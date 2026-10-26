import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, CategoryId } from '../../types';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { formatVND } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

const QUICK_AMOUNTS = [30000, 50000, 100000, 200000, 500000, 1000000];

export const TransactionModal: React.FC = () => {
  const {
    isTransactionModalOpen,
    closeTransactionModal,
    addTransaction,
    updateTransaction,
    editingTransaction,
  } = useApp();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Sync state when editing or opening
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setTitle(editingTransaction.title);
      setNote(editingTransaction.note || '');
      setDate(editingTransaction.date);
      setError(null);
    } else {
      setType('expense');
      setAmount('');
      setCategory('food');
      setTitle('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [editingTransaction, isTransactionModalOpen]);

  // Adjust default category if type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('food');
    } else {
      setCategory('family_allowance');
    }
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);

    if (!title.trim()) {
      setError('Vui lòng nhập tên hoặc nội dung giao dịch!');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Số tiền phải lớn hơn 0 VNĐ!');
      return;
    }

    if (!date) {
      setError('Vui lòng chọn ngày giao dịch!');
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        type,
        amount: parsedAmount,
        category,
        title: title.trim(),
        note: note.trim() || undefined,
        date,
      });
    } else {
      addTransaction({
        type,
        amount: parsedAmount,
        category,
        title: title.trim(),
        note: note.trim() || undefined,
        date,
      });
    }

    closeTransactionModal();
  };

  if (!isTransactionModalOpen) return null;

  const filteredCategories = CATEGORIES.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C4258]/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#A8DEFA]/40 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
          <h2 className="font-heading font-extrabold text-xl text-[#2C4258]">
            {editingTransaction ? 'Chỉnh sửa giao dịch ✏️' : 'Thêm giao dịch mới 🪙'}
          </h2>
          <button
            onClick={closeTransactionModal}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle Pills */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F0F8FD] rounded-2xl border border-[#A8DEFA]/30">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#F7C6D0] text-[#4F2E35] shadow-xs'
                  : 'text-[#6B8BAA] hover:text-[#52769A]'
              }`}
            >
              💸 Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#CDEBD6] text-[#1B6F3E] shadow-xs'
                  : 'text-[#6B8BAA] hover:text-[#52769A]'
              }`}
            >
              💰 Thu nhập
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-1.5">
              Số tiền (VNĐ) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="Ví dụ: 50000"
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 font-heading font-extrabold text-xl text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30 focus:bg-white"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#7F9EB8]">
                ₫
              </span>
            </div>

            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-[#F8FCFF] border border-[#E2E8F0] text-[11px] font-semibold text-[#52769A] hover:bg-[#EAF3FA] hover:border-[#A8DEFA] transition-colors"
                >
                  +{formatVND(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Grid Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-2">
              Danh mục *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
              {filteredCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#52769A] bg-[#EAF3FA] shadow-xs'
                        : 'border-transparent bg-[#F9FCFE] hover:bg-[#F0F8FD]'
                    }`}
                  >
                    <CategoryIcon categoryId={cat.id} size="sm" />
                    <span className="text-xs font-bold text-[#2C4258] truncate">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-1.5">
              Tên giao dịch *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Ví dụ: Cơm trưa căn tin, Bún bò, Sách vở..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-sm text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30 focus:bg-white"
            />
          </div>

          {/* Date & Note in Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-1.5">
                Ngày thực hiện *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-xs font-semibold text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5B7894] uppercase tracking-wider mb-1.5">
                Ghi chú thêm (tùy chọn)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ăn cùng ai, địa điểm..."
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-xs text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-[#F0F4F8] flex items-center gap-3">
            <button
              type="button"
              onClick={closeTransactionModal}
              className="flex-1 py-2.5 rounded-2xl border border-[#A8DEFA]/50 text-xs font-bold text-[#52769A] hover:bg-[#F0F8FD] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-[#52769A] hover:bg-[#436282] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              <span>{editingTransaction ? 'Lưu thay đổi' : 'Ghi chép ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
