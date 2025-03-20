# Stage 1: Build React Frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build Flask Backend
FROM python:3.9-slim
WORKDIR /app/backend

# Install Python dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create static directory if it doesn't exist
RUN mkdir -p static

# Copy React static files into Flask static folder
COPY --from=frontend-builder /app/frontend/dist/ ./static/

# Expose port and run Flask
EXPOSE 5000
CMD ["python", "app.py"]
