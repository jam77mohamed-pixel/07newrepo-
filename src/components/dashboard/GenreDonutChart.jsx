import React, { useState } from 'react';
import { FiPieChart } from 'react-icons/fi';

export const GenreDonutChart = ({ books = [] }) => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  // Calculate genre counts
  const genreMap = books.reduce((acc, book) => {
    const genre = book.genre || 'Other';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const totalBooks = books.length || 1;

  const colorPalette = [
    { fill: '#4f46e5', name: 'Indigo' },
    { fill: '#10b981', name: 'Emerald' },
    { fill: '#f59e0b', name: 'Amber' },
    { fill: '#ec4899', name: 'Pink' },
    { fill: '#8b5cf6', name: 'Violet' },
    { fill: '#06b6d4', name: 'Cyan' }
  ];

  const sortedGenres = Object.entries(genreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([genre, count], index) => ({
      genre,
      count,
      percentage: Math.round((count / totalBooks) * 100),
      color: colorPalette[index % colorPalette.length].fill
    }));

  // Donut SVG Math
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base">
          <FiPieChart />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white m-0">
            Catalog by Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Holdings proportion by genre
          </p>
        </div>
      </div>

      {/* Donut Chart & Center Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {sortedGenres.map((item, index) => {
              const strokeDasharray = `${(item.count / totalBooks) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercent * circumference;
              cumulativePercent += item.count / totalBooks;

              const isHovered = hoveredGenre === item.genre;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredGenre(item.genre)}
                  onMouseLeave={() => setHoveredGenre(null)}
                />
              );
            })}
          </svg>

          {/* Center text badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalBooks}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Books
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {sortedGenres.map((item) => (
            <div
              key={item.genre}
              onMouseEnter={() => setHoveredGenre(item.genre)}
              onMouseLeave={() => setHoveredGenre(null)}
              className={`flex items-center justify-between text-xs px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                hoveredGenre === item.genre
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold scale-[1.02]'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                  {item.genre}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                <span className="text-[10px]">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
