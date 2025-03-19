import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  ScrollText, 
  LineChart, 
  Network, 
  Activity, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';

type TabType = 'memory' | 'cpu' | 'disk' | 'logs' | 'metrics' | 'traces';

interface TabProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ icon: Icon, label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function ResourceCard({ 
  title, 
  icon: Icon, 
  percentage = 0,
  duration = '00:00',
  onPercentageChange,
  onDurationChange,
  onSimulate,
  isSimulating = false,
  status = 'idle'
}: { 
  title: string;
  icon: React.ElementType;
  percentage?: number;
  duration?: string;
  onPercentageChange: (value: number) => void;
  onDurationChange: (value: string) => void;
  onSimulate: () => void;
  isSimulating?: boolean;
  status?: 'idle' | 'good' | 'warning' | 'critical';
}) {
  const statusColors = {
    idle: 'bg-gray-100 text-gray-600',
    good: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    critical: 'bg-red-100 text-red-600'
  };

  const iconAnimation = isSimulating ? 'animate-pulse' : '';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-lg transition-colors duration-300 ${statusColors[status]} ${iconAnimation}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Percentage
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => onPercentageChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-600 mt-1">{percentage}%</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (MM:ss)
          </label>
          <input
            type="text"
            pattern="[0-9]{2}:[0-9]{2}"
            placeholder="00:30"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 
            ${isSimulating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isSimulating ? (
            <>
              <Timer className="w-5 h-5 animate-spin" />
              Simulating...
            </>
          ) : (
            'Start Simulation'
          )}
        </button>
      </div>
    </div>
  );
}

function LogsPanel() {
  const [logs, setLogs] = useState<Array<{ level: string; message: string; timestamp: string }>>([]);

  const generateLog = (level: 'INFO' | 'WARN' | 'ERROR') => {
    const messages = {
      INFO: [
        'User logged in successfully',
        'Cache updated',
        'Background job completed',
        'API request successful',
        'Data sync completed'
      ],
      WARN: [
        'High memory usage detected',
        'API response time degraded',
        'Cache miss rate increasing',
        'Database connection pool near limit',
        'Queue backlog detected'
      ],
      ERROR: [
        'Failed to connect to database',
        'API request timeout',
        'Authentication failed',
        'Invalid data format',
        'Service unavailable'
      ]
    };

    const message = messages[level][Math.floor(Math.random() * messages[level].length)];
    const newLog = {
      level,
      message,
      timestamp: new Date().toISOString()
    };

    setLogs(prev => [newLog, ...prev]);
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-green-600 bg-green-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'ERROR': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => generateLog('INFO')}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-300"
        >
          INFO
        </button>
        <button
          onClick={() => generateLog('WARN')}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-300"
        >
          WARN
        </button>
        <button
          onClick={() => generateLog('ERROR')}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300"
        >
          ERROR
        </button>
      </div>

      <div className="h-96 overflow-y-auto bg-white rounded-lg border border-gray-200 p-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg font-mono text-sm ${getLogColor(log.level)}`}
          >
            <span className="text-gray-500">[{log.timestamp}]</span>{' '}
            <span className="font-semibold">{log.level}:</span>{' '}
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsPanel() {
  const [metrics, setMetrics] = useState<Array<{ name: string; value: string; timestamp: string }>>([]);
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [isEmitting, setIsEmitting] = useState(false);

  const emitMetric = async () => {
    if (!metricName || !metricValue) return;

    setIsEmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMetric = {
      name: metricName,
      value: metricValue,
      timestamp: new Date().toISOString()
    };

    setMetrics(prev => [newMetric, ...prev]);
    setMetricName('');
    setMetricValue('');
    setIsEmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric Name
          </label>
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            placeholder="e.g., request_count"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric Value
          </label>
          <input
            type="text"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            placeholder="e.g., 100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={emitMetric}
        disabled={isEmitting || !metricName || !metricValue}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 
          ${isEmitting || !metricName || !metricValue
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {isEmitting ? (
          <>
            <Timer className="w-5 h-5 animate-spin" />
            Emitting Metric...
          </>
        ) : (
          'Emit Metric'
        )}
      </button>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Metrics</h3>
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-3 bg-blue-50 rounded-lg text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">{metric.name}</span>
                <span className="text-blue-600">= {metric.value}</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {new Date(metric.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TracesPanel() {
  const [traces, setTraces] = useState<Array<{
    id: string;
    services: Array<{ name: string; duration: number; status: 'success' | 'error' }>;
    timestamp: string;
  }>>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateTrace = async () => {
    setIsSimulating(true);

    const services = [
      { name: 'API Gateway', duration: Math.floor(Math.random() * 100) + 20 },
      { name: 'Auth Service', duration: Math.floor(Math.random() * 150) + 50 },
      { name: 'User Service', duration: Math.floor(Math.random() * 200) + 100 },
      { name: 'Database', duration: Math.floor(Math.random() * 100) + 30 }
    ].map(service => ({
      ...service,
      status: Math.random() > 0.9 ? 'error' as const : 'success' as const
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTrace = {
      id: Math.random().toString(36).substr(2, 9),
      services,
      timestamp: new Date().toISOString()
    };

    setTraces(prev => [newTrace, ...prev]);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={simulateTrace}
        disabled={isSimulating}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 
          ${isSimulating
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {isSimulating ? (
          <>
            <Timer className="w-5 h-5 animate-spin" />
            Simulating Trace...
          </>
        ) : (
          'Simulate New Trace'
        )}
      </button>

      <div className="space-y-4">
        {traces.map((trace) => (
          <div key={trace.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">Trace ID: {trace.id}</div>
              <div className="text-sm text-gray-500">{new Date(trace.timestamp).toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              {trace.services.map((service, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    <span className="text-sm text-gray-500">{service.duration}ms</span>
                    {service.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        service.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(service.duration / 300) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('memory');
  const [resourceStates, setResourceStates] = useState({
    memory: { percentage: 0, duration: '00:30', isSimulating: false, status: 'idle' as const },
    cpu: { percentage: 0, duration: '00:30', isSimulating: false, status: 'idle' as const },
    disk: { percentage: 0, duration: '00:30', isSimulating: false, status: 'idle' as const }
  });

  const simulateResource = async (resource: 'memory' | 'cpu' | 'disk') => {
    setResourceStates(prev => ({
      ...prev,
      [resource]: { ...prev[resource], isSimulating: true }
    }));

    const [minutes, seconds] = resourceStates[resource].duration.split(':').map(Number);
    const totalMs = (minutes * 60 + seconds) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, totalMs));

    setResourceStates(prev => ({
      ...prev,
      [resource]: { 
        ...prev[resource], 
        isSimulating: false,
        status: prev[resource].percentage < 50 ? 'good' : prev[resource].percentage < 80 ? 'warning' : 'critical'
      }
    }));
  };

  const tabs = [
    { key: 'memory' as const, label: 'Memory', icon: MemoryStick },
    { key: 'cpu' as const, label: 'CPU', icon: Cpu },
    { key: 'disk' as const, label: 'Disk', icon: HardDrive },
    { key: 'logs' as const, label: 'Logs', icon: ScrollText },
    { key: 'metrics' as const, label: 'Metrics', icon: LineChart },
    { key: 'traces' as const, label: 'Traces', icon: Network }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Observability Dashboard</h1>
              <p className="text-sm text-gray-600">Monitor and test your system's observability features</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <Tab
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {activeTab === 'memory' && (
          <ResourceCard
            title="Memory Usage"
            icon={MemoryStick}
            percentage={resourceStates.memory.percentage}
            duration={resourceStates.memory.duration}
            onPercentageChange={(value) => 
              setResourceStates(prev => ({
                ...prev,
                memory: { ...prev.memory, percentage: value }
              }))
            }
            onDurationChange={(value) =>
              setResourceStates(prev => ({
                ...prev,
                memory: { ...prev.memory, duration: value }
              }))
            }
            onSimulate={() => simulateResource('memory')}
            isSimulating={resourceStates.memory.isSimulating}
            status={resourceStates.memory.status}
          />
        )}

        {activeTab === 'cpu' && (
          <ResourceCard
            title="CPU Usage"
            icon={Cpu}
            percentage={resourceStates.cpu.percentage}
            duration={resourceStates.cpu.duration}
            onPercentageChange={(value) =>
              setResourceStates(prev => ({
                ...prev,
                cpu: { ...prev.cpu, percentage: value }
              }))
            }
            onDurationChange={(value) =>
              setResourceStates(prev => ({
                ...prev,
                cpu: { ...prev.cpu, duration: value }
              }))
            }
            onSimulate={() => simulateResource('cpu')}
            isSimulating={resourceStates.cpu.isSimulating}
            status={resourceStates.cpu.status}
          />
        )}

        {activeTab === 'disk' && (
          <ResourceCard
            title="Disk Usage"
            icon={HardDrive}
            percentage={resourceStates.disk.percentage}
            duration={resourceStates.disk.duration}
            onPercentageChange={(value) =>
              setResourceStates(prev => ({
                ...prev,
                disk: { ...prev.disk, percentage: value }
              }))
            }
            onDurationChange={(value) =>
              setResourceStates(prev => ({
                ...prev,
                disk: { ...prev.disk, duration: value }
              }))
            }
            onSimulate={() => simulateResource('disk')}
            isSimulating={resourceStates.disk.isSimulating}
            status={resourceStates.disk.status}
          />
        )}

        {activeTab === 'logs' && <LogsPanel />}
        {activeTab === 'metrics' && <MetricsPanel />}
        {activeTab === 'traces' && <TracesPanel />}
      </main>
    </div>
  );
}

function HomePage({ onStartExploring }: { onStartExploring: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Activity className="w-4 h-4 mr-2" />
              Modern Observability Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Monitor Your Application with Confidence
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Experience a comprehensive playground for testing and exploring various observability features. 
              Monitor CPU usage, memory allocation, generate logs, emit custom metrics, and simulate distributed tracing.
            </p>
            <button
              onClick={onStartExploring}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Cpu className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold">CPU Monitoring</h3>
                <p className="text-sm text-gray-600">Simulate and monitor CPU-intensive tasks</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <ScrollText className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold">Log Generation</h3>
                <p className="text-sm text-gray-600">Generate and view system logs</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <MemoryStick className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold">Memory Analysis</h3>
                <p className="text-sm text-gray-600">Track memory allocation patterns</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Network className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold">Distributed Tracing</h3>
                <p className="text-sm text-gray-600">Simulate distributed system traces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return showDashboard ? (
    <Dashboard />
  ) : (
    <HomePage onStartExploring={() => setShowDashboard(true)} />
  );
}

export default App;