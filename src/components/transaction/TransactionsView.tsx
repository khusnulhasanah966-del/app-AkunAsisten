import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  Receipt,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { Transaction } from '../../types';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onShowReceipt?: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onEditTransaction,
  onShowReceipt,
}) => {
  const { transactions, deleteTransaction } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Dynamic Date Filter
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => t.category && set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  // Filter and sort
  const filteredList = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return transactions
      .filter((tx) => {
        const matchSearch =
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchType = selectedType === 'all' || tx.type === selectedType;
        const matchCat = selectedCategory === 'all' || tx.category === selectedCategory;

        // Date logic
        let matchDate = true;
        if (dateRangeFilter === 'today') {
          matchDate = tx.date === todayStr;
        } else if (dateRangeFilter === 'this_week') {
          const txDate = new Date(tx.date);
          const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
          matchDate = diffDays >= 0 && diffDays <= 7;
        } else if (dateRangeFilter === 'this_month') {
          const txDate = new Date(tx.date);
          matchDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        } else if (dateRangeFilter === 'custom') {
          if (customStartDate && tx.date < customStartDate) matchDate = false;
          if (customEndDate && tx.date > customEndDate) matchDate = false;
        }

        return matchSearch && matchType && matchCat && matchDate;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'amount_asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedType, selectedCategory, sortBy, dateRangeFilter, customStartDate, customEndDate]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  // Quick summary
  const summaryIncome = filteredList.filter((t) => t.type === 'pemasukan').reduce((a, b) => a + b.amount, 0);
  const summaryExpense = filteredList.filter((t) => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Semua Transaksi
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Kelola seluruh riwayat pemasukan, cetak struk nota, dan pengeluaran usaha Anda
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto transform active:scale-95"
        >
          <Plus size={16} />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-pink-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Pemasukan</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">{formatRupiah(summaryIncome)}</p>
          </div>
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold">
            {filteredList.filter((t) => t.type === 'pemasukan').length} Trx
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-pink-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Pengeluaran</p>
            <p className="text-sm font-black text-rose-600 mt-0.5">{formatRupiah(summaryExpense)}</p>
          </div>
          <span className="p-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
            {filteredList.filter((t) => t.type === 'pengeluaran').length} Trx
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-pink-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Selisih Bersih</p>
            <p className={`text-sm font-black mt-0.5 ${summaryIncome >= summaryExpense ? 'text-[#F4519A]' : 'text-amber-600'}`}>
              {formatRupiah(summaryIncome - summaryExpense)}
            </p>
          </div>
          <span className="p-2 rounded-xl bg-pink-50 text-[#F4519A] text-xs font-bold">
            Total {filteredList.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
        {/* Dynamic Period Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-100 text-xs">
          <span className="font-bold text-gray-400 text-[11px] mr-1 flex items-center gap-1">
            <Calendar size={13} /> Periode:
          </span>
          {[
            { id: 'all', label: 'Semua Waktu' },
            { id: 'today', label: 'Hari Ini' },
            { id: 'this_week', label: '7 Hari Terakhir' },
            { id: 'this_month', label: 'Bulan Ini' },
            { id: 'custom', label: 'Pilih Tanggal' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setDateRangeFilter(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                dateRangeFilter === btn.id
                  ? 'bg-[#F4519A] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {btn.label}
            </button>
          ))}

          {dateRangeFilter === 'custom' && (
            <div className="flex items-center gap-2 pl-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs"
              />
              <span className="text-gray-400">s/d</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi, ket, atau nota..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
            >
              <option value="all">Semua Jenis</option>
              <option value="pemasukan">Pemasukan (+)</option>
              <option value="pengeluaran">Pengeluaran (-)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
            >
              <option value="date_desc">Terbaru</option>
              <option value="date_asc">Terlama</option>
              <option value="amount_desc">Nominal Tertinggi</option>
              <option value="amount_asc">Nominal Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF0F6]/50 border-b border-pink-100 text-[11px] font-bold uppercase text-gray-500">
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-4 text-center">Struk</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredList.map((tx) => (
                <tr key={tx.id} className="hover:bg-pink-50/20 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium">
                    {formatDateIndo(tx.date)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{tx.description}</p>
                    {tx.notes && <p className="text-[11px] text-gray-400 mt-0.5">{tx.notes}</p>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF0F6] text-[#F4519A] font-semibold text-[11px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                    {tx.paymentMethod}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${
                      tx.type === 'pemasukan' ? 'text-[#F4519A]' : 'text-gray-900'
                    }`}
                  >
                    {tx.type === 'pemasukan' ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {onShowReceipt && (
                        <button
                          onClick={() => onShowReceipt(tx)}
                          title="Cetak Struk Resmi"
                          className="p-1.5 rounded-lg bg-pink-50 text-[#F4519A] hover:bg-pink-100 transition-colors"
                        >
                          <Receipt size={15} />
                        </button>
                      )}
                      {tx.receiptImage ? (
                        <button
                          onClick={() => setPreviewImage(tx.receiptImage!)}
                          title="Lihat foto nota"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <ImageIcon size={15} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        title="Edit transaksi"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#F4519A] hover:bg-pink-50 transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        title="Hapus transaksi"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Tidak ditemukan data transaksi yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Hapus Transaksi Ini?
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Data transaksi akan dihapus permanen dan saldo kas serta grafik dashboard akan diperbarui otomatis.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-lg w-full shadow-2xl overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-gray-800">Bukti Nota Transaksi</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Tutup [X]
              </button>
            </div>
            <img
              src={previewImage}
              alt="Receipt"
              className="max-h-[70vh] w-full object-contain rounded-2xl bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};
