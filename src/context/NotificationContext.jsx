import React, { createContext, useContext, useState, useEffect } from 'react';
import { KEYS, getStoredItem, setStoredItem } from '../services/storageService';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    const stored = getStoredItem(KEYS.NOTIFICATIONS, []);
    setNotifications(stored);
    setUnreadCount(stored.filter((n) => !n.isRead).length);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const addNotification = ({ title, message, type = 'system', link = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      link,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    setStoredItem(KEYS.NOTIFICATIONS, updated);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    setStoredItem(KEYS.NOTIFICATIONS, updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setStoredItem(KEYS.NOTIFICATIONS, updated);
    setUnreadCount(0);
    toast.success('All notifications marked as read.');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setStoredItem(KEYS.NOTIFICATIONS, []);
    setUnreadCount(0);
    toast.info('Notifications cleared.');
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    refreshNotifications: fetchNotifications
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
