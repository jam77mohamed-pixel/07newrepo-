import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as memberService from '../services/memberService';
import { toast } from 'react-toastify';

const MemberContext = createContext(null);

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
      setError(err.message || 'Failed to load members');
      toast.error(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (memberData) => {
    try {
      setLoading(true);
      const newMember = await memberService.createMember(memberData);
      setMembers((prev) => [newMember, ...prev]);
      toast.success(`Member "${newMember.name}" registered successfully!`);
      return newMember;
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id, updatedData) => {
    try {
      setLoading(true);
      const updated = await memberService.updateMember(id, updatedData);
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      toast.success(`Member "${updated.name}" updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    try {
      setLoading(true);
      const target = members.find((m) => m.id === id);
      await memberService.deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Member "${target?.name || 'Member'}" deleted successfully.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    totalMembersCount: members.length,
    activeMembersCount: members.filter((m) => m.status === 'Active').length
  };

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
};

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};
