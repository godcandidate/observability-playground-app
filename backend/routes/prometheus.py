# Prometheus server
from prometheus_client import Counter 

# Initialize metrics
REQUESTS = Counter('http_requests_total', 'Total number of requests', labelnames=['path'])
