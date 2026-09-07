import React, { useState, useMemo } from 'react';
import { useMembers } from '../context/MemberContext';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { MemberFormModal } from '../components/members/MemberFormModal';
import { MemberHistoryModal } from '../components/members/MemberHistoryModal';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  FiUserPlus,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiMail,
  FiPhone,
  FiArrowLeft,
  FiBookOpen
} from 'react-icons/fi';

export const Members = () => {
  const { members, loading, addMember, updateMember, deleteMember } = useMembers();
  const navigate = useNavigate();

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.membershipId.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, debouncedSearch, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    setPageSize
  } = usePagination(filteredMembers, 10);

  const handleOpenAdd = () => {
    setSelectedMember(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setSelectedMember(member);
    setFormModalOpen(true);
  };

  const handleOpenHistory = (member) => {
    setSelectedMember(member);
    setHistoryModalOpen(true);
  };

  const handleOpenDelete = (member) => {
    setMemberToDelete(member);
    setConfirmDeleteOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setActionLoading(true);
      if (selectedMember) {
        await updateMember(selectedMember.id, data);
      } else {
        await addMember(data);
      }
      setFormModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      setActionLoading(true);
      await deleteMember(memberToDelete.id);
      setConfirmDeleteOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Member Details',
      key: 'name',
      render: (m) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`}
            alt={m.name}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate">{m.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
              <FiMail className="text-[10px]" /> {m.email}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Membership ID',
      key: 'membershipId',
      render: (m) => (
        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
          {m.membershipId}
        </span>
      )
    },
    {
      header: 'Contact Phone',
      key: 'phone',
      render: (m) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
          <FiPhone className="text-slate-400 text-xs" /> {m.phone || 'N/A'}
        </span>
      )
    },
    {
      header: 'Member Since',
      key: 'membershipDate',
      render: (m) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatDate(m.membershipDate)}</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (m) => <Badge status={m.status} size="sm" dot />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (m) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenHistory(m)}
            className="text-xs py-1.5 px-3 rounded-xl font-bold"
            icon={FiBookOpen}
            title="View member borrow history"
          >
            Borrow History
          </Button>
          <button
            type="button"
            onClick={() => handleOpenEdit(m)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title="Edit Member Profile"
          >
            <FiEdit2 className="text-base" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDelete(m)}
            className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Member (Admin Action)"
          >
            <FiTrash2 className="text-base" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          icon={FiArrowLeft}
          onClick={() => navigate('/dashboard')}
          className="text-xs rounded-2xl"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white m-0">
            Library Members Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage member registrations, contact records, and patron borrowing histories
          </p>
        </div>

        <Button
          variant="primary"
          icon={FiUserPlus}
          onClick={handleOpenAdd}
          className="text-xs sm:text-sm font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-indigo-500/20"
        >
          Register Member
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email, membership ID, or phone..."
          className="flex-1"
        />

        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: 'Active Members', value: 'Active' },
            { label: 'Inactive Members', value: 'Inactive' }
          ]}
          allLabel="All Member Statuses"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No members found"
          message={
            searchTerm || statusFilter
              ? 'Try modifying your search or filter settings.'
              : 'No library members registered yet.'
          }
          actionLabel={searchTerm || statusFilter ? 'Clear Filters' : 'Register Member'}
          onAction={() => {
            if (searchTerm || statusFilter) {
              setSearchTerm('');
              setStatusFilter('');
            } else {
              handleOpenAdd();
            }
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={paginatedItems}
          keyExtractor={(m) => m.id}
        />
      )}

      {/* Pagination */}
      {!loading && filteredMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )}

      {/* Modals */}
      <MemberFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
        loading={actionLoading}
      />

      <MemberHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        member={selectedMember}
      />

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete member "${memberToDelete?.name}"?`}
        message="This will remove the member profile from the library directory. Note: Members with unreturned borrowed books cannot be deleted until books are returned."
        loading={actionLoading}
      />
    </div>
  );
};
