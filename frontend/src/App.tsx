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
  Timer,
  ArrowRight
} from 'lucide-react';
import { api } from './services/api';

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
  const [level, setLevel] = useState<'INFO' | 'WARN' | 'ERROR'>('INFO');
  const [message, setMessage] = useState('Test log message');
  const [count, setCount] = useState(1);

  const generateLogs = async () => {
    try {
      await api.generateLogs({ level, message, count });
      const timestamp = new Date().toISOString();
      const newLogs = Array(count).fill(null).map((_, i) => ({
        level,
        message: `${message} - ${i + 1}`,
        timestamp
      }));
      setLogs(prev => [...newLogs, ...prev]);
    } catch (error) {
      console.error('Error generating logs:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Log Pattern Generator</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Log Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as 'INFO' | 'WARN' | 'ERROR')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value)))}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={generateLogs}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Logs
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Generated Logs</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                log.level === 'INFO' ? 'bg-blue-50 text-blue-700' :
                log.level === 'WARN' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }`}
            >
              <div className="text-xs opacity-75">{log.timestamp}</div>
              <div className="font-mono">[{log.level}] {log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricsPanel() {
  const [metrics, setMetrics] = useState<Array<{ name: string; value: number; unit: string; timestamp: string }>>([]);
  const [name, setName] = useState('custom_metric');
  const [value, setValue] = useState(1.0);
  const [unit, setUnit] = useState('Count');

  const emitMetric = async () => {
    try {
      await api.emitMetric({ name, value, unit });
      const timestamp = new Date().toISOString();
      setMetrics(prev => [{
        name,
        value,
        unit,
        timestamp
      }, ...prev]);
    } catch (error) {
      console.error('Error emitting metric:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Metric Pattern Generator</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Metric Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Count">Count</option>
              <option value="Seconds">Seconds</option>
              <option value="Bytes">Bytes</option>
              <option value="Percent">Percent</option>
            </select>
          </div>

          <button
            onClick={emitMetric}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Emit Metric
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Emitted Metrics</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-3 rounded-md bg-gray-50"
            >
              <div className="text-xs text-gray-500">{metric.timestamp}</div>
              <div className="font-mono">
                {metric.name} = {metric.value} {metric.unit}
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
    service: string;
    latency: number;
    status: string;
    timestamp: number;
  }>>([]);
  const [services, setServices] = useState(3);
  const [errorRate, setErrorRate] = useState(0.1);

  const generateTraces = async () => {
    try {
      const response = await api.generateTraces({ services, errorRate });
      if (response.traces) {
        setTraces(prev => [...response.traces, ...prev]);
      }
    } catch (error) {
      console.error('Error generating traces:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Trace Pattern Generator</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Services</label>
            <input
              type="number"
              value={services}
              onChange={(e) => setServices(Math.max(1, parseInt(e.target.value)))}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Error Rate (0-1)</label>
            <input
              type="number"
              value={errorRate}
              onChange={(e) => setErrorRate(Math.min(1, Math.max(0, parseFloat(e.target.value))))}
              step="0.1"
              min="0"
              max="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={generateTraces}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Traces
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Generated Traces</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {traces.map((trace, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                trace.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <div className="text-xs opacity-75">
                {new Date(trace.timestamp * 1000).toISOString()}
              </div>
              <div className="font-mono">
                {trace.service} - {trace.latency.toFixed(3)}s - {trace.status}
              </div>
            </div>
          ))}
        </div>
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

  const handleSimulation = async (type: 'memory' | 'cpu' | 'disk') => {
    const state = resourceStates[type];
    if (state.isSimulating) return;

    try {
      setResourceStates(prev => ({
        ...prev,
        [type]: { ...prev[type], isSimulating: true }
      }));

      let response;
      const params = {
        percentage: state.percentage,
        duration: state.duration
      };

      switch (type) {
        case 'memory':
          response = await api.simulateMemory(params);
          break;
        case 'cpu':
          response = await api.simulateCPU(params);
          break;
        case 'disk':
          response = await api.simulateDisk(params);
          break;
      }

      if (response.status) {
        setResourceStates(prev => ({
          ...prev,
          [type]: { ...prev[type], status: response.status }
        }));
      }

      // Reset after duration
      const [minutes, seconds] = state.duration.split(':').map(Number);
      const totalMs = (minutes * 60 + seconds) * 1000;

      setTimeout(() => {
        setResourceStates(prev => ({
          ...prev,
          [type]: { ...prev[type], isSimulating: false, status: 'idle' }
        }));
      }, totalMs);

    } catch (error) {
      console.error(`Error simulating ${type}:`, error);
      setResourceStates(prev => ({
        ...prev,
        [type]: { ...prev[type], isSimulating: false, status: 'idle' }
      }));
    }
  };

  const handlePercentageChange = (type: 'memory' | 'cpu' | 'disk', value: number) => {
    setResourceStates(prev => ({
      ...prev,
      [type]: { ...prev[type], percentage: value }
    }));
  };

  const handleDurationChange = (type: 'memory' | 'cpu' | 'disk', value: string) => {
    setResourceStates(prev => ({
      ...prev,
      [type]: { ...prev[type], duration: value }
    }));
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Activity className="w-6 h-6" />
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

          {/* Tabs */}
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 border-b border-gray-200">
              {tabs.map(tab => (
                <Tab
                  key={tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8 min-h-[calc(100vh-12rem)]">
        {activeTab === 'memory' && (
          <ResourceCard
            title="Memory Test"
            icon={MemoryStick}
            percentage={resourceStates.memory.percentage}
            duration={resourceStates.memory.duration}
            onPercentageChange={(value) => handlePercentageChange('memory', value)}
            onDurationChange={(value) => handleDurationChange('memory', value)}
            onSimulate={() => handleSimulation('memory')}
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
            onSimulate={() => handleSimulation('cpu')}
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
            onSimulate={() => handleSimulation('disk')}
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