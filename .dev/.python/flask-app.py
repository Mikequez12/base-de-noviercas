from flask import Flask, send_from_directory, abort
import os

app = Flask(__name__)
BASE_DIR = os.path.abspath(".")

@app.route('/', methods=['GET'])
def serve_index():
    if os.path.isfile(os.path.join(BASE_DIR, 'index.html')):
        return send_from_directory(BASE_DIR, 'index.html')
    return abort(404)

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
    print(f"Solicitado: {filename}")
    file_path = os.path.join(BASE_DIR, filename)

    if os.path.isfile(file_path):
        return send_from_directory(BASE_DIR, filename)

    if not filename.endswith('.html'):
        html_filename = filename + '.html'
        if os.path.isfile(os.path.join(BASE_DIR, html_filename)):
            return send_from_directory(BASE_DIR, html_filename)

    return abort(404)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
