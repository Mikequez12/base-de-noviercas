from flask import Flask, send_from_directory, abort, jsonify, request
import json
from datetime import datetime, timedelta
import random
import os

from tours import tour_whitelist
import users

from spam import send_verification

app = Flask(__name__)


def exp_tokens():
    try:
        with open('tokens.json', 'r', encoding='utf-8') as file:
            tokens = json.load(file)
    except json.JSONDecodeError:
        tokens = {}
    
    new_tokens = {}
    now = datetime.utcnow()
    
    for token, data in tokens.items():
        exp_time = datetime.fromisoformat(data['exp'])
        if now < exp_time:
            new_tokens[token] = data
    
    with open('tokens.json', 'w') as file:
        json.dump(new_tokens, file)

if not os.path.exists('tokens.json'):
    with open('tokens.json', 'w') as f:
        json.dump({}, f)

@app.route('/create-account')
def serve_create_account():
    return send_from_directory('.','create-account.html')
    
@app.route('/svg/tour')
def serve_tour_svg():
    return send_from_directory('.','tour.svg')
    
@app.route('/svg/search-tours')
def serve_search_tours_svg():
    return send_from_directory('.','searchtours.svg')
    
@app.route('/svg/inicio')
def serve_home_svg():
    return send_from_directory('.','home.svg')
  
@app.route('/')
def serve_index():
    return send_from_directory('.','index.html')

@app.route('/login')
def serve_login():
    return send_from_directory('.','login.html')

@app.route('/style.css')
def serve_css():
    return send_from_directory('.','style.css')

@app.route('/login.js')
def serve_login_script():
    return send_from_directory('.','login.js')

@app.route('/account')
def serve_account():
    return send_from_directory('.','account.html')

@app.route('/account.js')
def serve_account_js():
    return send_from_directory('.','account.js')

@app.route('/test-html')
def serve_test():
    return send_from_directory('.','test.html')

@app.route('/qr-code')
def serve_qr_code():
    return send_from_directory('.','qr-code.html')
  
@app.route('/googlefeb2c87e63a3eba6.html')
def serve_google_index():
  return send_from_directory('.','googlefeb2c87e63a3eba6.html')
  
@app.route('/token', methods=['POST'])
def handle_token():
    exp_tokens()
    
    with open('tokens.json') as file:
        actual_passwords = json.load(file)
    
    new_password = None
    max_attempts = 1000
    
    for _ in range(max_attempts):
        candidate = random.randint(0, 99999999)
        if str(candidate) not in actual_passwords:
            new_password = candidate
            break
    if new_password is None:
        abort(500, 'ERROR: Could not generate unique token')
    
    new_file = actual_passwords.copy()
    expiration = datetime.utcnow() + timedelta(minutes=5)
    new_file[str(new_password)] = {
        'exp': expiration.isoformat(),
        'dat': {
            'dsr':request.get_json()['dsr']
        }
    }
    
    with open('tokens.json', 'w') as file:
        json.dump(new_file, file)
    
    print(new_file)
    
    return jsonify({
        "token": str(new_password),
        "expires-in": expiration.isoformat()
    })

@app.route('/send', methods=['POST'])
def send_data():
    dat = request.get_json()['token']
    user = request.get_json()['user']
    
    app.logger.info(f'DAT: {dat}')
    app.logger.info(f'USER: {user}')

    app.logger.info(send_verification(user,dat))

    return jsonify({"status":"ok"})

@app.route('/dsr', methods=['POST'])
def get_dsr():
    dat = request.get_json()['dsr']

    exp_tokens()

    with open('tokens.json') as file:
        fil_ = json.load(file)
        dsr_ = {"dsr":fil_[str(dat)]['dat']["dsr"]}

    print(dsr_)
    return jsonify(dsr_)

@app.route('/logo')
def get_logo():
  return send_from_directory('.','logo.svg')

@app.route('/svg/cerrar-sesion')
def get_logout():
  return send_from_directory('.','logout.svg')

@app.route('/users', methods=['POST'])
def get_users():
    dat = request.get_json()['dsr']

    exp_tokens()

    fil_ = users.get_users()
    dsr_ = {"users":fil_}
      
    if dat not in list(fil_.keys()):
      abort(405)
      return jsonify({'status':'not-ok'})

    app.logger.info(fil_)
    return jsonify(dsr_)

@app.route('/tour-whitelist', methods=['POST'])
def get_whitelist():
  return jsonify(tour_whitelist())
  
@app.route('/font')
def serve_font():
  return send_from_directory('.','font.css')
  
@app.route('/main.js')
def serve_main_js():
  return send_from_directory('.','main.js')
  
def exp_tokens():
    try:
        with open('tokens.json', 'r', encoding='utf-8') as file:
            tokens = json.load(file)
    except json.JSONDecodeError:
        tokens = {}
    
    new_tokens = {}
    now = datetime.utcnow()
    
    for token, data in tokens.items():
        exp_time = datetime.fromisoformat(data['exp'])
        if now < exp_time:
            new_tokens[token] = data
    
    with open('tokens.json', 'w') as file:
        json.dump(new_tokens, file)

@app.route('/noticias')
def serve_news():
  return send_from_directory('.','noticias.html')

@app.route('/noticias.md')
def serve_news_md():
  return send_from_directory('.','noticias.md')
        
@app.route('/reglamento.yaml')
def serve_reglamento_yaml():
  return send_from_directory('.','reglamento.yaml')
        
@app.route('/reglamento')
def serve_reglamento():
  return send_from_directory('.','reglamento.html')

@app.route('/svg/reglamento')
def serve_reglamento_favicon():
  return send_from_directory('.','reglamento.svg')

@app.route('/svg/cuenta')
def serve_account_favicon():
  return send_from_directory('.','account.svg')

@app.route('/svg/ayuda')
def serve_help_favicon():
  return send_from_directory('.','help.svg')

@app.route('/svg/noticias')
def serve_news_favicon():
  return send_from_directory('.','news.svg')

@app.route('/svg/expand-collapse')
def serve_expand_collapse_svg():
  return send_from_directory('.','expand-collapse.svg')

@app.route('/svg/x')
def serve_x_svg():
  return send_from_directory('.','x.svg')

@app.route('/tours')
def serve_tours():
  return send_from_directory('.','tours.html')

@app.route('/help')
def serve_help():
  return send_from_directory('.','help.html')

@app.route('/protocols.yaml')
def serve_protocols():
  return send_from_directory('.','protocols.yaml')

@app.route('/tours.js')
def serve_tours_js():
  return send_from_directory('.','tours.js')

@app.route('/help.md')
def serve_help_md():
  return send_from_directory('.','help.md')

@app.route('/qr-code.js')
def serve_qr_code_js():
  return send_from_directory('.','qr-code.js')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_404(path=None):
  return send_from_directory('.','404.html')
        
def run():
    app.run(debug=True, port=5000)

if __name__ == '__main__':
    run()
  
@app.before_request
def check_https():
    if not request.is_secure:
        app.logger.warning("¡La conexión no es segura!")
