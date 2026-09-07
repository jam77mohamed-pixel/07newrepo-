import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FiBell, FiX, FiCheck, FiClock, FiAlertTriangle, FiBookOpen } from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatters';
import { Button } from '../common/Button';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'overdue', 'due_soon'

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'overdue') return n.type === 'overdue';
    if (filter === 'due_soon') return n.type === 'due_soon';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <FiAlertTriangle className="text-rose-600 text-lg" />;
      case 'due_soon':
        return <FiClock className="text-amber-600 text-lg" />;
      case 'new_book':
        return <FiBookOpen className="text-indigo-600 text-lg" />;
      default:
        return <FiBell className="text-slate-600 text-lg" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'overdue':
        return 'bg-rose-50 border-rose-100';
      case 'due_soon':
        return 'bg-amber-50 border-amber-100';
      case 'new_book':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <FiBell className="text-lg" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">
                  {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Action & Filter Bar */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-white">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'unread', 'overdue', 'due_soon'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                    filter === f
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'due_soon' ? 'Due Soon' : f}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${getBg(item.type)} ${
                    !item.isRead ? 'ring-2 ring-indigo-500/20' : 'opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                    </div>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FiBell className="mx-auto text-3xl text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">No notifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
