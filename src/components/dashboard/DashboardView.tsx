import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ChevronRight,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND, getRemainingDaysInMonth, formatMonthDisplay, getMonthString } from '../../utils/formatters';
import { PiggyBank3D } from '../illustrations/PiggyBank3D';
import { Coin3D } from '../illustrations/Coin3D';
import { CategoryIcon } from '../common/CategoryIcon';
import { getCategoryById } from '../../data/categories';

export const DashboardView: React.FC = () => {
  const {
    currentBalance,
    monthlyIncome,
    monthlyExpense,
    budget,
    transactions,
    setActiveTab,
    openTransactionModal,
    openBudgetModal,
  } = useApp();

  const currentMonthKey = getMonthString();
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonthKey)
  );

  // Budget calculations
  const totalBudget = budget.totalBudget || 1;
  const budgetSpent = monthlyExpense;
  const budgetRemaining = Math.max(0, totalBudget - budgetSpent);
  const budgetPercentage = Math.min(100, Math.round((budgetSpent / totalBudget) * 100));
  const isBudgetExceeded = budgetSpent > totalBudget;
  const isNearLimit = budgetSpent >= totalBudget * 0.75 && !isBudgetExceeded;

  // Category breakdown for donut chart
  const expenseByCategory: Record<string, number> = {};
  currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const categoryEntries = Object.entries(expenseByCategory).sort(
    (a, b) => b[1] - a[1]
  );
  const totalCalculatedExpense = Object.values(expenseByCategory).reduce(
    (sum, val) => sum + val,
    0
  );

  // SVG Donut calculation
  let cumulativePercent = 0;
  const donutSlices = categoryEntries.map(([catId, amount]) => {
    const category = getCategoryById(catId);
    const percent = totalCalculatedExpense > 0 ? (amount / totalCalculatedExpense) * 100 : 0;
    const strokeDasharray = `${percent} ${100 - percent}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += percent;
    return {
      catId,
      category,
      amount,
      percent: Math.round(percent),
      strokeDasharray,
      strokeDashoffset,
      color: category.color,
    };
  });

  // Recent transactions (up to 5)
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-gradient-to-r from-[#A8DEFA]/40 via-[#F7C6D0]/30 to-[#F0F8FD] rounded-3xl p-5 sm:p-7 border border-[#A8DEFA]/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative bg-white/70 p-2.5 rounded-2xl shadow-xs border border-white/80">
              <PiggyBank3D size="md" showCoin={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#52769A] text-white">
                  STUDENTS COINS
                </span>
                <span className="text-xs font-semibold text-[#52769A] flex items-center gap-1">
                  <Calendar size={13} /> {formatMonthDisplay(currentMonthKey)}
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2C4258] mt-1">
                Chào bạn sinh viên! 🐷
              </h1>
              <p className="text-sm text-[#5B7894] mt-0.5 font-medium">
                Cùng tích lũy từng đồng xu, quản lý chi tiêu thông minh cho tương lai! ✨
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => openTransactionModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#52769A] hover:bg-[#436282] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle size={18} className="text-[#F4CB70]" />
              <span>Ghi chép chi tiêu</span>
            </button>
          </div>
        </div>

        {/* Decorative background sparkles */}
        <div className="absolute top-2 right-12 opacity-30 pointer-events-none">
          <Sparkles size={48} className="text-[#F4CB70]" />
        </div>
      </div>

      {/* 2. Balance & Financial Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Current Balance Card (Pastel Sky Blue themed) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#A8DEFA] via-[#BEE7FC] to-[#DDF2FD] rounded-3xl p-6 text-[#2C4258] shadow-md border border-[#92CEF3] relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#355776] bg-white/60 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <Wallet size={13} /> Số dư khả dụng
              </span>
              <Coin3D size="sm" symbol="₫" />
            </div>

            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-[#1E3B57]">
                {formatVND(currentBalance)}
              </div>
              <p className="text-xs text-[#486B8C] mt-1 font-semibold flex items-center gap-1">
                {currentBalance >= 0 ? (
                  <span className="text-[#1B7943] bg-[#CDEBD6] px-2 py-0.5 rounded-md font-bold">
                    ✓ Trạng thái an toàn
                  </span>
                ) : (
                  <span className="text-[#96222A] bg-[#F3A5AA] px-2 py-0.5 rounded-md font-bold">
                    ⚠ Đang chi tiêu âm
                  </span>
                )}
                <span>cả ví tiền mặt &amp; ngân hàng</span>
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-[#89C3E6]/60 flex items-center justify-between text-xs">
            <span className="text-[#3F6382] font-semibold">Kế hoạch chi tiêu</span>
            <button
              onClick={() => setActiveTab('budget')}
              className="font-bold text-[#2A5174] hover:underline flex items-center gap-1"
            >
              <span>Xem ngân sách</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Background subtle coin watermark */}
          <div className="absolute -bottom-6 -right-6 opacity-20 pointer-events-none">
            <Coin3D size="lg" />
          </div>
        </div>

        {/* Monthly Income & Expense Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Monthly Income */}
          <div className="card-soft p-6 flex flex-col justify-between border-t-4 border-t-[#CDEBD6]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5B7894] uppercase tracking-wider">
                  Thu nhập tháng này
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#EAF7EE] text-[#27AE60] flex items-center justify-center shadow-xs">
                  <TrendingUp size={20} strokeWidth={2.4} />
                </div>
              </div>

              <div className="mt-3 text-2xl sm:text-3xl font-extrabold font-heading text-[#1F7A43]">
                +{formatVND(monthlyIncome)}
              </div>
              <p className="text-xs text-[#6B8BAA] mt-1 font-medium">
                Trợ cấp từ gia đình, làm thêm, học bổng
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F0F4F8] flex items-center justify-between text-xs">
              <span className="text-[#7F9EB8] font-medium">
                {currentMonthTransactions.filter((t) => t.type === 'income').length} khoản thu
              </span>
              <button
                onClick={() => setActiveTab('transactions')}
                className="font-semibold text-[#52769A] hover:text-[#38536F] flex items-center gap-0.5"
              >
                Chi tiết <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* Monthly Expense */}
          <div className="card-soft p-6 flex flex-col justify-between border-t-4 border-t-[#F7C6D0]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5B7894] uppercase tracking-wider">
                  Tổng chi tiêu tháng này
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEE9] text-[#E07A5F] flex items-center justify-center shadow-xs">
                  <TrendingDown size={20} strokeWidth={2.4} />
                </div>
              </div>

              <div className="mt-3 text-2xl sm:text-3xl font-extrabold font-heading text-[#D35400]">
                -{formatVND(monthlyExpense)}
              </div>
              <p className="text-xs text-[#6B8BAA] mt-1 font-medium">
                Tiền trọ, ăn uống, trà sữa, sách vở
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F0F4F8] flex items-center justify-between text-xs">
              <span className="text-[#7F9EB8] font-medium">
                {currentMonthTransactions.filter((t) => t.type === 'expense').length} khoản chi
              </span>
              <button
                onClick={() => setActiveTab('transactions')}
                className="font-semibold text-[#52769A] hover:text-[#38536F] flex items-center gap-0.5"
              >
                Chi tiết <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Monthly Budget Section */}
      <div className="card-soft p-6 sm:p-7 border border-[#A8DEFA]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-xl text-[#2C4258]">
                Ngân sách sinh viên tháng {new Date().getMonth() + 1}
              </h2>
              {isBudgetExceeded ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F3A5AA]/50 text-[#821922]">
                  <AlertTriangle size={12} /> Đã vượt ngân sách
                </span>
              ) : isNearLimit ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F4CB70]/50 text-[#6B4B0A]">
                  <AlertTriangle size={12} /> Cảnh báo gần giới hạn
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#CDEBD6] text-[#1B6F3E]">
                  <CheckCircle2 size={12} /> Trong mức an toàn
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B8BAA] mt-1">
              Còn lại <strong className="text-[#52769A] font-bold">{getRemainingDaysInMonth()} ngày</strong> trong tháng này để sinh hoạt
            </p>
          </div>

          <button
            onClick={openBudgetModal}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[#52769A]/30 text-xs font-bold text-[#52769A] hover:bg-[#52769A]/10 transition-colors"
          >
            Điều chỉnh hạn mức
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#5B7894]">
              Đã chi tiêu: <span className="text-[#2C4258]">{formatVND(budgetSpent)}</span>
            </span>
            <span className="text-[#5B7894]">
              Hạn mức: <span className="text-[#2C4258]">{formatVND(totalBudget)}</span>
            </span>
          </div>

          <div className="w-full h-4 bg-[#F0F4F8] rounded-full overflow-hidden p-0.5 border border-[#E2E8F0]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBudgetExceeded
                  ? 'bg-[#F3A5AA]'
                  : isNearLimit
                  ? 'bg-[#F4CB70]'
                  : 'bg-[#CDEBD6]'
              }`}
              style={{
                width: `${budgetPercentage}%`,
                backgroundColor: isBudgetExceeded
                  ? '#F3A5AA'
                  : isNearLimit
                  ? '#F4CB70'
                  : '#82D29C',
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#6B8BAA]">
              Tỷ lệ đã dùng: <span className="font-extrabold text-[#2C4258]">{budgetPercentage}%</span>
            </span>
            <span className="font-bold">
              {isBudgetExceeded ? (
                <span className="text-[#D32F2F]">
                  Vượt mức {formatVND(budgetSpent - totalBudget)}!
                </span>
              ) : (
                <span className="text-[#2E7D32]">
                  Còn lại: {formatVND(budgetRemaining)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Two Columns: Spending Breakdown Donut Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spending Breakdown Pie/Donut */}
        <div className="lg:col-span-5 card-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#2C4258]">
                  Phân loại chi tiêu
                </h3>
                <p className="text-xs text-[#6B8BAA]">Theo danh mục tháng này</p>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-bold text-[#52769A] hover:underline"
              >
                Báo cáo chi tiết
              </button>
            </div>

            {categoryEntries.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <PiggyBank3D size="sm" showCoin={false} animated={false} />
                <p className="text-sm font-semibold text-[#6B8BAA] mt-3">
                  Chưa có chi tiêu nào trong tháng!
                </p>
                <p className="text-xs text-[#8AA6C3] mt-1">
                  Nhấn "Thêm giao dịch" để bắt đầu ghi chép nhé.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                {/* SVG Donut */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                    <circle
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#F0F4F8"
                      strokeWidth="5"
                    />
                    {donutSlices.map((slice) => (
                      <circle
                        key={slice.catId}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="5"
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 hover:opacity-80"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] font-bold text-[#7F9EB8] uppercase">
                      Tổng chi
                    </span>
                    <span className="text-xs font-extrabold text-[#2C4258]">
                      {formatVND(totalCalculatedExpense)}
                    </span>
                  </div>
                </div>

                {/* Top Category List */}
                <div className="flex-1 w-full space-y-2">
                  {donutSlices.slice(0, 4).map((slice) => (
                    <div
                      key={slice.catId}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-xl hover:bg-[#F0F8FD] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="font-semibold text-[#38526F] truncate max-w-[110px]">
                          {slice.category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#2C4258]">
                          {slice.percent}%
                        </span>
                        <div className="text-[10px] text-[#7F9EB8]">
                          {formatVND(slice.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Saving Tip */}
          <div className="mt-5 p-3 rounded-2xl bg-[#FFF9E6] border border-[#F4CB70]/40 flex items-start gap-2.5">
            <div className="p-1 rounded-xl bg-[#F4CB70]/30 text-[#8F640E] flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <p className="text-[11px] font-medium text-[#7A5A19] leading-relaxed">
              <strong>Mẹo tiết kiệm:</strong> Nấu cơm chung với bạn cùng phòng hoặc săn khuyến mãi suất sinh viên có thể tiết kiệm đến 400.000₫/tháng đấy!
            </p>
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-7 card-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#2C4258]">
                  Giao dịch gần đây
                </h3>
                <p className="text-xs text-[#6B8BAA]">Các khoản thu chi mới nhất</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-bold text-[#52769A] hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả ({transactions.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#7F9EB8] font-medium">Chưa có giao dịch nào.</p>
                <button
                  onClick={() => openTransactionModal()}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#52769A] text-white text-xs font-bold"
                >
                  Thêm giao dịch ngay
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F4F8]">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const category = getCategoryById(tx.category);
                  return (
                    <div
                      key={tx.id}
                      className="py-3 flex items-center justify-between hover:bg-[#F8FCFF] px-2 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CategoryIcon categoryId={tx.category} size="md" />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#2C4258] truncate">
                            {tx.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#7F9EB8]">
                            <span>{category.name}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-3">
                        <span
                          className={`font-heading font-extrabold text-sm sm:text-base ${
                            isIncome ? 'text-[#1F7A43]' : 'text-[#2C4258]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatVND(tx.amount)}
                        </span>
                        {tx.note && (
                          <p className="text-[10px] text-[#94ADC4] truncate max-w-[120px]">
                            {tx.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
