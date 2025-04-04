from flask import jsonify, request
import logging
import random
import time
from routes.prometheus import REQUESTS

logger = logging.getLogger(__name__)




def generate_logs():
    REQUESTS.labels(path='/api/logs').inc() # increases the counter
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

def emit_metrics():
    REQUESTS.labels(path='/api/metrics').inc() # increases the counter
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

def simulate_traces():
    REQUESTS.labels(path='/api/traces').inc() # increases the counter
    try:
        data = request.json
        num_services = int(data.get('services', 3))
        error_rate = float(data.get('errorRate', 0.1))
        
        trace_id = f"trace-{random.randint(1000, 9999)}"
        services = [f"service-{i}" for i in range(num_services)]
        
        trace_data = []
        parent_id = None
        
        for service in services:
            span_id = f"span-{random.randint(1000, 9999)}"
            duration = random.uniform(0.1, 2.0)
            has_error = random.random() < error_rate
            
            span = {
                "traceId": trace_id,
                "spanId": span_id,
                "parentId": parent_id,
                "service": service,
                "duration": duration,
                "status": "error" if has_error else "success"
            }
            
            trace_data.append(span)
            parent_id = span_id
            
            # Simulate service processing time
            time.sleep(duration * 0.1)  # Scale down for demo
        
        logger.info(f"Generated trace {trace_id} with {num_services} services")
        
        return jsonify({
            "message": f"Trace generated with {num_services} services",
            "traceId": trace_id,
            "spans": trace_data
        })
    except Exception as e:
        logger.error(f"Error generating trace: {str(e)}")
        return jsonify({"error": str(e)}), 500
