import React, { useState } from 'react';
import {
  WalletCards,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  PiggyBank,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND, getMonthString, getRemainingDaysInMonth } from '../../utils/formatters';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategoryId } from '../../types';

export const BudgetView: React.FC = () => {
  const {
    budget,
    updateBudget,
    transactions,
    monthlyExpense,
    openBudgetModal,
  } = useApp();

  const currentMonthKey = getMonthString();
  const currentMonthTransactions = transactions.filter(
    (t) => t.date.startsWith(currentMonthKey) && t.type === 'expense'
  );

  // Overall calculations
  const totalBudget = budget.totalBudget || 1;
  const spentOverall = monthlyExpense;
  const remainingOverall = Math.max(0, totalBudget - spentOverall);
  const percentOverall = Math.round((spentOverall / totalBudget) * 100);

  const isOverBudget = spentOverall > totalBudget;
  const isNearLimit = spentOverall >= totalBudget * 0.75 && !isOverBudget;

  const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense');

  // Spent per category
  const spentByCategory: Record<string, number> = {};
  currentMonthTransactions.forEach((t) => {
    spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2C4258]">
            Kế hoạch ngân sách 🎯
          </h1>
          <p className="text-sm text-[#6B8BAA] mt-0.5">
            Kiểm soát chi tiêu từng danh mục để không bị "cháy túi" cuối tháng
          </p>
        </div>

        <button
          onClick={openBudgetModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#52769A] hover:bg-[#436282] text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Sliders size={18} className="text-[#F4CB70]" />
          <span>Cài đặt hạn mức ngân sách</span>
        </button>
      </div>

      {/* Main Budget Card */}
      <div className="card-soft p-6 sm:p-8 border-2 border-[#A8DEFA]/40 bg-gradient-to-br from-[#FFFDF8] to-[#F5FAFE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52769A] bg-[#EAF3FA] px-3 py-1 rounded-full">
                Tổng ngân sách tháng {new Date().getMonth() + 1}
              </span>
              {isOverBudget ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F3A5AA] text-[#610E16]">
                  <AlertTriangle size={13} /> Vượt hạn mức
                </span>
              ) : isNearLimit ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F4CB70] text-[#543D0A]">
                  <AlertTriangle size={13} /> Gần chạm giới hạn (≥75%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#CDEBD6] text-[#1B6F3E]">
                  <CheckCircle2 size={13} /> An toàn (&lt;75%)
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#2C4258]">
              {formatVND(totalBudget)}
            </h2>

            <p className="text-xs text-[#6B8BAA]">
              Bạn đã tiêu <strong className="text-[#2C4258] font-bold">{formatVND(spentOverall)}</strong> ({percentOverall}%). Còn lại <strong className="text-[#2C4258] font-bold">{formatVND(remainingOverall)}</strong> cho <strong className="text-[#52769A]">{getRemainingDaysInMonth()} ngày</strong> tới (khoảng <strong className="text-[#52769A]">{formatVND(Math.round(remainingOverall / getRemainingDaysInMonth()))} / ngày</strong>).
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-xs border border-[#A8DEFA]/30 self-stretch md:self-auto justify-around">
            <div className="text-center px-3">
              <p className="text-[11px] font-bold text-[#7F9EB8] uppercase">Đã chi</p>
              <p className="text-lg font-extrabold text-[#D35400] mt-0.5">
                {formatVND(spentOverall)}
              </p>
            </div>
            <div className="h-9 w-px bg-[#E2E8F0]" />
            <div className="text-center px-3">
              <p className="text-[11px] font-bold text-[#7F9EB8] uppercase">Còn lại</p>
              <p
                className={`text-lg font-extrabold mt-0.5 ${
                  isOverBudget ? 'text-[#D32F2F]' : 'text-[#2E7D32]'
                }`}
              >
                {formatVND(remainingOverall)}
              </p>
            </div>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-5 bg-[#E8F1F7] rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, percentOverall)}%`,
                backgroundColor: isOverBudget
                  ? '#F3A5AA'
                  : isNearLimit
                  ? '#F4CB70'
                  : '#82D29C',
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-[#6B8BAA]">
            <span>0 ₫</span>
            <span className="font-extrabold text-[#2C4258]">
              {percentOverall}% đã sử dụng
            </span>
            <span>{formatVND(totalBudget)}</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-[#2C4258]">
              Hạn mức theo từng danh mục
            </h2>
            <p className="text-xs text-[#6B8BAA]">
              Theo dõi chi tiết mức chi cho ăn uống, trọ, học tập, giải trí...
            </p>
          </div>
          <button
            onClick={openBudgetModal}
            className="text-xs font-bold text-[#52769A] hover:underline"
          >
            Chỉnh sửa hạn mức
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expenseCategories.map((cat) => {
            const catBudget = budget.categoryBudgets[cat.id as CategoryId] || 0;
            const catSpent = spentByCategory[cat.id] || 0;
            const hasBudget = catBudget > 0;
            const catPercent = hasBudget ? Math.round((catSpent / catBudget) * 100) : 0;
            const isCatOver = hasBudget && catSpent > catBudget;
            const isCatNear = hasBudget && catSpent >= catBudget * 0.75 && !isCatOver;
            const catRemaining = Math.max(0, catBudget - catSpent);

            return (
              <div
                key={cat.id}
                className="card-soft p-5 flex flex-col justify-between hover:border-[#A8DEFA] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryIcon categoryId={cat.id} size="md" />
                      <div>
                        <h3 className="font-bold text-sm text-[#2C4258]">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-[#7F9EB8]">
                          {hasBudget ? `Ngân sách: ${formatVND(catBudget)}` : 'Chưa đặt hạn mức'}
                        </p>
                      </div>
                    </div>

                    {hasBudget && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCatOver
                            ? 'bg-[#F3A5AA] text-[#610E16]'
                            : isCatNear
                            ? 'bg-[#F4CB70]/60 text-[#543D0A]'
                            : 'bg-[#CDEBD6] text-[#1B6F3E]'
                        }`}
                      >
                        {catPercent}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="w-full h-2.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${hasBudget ? Math.min(100, catPercent) : 0}%`,
                          backgroundColor: isCatOver
                            ? '#F3A5AA'
                            : isCatNear
                            ? '#F4CB70'
                            : '#82D29C',
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6B8BAA]">
                        Đã chi: <strong className="text-[#2C4258]">{formatVND(catSpent)}</strong>
                      </span>
                      {hasBudget ? (
                        <span
                          className={`font-semibold ${
                            isCatOver ? 'text-[#D32F2F]' : 'text-[#2E7D32]'
                          }`}
                        >
                          {isCatOver ? 'Vượt hạn mức' : `Còn ${formatVND(catRemaining)}`}
                        </span>
                      ) : (
                        <button
                          onClick={openBudgetModal}
                          className="text-[11px] text-[#52769A] font-bold hover:underline"
                        >
                          + Đặt ngân sách
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Helpful contextual tip for students */}
                <div className="mt-4 pt-3 border-t border-[#F0F4F8] text-[11px] text-[#7A97B0] flex items-center justify-between">
                  <span>Trạng thái:</span>
                  <span className="font-semibold text-[#2C4258]">
                    {isCatOver
                      ? 'Cần thắt chặt chi tiêu'
                      : isCatNear
                      ? 'Nên tiết kiệm thêm'
                      : 'Đang quản lý rất tốt ✨'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
