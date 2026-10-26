import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';
import { formatVND } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

export const BudgetModal: React.FC = () => {
  const {
    isBudgetModalOpen,
    closeBudgetModal,
    budget,
    updateBudget,
  } = useApp();

  const [totalBudget, setTotalBudget] = useState<string>('');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (isBudgetModalOpen) {
      setTotalBudget(budget.totalBudget.toString());
      const catMap: Record<string, string> = {};
      expenseCategories.forEach((cat) => {
        catMap[cat.id] = (budget.categoryBudgets[cat.id as CategoryId] || 0).toString();
      });
      setCategoryBudgets(catMap);
      setError(null);
    }
  }, [isBudgetModalOpen, budget]);

  const handleCategoryChange = (catId: string, val: string) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [catId]: val,
    }));
  };

  const handleQuickBudgetPreset = (preset: 'standard' | 'frugal' | 'comfortable') => {
    if (preset === 'standard') {
      // 4.5M standard student budget
      setTotalBudget('4500000');
      setCategoryBudgets({
        food: '1400000',
        rent_bills: '1800000',
        study: '350000',
        milktea_coffee: '250000',
        transport: '250000',
        groceries: '250000',
        entertainment: '200000',
      });
    } else if (preset === 'frugal') {
      // 3.0M frugal student budget
      setTotalBudget('3000000');
      setCategoryBudgets({
        food: '1100000',
        rent_bills: '1300000',
        study: '200000',
        milktea_coffee: '100000',
        transport: '150000',
        groceries: '150000',
      });
    } else {
      // 6.0M comfortable
      setTotalBudget('6000000');
      setCategoryBudgets({
        food: '2000000',
        rent_bills: '2200000',
        study: '500000',
        milktea_coffee: '400000',
        transport: '300000',
        groceries: '300000',
        entertainment: '300000',
      });
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTotal = parseInt(totalBudget.replace(/[^0-9]/g, ''), 10);

    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      setError('Tổng ngân sách phải lớn hơn 0 VNĐ!');
      return;
    }

    const parsedCategoryBudgets: Partial<Record<CategoryId, number>> = {};
    Object.entries(categoryBudgets).forEach(([catId, val]) => {
      const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        parsedCategoryBudgets[catId as CategoryId] = num;
      }
    });

    updateBudget({
      ...budget,
      totalBudget: parsedTotal,
      categoryBudgets: parsedCategoryBudgets,
    });

    closeBudgetModal();
  };

  if (!isBudgetModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C4258]/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#A8DEFA]/40 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-[#52769A]" />
            <h2 className="font-heading font-extrabold text-xl text-[#2C4258]">
              Cài đặt ngân sách sinh viên
            </h2>
          </div>
          <button
            onClick={closeBudgetModal}
            className="p-1.5 rounded-xl text-[#7F9EB8] hover:text-[#2C4258] hover:bg-[#F0F8FD]"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-[#FDF0EF] border border-[#F3A5AA] flex items-center gap-2 text-xs text-[#C0392B] font-semibold">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Presets */}
        <div className="p-3 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/30 space-y-2">
          <span className="text-[11px] font-bold text-[#52769A] uppercase tracking-wide flex items-center gap-1">
            <Sparkles size={12} className="text-[#F4CB70]" /> Gợi ý định mức mẫu cho sinh viên:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickBudgetPreset('frugal')}
              className="py-1.5 px-2 rounded-xl bg-white border border-[#A8DEFA]/40 text-xs font-semibold text-[#52769A] hover:bg-[#EAF3FA]"
            >
              Tiết kiệm (3 triệu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickBudgetPreset('standard')}
              className="py-1.5 px-2 rounded-xl bg-white border border-[#A8DEFA]/40 text-xs font-semibold text-[#52769A] hover:bg-[#EAF3FA]"
            >
              Tiêu chuẩn (4.5 triệu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickBudgetPreset('comfortable')}
              className="py-1.5 px-2 rounded-xl bg-white border border-[#A8DEFA]/40 text-xs font-semibold text-[#52769A] hover:bg-[#EAF3FA]"
            >
              Thoải mái (6 triệu)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total Budget */}
          <div>
            <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-1.5">
              Tổng ngân sách tháng (VNĐ) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="100000"
                step="50000"
                value={totalBudget}
                onChange={(e) => {
                  setTotalBudget(e.target.value);
                  setError(null);
                }}
                placeholder="4500000"
                className="w-full pl-4 pr-12 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 font-heading font-extrabold text-xl text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30 focus:bg-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#7F9EB8]">
                ₫
              </span>
            </div>
          </div>

          {/* Per-Category Budgets */}
          <div className="space-y-3 pt-2 border-t border-[#F0F4F8]">
            <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider">
              Hạn mức từng danh mục (tùy chọn)
            </label>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-[#F8FCFF] border border-[#EAF3FA]"
                >
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon categoryId={cat.id} size="sm" />
                    <span className="text-xs font-bold text-[#2C4258]">
                      {cat.name}
                    </span>
                  </div>

                  <div className="relative w-36">
                    <input
                      type="number"
                      step="50000"
                      min="0"
                      value={categoryBudgets[cat.id] || ''}
                      onChange={(e) => handleCategoryChange(cat.id, e.target.value)}
                      placeholder="0"
                      className="w-full pl-3 pr-7 py-1.5 rounded-xl bg-white border border-[#A8DEFA]/40 text-xs font-bold text-[#2C4258] text-right focus:outline-hidden focus:ring-1 focus:ring-[#52769A]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7F9EB8] font-bold">
                      ₫
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] flex items-center gap-3">
            <button
              type="button"
              onClick={closeBudgetModal}
              className="flex-1 py-2.5 rounded-2xl border border-[#A8DEFA]/50 text-xs font-bold text-[#52769A] hover:bg-[#F0F8FD]"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-[#52769A] hover:bg-[#436282] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              <span>Lưu ngân sách</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
