import React from 'react';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
    iconBg: 'bg-indigo-600 dark:bg-indigo-500',
    iconText: 'text-white',
    accent: 'text-indigo-600 dark:text-indigo-400',
    glow: 'from-indigo-500/10 to-transparent',
    sparkline: '#4f46e5'
  },
  emerald: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
    iconBg: 'bg-emerald-600 dark:bg-emerald-500',
    iconText: 'text-white',
    accent: 'text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/10 to-transparent',
    sparkline: '#10b981'
  },
  amber: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/40',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    accent: 'text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/10 to-transparent',
    sparkline: '#f59e0b'
  },
  rose: {
    bg: 'bg-rose-50/70 dark:bg-rose-950/40',
    iconBg: 'bg-rose-600 dark:bg-rose-500',
    iconText: 'text-white',
    accent: 'text-rose-600 dark:text-rose-400',
    glow: 'from-rose-500/10 to-transparent',
    sparkline: '#f43f5e'
  },
  purple: {
    bg: 'bg-purple-50/70 dark:bg-purple-950/40',
    iconBg: 'bg-purple-600 dark:bg-purple-500',
    iconText: 'text-white',
    accent: 'text-purple-600 dark:text-purple-400',
    glow: 'from-purple-500/10 to-transparent',
    sparkline: '#8b5cf6'
  }
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
  trend,
  sparklineData,
  className = ''
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  // Default sparklines if none provided
  const points = sparklineData || [12, 18, 15, 24, 28, 22, 35, 30, 42];
  const max = Math.max(...points) * 1.1;
  const min = Math.min(...points) * 0.9;
  const range = max - min || 1;

  const sparklinePoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 64;
      const y = 24 - ((p - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 ${className}`}>
      {/* Ambient background glow */}
      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl pointer-events-none`} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {title}
          </p>
          <h3 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`flex h-13 w-13 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconText} shadow-md shrink-0 ring-4 ring-slate-50 dark:ring-slate-800`}>
          {Icon && <Icon className="text-2xl" />}
        </div>
      </div>

      <div className="relative z-10 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`px-1.5 py-0.5 rounded-md font-bold text-[11px] ${
              trend.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}>
              {trend.value}
            </span>
            <span className="text-slate-400 dark:text-slate-500">{trend.label}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Live Metric</span>
        )}

        {/* Mini SVG Sparkline */}
        <svg width="64" height="24" className="overflow-visible opacity-80">
          <polyline
            fill="none"
            stroke={theme.sparkline}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sparklinePoints}
          />
        </svg>
      </div>
    </div>
  );
};
