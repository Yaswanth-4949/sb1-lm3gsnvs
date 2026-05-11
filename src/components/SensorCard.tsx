import { type LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  Icon: LucideIcon;
  statusLabel: string;
}

export default function SensorCard({ title, value, unit, status, Icon, statusLabel }: SensorCardProps) {
  const statusColors = {
    normal: { dot: 'bg-green-400', text: 'text-green-400', border: 'border-green-400/20', glow: 'shadow-green-400/10' },
    warning: { dot: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400/20', glow: 'shadow-yellow-400/10' },
    critical: { dot: 'bg-red-400', text: 'text-red-400', border: 'border-red-400/20', glow: 'shadow-red-400/10' },
  };

  const colors = statusColors[status];

  return (
    <div
      className={`relative bg-slate-900 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-3
        hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10
        transition-all duration-300 hover:-translate-y-0.5 cursor-default overflow-hidden`}
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Icon size={18} className="text-cyan-400" />
          </div>
          <span className="text-slate-400 text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
          <span className={`text-xs font-medium ${colors.text}`}>{statusLabel}</span>
        </div>
      </div>

      <div className="flex items-end gap-1 mt-1">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-slate-400 text-sm mb-1">{unit}</span>
      </div>

      <div className={`h-1 rounded-full bg-slate-800 overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            status === 'normal' ? 'bg-green-400' : status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
          }`}
          style={{ width: status === 'normal' ? '60%' : status === 'warning' ? '80%' : '95%' }}
        />
      </div>
    </div>
  );
}
