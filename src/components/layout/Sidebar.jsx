import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBooks } from '../../context/BookContext';
import { useBorrow } from '../../context/BorrowContext';
import { UserProfileModal } from '../common/UserProfileModal';
import {
  FiGrid,
  FiBook,
  FiUsers,
  FiRepeat,
  FiBookmark,
  FiBell,
  FiX,
  FiBookOpen,
  FiStar,
  FiUser
} from 'react-icons/fi';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, user } = useAuth();
  const { currentTheme } = useTheme();
  const { totalBooksCount } = useBooks();
  const { totalBorrowedCount } = useBorrow();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Book Catalog', path: '/books', icon: FiBook },
    { name: 'Library Members', path: '/members', icon: FiUsers },
    { name: 'Borrow & Return', path: '/borrows', icon: FiRepeat },
    { name: 'Notifications', path: '/notifications', icon: FiBell }
  ];

  const memberNavItems = [
    { name: 'Browse Catalog', path: '/books', icon: FiBook },
    { name: 'My Borrowed Books', path: '/my-borrows', icon: FiBookmark },
    { name: 'Notifications', path: '/notifications', icon: FiBell }
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  const sidebarContent = (
    <div className={`flex h-full flex-col justify-between ${currentTheme.navBg} text-slate-200 border-r border-slate-800/80 transition-colors duration-300`}>
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr ${currentTheme.previewColor} text-white shadow-lg shadow-indigo-500/20`}>
              <FiBookOpen className="text-xl" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                City Central <FiStar className="text-amber-400 text-xs inline" />
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Library System
              </span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              aria-label="Close Sidebar"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="px-3 py-5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${currentTheme.previewColor} text-white shadow-md shadow-indigo-600/25`
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="text-lg shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Mini Status widget for Admin */}
        {isAdmin && (
          <div className="mx-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Catalog Status</span>
              <span className="text-[11px] text-emerald-400 font-bold">Online</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400">Total Books</p>
                <p className="text-xs font-bold text-white mt-0.5">{totalBooksCount || 0}</p>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400">Borrowed</p>
                <p className="text-xs font-bold text-amber-400 mt-0.5">{totalBorrowedCount || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / User status pill with View Profile trigger */}
      <div className="p-4 border-t border-slate-800/80">
        <div
          onClick={() => setProfileModalOpen(true)}
          className="rounded-2xl bg-slate-800/50 hover:bg-slate-800/80 transition-all p-3 border border-slate-800/90 flex items-center justify-between cursor-pointer group"
          title="Click to view full Account Profile"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
              alt={user?.name}
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-700 shrink-0 group-hover:ring-indigo-500 transition-all"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                <FiUser className="text-[10px] text-indigo-400" /> View Profile
              </p>
            </div>
          </div>
          <span className="text-slate-500 group-hover:text-white text-xs transition-colors">➔</span>
        </div>
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
