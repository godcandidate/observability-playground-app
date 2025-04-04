from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import logging
import os


from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

# Initialize Flask app
app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Prometheus metric route
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, { '/metrics': make_wsgi_app() })


# Import routes
from routes.resource_routes import simulate_memory, simulate_cpu, simulate_disk
from routes.observability_routes import generate_logs, emit_metrics, simulate_traces

# Register resource simulation routes
app.route('/api/simulate/memory', methods=['POST'])(simulate_memory)
app.route('/api/simulate/cpu', methods=['POST'])(simulate_cpu)
app.route('/api/simulate/disk', methods=['POST'])(simulate_disk)

# Register observability routes
app.route('/api/logs', methods=['POST'])(generate_logs)
app.route('/api/metrics', methods=['POST'])(emit_metrics)
app.route('/api/traces', methods=['POST'])(simulate_traces)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Start Prometheus server
    app.run(host='0.0.0.0', port=5000, debug=True)

