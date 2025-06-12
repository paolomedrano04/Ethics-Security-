from flask import Flask, render_template, request, redirect, url_for, session
import json
from functools import wraps
import random, string, time

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Cámbialo por algo seguro

# Cargo datos de tu JSON
with open('data.json', encoding='utf-8') as f:
    data = json.load(f)

# Usuarios de ejemplo
users = {
    "estudiante@utec.edu.pe":   {"password": "pass1", "role": "student",    "id": "20200001"},
    "profesor@utec.edu.pe":     {"password": "pass2", "role": "teacher",    "id": "P001", "verification_code": ""},
    "supervisor@utec.edu.pe":   {"password": "pass3", "role": "supervisor","id": "S001", "verification_code": ""},
    "admin@utec.edu.pe":        {"password": "pass4", "role": "admin",      "id": "A001", "verification_code": ""}
}

VERIFICATION_ROLES = ["teacher", "supervisor", "admin"]

# Decorador para rutas que requieren login
def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return wrapped

# Decorador para roles específicos (no usado aquí, pero queda listo)
def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('login'))
            if session['user']['role'] not in roles:
                return render_template('unauthorized.html'), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

def send_verification_code(email, code):
    print(f"\n=== CÓDIGO DE VERIFICACIÓN PARA {email} ===")
    print(f"Su código es: {code}")
    print("Este código es válido por 5 minutos")
    print("===================================\n")
    # Aquí iría el envío real por email/SMS

# --- RUTAS PUBLICAS ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email    = request.form.get('email','').strip()
        password = request.form.get('password','')
        user = users.get(email)

        if user and user['password'] == password:
            # Si necesita verificación de código
            if user['role'] in VERIFICATION_ROLES:
                code = generate_verification_code()
                users[email]['verification_code'] = code
                users[email]['code_expiration'] = time.time() + 300
                send_verification_code(email, code)
                session['verification_email'] = email
                return redirect(url_for('verify_code'))

            # Login directo
            session['user'] = {
                'email': email,
                'role':  user['role'],
                'id':    user['id']
            }
            return redirect(url_for('profile'))

        error = "Credenciales inválidas"
    return render_template('login.html', error=error)


@app.route('/verify-code', methods=['GET', 'POST'])
def verify_code():
    if 'verification_email' not in session:
        return redirect(url_for('login'))

    email = session['verification_email']
    error = None

    if request.method == 'POST':
        entered = request.form.get('code','')
        stored  = users[email].get('verification_code','')
        exp     = users[email].get('code_expiration', 0)

        if time.time() > exp:
            error = "El código ha expirado. Solicita uno nuevo."
        elif entered == stored:
            # Verificado, guardo user en sesión
            session['user'] = {
                'email': email,
                'role':  users[email]['role'],
                'id':    users[email]['id']
            }
            session.pop('verification_email', None)
            return redirect(url_for('profile'))
        else:
            error = "Código incorrecto"

    return render_template('verify_code.html', error=error)


@app.route('/resend-code')
def resend_code():
    if 'verification_email' not in session:
        return redirect(url_for('login'))
    email = session['verification_email']
    code  = generate_verification_code()
    users[email]['verification_code'] = code
    users[email]['code_expiration'] = time.time() + 300
    send_verification_code(email, code)
    return render_template('verify_code.html', success="Nuevo código enviado correctamente")


# --- RUTAS PROTEGIDAS ---

@app.route('/')
@login_required
def profile():
    return render_template('index.html', section='profile', data=data)

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


# Ruta para logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(ssl_context=('cert/cert.crt', 'cert/key.pem'), debug=True)
