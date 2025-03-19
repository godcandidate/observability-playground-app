const API_BASE_URL = 'http://localhost:5000/api';

interface SimulationParams {
  percentage: number;
  duration: string;
}

interface LogParams {
  level: 'INFO' | 'WARN' | 'ERROR';
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
    const response = await fetch(`${API_BASE_URL}/simulate/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  simulateCPU: async (params: SimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/simulate/cpu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  simulateDisk: async (params: SimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/simulate/disk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  // Observability endpoints
  generateLogs: async (params: LogParams) => {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  emitMetric: async (params: MetricParams) => {
    const response = await fetch(`${API_BASE_URL}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  generateTraces: async (params: TraceParams) => {
    const response = await fetch(`${API_BASE_URL}/traces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
};
