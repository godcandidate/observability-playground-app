# Backend API Documentation

The backend provides simulation endpoints for testing various observability patterns and generating observability signals.

## 🛠 Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   python app.py
   ```

The server runs on `http://localhost:5000` by default.

## 🔌 API Endpoints

### Resource Simulation

#### Simulate Memory Usage
```http
POST /api/simulate/memory
Content-Type: application/json

{
  "percentage": 75,
  "duration": "00:30"
}
```
- `percentage`: Memory usage percentage (0-100)
- `duration`: Duration in MM:SS format

#### Simulate CPU Usage
```http
POST /api/simulate/cpu
Content-Type: application/json

{
  "percentage": 80,
  "duration": "00:45"
}
```
- `percentage`: CPU utilization percentage (0-100)
- `duration`: Duration in MM:SS format

#### Simulate Disk Usage
```http
POST /api/simulate/disk
Content-Type: application/json

{
  "percentage": 60,
  "duration": "01:00"
}
```
- `percentage`: Disk I/O intensity percentage (0-100)
- `duration`: Duration in MM:SS format

### Observability Signals

#### Generate Logs
```http
POST /api/logs
Content-Type: application/json

{
  "level": "INFO",
  "message": "Test log message",
  "count": 5
}
```
- `level`: Log level (INFO, WARN, ERROR)
- `message`: Base message text
- `count`: Number of logs to generate

#### Emit Metrics
```http
POST /api/metrics
Content-Type: application/json

{
  "name": "custom_metric",
  "value": 42.5,
  "unit": "Count"
}
```
- `name`: Metric name
- `value`: Numeric value
- `unit`: Unit type (Count, Seconds, Bytes, Percent)

#### Generate Traces
```http
POST /api/traces
Content-Type: application/json

{
  "services": 3,
  "errorRate": 0.1
}
```
- `services`: Number of services in trace
- `errorRate`: Probability of error (0-1)

## 🔄 Response Format

All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "message": "Operation description",
  "status": "good|warning|critical",
  "duration": 30
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

## 🔐 Security Notes

- The server is configured with CORS enabled for development
- No authentication is required (this is a local development tool)
- Resource simulations are controlled and safe

## 🧪 Testing

Test the API endpoints using curl:

```bash
# Test memory simulation
curl -X POST http://localhost:5000/api/simulate/memory \
  -H "Content-Type: application/json" \
  -d '{"percentage": 75, "duration": "00:30"}'

# Generate logs
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"level": "INFO", "message": "Test message", "count": 5}'
```
