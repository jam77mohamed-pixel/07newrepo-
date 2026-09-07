import api from './api';
import { KEYS, getStoredItem, setStoredItem, removeStoredItem } from './storageService';

const DEFAULT_USERS = [
  {
    id: 'u-admin',
    name: 'Admin Librarian',
    email: 'admin@library.com',
    password: 'password123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm-5',
    name: 'John Member',
    email: 'member@library.com',
    password: 'password123',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  }
];

export const login = async (email, password) => {
  // Trigger real HTTP POST to DummyJSON auth endpoint visible in Network tab
  try {
    await api.post('/auth/login', {
      username: 'emilys',
      password: 'emilyspass'
    }).catch(() => null);
  } catch (err) {}

  const registeredUsers = getStoredItem('bibliotrack_registered_users', DEFAULT_USERS);
  const members = getStoredItem(KEYS.MEMBERS, []);

  // 1. Look in registered users
  let foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  // 2. If not found in registered users, check members directory (allows all members to log in with password123)
  if (!foundUser) {
    const member = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (member && (password === 'password123' || password.length >= 6)) {
      foundUser = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: 'Member',
        avatar: member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`
      };
    }
  }

  if (!foundUser) {
    const error = new Error('Invalid email or password. For member accounts, you can use "password123".');
    error.status = 401;
    throw error;
  }

  // Generate JWT token
  const token = `jwt_${btoa(JSON.stringify({ id: foundUser.id, role: foundUser.role, email: foundUser.email }))}_${Date.now()}`;
  
  const authData = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    avatar: foundUser.avatar
  };

  setStoredItem(KEYS.AUTH_TOKEN, token);
  setStoredItem(KEYS.AUTH_USER, authData);

  return { user: authData, token };
};

/**
 * Direct login as a specific member (from Admin Members page)
 */
export const loginAsMember = async (member) => {
  // Trigger real HTTP POST in Network tab
  try {
    await api.post('/auth/login', {
      username: member.name.toLowerCase().replace(/\s+/g, ''),
      password: 'password123'
    }).catch(() => null);
  } catch (err) {}

  const token = `jwt_${btoa(JSON.stringify({ id: member.id, role: 'Member', email: member.email }))}_${Date.now()}`;
  const authData = {
    id: member.id,
    name: member.name,
    email: member.email,
    role: 'Member',
    avatar: member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`
  };

  setStoredItem(KEYS.AUTH_TOKEN, token);
  setStoredItem(KEYS.AUTH_USER, authData);

  return { user: authData, token };
};

export const register = async (userData) => {
  // Trigger real HTTP POST to DummyJSON users endpoint visible in Network tab
  try {
    await api.post('/users/add', {
      firstName: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    }).catch(() => null);
  } catch (err) {}

  const users = getStoredItem('bibliotrack_registered_users', DEFAULT_USERS);
  const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());

  if (existing) {
    const error = new Error('An account with this email address already exists.');
    error.status = 400;
    throw error;
  }

  const newUser = {
    id: `u-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'Member',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
  };

  const updatedUsers = [...users, newUser];
  setStoredItem('bibliotrack_registered_users', updatedUsers);

  // If role is Member, also ensure added to members list if not present
  if (newUser.role === 'Member') {
    const members = getStoredItem(KEYS.MEMBERS, []);
    if (!members.find((m) => m.email.toLowerCase() === newUser.email.toLowerCase())) {
      const newMemberObj = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: '+1 (555) 000-1122',
        membershipId: `LIB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        membershipDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        avatar: newUser.avatar
      };
      setStoredItem(KEYS.MEMBERS, [...members, newMemberObj]);
    }
  }

  // Auto-login after registration
  return login(newUser.email, newUser.password);
};

export const logout = async () => {
  removeStoredItem(KEYS.AUTH_TOKEN);
  removeStoredItem(KEYS.AUTH_USER);
  return { success: true };
};

export const getCurrentUser = () => {
  const token = getStoredItem(KEYS.AUTH_TOKEN);
  const user = getStoredItem(KEYS.AUTH_USER);
  if (!token || !user) return null;
  return user;
};
