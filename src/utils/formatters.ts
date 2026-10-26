export const formatVND = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactVND = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} tr`;
  }
  if (Math.abs(amount) >= 1_000) {
    const thousands = amount / 1_000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(0)}k`;
  }
  return `${amount} ₫`;
};

export const formatDateVietnamese = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return `Hôm nay (${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')})`;
    if (isYesterday) return `Hôm qua (${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')})`;

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  } catch {
    return dateStr;
  }
};

export const getMonthString = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

export const formatMonthDisplay = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return `Tháng ${parseInt(month, 10)} / ${year}`;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getRemainingDaysInMonth = (): number => {
  const now = new Date();
  const totalDays = getDaysInMonth(now.getFullYear(), now.getMonth() + 1);
  return Math.max(1, totalDays - now.getDate());
};
