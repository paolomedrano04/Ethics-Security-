from flask import Flask, render_template
import json

app = Flask(__name__)

# Carga tus datos una vez
with open('data.json', encoding='utf-8') as f:
    data = json.load(f)

@app.route('/')
def profile():
    return render_template('index.html', section='profile', data=data)

@app.route('/courses')
def courses():
    return render_template('index.html', section='courses', data=data)

@app.route('/sessions')
def sessions():
    return render_template('index.html', section='sessions', data=data)

@app.route('/payments')
def payments():
    return render_template('index.html', section='payments', data=data)

if __name__ == '__main__':
    app.run(ssl_context=('cert/cert.crt', 'cert/key.pem'), debug=True)
