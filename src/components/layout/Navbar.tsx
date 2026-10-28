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
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleSignOut = async () => {
    try {
      setShowAccountModal(false);
      await signOutUser();
      showToast('Đã đăng xuất tài khoản. Bạn có thể chọn tài khoản Google khác để đăng nhập.');
    } catch (error) {
      console.error(error);
      showToast('Đăng xuất thất bại, vui lòng thử lại.');
    }
  };

  const handleSwitchAccount = async () => {
    try {
      setShowAccountModal(false);
      await signOutUser();
      showToast('Vui lòng chọn tài khoản Google mới để đăng nhập.');
    } catch (error) {
      console.error(error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <>
      {/* Top Header: Clean, minimal brand banner with sync status and account info */}
      <header className="sticky top-0 z-30 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#A8DEFA]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="relative transform transition-transform group-hover:scale-105 duration-200">
                <PiggyBank3D size="sm" showCoin={true} animated={false} />
                <div className="absolute -bottom-1 -right-1">
                  <Coin3D size="sm" symbol="₫" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#52769A]">
                    STUDENTS
                  </span>
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#F4CB70] drop-shadow-xs">
                    COINS
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7C6D0]/50 text-[#733B49]">
                    <Sparkles size={10} className="mr-0.5 text-[#F4CB70]" /> GenZ
                  </span>
                </div>
                <p className="text-[10px] font-medium text-[#7D9BB9] hidden sm:block">
                  Quản lý chi tiêu sinh viên
                </p>
              </div>
            </div>

            {/* Right: Cloud Sync Status & Account Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cloud Sync Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF8F0] border border-[#BDE7CC] text-[11px] font-medium text-[#218838]">
                <span className="w-2 h-2 rounded-full bg-[#28A745] inline-block animate-pulse" />
                <span>Đã đồng bộ Google Cloud</span>
              </div>

              {/* Direct Switch Account Button in Header */}
              {currentUser && (
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FFF0ED] text-[#E07A5F] hover:bg-[#FFE5E0] active:scale-95 border border-[#FAD2C8] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Đổi tài khoản Google"
                >
                  <RefreshCw size={13} />
                  <span className="hidden sm:inline">Đổi tài khoản</span>
                </button>
              )}

              {/* User Avatar Button */}
              {currentUser && (
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-[#F0F8FD] hover:bg-[#E2F0FA] border border-[#A8DEFA]/40 transition-all cursor-pointer group"
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
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* THANH CÔNG CỤ Ở DƯỚI (BOTTOM TOOLBAR) - DESKTOP & TABLET */}
      {/* ======================================================== */}
      <div className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <nav className="flex items-center gap-1.5 bg-[#FFFDF8]/95 backdrop-blur-xl border border-[#A8DEFA]/60 shadow-2xl rounded-2xl px-3 py-2">
          {/* Navigation Items: Tổng quan & Giao dịch */}
          {NAV_ITEMS.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#52769A] text-white shadow-sm scale-[1.02]'
                    : 'text-[#6B8BAA] hover:text-[#52769A] hover:bg-[#F0F8FD]'
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-white' : 'text-[#8AA6C3]'}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Primary Action Button: + Thêm Giao Dịch */}
          <button
            onClick={() => openTransactionModal()}
            className="flex items-center gap-2 px-4 py-2 mx-1 rounded-xl bg-[#F4CB70] hover:bg-[#eec15b] active:scale-95 text-[#543D0A] font-extrabold text-xs shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
            title="Thêm giao dịch thu chi mới"
          >
            <PlusCircle size={17} className="text-[#543D0A]" />
            <span>+ Thêm giao dịch</span>
          </button>

          {/* Navigation Items: Ngân sách & Báo cáo */}
          {NAV_ITEMS.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#52769A] text-white shadow-sm scale-[1.02]'
                    : 'text-[#6B8BAA] hover:text-[#52769A] hover:bg-[#F0F8FD]'
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-white' : 'text-[#8AA6C3]'}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ======================================================== */}
      {/* THANH CÔNG CỤ Ở DƯỚI (BOTTOM TOOLBAR) - MOBILE & PHONES  */}
      {/* ======================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#A8DEFA]/40 shadow-xl px-1.5 py-1 safe-area-pb">
        <div className="grid grid-cols-5 gap-1 items-center">
          {/* Tab 1: Tổng quan */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setShowAccountModal(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'dashboard' && !showAccountModal
                ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                : 'text-[#8AA6C3] hover:text-[#52769A]'
            }`}
          >
            <LayoutDashboard size={18} className={activeTab === 'dashboard' && !showAccountModal ? 'text-[#52769A]' : 'text-[#8AA6C3]'} />
            <span className="truncate max-w-full mt-0.5">Tổng quan</span>
          </button>

          {/* Tab 2: Giao dịch */}
          <button
            onClick={() => {
              setActiveTab('transactions');
              setShowAccountModal(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'transactions' && !showAccountModal
                ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                : 'text-[#8AA6C3] hover:text-[#52769A]'
            }`}
          >
            <Receipt size={18} className={activeTab === 'transactions' && !showAccountModal ? 'text-[#52769A]' : 'text-[#8AA6C3]'} />
            <span className="truncate max-w-full mt-0.5">Thu chi</span>
          </button>

          {/* Action: + Thêm (Center Highlighted) */}
          <button
            onClick={() => openTransactionModal()}
            className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-bold text-[#543D0A] bg-[#F4CB70] hover:bg-[#eec15b] shadow-xs active:scale-95 transition-all"
            title="Thêm giao dịch mới"
          >
            <PlusCircle size={19} className="text-[#543D0A]" />
            <span className="truncate max-w-full mt-0.5">+ Thêm</span>
          </button>

          {/* Tab 3: Ngân sách */}
          <button
            onClick={() => {
              setActiveTab('budget');
              setShowAccountModal(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'budget' && !showAccountModal
                ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                : 'text-[#8AA6C3] hover:text-[#52769A]'
            }`}
          >
            <WalletCards size={18} className={activeTab === 'budget' && !showAccountModal ? 'text-[#52769A]' : 'text-[#8AA6C3]'} />
            <span className="truncate max-w-full mt-0.5">Ngân sách</span>
          </button>

          {/* Tab 4: Báo cáo */}
          <button
            onClick={() => {
              setActiveTab('reports');
              setShowAccountModal(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'reports' && !showAccountModal
                ? 'text-[#52769A] bg-[#EAF3FA] font-bold'
                : 'text-[#8AA6C3] hover:text-[#52769A]'
            }`}
          >
            <BarChart3 size={18} className={activeTab === 'reports' && !showAccountModal ? 'text-[#52769A]' : 'text-[#8AA6C3]'} />
            <span className="truncate max-w-full mt-0.5">Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Account & Logout Modal / Bottom Sheet */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setShowAccountModal(false)}
          />

          {/* Modal / Sheet Container */}
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#A8DEFA]/40 p-5 z-10 animate-slide-up space-y-4">
            {/* Sheet Handle (for mobile) */}
            <div className="sm:hidden w-12 h-1.5 bg-[#E2E8F0] rounded-full mx-auto" />

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
                onClick={() => setShowAccountModal(false)}
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
                    <CheckCircle2 size={13} className="text-[#27AE60]" />
                    <span>Đã đồng bộ đám mây Firebase</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
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
                      Đổi sang tài khoản Google khác
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
                      Thoát phiên đăng nhập hiện tại
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAccountModal(false)}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
