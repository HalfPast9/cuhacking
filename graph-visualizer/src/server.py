from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run-script', methods=['POST'])
def run_script():
    data = request.json
    path = data.get('path', [])
    print("BAHHH")
    if not path:
        return jsonify({'error': 'Path data is required'}), 400

    try:
        output = subprocess.run(['python', 'picontrol.py', *path], capture_output=True, text=True)
        print(output.stdout)
        print("Script error (if any):", output.stderr)
        return jsonify({'message': 'Script executed successfully', 'output': output.stdout})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    print("BAHH")