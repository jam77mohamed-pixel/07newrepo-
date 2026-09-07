import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatRelativeTime } from '../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiAlertTriangle,
  FiClock,
  FiBookOpen,
  FiArrowLeft
} from 'react-icons/fi';

export const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
  } = useNotifications();

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unread', 'overdue', 'due_soon', 'new_book'

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'overdue') return n.type === 'overdue';
    if (activeFilter === 'due_soon') return n.type === 'due_soon';
    if (activeFilter === 'new_book') return n.type === 'new_book';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <FiAlertTriangle className="text-rose-600 text-xl" />;
      case 'due_soon':
        return <FiClock className="text-amber-600 text-xl" />;
      case 'new_book':
        return <FiBookOpen className="text-indigo-600 text-xl" />;
      default:
        return <FiBell className="text-slate-600 text-xl" />;
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case 'overdue':
        return 'border-rose-100 bg-rose-50/50';
      case 'due_soon':
        return 'border-amber-100 bg-amber-50/50';
      case 'new_book':
        return 'border-indigo-100 bg-indigo-50/50';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          icon={FiArrowLeft}
          onClick={() => navigate(isAdmin ? '/dashboard' : '/books')}
          className="text-xs"
        >
          {isAdmin ? 'Back to Dashboard' : 'Back to Catalog'}
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 m-0">Notification Center</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System alerts, book due reminders, overdue notices, and catalog updates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={FiCheck}
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={FiTrash2}
              onClick={clearAllNotifications}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'overdue', label: 'Overdue Notices' },
          { id: 'due_soon', label: 'Due Soon' },
          { id: 'new_book', label: 'New Books' }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === f.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`flex items-start justify-between gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${getStyle(
                item.type
              )} ${!item.isRead ? 'ring-2 ring-indigo-500/20' : 'opacity-90'}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-xs shrink-0">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    {!item.isRead && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                {!item.isRead ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                    }}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer"
                    title="Mark as read"
                  >
                    <FiCheck className="text-base" />
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <FiCheckCircle className="text-sm text-emerald-500" /> Read
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={FiBell}
            title="No notifications"
            message={
              activeFilter !== 'all'
                ? `No notifications found in the "${activeFilter}" filter.`
                : 'You are all caught up! There are no active notifications.'
            }
          />
        )}
      </div>
    </div>
  );
};
