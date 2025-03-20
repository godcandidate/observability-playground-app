from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
