import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../../context/AuthContext';
import { useBorrow } from '../../context/BorrowContext';
import { formatDate } from '../../utils/formatters';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiKey,
  FiBookmark
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const { borrowRecords } = useBorrow();

  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');
  const [department, setDepartment] = useState(isAdmin ? 'Head Librarian / Cataloging' : 'Literature & Arts');

  if (!user) return null;

  // Filter records for this user if Member, or all records if Admin
  const myRecords = borrowRecords.filter(
    (r) =>
      r.memberEmail?.toLowerCase() === user.email?.toLowerCase() ||
      r.memberId === user.id
  );

  const activeBorrows = myRecords.filter((r) => r.status === 'Borrowed' || r.status === 'Overdue');
  const totalReturned = myRecords.filter((r) => r.status === 'Returned');

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Account Profile"
      subtitle="View your library membership and security credentials"
      size="md"
    >
      <div className="space-y-6">
        {/* Top Profile Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-lg">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt={user?.name}
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
          />
          <div className="text-center sm:text-left min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-white">{user?.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAdmin
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              }`}>
                {isAdmin ? 'Staff Administrator' : 'Library Reader'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <FiMail className="text-indigo-400" /> {user?.email}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Account ID: {user?.id ? `LIB-${user.id.toUpperCase().slice(0, 8)}` : 'LIB-USR-0042'}
            </p>
          </div>
        </div>

        {/* Activity & Borrowing Summary Cards */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
              <FiCheckCircle /> Active
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Borrows</p>
            <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {isAdmin ? borrowRecords.filter(r => r.status === 'Borrowed').length : activeBorrows.length}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Returned</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              {isAdmin ? borrowRecords.filter(r => r.status === 'Returned').length : totalReturned.length}
            </p>
          </div>
        </div>

        {/* Profile Information List */}
        {!isEditing ? (
          <div className="space-y-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between pb-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FiShield className="text-indigo-500" /> Assigned Permissions
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {isAdmin ? 'Full CRUD on Books & Members' : 'Browse Catalog & Borrow Books'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FiPhone className="text-indigo-500" /> Contact Phone
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{phoneNumber}</span>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FiBookmark className="text-indigo-500" /> Department / Section
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{department}</span>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FiCalendar className="text-indigo-500" /> Member Since
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatDate(new Date(2023, 5, 12))}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department / Section
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs"
            >
              Edit Contact Details
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="ml-auto text-xs"
          >
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
