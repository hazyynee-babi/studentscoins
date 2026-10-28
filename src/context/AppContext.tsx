import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Transaction, Budget, ActiveTab } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET } from '../data/mockData';
import { getMonthString } from '../utils/formatters';
import { db, handleFirestoreError, OperationType, sanitizeForFirestore } from '../lib/firebase';
import { useAuth } from './AuthContext';

const STORAGE_KEY_TRANSACTIONS = 'students_coins_transactions_v2';
const STORAGE_KEY_BUDGET = 'students_coins_budget_v2';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  transactions: Transaction[];
  budget: Budget;
  
  // Computed values
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySpentForBudget: number;
  
  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Budget actions
  updateBudget: (newBudget: Budget) => Promise<void>;

  // State reset/mock actions
  loadSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;

  // Global modals
  isTransactionModalOpen: boolean;
  openTransactionModal: (tx?: Transaction) => void;
  closeTransactionModal: () => void;
  editingTransaction: Transaction | null;

  isBudgetModalOpen: boolean;
  openBudgetModal: () => void;
  closeBudgetModal: () => void;

  // Toast / notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Transactions state: start strictly from empty [] (0 data) for new accounts
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Budget state: start strictly from 0 for new accounts
  const [budget, setBudget] = useState<Budget>(() => ({
    month: getMonthString(),
    totalBudget: 0,
    categoryBudgets: {},
  }));

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Sync to user-scoped localStorage
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`students_coins_tx_${currentUser.uid}`, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed saving transactions', e);
    }
  }, [transactions, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`students_coins_bgt_${currentUser.uid}`, JSON.stringify(budget));
    } catch (e) {
      console.error('Failed saving budget', e);
    }
  }, [budget, currentUser]);

  // Real-time Firestore sync when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      // When not logged in, reset strictly to 0
      setTransactions([]);
      setBudget({ month: getMonthString(), totalBudget: 0, categoryBudgets: {} });
      return;
    }

    const userTxKey = `students_coins_tx_${currentUser.uid}`;
    const userBudgetKey = `students_coins_bgt_${currentUser.uid}`;

    // Read user-specific cache if exists for instant UI rendering
    try {
      const cachedTx = localStorage.getItem(userTxKey);
      if (cachedTx) {
        setTransactions(JSON.parse(cachedTx));
      } else {
        setTransactions([]);
      }
      const cachedBudget = localStorage.getItem(userBudgetKey);
      if (cachedBudget) {
        setBudget(JSON.parse(cachedBudget));
      } else {
        setBudget({ month: getMonthString(), userId: currentUser.uid, totalBudget: 0, categoryBudgets: {} });
      }
    } catch (e) {
      console.error('Error reading user cached data', e);
    }

    const txCollectionRef = collection(db, 'users', currentUser.uid, 'transactions');
    const txQuery = query(txCollectionRef, orderBy('date', 'desc'));

    const unsubscribeTx = onSnapshot(
      txQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteTxList: Transaction[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteTxList.push({
              id: docSnap.id,
              userId: data.userId || currentUser.uid,
              type: data.type || 'expense',
              amount: Number(data.amount) || 0,
              category: data.category || 'other_expense',
              date: data.date || '',
              title: data.title || '',
              note: data.note || '',
            });
          });
          setTransactions(remoteTxList);
          try {
            localStorage.setItem(userTxKey, JSON.stringify(remoteTxList));
          } catch (e) {}
        } else {
          // For new account or first login: start strictly from 0 (empty transactions list)
          setTransactions([]);
          try {
            localStorage.setItem(userTxKey, JSON.stringify([]));
          } catch (e) {}
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/transactions`);
      }
    );

    // Sync budget
    const currentMonth = getMonthString();
    const budgetDocRef = doc(db, 'users', currentUser.uid, 'budget', currentMonth);
    const unsubscribeBudget = onSnapshot(
      budgetDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const remoteBudget: Budget = {
            month: data.month || currentMonth,
            userId: data.userId || currentUser.uid,
            totalBudget: Number(data.totalBudget) || 0,
            categoryBudgets: data.categoryBudgets || {},
          };
          setBudget(remoteBudget);
          try {
            localStorage.setItem(userBudgetKey, JSON.stringify(remoteBudget));
          } catch (e) {}
        } else {
          // New account: start budget strictly from 0
          const emptyBudget: Budget = {
            month: currentMonth,
            userId: currentUser.uid,
            totalBudget: 0,
            categoryBudgets: {},
          };
          setBudget(emptyBudget);
          try {
            localStorage.setItem(userBudgetKey, JSON.stringify(emptyBudget));
          } catch (e) {}
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/budget/${currentMonth}`);
      }
    );

    return () => {
      unsubscribeTx();
      unsubscribeBudget();
    };
  }, [currentUser]);

  // Calculations
  const currentMonth = getMonthString();

  const totalIncomeAllTime = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseAllTime = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncomeAllTime - totalExpenseAllTime;

  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySpentForBudget = monthlyExpense;

  // Handlers
  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newTx: Transaction = {
      ...tx,
      id: newId,
      userId: currentUser?.uid,
    };

    // Optimistic local update
    setTransactions((prev) => [newTx, ...prev]);

    // Save to Firestore if user logged in
    if (currentUser) {
      const txDocRef = doc(db, 'users', currentUser.uid, 'transactions', newId);
      try {
        await setDoc(txDocRef, sanitizeForFirestore({ ...newTx, userId: currentUser.uid }));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/transactions/${newId}`);
      }
    }

    showToast(tx.type === 'income' ? 'Đã thêm thu nhập mới!' : 'Đã ghi chép chi tiêu thành công!');
  };

  const updateTransaction = async (id: string, updatedData: Omit<Transaction, 'id'>) => {
    const updatedTx: Transaction = { ...updatedData, id, userId: currentUser?.uid };
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updatedTx : t))
    );

    if (currentUser) {
      const txDocRef = doc(db, 'users', currentUser.uid, 'transactions', id);
      try {
        await setDoc(txDocRef, sanitizeForFirestore({ ...updatedTx, userId: currentUser.uid }), { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/transactions/${id}`);
      }
    }

    showToast('Đã cập nhật giao dịch!');
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (currentUser) {
      const txDocRef = doc(db, 'users', currentUser.uid, 'transactions', id);
      try {
        await deleteDoc(txDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/transactions/${id}`);
      }
    }

    showToast('Đã xóa giao dịch');
  };

  const updateBudget = async (newBudget: Budget) => {
    const payload = { ...newBudget, userId: currentUser?.uid };
    setBudget(payload);

    if (currentUser) {
      const budgetDocRef = doc(db, 'users', currentUser.uid, 'budget', newBudget.month);
      try {
        await setDoc(budgetDocRef, sanitizeForFirestore(payload), { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/budget/${newBudget.month}`);
      }
    }

    showToast('Đã cập nhật kế hoạch ngân sách!');
  };

  const loadSampleData = async () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudget(INITIAL_BUDGET);

    if (currentUser) {
      for (const tx of INITIAL_TRANSACTIONS) {
        const txDoc = doc(db, 'users', currentUser.uid, 'transactions', tx.id);
        await setDoc(txDoc, sanitizeForFirestore({ ...tx, userId: currentUser.uid }), { merge: true });
      }
      const budgetDoc = doc(db, 'users', currentUser.uid, 'budget', INITIAL_BUDGET.month);
      await setDoc(budgetDoc, sanitizeForFirestore({ ...INITIAL_BUDGET, userId: currentUser.uid }), { merge: true });
    }

    showToast('Đã khôi phục dữ liệu sinh viên mẫu!');
  };

  const clearAllData = async () => {
    const clearedBudget = {
      month: getMonthString(),
      userId: currentUser?.uid,
      totalBudget: 0,
      categoryBudgets: {},
    };
    
    // Delete Firestore transactions if logged in
    if (currentUser) {
      for (const tx of transactions) {
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', tx.id));
        } catch (e) {
          console.warn('Delete transaction error:', e);
        }
      }
    }

    setTransactions([]);
    setBudget(clearedBudget);
    showToast('Đã làm trống toàn bộ dữ liệu');
  };

  // Modal helpers
  const openTransactionModal = (tx?: Transaction) => {
    setEditingTransaction(tx || null);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const openBudgetModal = () => setIsBudgetModalOpen(true);
  const closeBudgetModal = () => setIsBudgetModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        transactions,
        budget,
        currentBalance,
        monthlyIncome,
        monthlyExpense,
        monthlySpentForBudget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        loadSampleData,
        clearAllData,
        isTransactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
        editingTransaction,
        isBudgetModalOpen,
        openBudgetModal,
        closeBudgetModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
