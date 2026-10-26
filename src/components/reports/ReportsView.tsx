import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  RotateCcw,
  Trash2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND, getMonthString, formatMonthDisplay } from '../../utils/formatters';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { PiggyBank3D } from '../illustrations/PiggyBank3D';
import { Coin3D } from '../illustrations/Coin3D';

export const ReportsView: React.FC = () => {
  const { transactions, loadSampleData, clearAllData } = useApp();

  const currentMonthKey = getMonthString();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [showResetConfirm, setShowResetConfirm] = useState<'sample' | 'clear' | null>(null);

  // Available months from transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(currentMonthKey);
    transactions.forEach((tx) => {
      const ym = tx.date.substring(0, 7);
      if (ym) set.add(ym);
    });
    return Array.from(set).sort().reverse();
  }, [transactions, currentMonthKey]);

  // Filter transactions for chosen month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = monthIncome - monthExpense;
  const savingsRate = monthIncome > 0 ? Math.round((netSavings / monthIncome) * 100) : 0;

  // Category breakdown for expenses
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthTransactions]);

  const topCategoryEntry = expenseByCategory[0];
  const topCategory = topCategoryEntry ? getCategoryById(topCategoryEntry[0]) : null;

  // Last 6 months trend data
  const trendMonths = useMemo(() => {
    const result: { month: string; income: number; expense: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = getMonthString(d);
      const txs = transactions.filter((t) => t.date.startsWith(mStr));
      const inc = txs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const exp = txs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      result.push({
        month: `T${d.getMonth() + 1}`,
        income: inc,
        expense: exp,
      });
    }
    return result;
  }, [transactions]);

  // Max value for bar scaling
  const maxTrendValue = Math.max(
    1,
    ...trendMonths.map((m) => Math.max(m.income, m.expense))
  );

  // Financial Health Score Calculation for student
  const healthScore = useMemo(() => {
    let score = 50;
    if (monthIncome > 0) {
      if (savingsRate > 25) score += 35;
      else if (savingsRate > 10) score += 25;
      else if (savingsRate >= 0) score += 10;
      else score -= 20;
    }
    if (monthTransactions.length >= 8) score += 15; // regular tracking
    return Math.min(100, Math.max(10, score));
  }, [monthIncome, savingsRate, monthTransactions.length]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2C4258]">
            Báo cáo tài chính 📊
          </h1>
          <p className="text-sm text-[#6B8BAA] mt-0.5">
            Thống kê trực quan thu chi và đánh giá sức khỏe ví tiền sinh viên
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Calendar size={16} className="text-[#52769A]" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#A8DEFA]/40 text-sm font-bold text-[#52769A] shadow-xs focus:outline-hidden"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthDisplay(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-soft p-5 border-l-4 border-l-[#27AE60]">
          <span className="text-xs font-bold text-[#7F9EB8] uppercase tracking-wide">
            Thu nhập ({formatMonthDisplay(selectedMonth)})
          </span>
          <p className="font-heading font-extrabold text-2xl text-[#1F7A43] mt-2">
            +{formatVND(monthIncome)}
          </p>
          <p className="text-xs text-[#7F9EB8] mt-1 font-medium">
            {monthTransactions.filter((t) => t.type === 'income').length} khoản tiền vào ví
          </p>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-[#E07A5F]">
          <span className="text-xs font-bold text-[#7F9EB8] uppercase tracking-wide">
            Chi tiêu ({formatMonthDisplay(selectedMonth)})
          </span>
          <p className="font-heading font-extrabold text-2xl text-[#D35400] mt-2">
            -{formatVND(monthExpense)}
          </p>
          <p className="text-xs text-[#7F9EB8] mt-1 font-medium">
            {monthTransactions.filter((t) => t.type === 'expense').length} khoản chi phí
          </p>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-[#F4CB70]">
          <span className="text-xs font-bold text-[#7F9EB8] uppercase tracking-wide">
            Tích lũy được
          </span>
          <p
            className={`font-heading font-extrabold text-2xl mt-2 ${
              netSavings >= 0 ? 'text-[#1F7A43]' : 'text-[#D32F2F]'
            }`}
          >
            {netSavings >= 0 ? '+' : ''}
            {formatVND(netSavings)}
          </p>
          <p className="text-xs text-[#7F9EB8] mt-1 font-medium">
            Tỷ lệ tiết kiệm: <strong className="text-[#2C4258]">{savingsRate}%</strong>
          </p>
        </div>
      </div>

      {/* Main Visuals: Bar Chart Comparison + Top Category Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6-Month Income vs Expense Bar Chart */}
        <div className="lg:col-span-7 card-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#2C4258]">
                  So sánh Thu - Chi qua các tháng
                </h3>
                <p className="text-xs text-[#7F9EB8]">Xu hướng tài chính 6 tháng gần nhất</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#27AE60]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CDEBD6] border border-[#27AE60]" />
                  Thu nhập
                </span>
                <span className="flex items-center gap-1.5 text-[#E07A5F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7C6D0] border border-[#E07A5F]" />
                  Chi tiêu
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[#F0F4F8]">
              {trendMonths.map((m, idx) => {
                const incHeight = (m.income / maxTrendValue) * 160;
                const expHeight = (m.expense / maxTrendValue) * 160;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Income Bar */}
                      <div
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-[#CDEBD6] hover:bg-[#a9dfb9] transition-all relative flex flex-col justify-end"
                        style={{ height: `${Math.max(4, incHeight)}px` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2C4258] text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap pointer-events-none z-10 font-bold transition-opacity">
                          +{formatVND(m.income)}
                        </div>
                      </div>

                      {/* Expense Bar */}
                      <div
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-[#F7C6D0] hover:bg-[#f2a8b7] transition-all relative flex flex-col justify-end"
                        style={{ height: `${Math.max(4, expHeight)}px` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2C4258] text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap pointer-events-none z-10 font-bold transition-opacity">
                          -{formatVND(m.expense)}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#6B8BAA]">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#7F9EB8]">
            <span>💡 Rê chuột vào từng cột để xem chi tiết số tiền</span>
            <span className="font-semibold text-[#52769A]">STUDENTS COINS Analytics</span>
          </div>
        </div>

        {/* Right Column: Top Category + Student Health Score */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Spending Category Highlight */}
          <div className="card-soft p-6 border-t-4 border-t-[#F4CB70]">
            <span className="text-[11px] font-bold text-[#7F9EB8] uppercase tracking-wider block">
              Danh mục chi nhiều nhất
            </span>

            {topCategory && topCategoryEntry ? (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CategoryIcon categoryId={topCategory.id} size="lg" />
                  <div>
                    <h4 className="font-heading font-extrabold text-lg text-[#2C4258]">
                      {topCategory.name}
                    </h4>
                    <p className="text-xs text-[#7F9EB8]">
                      Chiếm {Math.round((topCategoryEntry[1] / (monthExpense || 1)) * 100)}% tổng chi tiêu
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-heading font-extrabold text-lg text-[#D35400]">
                    {formatVND(topCategoryEntry[1])}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#7F9EB8] mt-3">
                Chưa có dữ liệu chi tiêu trong tháng được chọn.
              </p>
            )}

            {/* Breakdown for other top categories */}
            <div className="mt-4 pt-3 border-t border-[#F0F4F8] space-y-2">
              {expenseByCategory.slice(1, 4).map(([catId, amount]) => {
                const cat = getCategoryById(catId);
                const percent = Math.round((amount / (monthExpense || 1)) * 100);
                return (
                  <div key={catId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium text-[#38526F]">{cat.name}</span>
                    </div>
                    <div className="font-bold text-[#2C4258]">
                      {formatVND(amount)} ({percent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Financial Health Score */}
          <div className="card-soft p-6 bg-gradient-to-br from-[#FFFDF8] via-[#FFF8F0] to-[#FEF5E7] border border-[#F4CB70]/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#8C6D27] uppercase tracking-wider">
                  Chỉ số sức khỏe ví tiền
                </span>
                <h4 className="font-heading font-extrabold text-lg text-[#2C4258] mt-0.5">
                  {healthScore >= 80
                    ? '🏆 Thần đồng tiết kiệm'
                    : healthScore >= 60
                    ? '🥈 Chi tiêu cân đối'
                    : '🥉 Cần chú ý tài chính'}
                </h4>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#F4CB70]/50 flex flex-col items-center justify-center">
                <span className="font-heading font-extrabold text-lg text-[#8C6D27]">
                  {healthScore}
                </span>
                <span className="text-[9px] font-bold text-[#A6863B]">/ 100</span>
              </div>
            </div>

            <p className="text-xs text-[#7A5A19] mt-3 leading-relaxed">
              {healthScore >= 80
                ? 'Bạn đang kiểm soát chi tiêu cực kỳ xuất sắc! Tỷ lệ tiết kiệm lý tưởng cho sinh viên.'
                : healthScore >= 60
                ? 'Ví tiền của bạn đang ở mức ổn định. Hãy hạn chế trà sữa hoặc ăn vặt thêm một chút nhé!'
                : 'Bạn đang chi tiêu gần hết hoặc vượt quá số tiền thu nhập. Hãy xem lại danh mục có mức chi cao nhất!'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Management Section (Reset / Sample Data as requested) */}
      <div className="card-soft p-6 border border-[#A8DEFA]/40 bg-[#F8FCFF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#2C4258] flex items-center gap-2">
              <RotateCcw size={17} className="text-[#52769A]" />
              <span>Quản lý dữ liệu sinh viên</span>
            </h3>
            <p className="text-xs text-[#7F9EB8] mt-0.5">
              Toàn bộ dữ liệu được lưu an toàn trên trình duyệt (localStorage) của bạn
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowResetConfirm('sample')}
              className="px-4 py-2 rounded-xl bg-white border border-[#A8DEFA]/60 text-xs font-bold text-[#52769A] hover:bg-[#EAF3FA] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw size={13} />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>

            <button
              onClick={() => setShowResetConfirm('clear')}
              className="px-4 py-2 rounded-xl bg-[#FDF0EF] border border-[#F3A5AA]/40 text-xs font-bold text-[#C0392B] hover:bg-[#FCE3E2] transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Bắt đầu dữ liệu trống</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset Actions */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C4258]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFDF8] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#A8DEFA]/40 space-y-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                showResetConfirm === 'clear'
                  ? 'bg-[#FDF0EF] text-[#C0392B]'
                  : 'bg-[#EAF3FA] text-[#52769A]'
              }`}
            >
              <AlertCircle size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-extrabold text-lg text-[#2C4258]">
                {showResetConfirm === 'clear'
                  ? 'Xác nhận xóa toàn bộ dữ liệu?'
                  : 'Khôi phục dữ liệu mẫu sinh viên?'}
              </h3>
              <p className="text-xs text-[#6B8BAA] mt-1.5">
                {showResetConfirm === 'clear'
                  ? 'Thao tác này sẽ đặt lại ứng dụng về trạng thái trống hoàn toàn (0 giao dịch).'
                  : 'Thao tác này sẽ tải lại danh sách các giao dịch mẫu thực tế cho học sinh sinh viên.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#A8DEFA]/50 text-xs font-bold text-[#52769A] hover:bg-[#F0F8FD]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (showResetConfirm === 'clear') {
                    clearAllData();
                  } else {
                    loadSampleData();
                  }
                  setShowResetConfirm(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs ${
                  showResetConfirm === 'clear'
                    ? 'bg-[#E07A5F] hover:bg-[#cf6d52]'
                    : 'bg-[#52769A] hover:bg-[#436282]'
                }`}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
