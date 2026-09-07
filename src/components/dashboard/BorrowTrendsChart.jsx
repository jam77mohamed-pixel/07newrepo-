import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiTrendingUp, FiCalendar, FiArrowUpRight } from 'react-icons/fi';

export const BorrowTrendsChart = ({ borrowRecords = [] }) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState('monthly'); // 'weekly' or 'monthly'

  // Monthly dataset
  const monthlyData = [
    { label: 'Jan', borrowed: 42, returned: 38 },
    { label: 'Feb', borrowed: 55, returned: 49 },
    { label: 'Mar', borrowed: 68, returned: 58 },
    { label: 'Apr', borrowed: 60, returned: 62 },
    { label: 'May', borrowed: 78, returned: 70 },
    { label: 'Jun', borrowed: 92, returned: 84 },
    { label: 'Jul', borrowed: 85, returned: 79 },
    { label: 'Aug', borrowed: 104, returned: 91 },
    { label: 'Sep', borrowed: 118, returned: 105 }
  ];

  // Weekly dataset
  const weeklyData = [
    { label: 'Mon', borrowed: 14, returned: 11 },
    { label: 'Tue', borrowed: 22, returned: 18 },
    { label: 'Wed', borrowed: 29, returned: 24 },
    { label: 'Thu', borrowed: 25, returned: 26 },
    { label: 'Fri', borrowed: 34, returned: 28 },
    { label: 'Sat', borrowed: 40, returned: 35 },
    { label: 'Sun', borrowed: 18, returned: 20 }
  ];

  const data = timeRange === 'monthly' ? monthlyData : weeklyData;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...data.flatMap((d) => [d.borrowed, d.returned])) * 1.15 || 100;
  const height = 220;
  const width = 600;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Compute SVG Points
  const getCoordinates = (index, value) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (value / maxVal) * chartHeight;
    return { x, y };
  };

  const borrowedPoints = data.map((d, i) => getCoordinates(i, d.borrowed));
  const returnedPoints = data.map((d, i) => getCoordinates(i, d.returned));

  const generateAreaPath = (points) => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const pathD = points.reduce(
      (acc, p, i) =>
        i === 0
          ? `M ${p.x} ${p.y}`
          : `${acc} C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y}, ${(points[i - 1].x + p.x) / 2} ${p.y}, ${p.x} ${p.y}`,
      ''
    );
    return `${pathD} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  };

  const generateLinePath = (points) => {
    if (points.length === 0) return '';
    return points.reduce(
      (acc, p, i) =>
        i === 0
          ? `M ${p.x} ${p.y}`
          : `${acc} C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y}, ${(points[i - 1].x + p.x) / 2} ${p.y}, ${p.x} ${p.y}`,
      ''
    );
  };

  const totalBorrowed = data.reduce((acc, d) => acc + d.borrowed, 0);
  const totalReturned = data.reduce((acc, d) => acc + d.returned, 0);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-base">
              <FiTrendingUp />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white m-0">
                Borrowing & Circulation Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Borrowing activity vs book returns volume
              </p>
            </div>
          </div>
        </div>

        {/* Legend & Filter Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 inline-block" />
              Issued
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              Returned
            </span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('monthly')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                timeRange === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('weekly')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                timeRange === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="borrowedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="returnedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * chartHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fills */}
          <path d={generateAreaPath(borrowedPoints)} fill="url(#borrowedGrad)" />
          <path d={generateAreaPath(returnedPoints)} fill="url(#returnedGrad)" />

          {/* Lines */}
          <path
            d={generateLinePath(borrowedPoints)}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={generateLinePath(returnedPoints)}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Data Points & Hover Triggers */}
          {data.map((d, i) => {
            const bPt = borrowedPoints[i];
            const rPt = returnedPoints[i];
            const isHovered = hoveredIndex === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={bPt.x}
                    y1={paddingY}
                    x2={bPt.x}
                    y2={height - paddingY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Invisible wide hover target */}
                <rect
                  x={bPt.x - (chartWidth / data.length) / 2}
                  y={0}
                  width={chartWidth / data.length}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Borrowed Node */}
                <circle
                  cx={bPt.x}
                  cy={bPt.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Returned Node */}
                <circle
                  cx={rPt.x}
                  cy={rPt.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* X Axis Labels */}
                <text
                  x={bPt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs py-1.5 px-3.5 rounded-2xl shadow-xl border border-slate-700 pointer-events-none flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150"
          >
            <span className="font-bold text-slate-300">{data[hoveredIndex].label}:</span>
            <span className="text-indigo-300 font-bold">
              ● {data[hoveredIndex].borrowed} Issued
            </span>
            <span className="text-emerald-300 font-bold">
              ● {data[hoveredIndex].returned} Returned
            </span>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span>
            Total Volume: <strong className="text-slate-900 dark:text-white font-bold">{totalBorrowed + totalReturned}</strong>
          </span>
          <span>
            Return Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">92.4%</strong>
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
          <FiArrowUpRight className="text-xs" /> +14.8% circulation rate
        </span>
      </div>
    </div>
  );
};
