from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import random
import logging
import psutil
import threading
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def calculate_status(percentage):
    """Calculate status based on percentage."""
    if percentage < 50:
        return "good"
    elif percentage < 80:
        return "warning"
    else:
        return "critical"

# Endpoint to simulate memory usage
@app.route('/api/simulate/memory', methods=['POST'])
def simulate_memory():
    try:
        data = request.json
        percentage = float(data.get('percentage', 50))  # Default 50%
        duration = data.get('duration', '00:30')  # Default 30 seconds
        
        # Convert duration from MM:SS format to seconds
        minutes, seconds = map(int, duration.split(':'))
        duration_seconds = minutes * 60 + seconds
        
        # Calculate memory to use based on percentage of total available memory
        total_memory = psutil.virtual_memory().total
        target_memory = int((total_memory * percentage) / 100)
        
        logger.info(f"Starting memory simulation: {percentage}% for {duration} ({duration_seconds}s)")
        
        # Start memory allocation in a separate thread
        def memory_task():
            try:
                data = [bytearray(1024) for _ in range(target_memory // 1024)]
                time.sleep(duration_seconds)
                del data
            except Exception as e:
                logger.error(f"Memory simulation error: {str(e)}")
        
        thread = threading.Thread(target=memory_task)
        thread.start()
        
        status = calculate_status(percentage)
        return jsonify({
            "message": f"Memory simulation started: {percentage}% for {duration}",
            "status": status,
            "duration": duration_seconds
        })
    except Exception as e:
        logger.error(f"Error in memory simulation: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to simulate CPU usage
@app.route('/api/simulate/cpu', methods=['POST'])
def simulate_cpu():
    try:
        data = request.json
        percentage = float(data.get('percentage', 50))  # Default 50%
        duration = data.get('duration', '00:30')  # Default 30 seconds
        
        # Convert duration from MM:SS format to seconds
        minutes, seconds = map(int, duration.split(':'))
        duration_seconds = minutes * 60 + seconds
        
        logger.info(f"Starting CPU simulation: {percentage}% for {duration} ({duration_seconds}s)")
        
        # Start CPU intensive task in a separate thread
        def cpu_task():
            start_time = time.time()
            while time.time() - start_time < duration_seconds:
                # Adjust CPU usage based on percentage
                if random.random() * 100 < percentage:
                    _ = [i * i for i in range(10000)]
                else:
                    time.sleep(0.1)
        
        thread = threading.Thread(target=cpu_task)
        thread.start()
        
        status = calculate_status(percentage)
        return jsonify({
            "message": f"CPU simulation started: {percentage}% for {duration}",
            "status": status,
            "duration": duration_seconds
        })
    except Exception as e:
        logger.error(f"Error in CPU simulation: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to simulate disk usage
@app.route('/api/simulate/disk', methods=['POST'])
def simulate_disk():
    try:
        data = request.json
        percentage = float(data.get('percentage', 50))  # Default 50%
        duration = data.get('duration', '00:30')  # Default 30 seconds
        
        # Convert duration from MM:SS format to seconds
        minutes, seconds = map(int, duration.split(':'))
        duration_seconds = minutes * 60 + seconds
        
        logger.info(f"Starting disk simulation: {percentage}% for {duration} ({duration_seconds}s)")
        
        # Simulate disk operations in a separate thread
        def disk_task():
            start_time = time.time()
            temp_file = 'temp_test_file'
            while time.time() - start_time < duration_seconds:
                if random.random() * 100 < percentage:
                    # Write and read operations
                    with open(temp_file, 'w') as f:
                        f.write('0' * 1024 * 1024)  # Write 1MB
                    with open(temp_file, 'r') as f:
                        _ = f.read()
                else:
                    time.sleep(0.1)
            # Cleanup
            import os
            if os.path.exists(temp_file):
                os.remove(temp_file)
        
        thread = threading.Thread(target=disk_task)
        thread.start()
        
        status = calculate_status(percentage)
        return jsonify({
            "message": f"Disk simulation started: {percentage}% for {duration}",
            "status": status,
            "duration": duration_seconds
        })
    except Exception as e:
        logger.error(f"Error in disk simulation: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to generate logs
@app.route('/api/logs', methods=['POST'])
def generate_logs():
    try:
        data = request.json
        level = data.get('level', 'INFO').upper()
        message = data.get('message', 'Test log message')
        count = int(data.get('count', 1))
        
        log_levels = {
            "INFO": logger.info,
            "WARN": logger.warning,
            "ERROR": logger.error
        }
        
        if level not in log_levels:
            return jsonify({"error": "Invalid log level"}), 400
            
        for i in range(count):
            log_levels[level](f"{message} - {i + 1}")
            
        return jsonify({
            "message": f"Generated {count} log(s) at {level} level",
            "level": level,
            "count": count
        })
    except Exception as e:
        logger.error(f"Error generating logs: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to emit metrics
@app.route('/api/metrics', methods=['POST'])
def emit_metrics():
    try:
        data = request.json
        metric_name = data.get('name', 'custom_metric')
        value = float(data.get('value', 0.0))
        unit = data.get('unit', 'Count')
        
        logger.info(f"Emitting metric: {metric_name} = {value} {unit}")
        
        # Here you would typically send to CloudWatch
        # For demo, we'll just log it
        logger.info(f"METRIC: {metric_name} = {value} {unit}")
        
        return jsonify({
            "message": f"Metric emitted: {metric_name}",
            "value": value,
            "unit": unit
        })
    except Exception as e:
        logger.error(f"Error emitting metric: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to simulate traces
@app.route('/api/traces', methods=['POST'])
def simulate_traces():
    try:
        data = request.json
        service_count = int(data.get('services', 3))
        error_rate = float(data.get('errorRate', 0.1))
        
        traces = []
        for i in range(service_count):
            # Simulate trace with random latency
            latency = random.uniform(0.1, 2.0)
            has_error = random.random() < error_rate
            
            trace = {
                "service": f"service-{i+1}",
                "latency": round(latency, 3),
                "status": "error" if has_error else "success",
                "timestamp": time.time()
            }
            traces.append(trace)
            logger.info(f"Trace generated: {json.dumps(trace)}")
            
            # Simulate service processing time
            time.sleep(latency / 10)  # Scale down sleep time
        
        return jsonify({
            "message": f"Generated traces for {service_count} services",
            "traces": traces
        })
    except Exception as e:
        logger.error(f"Error generating traces: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
