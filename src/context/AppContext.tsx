import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { Transaction, Budget, ActiveTab } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET } from '../data/mockData';
import { getMonthString } from '../utils/formatters';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const STORAGE_KEY_TRANSACTIONS = 'students_coins_transactions_v1';
const STORAGE_KEY_BUDGET = 'students_coins_budget_v1';

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

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  // Budget state
  const [budget, setBudget] = useState<Budget>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading budget from localStorage', e);
    }
    return INITIAL_BUDGET;
  });

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

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed saving transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(budget));
    } catch (e) {
      console.error('Failed saving budget', e);
    }
  }, [budget]);

  // Real-time Firestore synchronization when currentUser is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const currentMonth = getMonthString();
    const txCollectionRef = collection(db, 'users', currentUser.uid, 'transactions');
    const txQuery = query(txCollectionRef, orderBy('date', 'desc'));
    const txPath = `users/${currentUser.uid}/transactions`;

    const unsubscribeTx = onSnapshot(
      txQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudTxs: Transaction[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              type: data.type,
              amount: data.amount,
              category: data.category,
              date: data.date,
              title: data.title,
              note: data.note,
            };
          });
          setTransactions(cloudTxs);
        } else {
          // New account or empty cloud: migrate local transactions to Firestore
          transactions.forEach(async (tx) => {
            const docRef = doc(db, 'users', currentUser.uid, 'transactions', tx.id);
            try {
              await setDoc(docRef, {
                ...tx,
                userId: currentUser.uid,
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/transactions/${tx.id}`);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, txPath);
      }
    );

    // Sync budget
    const budgetDocRef = doc(db, 'users', currentUser.uid, 'budget', currentMonth);
    const budgetPath = `users/${currentUser.uid}/budget/${currentMonth}`;

    const unsubscribeBudget = onSnapshot(
      budgetDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setBudget(docSnap.data() as Budget);
        } else {
          // Save local budget to cloud
          setDoc(budgetDocRef, {
            ...budget,
            userId: currentUser.uid,
          }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, budgetPath);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, budgetPath);
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
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/transactions/${newId}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'transactions', newId), {
          ...newTx,
          userId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }

    showToast(tx.type === 'income' ? 'Đã thêm thu nhập mới!' : 'Đã ghi chép chi tiêu thành công!');
  };

  const updateTransaction = async (id: string, updatedData: Omit<Transaction, 'id'>) => {
    const updatedTx: Transaction = { ...updatedData, id };

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updatedTx : t))
    );

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/transactions/${id}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'transactions', id), {
          ...updatedTx,
          userId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }

    showToast('Đã cập nhật giao dịch!');
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/transactions/${id}`;
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }

    showToast('Đã xóa giao dịch');
  };

  const updateBudget = async (newBudget: Budget) => {
    setBudget(newBudget);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/budget/${newBudget.month}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'budget', newBudget.month), {
          ...newBudget,
          userId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }

    showToast('Đã cập nhật kế hoạch ngân sách!');
  };

  const loadSampleData = async () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudget(INITIAL_BUDGET);

    if (currentUser) {
      for (const tx of INITIAL_TRANSACTIONS) {
        const docPath = `users/${currentUser.uid}/transactions/${tx.id}`;
        try {
          await setDoc(doc(db, 'users', currentUser.uid, 'transactions', tx.id), {
            ...tx,
            userId: currentUser.uid,
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, docPath);
        }
      }
    }

    showToast('Đã khôi phục dữ liệu sinh viên mẫu!');
  };

  const clearAllData = async () => {
    if (currentUser) {
      for (const tx of transactions) {
        const docPath = `users/${currentUser.uid}/transactions/${tx.id}`;
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', tx.id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, docPath);
        }
      }
    }

    setTransactions([]);
    setBudget({
      month: getMonthString(),
      totalBudget: 3000000,
      categoryBudgets: {},
    });
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
