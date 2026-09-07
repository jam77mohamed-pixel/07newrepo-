import React from 'react';

export const Table = ({
  columns = [],
  data = [],
  keyExtractor = (item) => item.id,
  loading = false,
  emptyMessage = 'No records found.'
}) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  scope="col"
                  className={`px-6 py-4 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={keyExtractor(item, rowIndex)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${keyExtractor(item, rowIndex)}-${col.key || colIndex}`}
                      className={`px-6 py-4.5 whitespace-nowrap text-slate-800 dark:text-slate-200 ${
                        col.cellClassName || ''
                      }`}
                    >
                      {col.render ? col.render(item, rowIndex) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
