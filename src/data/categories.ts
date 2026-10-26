import { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  // EXPENSES (Chi tiêu)
  {
    id: 'food',
    name: 'Ăn uống',
    type: 'expense',
    icon: 'Utensils',
    color: '#E07A5F',
    bgColor: '#FDEEE9',
  },
  {
    id: 'milktea_coffee',
    name: 'Trà sữa & Cafe',
    type: 'expense',
    icon: 'Coffee',
    color: '#BA68C8',
    bgColor: '#F6EBF8',
  },
  {
    id: 'study',
    name: 'Học tập & Giáo trình',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#52769A',
    bgColor: '#EAF3FA',
  },
  {
    id: 'transport',
    name: 'Xăng xe & Đi lại',
    type: 'expense',
    icon: 'Bike',
    color: '#3D9970',
    bgColor: '#EAF7EE',
  },
  {
    id: 'rent_bills',
    name: 'Phòng trọ & Điện nước',
    type: 'expense',
    icon: 'Home',
    color: '#D9534F',
    bgColor: '#FDF0EF',
  },
  {
    id: 'groceries',
    name: 'Đồ dùng sinh hoạt',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#E67E22',
    bgColor: '#FDF3E8',
  },
  {
    id: 'entertainment',
    name: 'Giải trí & Phim ảnh',
    type: 'expense',
    icon: 'Gamepad2',
    color: '#9B59B6',
    bgColor: '#F5ECFA',
  },
  {
    id: 'shopping',
    name: 'Mua sắm cá nhân',
    type: 'expense',
    icon: 'Sparkles',
    color: '#E84393',
    bgColor: '#FCEBF4',
  },
  {
    id: 'gifts_social',
    name: 'Tiệc tùng & Bạn bè',
    type: 'expense',
    icon: 'Gift',
    color: '#F39C12',
    bgColor: '#FEF8EA',
  },
  {
    id: 'other_expense',
    name: 'Chi tiêu khác',
    type: 'expense',
    icon: 'HelpCircle',
    color: '#7F8C8D',
    bgColor: '#F4F6F6',
  },

  // INCOMES (Thu nhập)
  {
    id: 'family_allowance',
    name: 'Trợ cấp gia đình',
    type: 'income',
    icon: 'HeartHandshake',
    color: '#27AE60',
    bgColor: '#EAF8F0',
  },
  {
    id: 'part_time_job',
    name: 'Đi làm thêm (Part-time)',
    type: 'income',
    icon: 'Briefcase',
    color: '#2980B9',
    bgColor: '#EBF4FA',
  },
  {
    id: 'scholarship',
    name: 'Học bổng',
    type: 'income',
    icon: 'Award',
    color: '#F1C40F',
    bgColor: '#FEFCE8',
  },
  {
    id: 'rewards_bonus',
    name: 'Thưởng & Lì xì',
    type: 'income',
    icon: 'Gift',
    color: '#E74C3C',
    bgColor: '#FDEEEB',
  },
  {
    id: 'other_income',
    name: 'Thu nhập khác',
    type: 'income',
    icon: 'Coins',
    color: '#16A085',
    bgColor: '#E8F8F5',
  },
];

export const getCategoryById = (id: CategoryId | string): Category => {
  const found = CATEGORIES.find((c) => c.id === id);
  if (found) return found;
  return {
    id: 'other_expense' as CategoryId,
    name: 'Khác',
    type: 'expense',
    icon: 'HelpCircle',
    color: '#7F8C8D',
    bgColor: '#F4F6F6',
  };
};
