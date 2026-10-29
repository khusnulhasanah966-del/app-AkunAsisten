import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  Download,
  Calendar,
  Sparkles,
  ShoppingCart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatShortRupiah } from '../../utils/formatters';
import { ActiveTab } from '../layout/Sidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardViewProps {
  onOpenAddModal: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddModal, setActiveTab }) => {
  const {
    user,
    transactions,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  } = useApp();

  const [dateRangeFilter, setDateRangeFilter] = useState<'bulan_ini' | 'semua' | 'hari_ini' | 'minggu_ini'>('bulan_ini');

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (dateRangeFilter === 'semua') return true;
      if (dateRangeFilter === 'hari_ini') {
        return tx.date === todayStr;
      }
      if (dateRangeFilter === 'bulan_ini') {
        return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
      }
      if (dateRangeFilter === 'minggu_ini') {
        const diff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
        return diff >= 0 && diff <= 7;
      }
      return true;
    });
  }, [transactions, selectedMonth, selectedYear, dateRangeFilter]);

  // Financial calculations
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'pemasukan')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'pengeluaran')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredTransactions]);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Total Kas Realtime
  const currentCashBalance = useMemo(() => {
    const allIncome = transactions
      .filter((t) => t.type === 'pemasukan')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const allExpense = transactions
      .filter((t) => t.type === 'pengeluaran')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return (user?.initialBalance || 0) + allIncome - allExpense;
  }, [transactions, user?.initialBalance]);

  // Bar Chart Data: 4 Weeks
  const barChartData = useMemo(() => {
    const weeks = [
      { name: 'Mg 1', Masuk: 0, Keluar: 0 },
      { name: 'Mg 2', Masuk: 0, Keluar: 0 },
      { name: 'Mg 3', Masuk: 0, Keluar: 0 },
      { name: 'Mg 4', Masuk: 0, Keluar: 0 },
    ];

    filteredTransactions.forEach((tx) => {
      const day = new Date(tx.date).getDate();
      let weekIdx = 0;
      if (day <= 7) weekIdx = 0;
      else if (day <= 14) weekIdx = 1;
      else if (day <= 21) weekIdx = 2;
      else weekIdx = 3;

      if (tx.type === 'pemasukan') {
        weeks[weekIdx].Masuk += tx.amount;
      } else {
        weeks[weekIdx].Keluar += tx.amount;
      }
    });

    return weeks;
  }, [filteredTransactions]);

  // Pie Chart: Pengeluaran per Kategori
  const pieChartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'pengeluaran')
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });

    const colors = ['#F4519A', '#FB7185', '#F472B6', '#FBBF24', '#38BDF8', '#818CF8', '#A78BFA'];
    return Object.entries(map).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length],
    }));
  }, [filteredTransactions]);

  // Export Quick PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Laporan Keuangan - ${user?.businessName || 'AkunAsisten'}`, 14, 18);
    doc.setFontSize(10);
    doc.text(`Periode: ${MONTH_NAMES[selectedMonth]} ${selectedYear}`, 14, 25);
    doc.text(`Kas Realtime: ${formatRupiah(currentCashBalance)}`, 14, 31);

    const tableRows = filteredTransactions.map((tx) => [
      tx.date,
      tx.description,
      tx.category,
      tx.type.toUpperCase(),
      formatRupiah(tx.amount),
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [244, 81, 154] },
    });

    doc.save(`Ringkasan_Keuangan_${user?.businessName || 'UMKM'}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Keuangan
            </h1>
            <span className="p-1 rounded-lg bg-pink-100 text-[#F4519A]">
              <Sparkles size={16} />
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Selamat datang kembali, <b>{user?.name || 'Pemilik Usaha'}</b> ({user?.businessName || 'Toko'})
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* POS Quick Button */}
          <button
            onClick={() => setActiveTab('kasir')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#F4519A] text-xs font-bold rounded-2xl border border-pink-200 transition-all shadow-xs"
          >
            <ShoppingCart size={15} />
            <span>Mode Kasir POS</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all transform active:scale-95"
          >
            <Plus size={15} />
            <span>Catat Transaksi</span>
          </button>

          <button
            onClick={handleExportPDF}
            title="Download PDF"
            className="p-2.5 rounded-2xl bg-white border border-pink-100 hover:bg-pink-50 text-gray-600 transition-colors shadow-xs"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Filter Period Bar */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold flex items-center gap-1 mr-1">
            <Calendar size={13} /> Filter:
          </span>
          {[
            { id: 'bulan_ini', label: 'Bulan Pilihan' },
            { id: 'hari_ini', label: 'Hari Ini' },
            { id: 'minggu_ini', label: '7 Hari Terakhir' },
            { id: 'semua', label: 'Semua Waktu' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDateRangeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                dateRangeFilter === f.id
                  ? 'bg-[#F4519A] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {dateRangeFilter === 'bulan_ini' && (
          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="py-1.5 px-3 rounded-xl bg-[#FFF0F6] border border-pink-100 font-bold text-[#F4519A] focus:outline-none"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="py-1.5 px-3 rounded-xl bg-[#FFF0F6] border border-pink-100 font-bold text-[#F4519A] focus:outline-none"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kas Realtime */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Total Kas & Bank</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#F4519A] flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-3 tracking-tight">
            {formatRupiah(currentCashBalance)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>Saldo awal modal: {formatShortRupiah(user?.initialBalance || 0)}</span>
          </div>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Pemasukan Periode Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-3 tracking-tight">
            {formatRupiah(totalIncome)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <span>{filteredTransactions.filter((t) => t.type === 'pemasukan').length} transaksi berhasil</span>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Pengeluaran Periode Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-500 mt-3 tracking-tight">
            {formatRupiah(totalExpense)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
            <span>{filteredTransactions.filter((t) => t.type === 'pengeluaran').length} transaksi belanja</span>
          </div>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Laba Bersih Usaha</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PiggyBank size={20} />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black mt-3 tracking-tight ${netProfit >= 0 ? 'text-[#F4519A]' : 'text-rose-600'}`}>
            {formatRupiah(netProfit)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>Margin Keuntungan: <b>{profitMargin}%</b></span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Arus Kas Mingguan */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Arus Kas Masuk vs Keluar
              </h3>
              <p className="text-xs text-gray-400">Perbandingan per minggu pada periode terpilih</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F4519A]" />
                <span className="text-gray-600">Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-gray-600">Keluar</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(val) => formatShortRupiah(val)} />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #FCE7F3' }}
                />
                <Bar dataKey="Masuk" fill="#F4519A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Keluar" fill="#D1D5DB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Komposisi Pengeluaran */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Komposisi Pengeluaran
            </h3>
            <p className="text-xs text-gray-400">Alokasi biaya usaha terbesar</p>

            <div className="h-44 w-full my-2">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [formatRupiah(Number(val)), '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Belum ada data pengeluaran
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100 max-h-32 overflow-y-auto text-xs">
            {pieChartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{formatShortRupiah(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
