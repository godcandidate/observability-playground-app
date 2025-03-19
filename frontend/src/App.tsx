import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      className={`
        relative flex items-center gap-2 px-6 py-3
        transition-all duration-300 overflow-hidden
        ${isActive 
          ? 'text-blue-600 font-medium' 
          : 'text-gray-500 hover:text-gray-700'}
      `}
    >
      {/* Tab Content */}
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
      <span className={`transition-transform duration-300 ${isActive ? 'transform -translate-y-0.5' : ''}`}>
        {label}
      </span>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
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
  const statusConfig = {
    idle: {
      colors: 'bg-gray-100 text-gray-600 border-gray-200',
      iconColor: 'text-gray-400',
      gradient: 'from-gray-50 to-gray-100'
    },
    good: {
      colors: 'bg-green-100 text-green-600 border-green-200',
      iconColor: 'text-green-500',
      gradient: 'from-green-50 to-green-100'
    },
    warning: {
      colors: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      iconColor: 'text-yellow-500',
      gradient: 'from-yellow-50 to-yellow-100'
    },
    critical: {
      colors: 'bg-red-100 text-red-600 border-red-200',
      iconColor: 'text-red-500',
      gradient: 'from-red-50 to-red-100'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${currentStatus.colors}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Left Side - Controls */}
        <div className="flex-1 p-6 space-y-6 border-r border-gray-100">
          {/* Circular Percentage Indicator */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="44"
                  cx="50"
                  cy="50"
                />
                {/* Progress Circle */}
                <motion.circle
                  className={status === 'idle' ? 'text-gray-400' : 
                    status === 'good' ? 'text-green-500' : 
                    status === 'warning' ? 'text-yellow-500' : 'text-red-500'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="44"
                  cx="50"
                  cy="50"
                  style={{
                    pathLength: 1,
                    strokeDasharray: '1 1',
                    strokeDashoffset: 1 - (percentage / 100)
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
              </div>
            </div>

            {/* Percentage Control */}
            <div className="w-full space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  onPercentageChange(value);
                }}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    ${status === 'idle' ? '#9CA3AF' : 
                      status === 'good' ? '#22C55E' : 
                      status === 'warning' ? '#EAB308' : 
                      '#EF4444'} 0%, 
                    ${status === 'idle' ? '#9CA3AF' : 
                      status === 'good' ? '#22C55E' : 
                      status === 'warning' ? '#EAB308' : 
                      '#EF4444'} ${percentage}%, 
                    #E5E7EB ${percentage}%, 
                    #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Duration Input */}
          <div className="w-48 mx-auto">
            <label className="block text-sm font-medium text-gray-600 mb-2 text-center">
              Test Duration (MM:ss)
            </label>
            <div className="relative">
              <input
                type="text"
                pattern="[0-9]{2}:[0-9]{2}"
                placeholder="00:30"
                value={duration}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 5) {
                    let newValue = value;
                    // Auto-add colon if user types 4 numbers
                    if (value.length === 4 && !value.includes(':')) {
                      newValue = value.slice(0, 2) + ':' + value.slice(2);
                    }
                    // Only allow numbers and colon
                    if (/^[0-9:]*$/.test(newValue)) {
                      onDurationChange(newValue);
                    }
                  }
                }}
                className="w-full px-4 py-2 text-center text-lg bg-white border border-gray-200 rounded-full
                           shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all
                           placeholder-gray-400 font-light"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Timer className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Simulation Button */}
          <div className="flex justify-center">
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full
                font-normal text-sm shadow-sm transition-all duration-300 w-48
                ${isSimulating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md active:transform active:scale-[0.98]'}`}
            >
              {isSimulating ? (
                <>
                  <Timer className="w-4 h-4 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Run Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6 bg-gray-50">
          <motion.div
            className="p-8 rounded-full bg-white border-4 transition-colors duration-500"
            style={{
              borderColor: status === 'idle' ? '#9CA3AF' : 
                         status === 'good' ? '#22C55E' : 
                         status === 'warning' ? '#EAB308' : '#EF4444'
            }}
            animate={{
              scale: isSimulating ? [1, 1.1, 0.9, 1] : 1,
              rotate: status === 'critical' ? [-5, 5, -5, 5, -5, 0] : 0
            }}
            transition={{
              duration: status === 'critical' ? 0.5 : 2,
              repeat: isSimulating ? Infinity : 0,
              ease: status === 'critical' ? 'easeInOut' : 'easeOut'
            }}
          >
            <Icon className={`w-24 h-24 ${currentStatus.iconColor} transition-colors duration-500`} />
          </motion.div>

          {/* Status Message and Timer */}
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block bg-gray-50 px-4 py-1.5 rounded-full shadow-sm"
              >
                <CountdownTimer duration={duration} />
              </motion.div>
              
              <motion.p 
                className={`text-xl font-bold mb-2 ${status === 'good' ? 'text-green-600' : 
                  status === 'warning' ? 'text-yellow-600' : 
                  status === 'critical' ? 'text-red-600' : 'text-gray-600'}`}
              >
                {status === 'good' ? 'Simulating optimal resource patterns' :
                 status === 'warning' ? 'Testing warning threshold responses' :
                 status === 'critical' ? 'Validating critical state handling' :
                 'Initializing observability simulation...'}
              </motion.p>
              <p className="text-sm text-gray-600">
                {status === 'good' ? '✨ Normal Load Test' :
                 status === 'warning' ? '⚠️ High Load Test' :
                 status === 'critical' ? '🚨 Overload Test' : '🔄 Preparing Test...'}
              </p>
            </motion.div>
          )}
        </div>
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

  const handlePercentageChange = (resource: 'memory' | 'cpu' | 'disk', value: number) => {
    setResourceStates(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        percentage: value,
        status: prev[resource].isSimulating ? updateResourceStatus(value) : 'idle'
      }
    }));
  };

  const handleDurationChange = (resource: 'memory' | 'cpu' | 'disk', value: string) => {
    setResourceStates(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        duration: value
      }
    }));
  };

  const updateResourceStatus = (percentage: number) => {
    if (percentage < 50) return 'good';
    if (percentage < 80) return 'warning';
    return 'critical';
  };

  const simulateResource = async (resource: 'memory' | 'cpu' | 'disk') => {
    if (resourceStates[resource].isSimulating) return;

    try {
      const [minutes, seconds] = resourceStates[resource].duration.split(':').map(Number);
      if (isNaN(minutes) || isNaN(seconds)) {
        console.error('Invalid duration format');
        return;
      }

      const status = updateResourceStatus(resourceStates[resource].percentage);
      setResourceStates(prev => ({
        ...prev,
        [resource]: { 
          ...prev[resource], 
          isSimulating: true,
          status
        }
      }));

      const totalMs = (minutes * 60 + seconds) * 1000;
      await new Promise(resolve => setTimeout(resolve, totalMs));

      setResourceStates(prev => ({
        ...prev,
        [resource]: { 
          ...prev[resource], 
          isSimulating: false,
          status: 'idle'
        }
      }));
    } catch (error) {
      console.error('Simulation error:', error);
      setResourceStates(prev => ({
        ...prev,
        [resource]: { 
          ...prev[resource], 
          isSimulating: false,
          status: 'idle'
        }
      }));
    }
  };

  const tabs = [
    { key: 'memory' as const, label: 'Memory Tests', icon: MemoryStick },
    { key: 'cpu' as const, label: 'CPU Tests', icon: Cpu },
    { key: 'disk' as const, label: 'Disk Tests', icon: HardDrive },
    { key: 'logs' as const, label: 'Log Patterns', icon: ScrollText },
    { key: 'metrics' as const, label: 'Metric Patterns', icon: LineChart },
    { key: 'traces' as const, label: 'Trace Patterns', icon: Network }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header Content */}
          <div className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AWS Observability Simulator
                </h1>
                <p className="text-sm text-gray-600">
                  Test and validate your observability patterns
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center -mb-px">
            <div className="flex gap-8">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8 min-h-[calc(100vh-12rem)]">
        {activeTab === 'memory' && (
          <ResourceCard
            title="Memory Test"
            icon={MemoryStick}
            percentage={resourceStates.memory.percentage}
            duration={resourceStates.memory.duration}
            onPercentageChange={(value) => handlePercentageChange('memory', value)}
            onDurationChange={(value) => handleDurationChange('memory', value)}
            onSimulate={() => simulateResource('memory')}
            isSimulating={resourceStates.memory.isSimulating}
            status={resourceStates.memory.status}
          />
        )}

        {activeTab === 'cpu' && (
          <ResourceCard
            title="CPU Test"
            icon={Cpu}
            percentage={resourceStates.cpu.percentage}
            duration={resourceStates.cpu.duration}
            onPercentageChange={(value) => handlePercentageChange('cpu', value)}
            onDurationChange={(value) => handleDurationChange('cpu', value)}
            onSimulate={() => simulateResource('cpu')}
            isSimulating={resourceStates.cpu.isSimulating}
            status={resourceStates.cpu.status}
          />
        )}

        {activeTab === 'disk' && (
          <ResourceCard
            title="Disk Test"
            icon={HardDrive}
            percentage={resourceStates.disk.percentage}
            duration={resourceStates.disk.duration}
            onPercentageChange={(value) => handlePercentageChange('disk', value)}
            onDurationChange={(value) => handleDurationChange('disk', value)}
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

function CountdownTimer({ duration }: { duration: string }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const [minutes, seconds] = duration.split(':').map(Number);
    let totalSeconds = minutes * 60 + seconds;

    const timer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="font-mono text-sm text-gray-600">
      {timeLeft}
    </div>
  );
}

export default App;