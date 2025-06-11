document.addEventListener("DOMContentLoaded", () => {
  let data;

  // Navegación
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("visible"));
      document.getElementById(btn.dataset.section).classList.add("visible");
    });
  });

  // Carga de datos
  fetch("/api/data")
    .then(r => r.json())
    .then(json => {
      data = json;
      renderProfile();
      renderCourses();
      renderSessions();
      renderPayments();
    });

  function renderProfile() {
    const c = document.getElementById("profile");
    c.innerHTML = `
      <div class="card profile-container">
        <img src="${data.avatarurl}" alt="Avatar" width="100" style="border-radius:50%;margin-right:1rem;">
        <div>
          <h2>${data.name}</h2>
          <p><strong>DNI:</strong> ${data.dni}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Carrera:</strong> ${data.carreer}</p>
        </div>
      </div>`;
  }

  function renderCourses() {
    const c = document.getElementById("courses");
    c.innerHTML = `<h2>Cursos</h2>
      <div class="card">
        <table>
          <thead><tr><th>Sección</th><th>Código</th><th>Nombre</th><th>Nota Final</th></tr></thead>
          <tbody>
            ${data.sections.map(s => `
              <tr>
                <td>${s.section_name}</td>
                <td>${s.course.id}</td>
                <td>${s.course.name}</td>
                <td>${s.course.finalGrade.grade}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function renderSessions() {
    const c = document.getElementById("sessions");
    c.innerHTML = `<h2>Sesiones</h2>
      ${data.sections.map(s => `
        <div class="card">
          <h3>${s.section_name}</h3>
          <table>
            <thead><tr><th>Inicio</th><th>Fin</th><th>Modalidad</th><th>Aula/Link</th><th>Estado</th></tr></thead>
            <tbody>
              ${s.sessions.map(sess => `
                <tr>
                  <td>${new Date(sess.Initial_Hour).toLocaleString()}</td>
                  <td>${new Date(sess.Final_Hour).toLocaleString()}</td>
                  <td>${sess.modality}</td>
                  <td>${sess.modality==="Presencial"?sess.classroom:`<a href="${sess.link}" target="_blank">Zoom</a>`}</td>
                  <td>${sess.state}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`).join("")}`;
  }

  function renderPayments() {
    const c = document.getElementById("payments");
    c.innerHTML = `<h2>Pagos</h2>
      <div class="card">
        <table>
          <thead><tr><th>Descripción</th><th>Mora</th><th>Vencimiento</th><th>Estado</th><th>Monto</th></tr></thead>
          <tbody>
            ${data.pago.map(p => `
              <tr>
                <td>${p.descripcion}</td>
                <td>${p.mora}</td>
                <td>${p.vencimiento}</td>
                <td>${p.estado}</td>
                <td>S/ ${p.monto}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }
});
