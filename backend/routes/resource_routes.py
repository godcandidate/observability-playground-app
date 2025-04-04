from flask import jsonify, request
import time
import random
import logging
import psutil
import threading
import os
from routes.prometheus import REQUESTS

logger = logging.getLogger(__name__)




def calculate_status(percentage):
    """Calculate status based on percentage."""
    if percentage < 50:
        return "good"
    elif percentage < 80:
        return "warning"
    else:
        return "critical"

def simulate_memory():
    REQUESTS.labels(path='/api/simulate/memory').inc() # increases the counter
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

def simulate_cpu():
    REQUESTS.labels(path='/api/simulate/cpu').inc() # increases the counter
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

def simulate_disk():
    REQUESTS.labels(path='/api/simulate/disk').inc() # increases the counter
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
