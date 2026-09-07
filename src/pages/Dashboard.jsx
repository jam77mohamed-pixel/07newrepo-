import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { useMembers } from '../context/MemberContext';
import { useBorrow } from '../context/BorrowContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { BorrowTrendsChart } from '../components/dashboard/BorrowTrendsChart';
import { GenreDonutChart } from '../components/dashboard/GenreDonutChart';
import { LoanHealthGauge } from '../components/dashboard/LoanHealthGauge';
import { BookFormModal } from '../components/books/BookFormModal';
import { IssueBookModal } from '../components/borrow/IssueBookModal';
import { MemberFormModal } from '../components/members/MemberFormModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  FiBook,
  FiUsers,
  FiRepeat,
  FiAlertTriangle,
  FiPlus,
  FiBookOpen,
  FiUserPlus,
  FiCheckCircle,
  FiSearch,
  FiStar,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { currentTheme } = useTheme();
  const { books, totalBooksCount, uniqueTitlesCount, addBook } = useBooks();
  const { members, totalMembersCount, activeMembersCount, addMember } = useMembers();
  const {
    borrowRecords,
    totalBorrowedCount,
    overdueCount,
    totalFinesCalculated,
    issueNewBook
  } = useBorrow();

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  // Greeting based on time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const handleAddBookSubmit = async (data) => {
    await addBook(data);
    setBookModalOpen(false);
  };

  const handleIssueSubmit = async (data) => {
    await issueNewBook(data);
    setIssueModalOpen(false);
  };

  const handleAddMemberSubmit = async (data) => {
    await addMember(data);
    setMemberModalOpen(false);
  };

  return (
    <div className="space-y-7">
      {/* Top Greeting Banner with Ambient Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800/80">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/15 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 dark:text-emerald-300 text-xs font-bold backdrop-blur-md border border-white/10">
                <FiStar className="text-xs text-amber-400" /> {greeting}, {user?.name?.split(' ')[0] || 'Librarian'}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • Library Operations Hub
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white m-0">
              City Central Library System
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track real-time circulation, discover books via Google Books API, and manage member borrows and returns.
            </p>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                size="md"
                icon={FiBookOpen}
                onClick={() => setIssueModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 dark:shadow-emerald-500/20"
              >
                Issue Book
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={FiPlus}
                onClick={() => setBookModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-2xl backdrop-blur-md"
              >
                Add Book
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stat Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Books Cataloged"
          value={totalBooksCount}
          subtitle={`${uniqueTitlesCount} unique titles`}
          icon={FiBook}
          color="indigo"
          trend={{ value: '+12%', label: 'vs last month', isPositive: true }}
          sparklineData={[14, 18, 20, 24, 28, 32, 38, 44, 52]}
        />

        <StatCard
          title="Active Members"
          value={activeMembersCount}
          subtitle={`${totalMembersCount} registered patrons`}
          icon={FiUsers}
          color="emerald"
          trend={{ value: '+8%', label: 'patron growth', isPositive: true }}
          sparklineData={[8, 12, 14, 16, 21, 24, 28, 31, 35]}
        />

        <StatCard
          title="Books Currently Borrowed"
          value={totalBorrowedCount}
          subtitle="In active reader circulation"
          icon={FiRepeat}
          color="amber"
          sparklineData={[25, 22, 28, 30, 26, 34, 38, 36, 40]}
        />

        <StatCard
          title="Overdue Returns"
          value={overdueCount}
          subtitle={formatCurrency(totalFinesCalculated) + ' pending fines'}
          icon={FiAlertTriangle}
          color="rose"
          trend={overdueCount > 0 ? { value: `${overdueCount}`, label: 'action required', isPositive: false } : null}
          sparklineData={[6, 8, 5, 7, 9, 6, 8, 7, 5]}
        />
      </div>

      {/* CHARTS SECTION 1: Borrowing Trends Area Chart & Genre Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BorrowTrendsChart borrowRecords={borrowRecords} />
        </div>
        <div>
          <GenreDonutChart books={books} />
        </div>
      </div>

      {/* CHARTS SECTION 2: Loan Health Gauge + Recent Lending Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Loan Compliance Gauge & Quick Shortcuts */}
        <div className="space-y-6">
          <LoanHealthGauge
            totalBorrowed={totalBorrowedCount}
            overdueCount={overdueCount}
            totalFines={totalFinesCalculated}
          />

          {/* Quick Management Shortcuts */}
          {isAdmin && (
            <div className="rounded-3xl bg-indigo-50/70 dark:bg-slate-900 p-5 border border-indigo-100 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-1.5">
                <FiStar className="text-amber-500" /> Quick Operations
              </h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <FiBookOpen className="text-indigo-600 dark:text-emerald-400 text-sm" /> Issue a Book
                  </span>
                  <span className="text-indigo-600 dark:text-emerald-400 font-bold">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <FiUserPlus className="text-indigo-600 dark:text-emerald-400 text-sm" /> Register Member
                  </span>
                  <span className="text-indigo-600 dark:text-emerald-400 font-bold">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <FiSearch className="text-indigo-600 dark:text-emerald-400 text-sm" /> Google Books Discovery
                  </span>
                  <span className="text-indigo-600 dark:text-emerald-400 font-bold">→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Cols: Recent Lending Activity */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base">
                  <FiActivity />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white m-0">Recent Lending Activity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-time book transactions and audit logs</p>
                </div>
              </div>
              <Link
                to="/borrows"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-emerald-400 hover:underline"
              >
                <span>View All Records</span>
                <FiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {borrowRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 rounded-2xl px-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        record.status === 'Returned'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : record.status === 'Overdue'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {record.status === 'Returned' ? (
                        <FiCheckCircle className="text-xl" />
                      ) : record.status === 'Overdue' ? (
                        <FiAlertTriangle className="text-xl" />
                      ) : (
                        <FiRepeat className="text-xl" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {record.bookTitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Borrowed by <span className="font-semibold text-slate-700 dark:text-slate-300">{record.memberName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <Badge status={record.status} size="sm" dot />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      Due: {formatDate(record.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookFormModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSubmit={handleAddBookSubmit}
      />

      <IssueBookModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSubmit={handleIssueSubmit}
      />

      <MemberFormModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSubmit={handleAddMemberSubmit}
      />
    </div>
  );
};
