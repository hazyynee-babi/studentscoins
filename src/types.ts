export type TransactionType = 'expense' | 'income';

export type CategoryId =
  | 'food'
  | 'milktea_coffee'
  | 'study'
  | 'transport'
  | 'rent_bills'
  | 'groceries'
  | 'entertainment'
  | 'shopping'
  | 'gifts_social'
  | 'other_expense'
  | 'family_allowance'
  | 'part_time_job'
  | 'scholarship'
  | 'rewards_bonus'
  | 'other_income';

export interface Category {
  id: CategoryId;
  name: string;
  type: TransactionType;
  icon: string; // Lucide icon identifier or emoji
  color: string;
  bgColor: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  type: TransactionType;
  amount: number;
  category: CategoryId;
  date: string; // YYYY-MM-DD
  title: string;
  note?: string;
}

export interface Budget {
  month: string; // YYYY-MM
  userId?: string;
  totalBudget: number;
  categoryBudgets: Partial<Record<CategoryId, number>>;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'reports';
