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
  RefreshCw,
  X,
  CheckCircle2,
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
  const { activeTab, setActiveTab, openTransactionModal, showToast } = useApp();
  const { currentUser, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileAccountModal, setShowMobileAccountModal] = useState(false);

  const handleSignOut = async () => {
    try {
      setShowUserMenu(false);
      setShowMobileAccountModal(false);
      await signOutUser();
      showToast('Đã đăng xuất tài khoản. Bạn có thể chọn tài khoản Google khác để đăng nhập.');
    } catch (error) {
      console.error(error);
      showToast('Đăng xuất thất bại, vui lòng thử lại.');
    }
  };

  const handleSwitchAccount = async () => {
    try {
      setShowUserMenu(false);
      setShowMobileAccountModal(false);
      await signOutUser();
      showToast('Vui lòng chọn tài khoản Google mới để đăng nhập.');
    } catch (error) {
      console.error(error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.');
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

          {/* Right Area: User Profile, Quick Add & Mobile Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Button */}
            <button
              onClick={() => openTransactionModal()}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#52769A] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#436282] hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlusCircle size={17} className="text-[#F4CB70]" />
              <span className="hidden sm:inline">Thêm giao dịch</span>
              <span className="sm:hidden">+ Thêm</span>
            </button>

            {/* Mobile Direct Logout / Switch Account Button */}
            {currentUser && (
              <button
                onClick={() => setShowMobileAccountModal(true)}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#FFF0ED] text-[#E07A5F] hover:bg-[#FFE5E0] active:scale-95 border border-[#FAD2C8] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Đăng xuất hoặc chuyển tài khoản"
              >
                <LogOut size={14} />
                <span className="text-[11px]">Đăng xuất</span>
              </button>
            )}

            {/* Authenticated User Menu (Desktop Dropdown & Mobile Avatar click) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    // On desktop toggle dropdown, on mobile open bottom modal
                    if (window.innerWidth < 768) {
                      setShowMobileAccountModal(true);
                    } else {
                      setShowUserMenu(!showUserMenu);
                    }
                  }}
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

                {/* Desktop Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#A8DEFA]/40 p-3 z-40 animate-fade-in text-xs space-y-1">
                      <div className="px-3 py-2 border-b border-[#F0F4F8] mb-1">
                        <p className="font-bold text-[#2C4258] truncate">
                          {currentUser.displayName || 'Sinh viên'}
                        </p>
                        <p className="text-[#7F9EB8] text-[11px] truncate">
                          {currentUser.email}
                        </p>
                        <p className="text-[10px] text-[#27AE60] font-medium flex items-center gap-1 mt-1">
                          <CheckCircle2 size={12} />
                          Đã đồng bộ Google Cloud
                        </p>
                      </div>

                      {/* Switch Account */}
                      <button
                        onClick={handleSwitchAccount}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#52769A] hover:bg-[#F0F8FD] font-semibold transition-colors cursor-pointer text-left"
                      >
                        <RefreshCw size={14} />
                        <span>Chuyển tài khoản Google</span>
                      </button>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#E07A5F] hover:bg-[#FFF0ED] font-semibold transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} />
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

      {/* Mobile Bottom Navigation Bar (5 tabs including Logout / Account) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#A8DEFA]/40 shadow-lg px-2 py-1.5 safe-area-pb">
        <div className="grid grid-cols-5 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !showMobileAccountModal;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileAccountModal(false);
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                    : 'text-[#8AA6C3] hover:text-[#52769A]'
                }`}
              >
                <Icon
                  size={18}
                  className={`mb-0.5 ${isActive ? 'text-[#52769A]' : 'text-[#8AA6C3]'}`}
                />
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}

          {/* 5th Mobile Tab: Account & Logout */}
          <button
            onClick={() => setShowMobileAccountModal(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
              showMobileAccountModal
                ? 'text-[#E07A5F] bg-[#FFF0ED] font-bold'
                : 'text-[#E07A5F] hover:bg-[#FFF0ED]'
            }`}
          >
            <LogOut size={18} className="mb-0.5 text-[#E07A5F]" />
            <span className="truncate max-w-full font-bold">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Mobile Account & Logout Modal / Bottom Sheet */}
      {showMobileAccountModal && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setShowMobileAccountModal(false)}
          />

          {/* Modal / Sheet Container */}
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl border-t border-[#A8DEFA]/40 p-5 z-10 animate-slide-up space-y-4">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#EAF3FA] text-[#52769A]">
                  <UserIcon size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#2C4258]">
                    Tài khoản của bạn
                  </h3>
                  <p className="text-[11px] text-[#7F9EB8]">
                    Quản lý tài khoản và chuyển đổi đăng nhập
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileAccountModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F0F4F8] text-[#8AA6C3] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Card */}
            {currentUser && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#52769A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <UserIcon size={20} />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2C4258] text-sm truncate">
                    {currentUser.displayName || 'Sinh viên'}
                  </p>
                  <p className="text-[#64748B] text-xs truncate">
                    {currentUser.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-[#27AE60]">
                    <span className="w-2 h-2 rounded-full bg-[#27AE60] inline-block animate-pulse" />
                    <span>Đã đồng bộ đám mây Firebase</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions for Mobile */}
            <div className="space-y-2 pt-1">
              {/* Switch Account */}
              <button
                onClick={handleSwitchAccount}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F0F8FD] hover:bg-[#E2F0FA] border border-[#A8DEFA]/40 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#52769A] shadow-xs flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#2C4258]">
                      Chuyển sang tài khoản Google khác
                    </p>
                    <p className="text-[11px] text-[#7F9EB8]">
                      Đăng xuất và đăng nhập tài khoản Google khác
                    </p>
                  </div>
                </div>
              </button>

              {/* Log out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF0ED] hover:bg-[#FFE5E0] border border-[#FAD2C8] transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#E07A5F] shadow-xs flex items-center justify-center flex-shrink-0">
                    <LogOut size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#E07A5F]">
                      Đăng xuất khỏi thiết bị
                    </p>
                    <p className="text-[11px] text-[#A86455]">
                      Thoát phiên đăng nhập trên điện thoại này
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowMobileAccountModal(false)}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
