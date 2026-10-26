import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Receipt,
  WalletCards,
  BarChart3,
  PlusCircle,
  Sparkles,
  LogOut,
  User as UserIcon,
  Cloud,
  CheckCircle2,
  ChevronDown,
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

const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, openTransactionModal, showToast } = useApp();
  const { currentUser, loading, signInWithGoogle, signOutUser } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      showToast('Đăng nhập Google thành công! Dữ liệu đã đồng bộ Firebase.');
    } catch (err) {
      showToast('Đăng nhập chưa hoàn tất, vui lòng thử lại.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setIsUserMenuOpen(false);
      showToast('Đã đăng xuất khỏi tài khoản.');
    } catch (err) {
      showToast('Đăng xuất thất bại.');
    }
  };

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

          {/* Desktop Navigation Links (Only shown when logged in) */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1.5 bg-[#F0F8FD] p-1.5 rounded-2xl border border-[#A8DEFA]/30">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
          )}

          {/* Right Area: Action CTA & Google Auth */}
          <div className="flex items-center gap-2.5">
            {/* Quick Add Button (Only shown when logged in) */}
            {currentUser && (
              <button
                onClick={() => openTransactionModal()}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#52769A] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#436282] hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle size={17} className="text-[#F4CB70]" />
                <span className="hidden sm:inline">Thêm giao dịch</span>
                <span className="sm:hidden">+ Thêm</span>
              </button>
            )}

            {/* Google Authentication Button / User Profile */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-[#EAF3FA] animate-pulse" />
            ) : currentUser ? (
              /* Logged In User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 hover:bg-[#E2F0FA] transition-all"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Avatar'}
                      className="w-7 h-7 rounded-full object-cover border border-[#A8DEFA]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#F7C6D0] text-[#522530] font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#2C4258] max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">
                    {currentUser.displayName?.split(' ')[0] || 'Tài khoản'}
                  </span>
                  <ChevronDown size={14} className="text-[#7F9EB8]" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#FFFDF8] border border-[#A8DEFA]/50 shadow-xl p-3 z-50 animate-scale-up">
                    <div className="p-2 border-b border-[#F0F4F8] mb-2">
                      <p className="font-heading font-extrabold text-sm text-[#2C4258] truncate">
                        {currentUser.displayName || 'Sinh viên'}
                      </p>
                      <p className="text-[11px] text-[#7F9EB8] truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-xl bg-[#EAF7EE] text-[#1B6F3E] text-[10px] font-bold w-fit">
                        <Cloud size={12} className="text-[#27AE60]" />
                        <span>Đã đồng bộ Firebase Cloud</span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#C0392B] hover:bg-[#FDF0EF] transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Google Sign-In Button */
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#A8DEFA]/60 text-xs font-bold text-[#2C4258] shadow-xs hover:shadow-md hover:bg-[#F8FCFF] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                title="Đăng nhập bằng Google để đồng bộ dữ liệu với Firebase"
              >
                <GoogleIcon />
                <span className="hidden xs:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Only shown when logged in) */}
      {currentUser && (
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
      )}
    </header>
  );
};
