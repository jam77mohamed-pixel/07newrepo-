import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (dateString, format = 'MMM DD, YYYY') => {
  if (!dateString) return 'N/A';
  return dayjs(dateString).format(format);
};

export const formatDateTime = (dateString, format = 'MMM DD, YYYY hh:mm A') => {
  if (!dateString) return 'N/A';
  return dayjs(dateString).format(format);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).fromNow();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
