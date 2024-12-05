from flask import Flask, send_from_directory, abort, request
import os

app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    try:
        # Print request details for debugging
        print(f"\nRequest Details:")
        print(f"Path requested: {path}")
        print(f"Referrer: {request.referrer}")
        print(f"User Agent: {request.user_agent}")
        
        # Check if file exists
        full_path = os.path.join(os.getcwd(), path)
        if os.path.exists(full_path):
            return send_from_directory('.', path)
        
        # If file doesn't exist and it's a PNG, try JPG
        if path.endswith('.png'):
            jpg_path = path.rsplit('.', 1)[0] + '.jpg'
            jpg_full_path = os.path.join(os.getcwd(), jpg_path)
            if os.path.exists(jpg_full_path):
                print(f"Redirecting {path} to {jpg_path}")
                return send_from_directory('.', jpg_path)
        
        # Log error if file not found
        print(f"File not found: {full_path}")
        abort(404)
        
    except Exception as e:
        print(f"Error serving file: {path}")
        print(f"Error details: {str(e)}")
        abort(404)

if __name__ == '__main__':
    app.run(port=8000, debug=True)