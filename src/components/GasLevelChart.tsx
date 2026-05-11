import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface DataPoint {
  time: string;
  ppm: number;
}

interface GasLevelChartProps {
  data: DataPoint[];
  isMonitoring: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="text-cyan-400 font-semibold">{payload[0].value} ppm</p>
      </div>
    );
  }
  return null;
};

export default function GasLevelChart({ data, isMonitoring }: GasLevelChartProps) {
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Gas Level Monitor</h3>
          <p className="text-slate-500 text-xs mt-0.5">Real-time PPM readings</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full block" />
            <span className="text-slate-400">Gas (ppm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400/70 rounded-full block border-dashed border-t border-red-400/70" />
            <span className="text-slate-400">Alert Threshold</span>
          </div>
          {isMonitoring && (
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 600]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={400} stroke="rgba(248,113,113,0.5)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="ppm"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0e7490', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500">
        <span>Safe Zone: 0 – 400 ppm</span>
        <span>Danger Zone: &gt; 400 ppm</span>
      </div>
    </div>
  );
}
