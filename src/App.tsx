/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetView } from './components/budget/BudgetView';
import { ReportsView } from './components/reports/ReportsView';
import { TransactionModal } from './components/modals/TransactionModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { Coin3D } from './components/illustrations/Coin3D';
import { PiggyBank3D } from './components/illustrations/PiggyBank3D';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const { currentUser, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F8FD] text-[#2C4258]">
      {/* Top sticky navigation bar */}
      <Navbar />

      {/* Main Body */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <PiggyBank3D size="lg" showCoin={true} animated={true} />
          <p className="mt-4 font-heading font-bold text-base text-[#52769A]">
            Đang khởi động STUDENTS COINS...
          </p>
        </div>
      ) : !currentUser ? (
        /* When NOT logged in: Show the welcoming Logo landing screen with Google Sign-In */
        <main className="flex-1 flex flex-col">
          <LoginView />
        </main>
      ) : (
        /* When logged in: Show full functional views */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12 animate-fade-in">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'transactions' && <TransactionsView />}
          {activeTab === 'budget' && <BudgetView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      )}

      {/* Global Modals (Only active when authenticated) */}
      {currentUser && (
        <>
          <TransactionModal />
          <BudgetModal />
        </>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2C4258] text-[#FFFDF8] shadow-2xl border border-[#A8DEFA]/40 text-xs font-bold">
            <Coin3D size="sm" symbol="✓" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Cheerful Student Footer */}
      <footer className="border-t border-[#A8DEFA]/30 bg-[#FFFDF8] py-6 text-center text-xs text-[#7F9EB8] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#52769A]">STUDENTS COINS</span>
            <span>•</span>
            <span>Ứng dụng tài chính thông minh cho học sinh, sinh viên Việt Nam</span>
          </div>
          <div className="flex items-center gap-1 text-[#6B8BAA]">
            <span>Liên kết Firebase Cloud an toàn</span>
            <span className="text-[#F4CB70]">☁️</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
