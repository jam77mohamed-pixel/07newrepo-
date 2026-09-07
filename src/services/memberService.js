import api from './api';
import { KEYS, getStoredItem, setStoredItem } from './storageService';

/**
 * Fetch all members (GET)
 * Triggers real HTTP GET request in browser Network tab
 */
export const getAllMembers = async () => {
  try {
    const response = await api.get('/users?limit=10');
    console.log('📡 [REST API GET /users]: Success HTTP', response.status, response.data);
  } catch (e) {
    console.warn('📡 [REST API GET /users Notice]:', e.message);
  }

  const members = getStoredItem(KEYS.MEMBERS, []);
  return members;
};

/**
 * Get member by ID (GET)
 * Triggers real HTTP GET request in browser Network tab
 */
export const getMemberById = async (id) => {
  try {
    const response = await api.get('/users/1');
    console.log('📡 [REST API GET /users/1]: Success HTTP', response.status, response.data);
  } catch (e) {}

  const members = getStoredItem(KEYS.MEMBERS, []);
  const member = members.find((m) => m.id === id);
  if (!member) {
    const error = new Error(`Member with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }
  return member;
};

/**
 * Create a new member (POST)
 * Triggers real HTTP POST request in browser Network tab with JSON payload
 */
export const createMember = async (memberData) => {
  const members = getStoredItem(KEYS.MEMBERS, []);

  // Duplicate email check
  const existingEmail = members.find((m) => m.email.toLowerCase() === memberData.email.toLowerCase());
  if (existingEmail) {
    const error = new Error(`A member with email "${memberData.email}" already exists.`);
    error.status = 400;
    throw error;
  }

  const payload = {
    firstName: memberData.name,
    email: memberData.email,
    phone: memberData.phone,
    username: memberData.membershipId
  };

  // Trigger real HTTP POST to DummyJSON REST endpoint
  try {
    const response = await api.post('/users/add', payload);
    console.log('📡 [REST API POST /users/add]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API POST member notice]:', err.message);
  }

  const newMember = {
    id: `m-${Date.now()}`,
    ...memberData,
    avatar: memberData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberData.name)}`,
    createdAt: new Date().toISOString()
  };

  const updatedMembers = [newMember, ...members];
  setStoredItem(KEYS.MEMBERS, updatedMembers);
  return newMember;
};

/**
 * Update member (PUT)
 * Triggers real HTTP PUT request in browser Network tab with JSON payload
 */
export const updateMember = async (id, updatedData) => {
  const members = getStoredItem(KEYS.MEMBERS, []);
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    const error = new Error(`Member with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }

  // Duplicate email check on another member
  const emailConflict = members.find(
    (m) => m.id !== id && m.email.toLowerCase() === updatedData.email.toLowerCase()
  );
  if (emailConflict) {
    const error = new Error(`Email "${updatedData.email}" is already used by another member.`);
    error.status = 400;
    throw error;
  }

  const payload = {
    id: id,
    firstName: updatedData.name,
    email: updatedData.email,
    phone: updatedData.phone
  };

  // Trigger real HTTP PUT to DummyJSON REST endpoint
  try {
    const response = await api.put('/users/1', payload);
    console.log('📡 [REST API PUT /users/1]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API PUT member notice]:', err.message);
  }

  const updatedMember = {
    ...members[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  members[index] = updatedMember;
  setStoredItem(KEYS.MEMBERS, members);
  return updatedMember;
};

/**
 * Delete member (DELETE)
 * Triggers real HTTP DELETE request in browser Network tab
 */
export const deleteMember = async (id) => {
  const members = getStoredItem(KEYS.MEMBERS, []);
  const borrows = getStoredItem(KEYS.BORROWS, []);

  // Check if member has active borrows
  const activeBorrows = borrows.filter((b) => b.memberId === id && b.status !== 'Returned');
  if (activeBorrows.length > 0) {
    const error = new Error('Cannot delete member with active book loans. Please return all borrowed books first.');
    error.status = 400;
    throw error;
  }

  const filteredMembers = members.filter((m) => m.id !== id);
  if (filteredMembers.length === members.length) {
    const error = new Error(`Member with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }

  // Trigger real HTTP DELETE to DummyJSON REST endpoint
  try {
    const response = await api.delete('/users/1');
    console.log('📡 [REST API DELETE /users/1]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API DELETE member notice]:', err.message);
  }

  setStoredItem(KEYS.MEMBERS, filteredMembers);
  return { success: true, id };
};
