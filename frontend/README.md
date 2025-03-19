# AWS Observability Practice Simulator

An interactive simulator for testing and understanding AWS observability patterns. This tool helps you experiment with different resource usage scenarios and observe their impact on logs, metrics, and traces.

## 🎯 Purpose

This simulator is designed to help developers and DevOps engineers:

- Test observability patterns before implementing them in production
- Understand how different resource usage patterns affect observability signals
- Practice interpreting observability data
- Experiment with various monitoring scenarios

## 🚀 Features

### Resource Simulation

- **Configurable Resource States**
  - Memory usage simulation
  - CPU utilization simulation
  - Disk usage simulation
- **Interactive Controls**
  - Adjustable usage thresholds
  - Custom simulation duration
  - Real-time countdown timer
- **Status Indicators**
  - Good (< 60%)
  - Warning (60-80%)
  - Critical (> 80%)

### Observability Signals

- **Logs**

  - Dynamic log generation based on resource state
  - Multiple severity levels (INFO, WARN, ERROR)
  - Pattern-based log emission

- **Metrics**

  - Resource utilization metrics
  - Performance indicators
  - Real-time metric generation

- **Traces**
  - Service dependency simulation
  - Latency pattern generation
  - Distributed trace visualization

## 🛠 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📸 Screenshots

### Simulation Dashboard

[Your screenshot of the simulation dashboard]

> Configure and run resource usage simulations

### Observability Signals

[Your screenshot of logs/metrics/traces]

> View generated observability data

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd aws-observability-practice
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the simulator**
   ```bash
   npm run dev
   ```

## 🎮 How to Use

1. **Configure Simulation**

   - Select a resource type (Memory, CPU, Disk)
   - Set the desired usage percentage (0-100%)
   - Define simulation duration

2. **Run Simulation**

   - Click "Start Simulation"
   - Watch real-time status changes
   - Observe generated logs, metrics, and traces

3. **Analyze Results**
   - Review generated observability data
   - Understand pattern correlations
   - Experiment with different scenarios

## 💡 Learning Objectives

- Understand AWS observability concepts
- Practice interpreting observability signals
- Learn correlation between resource usage and observability patterns
- Experiment with different monitoring scenarios

## 📝 Notes

- This is a simulation tool, not a real resource monitor
- All data is generated for learning purposes
- Perfect for practicing before implementing in production

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Submit issues
- Propose new features
- Create pull requests

## 📄 License

[Your chosen license]
