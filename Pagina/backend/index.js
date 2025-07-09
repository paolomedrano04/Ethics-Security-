// server.js
require("dotenv").config();
const express    = require("express");
const bodyParser = require("body-parser");
const crypto     = require("crypto");
const cors       = require("cors");
const { Pool }   = require("pg");
const nodemailer = require("nodemailer");

const app  = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user:     "postgres",
  host:     "localhost",
  database: "etica",
  password: "1234",
  port:     5432,
});

// Almacén temporal de códigos 2FA
const verificationCodes = {};

/**
 * POST /api/login
 * Body: { email, password }
 * — Valida credenciales y envía código 2FA por correo
 */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, hash]
    );
    if (!rows.length) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // Generar y guardar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from:    `Intranet UTEC <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: "Código de verificación UTEC",
      text:    `Tu código de verificación es: ${code}`,
    });

    res.json({ mensaje: "Código enviado al correo." });
  } catch (err) {
    console.error("Error en /api/login:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

/**
 * POST /api/verify-code
 * Body: { email, code }
 * — Verifica el código y devuelve { mensaje, email, registro_id }
 */
app.post("/api/verify-code", async (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] !== code) {
    return res.status(401).json({ error: "Código incorrecto o expirado." });
  }
  delete verificationCodes[email];

  try {
    // Recuperar registro_id del usuario
    const { rows } = await pool.query(
      "SELECT registro_id FROM users WHERE email = $1",
      [email]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado tras verificar código." });
    }
    const registro_id = rows[0].registro_id;

    return res.json({
      mensaje: "Código verificado correctamente.",
      email,
      registro_id,
    });
  } catch (err) {
    console.error("Error en /api/verify-code:", err);
    res.status(500).json({ error: "Error interno tras verificar código." });
  }
});

/**
 * GET /api/user/profile
 * Query: ?email=... or ?registro_id=...
 * — Devuelve datos básicos del usuario (registro_id, name, email, role)
 */
app.get("/api/user/profile", async (req, res) => {
  const { email, registro_id } = req.query;
  if (!email && !registro_id) {
    return res.status(400).json({ error: "Falta parámetro email o registro_id." });
  }

  let queryText, param;
  if (registro_id) {
    queryText = `
      SELECT registro_id, first_name, middle_name, last_name, second_last_name, email, role
      FROM users
      WHERE registro_id = $1
    `;
    param = registro_id;
  } else {
    queryText = `
      SELECT registro_id, first_name, middle_name, last_name, second_last_name, email, role
      FROM users
      WHERE email = $1
    `;
    param = email.trim();
  }

  try {
    const { rows } = await pool.query(queryText, [param]);
    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    const u = rows[0];
    const name = [u.first_name, u.middle_name, u.last_name, u.second_last_name]
      .filter(Boolean)
      .join(" ");

    res.json({
      registro_id: u.registro_id,
      name,
      email: u.email,
      role: u.role,
    });
  } catch (err) {
    console.error("Error en /api/user/profile:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

/**
 * GET /api/student/data
 * Query: ?registro_id=...
 * — Devuelve todos los campos de la tabla students para ese registro_id
 */
app.get("/api/student/data", async (req, res) => {
  const { registro_id } = req.query;
  if (!registro_id) {
    return res.status(400).json({ error: "Falta parámetro registro_id." });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         registro_id, school, age_group, sex,
         medu, fedu, absences,
         failures_mat, failures_por,
         g1_mat, g2_mat, g3_mat,
         g1_por, g2_por, g3_por,
         studytime_mat, studytime_por,
         schoolsup_mat, schoolsup_por,
         internet, higher, paid, famsup,
         traveltime, goout, dalc, walc,
         health, freetime, id_profesor, seccion
       FROM students
       WHERE registro_id = $1`,
      [registro_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Datos del estudiante no encontrados." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error en /api/student/data:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

/**
 * GET /api/grades
 * Query: ?course=matematicas|portugues&registro_id=...
 * — Devuelve todas las notas del curso en la misma sección del estudiante
 */
app.get("/api/grades", async (req, res) => {
  const { course, registro_id } = req.query;
  if (!course || !registro_id) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros course y/o registro_id." });
  }
  if (!["matematicas", "portugues"].includes(course)) {
    return res.status(400).json({ error: "Course inválido." });
  }

  try {
    // 1) Obtenemos la sección del usuario
    const stu = await pool.query(
      "SELECT seccion FROM students WHERE registro_id = $1",
      [registro_id]
    );
    if (!stu.rows.length) {
      return res.status(404).json({ error: "Estudiante no encontrado." });
    }
    const seccion = stu.rows[0].seccion;

    // 2) Definimos columnas según curso
    const cols =
      course === "matematicas"
        ? ["g1_mat", "g2_mat", "g3_mat"]
        : ["g1_por", "g2_por", "g3_por"];

    // 3) Consultamos notas de esa sección
    const query = `
      SELECT ${cols.join(", ")}
      FROM students
      WHERE seccion = $1
    `;
    const { rows } = await pool.query(query, [seccion]);

    // 4) Aplanamos y filtramos valores nulos
    const grades = rows
      .flatMap((r) =>
        cols.map((c) => (r[c] != null ? Number(r[c]) : null))
      )
      .filter((v) => v !== null);

    res.json(grades);
  } catch (err) {
    console.error("Error en /api/grades:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});


app.get("/api/teacher/:id_profesor/grades", async (req, res) => {
  const { id_profesor } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT 
         s.registro_id,
         u.first_name, u.middle_name, u.last_name, u.second_last_name,
         s.g1_mat, s.g2_mat, s.g3_mat,
         s.g1_por, s.g2_por, s.g3_por,
         s.absences, s.age_group
       FROM students s
       JOIN users u ON u.registro_id = s.registro_id
       WHERE s.id_profesor = $1
       ORDER BY u.last_name, u.second_last_name, u.first_name
      `,
      [id_profesor]
    );

    const data = rows.map((r) => {
      const name = [r.first_name, r.middle_name, r.last_name, r.second_last_name]
        .filter(Boolean)
        .join(" ");
      return {
        registro_id: r.registro_id,
        name,
        g1_mat: r.g1_mat,
        g2_mat: r.g2_mat,
        g3_mat: r.g3_mat,
        g1_por: r.g1_por,
        g2_por: r.g2_por,
        g3_por: r.g3_por,
        absences: r.absences ?? 0,
        age_group: r.age_group ?? "Desconocido",
      };
    });

    res.json(data);
  } catch (err) {
    console.error("Error en GET /api/teacher/:id_profesor/grades:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});



/**
 * PUT /api/teacher/:id_profesor/grades/:registro_id
 * Body: { course: "matematicas"|"portugues", parcial: 1|2|3, value: number }
 * — Permite al profesor actualizar la nota de un parcial de un estudiante.
 */
app.put("/api/teacher/:id_profesor/grades/:registro_id", async (req, res) => {
  const { id_profesor, registro_id } = req.params;
  const { course, parcial, value } = req.body;

  // Validaciones básicas
  if (!["matematicas", "portugues"].includes(course)) {
    return res.status(400).json({ error: "Curso inválido." });
  }
  if (![1,2,3].includes(parcial)) {
    return res.status(400).json({ error: "Parcial inválido." });
  }
  if (typeof value !== "number" || value < 0 || value > 20) {
    return res.status(400).json({ error: "Valor de nota inválido." });
  }

  // Determinar la columna a actualizar
  const col =
    course === "matematicas"
      ? `g${parcial}_mat`
      : `g${parcial}_por`;

  try {
    // Verificar que el estudiante pertenece al profesor
    const check = await pool.query(
      "SELECT 1 FROM students WHERE registro_id=$1 AND id_profesor=$2",
      [registro_id, id_profesor]
    );
    if (!check.rows.length) {
      return res.status(403).json({ error: "No autorizado para modificar esta nota." });
    }

    // Ejecutar update
    await pool.query(
      `UPDATE students SET ${col}=$1 WHERE registro_id=$2`,
      [value, registro_id]
    );
    res.json({ mensaje: "Nota actualizada correctamente." });
  } catch (err) {
    console.error("Error en PUT /api/teacher/:id_profesor/grades/:registro_id:", err);
    res.status(500).json({ error: "Error interno al actualizar nota." });
  }
});

/* ───────────────────────────────────────────────────────────────────────── */
/*        2) API PARA PROMEDIOS DE PROFESORES POR CURSO QUE DICTAN           */
/* ───────────────────────────────────────────────────────────────────────── */

/**
 * GET /api/teachers/averages
 * Devuelve lista de profesores con promedio de notas que dictan en cada curso.
 */
app.get("/api/teachers/averages", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         u.registro_id AS id_profesor,
         u.first_name, u.middle_name, u.last_name, u.second_last_name,
         AVG(s.g1_mat + s.g2_mat + s.g3_mat)/3    AS avg_matematicas,
         AVG(s.g1_por + s.g2_por + s.g3_por)/3    AS avg_portugues
       FROM students s
       JOIN users u ON u.registro_id = s.id_profesor
       GROUP BY u.registro_id, u.first_name, u.middle_name, u.last_name, u.second_last_name
       ORDER BY u.last_name, u.second_last_name
      `
    );

    const result = rows.map((r) => {
      const name = [r.first_name, r.middle_name, r.last_name, r.second_last_name]
        .filter(Boolean)
        .join(" ");
      return {
        id_profesor: r.id_profesor,
        name,
        avg_matematicas: Number(r.avg_matematicas ?? 0).toFixed(2),
        avg_portugues:   Number(r.avg_portugues   ?? 0).toFixed(2),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error en GET /api/teachers/averages:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

/* ───────────────────────────────────────────────────────────────────────── */
/*                       INICIO DEL SERVIDOR                                 */
/* ───────────────────────────────────────────────────────────────────────── */

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
