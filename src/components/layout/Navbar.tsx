import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  WalletCards,
  BarChart3,
  PlusCircle,
  Sparkles,
  LogOut,
  User as UserIcon,
  CloudCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { PiggyBank3D } from '../illustrations/PiggyBank3D';
import { Coin3D } from '../illustrations/Coin3D';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'transactions', label: 'Giao dịch', icon: Receipt },
  { id: 'budget', label: 'Ngân sách', icon: WalletCards },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, openTransactionModal } = useApp();
  const { currentUser, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#A8DEFA]/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative transform transition-transform group-hover:scale-105 duration-200">
              <PiggyBank3D size="sm" showCoin={true} animated={false} />
              <div className="absolute -bottom-1 -right-1">
                <Coin3D size="sm" symbol="₫" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#52769A]">
                  STUDENTS
                </span>
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#F4CB70] drop-shadow-xs">
                  COINS
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F7C6D0]/50 text-[#733B49]">
                  <Sparkles size={11} className="mr-0.5 text-[#F4CB70]" /> GenZ
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#7D9BB9] hidden sm:block">
                Quản lý chi tiêu sinh viên
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F0F8FD] p-1.5 rounded-2xl border border-[#A8DEFA]/30">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFDF8] text-[#52769A] shadow-sm font-bold scale-[1.02]'
                      : 'text-[#6B8BAA] hover:text-[#52769A] hover:bg-white/60'
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#52769A]' : 'text-[#8AA6C3]'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Area: User Profile & Quick Add Transaction */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Button */}
            <button
              onClick={() => openTransactionModal()}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#52769A] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#436282] hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlusCircle size={17} className="text-[#F4CB70]" />
              <span className="hidden sm:inline">Thêm giao dịch</span>
              <span className="sm:hidden">+ Thêm</span>
            </button>

            {/* Authenticated User Menu */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#F0F8FD] hover:bg-[#E2F0FA] border border-[#A8DEFA]/40 transition-all cursor-pointer group"
                  title={currentUser.displayName || currentUser.email || 'Tài khoản'}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Avatar'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#52769A] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <UserIcon size={14} />}
                    </div>
                  )}
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-bold text-[#2C4258] truncate max-w-[110px]">
                      {currentUser.displayName || 'Sinh viên'}
                    </p>
                    <p className="text-[10px] text-[#27AE60] font-medium flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] inline-block animate-pulse" />
                      Đã đồng bộ
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#A8DEFA]/40 p-3 z-40 animate-fade-in text-xs">
                      <div className="px-3 py-2 border-b border-[#F0F4F8] mb-2">
                        <p className="font-bold text-[#2C4258] truncate">
                          {currentUser.displayName || 'Sinh viên'}
                        </p>
                        <p className="text-[#7F9EB8] text-[11px] truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          await signOutUser();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#E07A5F] hover:bg-[#FFF0ED] font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8] border-t border-[#A8DEFA]/40 shadow-lg px-2 py-1.5 safe-area-pb">
        <div className="grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                    : 'text-[#8AA6C3] hover:text-[#52769A]'
                }`}
              >
                <Icon
                  size={19}
                  className={`mb-0.5 ${isActive ? 'text-[#52769A]' : 'text-[#8AA6C3]'}`}
                />
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
