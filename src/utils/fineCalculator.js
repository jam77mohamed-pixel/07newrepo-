import dayjs from 'dayjs';

export const DAILY_FINE_RATE = 1.00; // $1.00 per day overdue

/**
 * Calculates days overdue and overdue fine.
 * @param {string} dueDate - ISO date string
 * @param {string|null} returnDate - ISO date string or null if not yet returned
 * @param {number} rate - Fine rate per day
 * @returns {{ daysOverdue: number, fineAmount: number, isOverdue: boolean }}
 */
export const calculateOverdueFine = (dueDate, returnDate = null, rate = DAILY_FINE_RATE) => {
  if (!dueDate) return { daysOverdue: 0, fineAmount: 0, isOverdue: false };

  const due = dayjs(dueDate).startOf('day');
  const compareDate = returnDate ? dayjs(returnDate).startOf('day') : dayjs().startOf('day');

  const diffDays = compareDate.diff(due, 'day');

  if (diffDays > 0) {
    return {
      daysOverdue: diffDays,
      fineAmount: diffDays * rate,
      isOverdue: true
    };
  }

  return {
    daysOverdue: 0,
    fineAmount: 0,
    isOverdue: false
  };
};
