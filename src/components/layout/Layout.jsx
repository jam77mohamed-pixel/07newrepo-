import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { useTheme } from '../../context/ThemeContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg} flex transition-colors duration-300 relative overflow-x-hidden`}>
      {/* Decorative ambient background glows */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="fixed bottom-10 left-1/3 w-80 h-80 bg-blue-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />

      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} City Central Library Management System. Built with React & Tailwind CSS.</p>
        </footer>

        {/* Global Notifications Drawer */}
        <NotificationDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
    </div>
  );
};
