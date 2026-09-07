import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_BORROWS, INITIAL_NOTIFICATIONS } from '../constants/initialData';

const KEYS = {
  BOOKS: 'bibliotrack_books',
  MEMBERS: 'bibliotrack_members',
  BORROWS: 'bibliotrack_borrows',
  NOTIFICATIONS: 'bibliotrack_notifications',
  AUTH_USER: 'bibliotrack_auth_user',
  AUTH_TOKEN: 'bibliotrack_auth_token'
};

// Initialize default seed data if not present in localStorage
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.BOOKS)) {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  }
  if (!localStorage.getItem(KEYS.BORROWS)) {
    localStorage.setItem(KEYS.BORROWS, JSON.stringify(INITIAL_BORROWS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

export const getStoredItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
  }
};

export const removeStoredItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
  }
};

export { KEYS };
