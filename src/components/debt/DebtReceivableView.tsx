import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Trash2,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { DebtReceivable, DebtType } from '../../types';

export const DebtReceivableView: React.FC = () => {
  const { 
    debtsReceivables, 
    addDebtReceivable, 
    updateDebtReceivable, 
    deleteDebtReceivable, 
    addDebtPayment 
  } = useApp();

  const [activeTab, setActiveTab] = useState<DebtType>('utang');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'belum_lunas' | 'sebagian' | 'lunas'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [payTarget, setPayTarget] = useState<DebtReceivable | null>(null);
  const [payAmount, setPayAmount] = useState<number>(500000);
  const [payNotes, setPayNotes] = useState<string>('');
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Add Form
  const [partyName, setPartyName] = useState('');
  const [initialAmount, setInitialAmount] = useState<number>(1000000);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');

  // Calculations for Utang and Piutang
  const currentList = useMemo(() => {
    return debtsReceivables.filter((d) => d.type === activeTab);
  }, [debtsReceivables, activeTab]);

  const filteredList = useMemo(() => {
    return currentList.filter((item) => {
      const matchSearch =
        item.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [currentList, searchTerm, statusFilter]);

  const totalOutstanding = useMemo(() => {
    return currentList.reduce((acc, curr) => acc + (curr.initialAmount - curr.paidAmount), 0);
  }, [currentList]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim() || initialAmount <= 0) return;

    addDebtReceivable({
      type: activeTab,
      partyName,
      transactionDate,
      dueDate,
      initialAmount,
      notes,
    });

    setPartyName('');
    setNotes('');
    setShowAddModal(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTarget || payAmount <= 0) return;

    addDebtPayment(payTarget.id, {
      date: payDate,
      amount: Number(payAmount),
      notes: payNotes,
    });

    setPayTarget(null);
    setPayAmount(500000);
    setPayNotes('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Utang & Piutang Usaha
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Kelola tagihan pelanggan dan kewajiban bayar ke pemasok agar arus kas tetap sehat
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto transform active:scale-95"
        >
          <Plus size={16} />
          <span>Tambah {activeTab === 'utang' ? 'Utang Usaha' : 'Piutang Pelanggan'}</span>
        </button>
      </div>

      {/* Tabs (Utang vs Piutang) */}
      <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('utang')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'utang'
              ? 'bg-white text-[#F4519A] shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Kewajiban Utang (Ke Pemasok)
        </button>
        <button
          onClick={() => setActiveTab('piutang')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'piutang'
              ? 'bg-white text-[#F4519A] shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Tagihan Piutang (Dari Pelanggan)
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total Sisa Saldo {activeTab === 'utang' ? 'Utang Usaha yang Harus Dibayar' : 'Piutang yang Belum Diterima'}
          </span>
          <h2 className="text-3xl font-black text-gray-900 mt-1">
            {formatRupiah(totalOutstanding)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Terdapat {filteredList.filter((d) => d.status !== 'lunas').length} tagihan yang masih aktif
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFF0F6] text-[#F4519A] self-start sm:self-auto">
          <Scale size={32} />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Cari nama ${activeTab === 'utang' ? 'pemasok / supplier' : 'pelanggan'}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="py-2.5 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="all">Semua Status</option>
          <option value="belum_lunas">Belum Lunas</option>
          <option value="sebagian">Sebagian (Dicicil)</option>
          <option value="lunas">Lunas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF0F6]/50 border-b border-pink-100 text-[11px] font-bold uppercase text-gray-500">
                <th className="py-3.5 px-4">{activeTab === 'utang' ? 'Nama Pemasok' : 'Nama Pelanggan'}</th>
                <th className="py-3.5 px-4">Tgl Transaksi</th>
                <th className="py-3.5 px-4">Jatuh Tempo</th>
                <th className="py-3.5 px-4 text-right">Nominal Awal</th>
                <th className="py-3.5 px-4 text-right">Sudah Dibayar</th>
                <th className="py-3.5 px-4 text-right">Sisa Saldo</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredList.map((item) => {
                const remaining = item.initialAmount - item.paidAmount;
                const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'lunas';

                return (
                  <tr key={item.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {item.partyName}
                      {item.notes && <p className="text-[11px] text-gray-400 font-normal">{item.notes}</p>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {formatDateIndo(item.transactionDate)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-semibold ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                        {formatDateIndo(item.dueDate)}
                      </span>
                      {isOverdue && (
                        <span className="block text-[10px] text-red-500 font-bold">Terlambat!</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-700 whitespace-nowrap">
                      {formatRupiah(item.initialAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-emerald-600 whitespace-nowrap">
                      {formatRupiah(item.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#F4519A] whitespace-nowrap">
                      {formatRupiah(remaining)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {item.status === 'lunas' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Lunas
                        </span>
                      ) : item.status === 'sebagian' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Sebagian
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Belum Lunas
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.status !== 'lunas' && (
                          <button
                            onClick={() => {
                              setPayTarget(item);
                              setPayAmount(remaining);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#F4519A] hover:bg-[#E03582] text-white font-bold text-[11px] shadow-xs transition-colors"
                          >
                            {activeTab === 'utang' ? 'Bayar Utang' : 'Terima Tagihan'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Hapus data ini?')) {
                              deleteDebtReceivable(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Tidak ada catatan {activeTab === 'utang' ? 'utang' : 'piutang'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Log */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-gray-900">
          Riwayat Angsuran & Pelunasan Terakhir
        </h3>
        <div className="divide-y divide-gray-100 text-xs">
          {debtsReceivables
            .filter((d) => d.type === activeTab)
            .flatMap((d) => d.payments.map((p) => ({ ...p, party: d.partyName, debtType: d.type })))
            .slice(0, 5)
            .map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">
                    {p.party} — <span className="text-[#F4519A]">{formatRupiah(p.amount)}</span>
                  </p>
                  <p className="text-[11px] text-gray-400">{p.notes || 'Pembayaran angsuran'}</p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {formatDateIndo(p.date)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Catat {activeTab === 'utang' ? 'Utang Baru ke Supplier' : 'Piutang Baru ke Pelanggan'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Nama {activeTab === 'utang' ? 'Pemasok / Agen' : 'Pelanggan / Klien'}
                </label>
                <input
                  type="text"
                  required
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Misal: Toko Agen Beras Barokah"
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-extrabold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Keterangan / Catatan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan barang atau pesanan..."
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold rounded-xl shadow-md transition-colors mt-2"
              >
                Simpan Catatan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {activeTab === 'utang' ? 'Bayar Utang' : 'Catat Pelunasan Piutang'}
              </h3>
              <button onClick={() => setPayTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-2">
              Pihak: <b className="text-gray-900">{payTarget.partyName}</b>
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Sisa Saldo: <b className="text-[#F4519A]">{formatRupiah(payTarget.initialAmount - payTarget.paidAmount)}</b>
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Tanggal Pembayaran</label>
                <input
                  type="date"
                  required
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  min="1"
                  max={payTarget.initialAmount - payTarget.paidAmount}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Catatan Pembayaran</label>
                <input
                  type="text"
                  placeholder="Misal: Cicilan tahap 1 via transfer BCA"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                />
              </div>

              <div className="p-3 bg-pink-50 rounded-xl text-[11px] text-pink-700">
                ℹ️ Transaksi ini akan <b>otomatis tercatat di arus kas & dashboard</b> agar pembukuan Anda sinkron.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold rounded-xl shadow-md transition-colors mt-2"
              >
                Simpan & Rekonsiliasi Kas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

