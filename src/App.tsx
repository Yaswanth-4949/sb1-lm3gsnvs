import { useState, useEffect, useCallback } from 'react';
import {
  Wind,
  Thermometer,
  Droplets,
  BatteryMedium,
  ScanLine,
  Activity,
  AlertTriangle,
  Wifi,
  Clock,
  Play,
  Square,
  X,
} from 'lucide-react';
import SensorCard from './components/SensorCard';
import GasLevelChart from './components/GasLevelChart';

type SensorStatus = 'normal' | 'warning' | 'critical';

interface SensorData {
  gas: number;
  temperature: number;
  humidity: number;
  battery: number;
  obstacle: boolean;
}

interface ChartPoint {
  time: string;
  ppm: number;
}

function generateInitialChart(): ChartPoint[] {
  const points: ChartPoint[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5000);
    points.push({
      time: t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ppm: Math.floor(180 + Math.random() * 120),
    });
  }
  return points;
}

function getGasStatus(ppm: number): SensorStatus {
  if (ppm > 400) return 'critical';
  if (ppm > 300) return 'warning';
  return 'normal';
}

function getTempStatus(temp: number): SensorStatus {
  if (temp > 40) return 'critical';
  if (temp > 35) return 'warning';
  return 'normal';
}

function getHumidityStatus(hum: number): SensorStatus {
  if (hum > 80) return 'warning';
  return 'normal';
}

function getBatteryStatus(bat: number): SensorStatus {
  if (bat < 20) return 'critical';
  if (bat < 40) return 'warning';
  return 'normal';
}

export default function App() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chartData, setChartData] = useState<ChartPoint[]>(generateInitialChart);
  const [sensors, setSensors] = useState<SensorData>({
    gas: 245,
    temperature: 28.4,
    humidity: 65,
    battery: 78,
    obstacle: false,
  });

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const updateSensors = useCallback(() => {
    setSensors(prev => ({
      gas: Math.max(100, Math.min(550, prev.gas + (Math.random() - 0.48) * 30)),
      temperature: parseFloat(Math.max(18, Math.min(45, prev.temperature + (Math.random() - 0.5) * 0.8)).toFixed(1)),
      humidity: Math.max(30, Math.min(95, prev.humidity + Math.round((Math.random() - 0.5) * 3))),
      battery: Math.max(5, prev.battery - (Math.random() > 0.85 ? 1 : 0)),
      obstacle: Math.random() > 0.85,
    }));

    setChartData(prev => {
      const newPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ppm: Math.max(100, Math.min(550, prev[prev.length - 1].ppm + Math.round((Math.random() - 0.48) * 30))),
      };
      return [...prev.slice(-11), newPoint];
    });
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;
    const id = setInterval(updateSensors, 2000);
    return () => clearInterval(id);
  }, [isMonitoring, updateSensors]);

  const gasStatus = getGasStatus(Math.round(sensors.gas));
  const tempStatus = getTempStatus(sensors.temperature);
  const humStatus = getHumidityStatus(sensors.humidity);
  const batStatus = getBatteryStatus(sensors.battery);
  const obstStatus: SensorStatus = sensors.obstacle ? 'critical' : 'normal';

  const systemHealthy = gasStatus === 'normal' && tempStatus === 'normal' && batStatus !== 'critical';

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Activity size={16} className="text-cyan-400" />
              </div>
              <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Monitoring System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Underground Atmospheric
              <span className="text-cyan-400"> Monitoring</span>
            </h1>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 w-fit">
              <Wifi size={12} className={systemHealthy ? 'text-green-400' : 'text-yellow-400'} />
              <span className={`text-xs font-medium ${systemHealthy ? 'text-green-400' : 'text-yellow-400'}`}>
                {systemHealthy ? 'System Connected' : 'Warning Active'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${systemHealthy ? 'bg-green-400' : 'bg-yellow-400'}`} />
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Clock size={11} />
              <span>
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                {' · '}
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
          </div>
        </header>

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <SensorCard
            title="Gas Level"
            value={String(Math.round(sensors.gas))}
            unit="ppm"
            status={gasStatus}
            Icon={Wind}
            statusLabel={gasStatus === 'normal' ? 'Safe' : gasStatus === 'warning' ? 'Elevated' : 'Danger'}
          />
          <SensorCard
            title="Temperature"
            value={String(sensors.temperature)}
            unit="°C"
            status={tempStatus}
            Icon={Thermometer}
            statusLabel={tempStatus === 'normal' ? 'Normal' : tempStatus === 'warning' ? 'High' : 'Critical'}
          />
          <SensorCard
            title="Humidity"
            value={String(sensors.humidity)}
            unit="%"
            status={humStatus}
            Icon={Droplets}
            statusLabel={humStatus === 'normal' ? 'Normal' : 'High'}
          />
          <SensorCard
            title="Battery"
            value={String(sensors.battery)}
            unit="%"
            status={batStatus}
            Icon={BatteryMedium}
            statusLabel={batStatus === 'normal' ? 'Good' : batStatus === 'warning' ? 'Low' : 'Critical'}
          />
          <SensorCard
            title="Obstacle"
            value={sensors.obstacle ? 'YES' : 'CLEAR'}
            unit=""
            status={obstStatus}
            Icon={ScanLine}
            statusLabel={sensors.obstacle ? 'Detected' : 'Clear'}
          />
        </div>

        {/* Chart + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <GasLevelChart data={chartData} isMonitoring={isMonitoring} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden flex-1">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <h3 className="text-white font-semibold text-sm mb-1">Monitoring Control</h3>
              <p className="text-slate-500 text-xs mb-5">Toggle live sensor data updates</p>

              <button
                onClick={() => setIsMonitoring(v => !v)}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95
                  ${isMonitoring
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
              >
                {isMonitoring ? <Square size={15} /> : <Play size={15} />}
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>

              <div className="mt-4 space-y-2.5">
                {[
                  { label: 'Sample Rate', value: '2 sec' },
                  { label: 'Data Points', value: `${chartData.length} pts` },
                  { label: 'Mode', value: isMonitoring ? 'Live' : 'Idle' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-medium ${label === 'Mode' && isMonitoring ? 'text-green-400' : 'text-slate-300'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAlert(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm
                bg-red-500/10 border border-red-500/30 text-red-400
                hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10
                transition-all duration-200 active:scale-95"
            >
              <AlertTriangle size={15} />
              Emergency Alert
            </button>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          {[
            { label: 'Active Sensors', value: '5 / 5', color: 'text-green-400' },
            { label: 'Avg Gas Level', value: `${Math.round(chartData.slice(-5).reduce((s, d) => s + d.ppm, 0) / 5)} ppm`, color: 'text-cyan-400' },
            { label: 'Peak Reading', value: `${Math.max(...chartData.map(d => d.ppm))} ppm`, color: 'text-yellow-400' },
            { label: 'System Uptime', value: '04:27:13', color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-slate-500 text-xs mb-0.5">{label}</p>
              <p className={`font-bold text-lg ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <button onClick={() => setShowAlert(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Emergency Alert Triggered</h2>
            <p className="text-slate-400 text-sm mb-5">
              An emergency signal has been sent to the monitoring control room. All personnel should evacuate immediately.
            </p>
            <div className="bg-slate-800 rounded-xl p-3 mb-5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Alert Time</span>
                <span className="text-white">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gas Level</span>
                <span className={gasStatus === 'critical' ? 'text-red-400' : 'text-green-400'}>
                  {Math.round(sensors.gas)} ppm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location</span>
                <span className="text-white">Zone B – Tunnel 3</span>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-semibold text-sm hover:bg-red-500/30 transition-colors"
            >
              Acknowledge &amp; Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
