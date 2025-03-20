// API configuration
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

interface SimulationParams {
  percentage: number;
  duration: string;
}

interface LogParams {
  level: string;
  message: string;
  count: number;
}

interface MetricParams {
  name: string;
  value: number;
  unit: string;
}

interface TraceParams {
  services: number;
  errorRate: number;
}

export const api = {
  // Resource simulation endpoints
  simulateMemory: async (params: SimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/api/simulate/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  simulateCPU: async (params: SimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/api/simulate/cpu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  simulateDisk: async (params: SimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/api/simulate/disk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  // Observability endpoints
  generateLogs: async (params: LogParams) => {
    const response = await fetch(`${API_BASE_URL}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  emitMetric: async (params: MetricParams) => {
    const response = await fetch(`${API_BASE_URL}/api/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  generateTraces: async (params: TraceParams) => {
    const response = await fetch(`${API_BASE_URL}/api/traces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
};
