import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  FileSpreadsheet, 
  Filter,
  DollarSign,
  TrendingUp,
  Package,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReportType = 'laba_rugi' | 'arus_kas' | 'buku_transaksi' | 'persediaan' | 'utang_piutang';

export const ReportsView: React.FC = () => {
  const { 
    user, 
    transactions, 
    products, 
    debtsReceivables, 
    selectedMonth, 
    selectedYear, 
    setSelectedMonth, 
    setSelectedYear 
  } = useApp();

  const [activeReport, setActiveReport] = useState<ReportType>('laba_rugi');
  const [filterPeriod, setFilterPeriod] = useState<'selected_month' | 'custom' | 'all'>('selected_month');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Filtered transactions based on period
  const reportTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (filterPeriod === 'all') return true;
      if (filterPeriod === 'selected_month') {
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }
      if (filterPeriod === 'custom') {
        return t.date >= startDate && t.date <= endDate;
      }
      return true;
    });
  }, [transactions, filterPeriod, selectedMonth, selectedYear, startDate, endDate]);

  // Revenue & Expenses breakdown
  const incomeItems = reportTransactions.filter((t) => t.type === 'pemasukan');
  const expenseItems = reportTransactions.filter((t) => t.type === 'pengeluaran');

  const totalIncome = incomeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);
  const netIncome = totalIncome - totalExpense;

  // Breakdown by category
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenseItems.forEach((tx) => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenseItems]);

  // Export to CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (activeReport === 'laba_rugi' || activeReport === 'arus_kas' || activeReport === 'buku_transaksi') {
      headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Metode Bayar', 'Nominal (Rp)', 'Catatan'];
      rows = reportTransactions.map((t) => [
        t.id,
        t.date,
        t.type,
        `"${t.category}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.paymentMethod,
        String(t.amount),
        `"${(t.notes || '').replace(/"/g, '""')}"`,
      ]);
    } else if (activeReport === 'persediaan') {
      headers = ['Kode', 'Nama Barang', 'Kategori', 'Stok', 'Satuan', 'Harga Beli', 'Harga Jual', 'Nilai Persediaan'];
      rows = products.map((p) => [
        p.code,
        `"${p.name}"`,
        p.category,
        String(p.stock),
        p.unit,
        String(p.buyPrice),
        String(p.sellPrice),
        String(p.stock * p.buyPrice),
      ]);
    } else {
      headers = ['Pihak', 'Jenis', 'Tgl Transaksi', 'Jatuh Tempo', 'Nominal Awal', 'Dibayar', 'Sisa', 'Status'];
      rows = debtsReceivables.map((d) => [
        `"${d.partyName}"`,
        d.type,
        d.transactionDate,
        d.dueDate,
        String(d.initialAmount),
        String(d.paidAmount),
        String(d.initialAmount - d.paidAmount),
        d.status,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AkunAsisten_${activeReport}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(244, 81, 154);
    doc.text(`AKUNASISTEN - ${activeReport.toUpperCase().replace('_', ' ')}`, 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Usaha: ${user?.businessName || 'Warung Makan Bu Sari'}`, 14, 28);
    doc.text(`Periode: ${MONTH_NAMES[selectedMonth]} ${selectedYear}`, 14, 34);

    if (activeReport === 'laba_rugi') {
      const summaryData = [
        ['Total Pendapatan / Penjualan', formatRupiah(totalIncome)],
        ...expenseByCategory.map(([cat, val]) => [`  Beban: ${cat}`, `- ${formatRupiah(val)}`]),
        ['Total Beban & Pengeluaran', `- ${formatRupiah(totalExpense)}`],
        ['LABA BERSIH USAHA', formatRupiah(netIncome)],
      ];
      autoTable(doc, {
        startY: 42,
        head: [['Pos Laba Rugi', 'Jumlah (IDR)']],
        body: summaryData,
        headStyles: { fillColor: [244, 81, 154] },
      });
    } else {
      const tableData = reportTransactions.map((t) => [
        t.date,
        t.description,
        t.category,
        t.type,
        formatRupiah(t.amount),
      ]);
      autoTable(doc, {
        startY: 42,
        head: [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal']],
        body: tableData,
        headStyles: { fillColor: [244, 81, 154] },
      });
    }

    doc.save(`Laporan_${activeReport}_${Date.now()}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Laporan Keuangan & Akuntansi
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Dihasilkan langsung secara real-time dari seluruh pencatatan transaksi Anda
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 text-xs font-bold rounded-2xl shadow-sm transition-all"
          >
            <Printer size={15} />
            <span>Cetak</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 text-xs font-bold rounded-2xl shadow-sm transition-all"
          >
            <FileSpreadsheet size={15} />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
          >
            <Download size={15} />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'laba_rugi', label: 'Laba Rugi', icon: <TrendingUp size={15} /> },
          { id: 'arus_kas', label: 'Arus Kas', icon: <DollarSign size={15} /> },
          { id: 'buku_transaksi', label: 'Buku Transaksi', icon: <FileText size={15} /> },
          { id: 'persediaan', label: 'Persediaan Barang', icon: <Package size={15} /> },
          { id: 'utang_piutang', label: 'Utang & Piutang', icon: <Scale size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as ReportType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeReport === tab.id
                ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20'
                : 'bg-white text-gray-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Period Box */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar size={16} className="text-[#F4519A]" />
          <span className="font-bold text-gray-700">Filter Periode:</span>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-medium text-gray-800"
          >
            <option value="selected_month">Bulan Terpilih</option>
            <option value="custom">Rentang Tanggal Khusus</option>
            <option value="all">Semua Riwayat</option>
          </select>
        </div>

        {filterPeriod === 'selected_month' && (
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-medium"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-medium"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        )}

        {filterPeriod === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5"
            />
            <span>s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5"
            />
          </div>
        )}
      </div>

      {/* Main Report View: LABA RUGI */}
      {activeReport === 'laba_rugi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
          <div className="text-center pb-4 border-b border-pink-100">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">
              Laporan Laba Rugi
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {user?.businessName || 'Warung Makan Bu Sari'} &bull; Periode: {MONTH_NAMES[selectedMonth]} {selectedYear}
            </p>
          </div>

          {/* Revenue Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#FFF0F6] p-3 rounded-2xl">
              <span className="font-extrabold text-sm text-[#F4519A]">1. PENDAPATAN USAHA (OMZET)</span>
              <span className="font-extrabold text-sm text-[#F4519A]">{formatRupiah(totalIncome)}</span>
            </div>
            <div className="pl-4 space-y-2 text-xs">
              {incomeItems.map((tx) => (
                <div key={tx.id} className="flex justify-between text-gray-600">
                  <span>{tx.description} ({formatDateIndo(tx.date)})</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(tx.amount)}</span>
                </div>
              ))}
              {incomeItems.length === 0 && (
                <p className="text-gray-400 italic">Belum ada pendapatan di periode ini.</p>
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-2xl">
              <span className="font-extrabold text-sm text-gray-800">2. BEBAN & PENGELUARAN USAHA</span>
              <span className="font-extrabold text-sm text-gray-900">- {formatRupiah(totalExpense)}</span>
            </div>
            <div className="pl-4 space-y-2.5 text-xs">
              {expenseByCategory.map(([cat, total]) => (
                <div key={cat} className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Beban {cat}</span>
                  <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
                </div>
              ))}
              {expenseByCategory.length === 0 && (
                <p className="text-gray-400 italic">Tidak ada catatan pengeluaran di periode ini.</p>
              )}
            </div>
          </div>

          {/* Net Profit Summary Box */}
          <div className="p-5 rounded-3xl bg-pink-500 text-white flex justify-between items-center shadow-lg shadow-pink-500/20">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">LABA BERSIH USAHA</span>
              <h3 className="text-2xl font-black mt-0.5">{formatRupiah(netIncome)}</h3>
              <p className="text-[11px] opacity-80">
                Margin Bersih: {totalIncome > 0 ? Math.round((netIncome / totalIncome) * 100) : 0}%
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-white text-[#F4519A] text-xs font-black">
                {netIncome >= 0 ? 'SURPLUS / PROFIT' : 'DEFISIT'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ARUS KAS / TRANSAKSI VIEW */}
      {(activeReport === 'arus_kas' || activeReport === 'buku_transaksi') && (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-pink-100 bg-[#FFF0F6]/40">
            <h2 className="text-base font-bold text-gray-900">
              {activeReport === 'arus_kas' ? 'Laporan Arus Kas Operasional' : 'Buku Catatan Transaksi'}
            </h2>
            <p className="text-xs text-gray-400">Total {reportTransactions.length} transaksi di periode ini</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right">Pemasukan</th>
                  <th className="py-3 px-4 text-right">Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reportTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-pink-50/20">
                    <td className="py-3 px-4 whitespace-nowrap text-gray-500">{formatDateIndo(tx.date)}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{tx.description}</td>
                    <td className="py-3 px-4">{tx.category}</td>
                    <td className="py-3 px-4 text-gray-500">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#F4519A]">
                      {tx.type === 'pemasukan' ? formatRupiah(tx.amount) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800">
                      {tx.type === 'pengeluaran' ? formatRupiah(tx.amount) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PERSEDIAAN VIEW */}
      {activeReport === 'persediaan' && (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-pink-100 bg-[#FFF0F6]/40">
            <h2 className="text-base font-bold text-gray-900">Laporan Nilai Persediaan Barang</h2>
            <p className="text-xs text-gray-400">
              Total Nilai Aset Stok: {formatRupiah(products.reduce((acc, p) => acc + p.stock * p.buyPrice, 0))}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-4 text-center">Stok</th>
                  <th className="py-3 px-4 text-right">Harga Modal</th>
                  <th className="py-3 px-4 text-right">Harga Jual</th>
                  <th className="py-3 px-4 text-right">Total Nilai Modal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono font-bold text-gray-500">{p.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{p.name}</td>
                    <td className="py-3 px-4 text-center">{p.stock} {p.unit}</td>
                    <td className="py-3 px-4 text-right">{formatRupiah(p.buyPrice)}</td>
                    <td className="py-3 px-4 text-right">{formatRupiah(p.sellPrice)}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#F4519A]">
                      {formatRupiah(p.stock * p.buyPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UTANG PIUTANG VIEW */}
      {activeReport === 'utang_piutang' && (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-pink-100 bg-[#FFF0F6]/40">
            <h2 className="text-base font-bold text-gray-900">Laporan Utang dan Piutang Usaha</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Pihak Terkait</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4 text-right">Nominal Awal</th>
                  <th className="py-3 px-4 text-right">Telah Terbayar</th>
                  <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {debtsReceivables.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 px-4 font-bold uppercase text-[10px] text-gray-500">{d.type}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{d.partyName}</td>
                    <td className="py-3 px-4">{formatDateIndo(d.dueDate)}</td>
                    <td className="py-3 px-4 text-right">{formatRupiah(d.initialAmount)}</td>
                    <td className="py-3 px-4 text-right text-emerald-600">{formatRupiah(d.paidAmount)}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#F4519A]">
                      {formatRupiah(d.initialAmount - d.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

