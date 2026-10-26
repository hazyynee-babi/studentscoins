import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PiggyBank3D } from '../illustrations/PiggyBank3D';
import { Coin3D } from '../illustrations/Coin3D';
import { Sparkles, ShieldCheck, PieChart, Wallet, ArrowRight, Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

export const LoginView: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const { showToast } = useApp();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      showToast('Đăng nhập thành công! Chào mừng bạn đến với STUDENTS COINS.');
    } catch (error) {
      console.error(error);
      showToast('Đăng nhập chưa hoàn tất, vui lòng thử lại.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-16 px-4 max-w-4xl mx-auto w-full animate-fade-in">
      {/* Central Logo Box */}
      <div className="relative flex flex-col items-center text-center">
        {/* Glow ambient background circle */}
        <div className="absolute -top-10 w-72 h-72 bg-gradient-to-tr from-[#A8DEFA]/40 to-[#F7C6D0]/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 3D Piggy Bank & Floating Coins Logo */}
        <div className="relative mb-6 transform transition-transform hover:scale-105 duration-300">
          <PiggyBank3D size="hero" showCoin={true} animated={true} />
          <div className="absolute -top-3 -right-3 animate-pulse duration-700">
            <Coin3D size="md" symbol="₫" />
          </div>
          <div className="absolute bottom-2 -left-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <Coin3D size="sm" symbol="★" />
          </div>
        </div>

        {/* App Title */}
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#52769A]">
            STUDENTS
          </h1>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#F4CB70] drop-shadow-xs">
            COINS
          </h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#F7C6D0]/60 text-[#733B49] shadow-2xs">
            <Sparkles size={13} className="mr-1 text-[#F4CB70]" /> GenZ
          </span>
        </div>

        {/* Subtitle / Value Proposition */}
        <p className="text-base sm:text-lg text-[#5B7894] max-w-xl font-medium leading-relaxed mb-8">
          Ứng dụng quản lý tài chính cá nhân thông minh, dễ thương dành riêng cho học sinh, sinh viên Việt Nam.
        </p>

        {/* Primary Google Login CTA Button */}
        <div className="w-full max-w-sm space-y-3 mb-10">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-[#A8DEFA] text-[#2C4258] font-bold text-base shadow-lg hover:shadow-xl hover:border-[#52769A] hover:bg-[#F8FCFF] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isSigningIn ? (
              <>
                <Loader2 size={20} className="animate-spin text-[#52769A]" />
                <span>Đang kết nối Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Đăng nhập với Google</span>
                <ArrowRight size={17} className="text-[#8AA6C3] group-hover:translate-x-1 transition-transform ml-auto" />
              </>
            )}
          </button>

          <p className="text-xs text-[#7F9EB8] flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-[#27AE60]" />
            <span>Đồng bộ hóa bảo mật với Firebase Cloud</span>
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="card-soft p-5 border border-[#A8DEFA]/40 bg-white/80">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FA] text-[#52769A] flex items-center justify-center mb-3">
              <Wallet size={20} />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2C4258] mb-1">
              Ghi chép thu chi dễ dàng
            </h3>
            <p className="text-xs text-[#7F9EB8] leading-relaxed">
              Phân loại danh mục quen thuộc: Cơm trưa, trà sữa, tiền phòng trọ, sách vở, làm thêm...
            </p>
          </div>

          <div className="card-soft p-5 border border-[#F7C6D0]/50 bg-white/80">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#E84393] flex items-center justify-center mb-3">
              <PieChart size={20} />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2C4258] mb-1">
              Hạn mức ngân sách tháng
            </h3>
            <p className="text-xs text-[#7F9EB8] leading-relaxed">
              Cảnh báo thông minh trước khi vượt hạn mức để không còn nỗi lo "cháy túi" cuối tháng.
            </p>
          </div>

          <div className="card-soft p-5 border border-[#CDEBD6]/70 bg-white/80">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF7EE] text-[#27AE60] flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2C4258] mb-1">
              Dữ liệu an toàn trên Cloud
            </h3>
            <p className="text-xs text-[#7F9EB8] leading-relaxed">
              Tự động lưu trữ trên Firebase Firestore, truy cập mọi lúc trên điện thoại và máy tính.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
