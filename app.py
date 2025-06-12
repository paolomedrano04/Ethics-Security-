# app.py
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
import json
import random
import time
import smtplib
from email.mime.text import MIMEText
import hashlib
from sqlalchemy import Table, MetaData, select
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Configuración de la base de datos PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:1234@localhost:5432/sistacademico'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo vinculado exactamente a la tabla "Users"
class User(db.Model):
    __tablename__ = 'Users'
    registro_id = db.Column(db.String, primary_key=True)
    nombre1     = db.Column(db.String)
    nombre2     = db.Column(db.String)
    apellido1   = db.Column(db.String)
    apellido2   = db.Column(db.String)
    correo      = db.Column(db.String, unique=True)
    contraseña  = db.Column(db.String)

# Carga de datos desde JSON
with open('data.json', encoding='utf-8') as f:
    data = json.load(f)

# Configuración de Mailtrap para pruebas
SMTP_SERVER   = "sandbox.smtp.mailtrap.io"
SMTP_PORT     = 2525
SMTP_USER     = "b34e42697ead79"
SMTP_PASSWORD = "7a4b577288a4c0"

def get_students_table():
    with app.app_context():
        metadata = MetaData()
        students_table = Table('Students', metadata, autoload_with=db.engine)
        return students_table

def send_verification_code(email, code):
    try:
        subject = "Código de verificación - Sistema Académico UTEC"
        body = f"""Estimado usuario,

Su código de verificación es: {code}

Este código es válido por 5 minutos. No comparta este código con nadie.

Atentamente,
Equipo de Sistemas UTEC
"""
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From']    = SMTP_USER
        msg['To']      = email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [email], msg.as_string())
        return True
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False

def generate_verification_code():
    return ''.join(random.choices('0123456789', k=6))

def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return wrapped

@app.route('/login', methods=['GET','POST'])
def login():
    error = None
    if request.method == 'POST':
        email    = request.form.get('email','').strip()
        password = request.form.get('password','')
        user = User.query.filter_by(correo=email).first()

        if user and user.contraseña == hashlib.sha256(password.encode()).hexdigest():
            code = generate_verification_code()
            session['verification_email'] = email
            session['verification_code']  = code
            session['code_expiration']    = time.time() + 300

            if send_verification_code(email, code):
                return redirect(url_for('verify_code'))
            else:
                error = "Error al enviar el código de verificación"
        else:
            error = "Credenciales inválidas"

    return render_template('login.html', error=error)

@app.route('/verify-code', methods=['GET','POST'])
def verify_code():
    if 'verification_email' not in session:
        return redirect(url_for('login'))
    email = session['verification_email']
    error = None

    if request.method == 'POST':
        entered_code = request.form.get('code','').strip()
        stored_code  = session.get('verification_code')
        expiration   = session.get('code_expiration',0)

        if time.time() > expiration:
            error = "El código ha expirado. Inicie sesión nuevamente."
        elif entered_code == stored_code:
            user = User.query.filter_by(correo=email).first()
            session['user'] = {
                'correo'      : user.correo,
                'nombre'      : f"{user.nombre1} {user.apellido1}",
                'registro_id' : user.registro_id
            }
            session.pop('verification_email')
            session.pop('verification_code')
            session.pop('code_expiration')
            return redirect(url_for('profile'))
        else:
            error = "Código incorrecto. Intente de nuevo."

    return render_template('verify_code.html', error=error, email=email)

@app.route('/resend-code')
def resend_code():
    if 'verification_email' not in session:
        return redirect(url_for('login'))
    email = session['verification_email']
    code  = generate_verification_code()
    session['verification_code'] = code
    session['code_expiration']   = time.time() + 300

    if send_verification_code(email, code):
        return render_template('verify_code.html', success="¡Nuevo código enviado!", email=email)
    return render_template('verify_code.html', error="No se pudo reenviar el código", email=email)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/')
@login_required
def profile():
    students_table = get_students_table()
    all_cols = students_table.columns.keys()
    cols_to_show = list(all_cols)[-18:]

    # Creamos un SELECT con columnas posicionales
    columnas = [students_table.c[c] for c in cols_to_show]
    query = select(*columnas).select_from(students_table).limit(100)

    result = db.session.execute(query)
    students = [dict(row) for row in result.mappings()]

    current_date = datetime.now().strftime("%Y.%m.%d (%H):%M:%S")

    return render_template('index.html',
                           section       = 'profile',
                           students      = students,
                           column_names  = cols_to_show,
                           current_date  = current_date,
                           data          = data)

@app.route('/courses')
@login_required
def courses():
    return render_template('index.html', section='courses', data=data)

@app.route('/sessions')
@login_required
def sessions():
    return render_template('index.html', section='sessions', data=data)

@app.route('/payments')
@login_required
def payments():
    return render_template('index.html', section='payments', data=data)

if __name__ == '__main__':
    app.run(ssl_context=('cert/cert.crt','cert/key.pem'), debug=True)
