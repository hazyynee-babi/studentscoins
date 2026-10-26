import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  ArrowUpDown,
  Calendar,
  X,
  FileQuestion,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType, CategoryId } from '../../types';
import { formatVND, formatDateVietnamese, getMonthString } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { PiggyBank3D } from '../illustrations/PiggyBank3D';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    deleteTransaction,
    openTransactionModal,
  } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'this_month' | 'last_month'>('this_month');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Delete confirm modal state
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  // Month string calculations
  const thisMonth = getMonthString();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = getMonthString(lastMonthDate);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = tx.title.toLowerCase().includes(q);
          const noteMatch = tx.note?.toLowerCase().includes(q);
          const cat = getCategoryById(tx.category);
          const catMatch = cat.name.toLowerCase().includes(q);
          if (!titleMatch && !noteMatch && !catMatch) return false;
        }

        // Type filter
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }

        // Time filter
        if (timeFilter === 'this_month') {
          return tx.date.startsWith(thisMonth);
        } else if (timeFilter === 'last_month') {
          return tx.date.startsWith(lastMonth);
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, searchQuery, selectedType, selectedCategory, timeFilter, sortOrder, thisMonth, lastMonth]);

  // Aggregate stats of filtered transactions
  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    filteredTransactions.forEach((tx) => {
      const existing = groups.find((g) => g.date === tx.date);
      if (existing) {
        existing.items.push(tx);
      } else {
        groups.push({ date: tx.date, items: [tx] });
      }
    });
    return groups;
  }, [filteredTransactions]);

  const handleDeleteConfirm = () => {
    if (deletingTx) {
      deleteTransaction(deletingTx.id);
      setDeletingTx(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setTimeFilter('all');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2C4258]">
          Giao dịch
        </h1>

        <button
          onClick={() => openTransactionModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#52769A] hover:bg-[#436282] text-white font-bold text-sm shadow-md transition-all"
        >
          <PlusCircle size={18} className="text-[#F4CB70]" />
          <span>Thêm giao dịch</span>
        </button>
      </div>

      {/* Summary Cards: Chỉ để lại Tổng thu và Tổng chi */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-soft p-4 flex items-center justify-between border-l-4 border-l-[#27AE60]">
          <div>
            <p className="text-xs font-bold text-[#6B8BAA] uppercase tracking-wide">
              Tổng thu
            </p>
            <p className="font-heading font-extrabold text-lg sm:text-xl text-[#1F7A43] mt-1">
              +{formatVND(totalFilteredIncome)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#EAF7EE] text-[#27AE60] flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="card-soft p-4 flex items-center justify-between border-l-4 border-l-[#E07A5F]">
          <div>
            <p className="text-xs font-bold text-[#6B8BAA] uppercase tracking-wide">
              Tổng chi
            </p>
            <p className="font-heading font-extrabold text-lg sm:text-xl text-[#D35400] mt-1">
              -{formatVND(totalFilteredExpense)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FDEEE9] text-[#E07A5F] flex items-center justify-center">
            <TrendingDown size={18} />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card-soft p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8AA6C3]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên giao dịch, ghi chú, danh mục..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-sm text-[#2C4258] focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30 focus:bg-white placeholder:text-[#8AA6C3]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA6C3] hover:text-[#52769A]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Time Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-sm text-[#2C4258] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30"
            >
              <option value="this_month">Tháng này ({new Date().getMonth() + 1})</option>
              <option value="last_month">Tháng trước</option>
              <option value="all">Tất cả thời gian</option>
            </select>
          </div>

          {/* Category Filter Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0F8FD] border border-[#A8DEFA]/40 text-sm text-[#2C4258] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#52769A]/30"
            >
              <option value="all">Tất cả danh mục ({CATEGORIES.length})</option>
              <optgroup label="Chi tiêu">
                {CATEGORIES.filter((c) => c.type === 'expense').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Thu nhập">
                {CATEGORIES.filter((c) => c.type === 'income').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Type Filter Pills & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0F4F8]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#6B8BAA] mr-1">Loại:</span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedType === 'all'
                  ? 'bg-[#52769A] text-white shadow-xs'
                  : 'bg-[#F0F8FD] text-[#6B8BAA] hover:bg-[#E2F0FA]'
              }`}
            >
              Tất cả ({transactions.length})
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                selectedType === 'expense'
                  ? 'bg-[#F7C6D0] text-[#54252F] shadow-xs'
                  : 'bg-[#F0F8FD] text-[#6B8BAA] hover:bg-[#FDEEE9]'
              }`}
            >
              <TrendingDown size={14} className="text-[#E07A5F]" />
              Chi tiêu
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                selectedType === 'income'
                  ? 'bg-[#CDEBD6] text-[#1B6F3E] shadow-xs'
                  : 'bg-[#F0F8FD] text-[#6B8BAA] hover:bg-[#EAF7EE]'
              }`}
            >
              <TrendingUp size={14} className="text-[#27AE60]" />
              Thu nhập
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0F8FD] text-xs font-bold text-[#52769A] hover:bg-[#E2F0FA] transition-colors"
            >
              <ArrowUpDown size={13} />
              <span>{sortOrder === 'desc' ? 'Mới nhất trước' : 'Cũ nhất trước'}</span>
            </button>

            {(searchQuery || selectedType !== 'all' || selectedCategory !== 'all' || timeFilter !== 'this_month') && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-[#E07A5F] hover:underline px-2 py-1"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="card-soft p-12 text-center flex flex-col items-center justify-center">
          <PiggyBank3D size="md" showCoin={false} animated={false} />
          <h3 className="font-heading font-extrabold text-lg text-[#2C4258] mt-4">
            Không tìm thấy giao dịch nào!
          </h3>
          <p className="text-sm text-[#7F9EB8] max-w-md mt-1">
            Không có kết quả phù hợp với tiêu chí lọc của bạn. Hãy thử thay đổi bộ lọc hoặc thêm một giao dịch mới.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl border border-[#52769A]/30 text-xs font-bold text-[#52769A]"
            >
              Xóa bộ lọc
            </button>
            <button
              onClick={() => openTransactionModal()}
              className="px-4 py-2 rounded-xl bg-[#52769A] text-white text-xs font-bold"
            >
              Thêm giao dịch ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="card-soft overflow-hidden">
              {/* Date Header */}
              <div className="bg-[#F8FCFF] px-5 py-2.5 border-b border-[#F0F4F8] flex items-center justify-between text-xs">
                <span className="font-bold text-[#52769A] flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDateVietnamese(group.date)}
                </span>
                <span className="text-[#8AA6C3] font-semibold">
                  {group.items.length} giao dịch
                </span>
              </div>

              {/* Items in that date */}
              <div className="divide-y divide-[#F0F4F8] px-2 sm:px-4">
                {group.items.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const category = getCategoryById(tx.category);

                  return (
                    <div
                      key={tx.id}
                      className="py-3 px-2 flex items-center justify-between hover:bg-[#F9FCFE] rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CategoryIcon categoryId={tx.category} size="md" />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#2C4258] truncate">
                            {tx.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7F9EB8]">
                            <span className="font-medium text-[#52769A]">
                              {category.name}
                            </span>
                            {tx.note && (
                              <>
                                <span>•</span>
                                <span className="italic truncate max-w-[200px]">
                                  {tx.note}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <span
                            className={`font-heading font-extrabold text-sm sm:text-base ${
                              isIncome ? 'text-[#1F7A43]' : 'text-[#2C4258]'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {formatVND(tx.amount)}
                          </span>
                        </div>

                        {/* Action buttons (Edit & Delete) */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openTransactionModal(tx)}
                            title="Chỉnh sửa giao dịch"
                            className="p-1.5 rounded-lg text-[#6B8BAA] hover:text-[#52769A] hover:bg-[#EAF3FA] transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingTx(tx)}
                            title="Xóa giao dịch"
                            className="p-1.5 rounded-lg text-[#C0392B] hover:text-[#96222A] hover:bg-[#FDF0EF] transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C4258]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFDF8] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#A8DEFA]/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF0EF] text-[#C0392B] flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-extrabold text-lg text-[#2C4258]">
                Xác nhận xóa giao dịch?
              </h3>
              <p className="text-xs text-[#6B8BAA] mt-1.5">
                Bạn có chắc chắn muốn xóa giao dịch <strong>"{deletingTx.title}"</strong> ({formatVND(deletingTx.amount)})? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingTx(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#A8DEFA]/50 text-xs font-bold text-[#52769A] hover:bg-[#F0F8FD]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#cf6d52] text-white text-xs font-bold shadow-xs"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
