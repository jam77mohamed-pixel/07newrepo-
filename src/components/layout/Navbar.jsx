import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiBell,
  FiMenu,
  FiLogOut,
  FiUser,
  FiCheckCircle,
  FiShield,
  FiClock
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { UserProfileModal } from '../common/UserProfileModal';

export const Navbar = ({ onOpenSidebar, onOpenNotifications }) => {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-[#faf7f2]/90 backdrop-blur-md px-4 sm:px-6 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Brand/Portal badge */}
        <div className="hidden sm:flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
              isAdmin
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {isAdmin ? <FiShield className="text-xs text-amber-700" /> : <FiUser className="text-xs text-emerald-700" />}
            {isAdmin ? 'Staff / Admin Portal' : 'Member Portal'}
          </span>

          <span className="h-4 w-px bg-stone-300" />

          {/* Real-time Clock Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-200/60 text-stone-700 text-xs font-medium">
            <FiClock className="text-xs text-stone-500" />
            <span>{formattedTime}</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 text-[11px]">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-colors cursor-pointer"
          aria-label="View Notifications"
        >
          <FiBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="User Profile Menu"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
              alt={user?.name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-amber-500/30"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-stone-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-stone-500 capitalize font-medium">{user?.role}</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-stone-200 z-30 animate-in fade-in zoom-in-95 duration-150 text-left">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-900">{user?.name}</p>
                  <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <FiCheckCircle className="text-xs" /> Signed in as {user?.role}
                    </span>
                  </div>
                </div>

                <div className="py-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <FiUser className="text-sm text-amber-600" /> View Account Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <FiLogOut className="text-sm" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </header>
  );
};
