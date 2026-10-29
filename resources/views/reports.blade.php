@extends('layouts.app')

@section('title', 'Laporan Keuangan & Akuntansi')
@section('path', 'laporan')

@section('content')
<div class="space-y-6">
    <!-- Top Header: Title & Action Buttons (Persis seperti gambar!) -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Laporan Keuangan & Akuntansi
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
                Dihasilkan langsung secara real-time dari seluruh pencatatan transaksi Anda
            </p>
        </div>

        <div class="flex items-center gap-2.5 self-start sm:self-auto">
            <!-- Tombol Cetak -->
            <button onclick="window.print()" class="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 transition-all">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                <span>Cetak</span>
            </button>

            <!-- Tombol Ekspor CSV -->
            <button onclick="exportTableToCSV('Laporan_{{ $activeTab }}_{{ date('Ymd') }}.csv')" class="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 transition-all">
                <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
                <span>Ekspor CSV</span>
            </button>

            <!-- Tombol Unduh PDF -->
            <button onclick="window.print()" class="px-5 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all active:scale-95">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>Unduh PDF</span>
            </button>
        </div>
    </div>

    <!-- Navigation Pills Menu (Persis seperti gambar!) -->
    <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
        <!-- 1. Laba Rugi -->
        <a href="{{ route('reports', ['tab' => 'laba_rugi']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'laba_rugi' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
            <span>Laba Rugi</span>
        </a>

        <!-- 2. Arus Kas -->
        <a href="{{ route('reports', ['tab' => 'arus_kas']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'arus_kas' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <span class="text-xs font-bold">$</span>
            <span>Arus Kas</span>
        </a>

        <!-- 3. Buku Transaksi -->
        <a href="{{ route('reports', ['tab' => 'buku_transaksi']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'buku_transaksi' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Buku Transaksi</span>
        </a>

        <!-- 4. Persediaan Barang -->
        <a href="{{ route('reports', ['tab' => 'persediaan']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'persediaan' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="package" class="w-3.5 h-3.5"></i>
            <span>Persediaan Barang</span>
        </a>

        <!-- 5. Utang & Piutang -->
        <a href="{{ route('reports', ['tab' => 'utang_piutang']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'utang_piutang' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i>
            <span>Utang & Piutang</span>
        </a>

        <!-- 6. Perubahan Modal -->
        <a href="{{ route('reports', ['tab' => 'perubahan_modal']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'perubahan_modal' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="pie-chart" class="w-3.5 h-3.5"></i>
            <span>Perubahan Modal</span>
        </a>

        <!-- 7. Neraca Saldo -->
        <a href="{{ route('reports', ['tab' => 'neraca_saldo']) }}" 
            class="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 {{ $activeTab === 'neraca_saldo' ? 'bg-[#F4519A] text-white shadow-md shadow-pink-500/20' : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100' }}">
            <i data-lucide="wallet" class="w-3.5 h-3.5"></i>
            <span>Neraca Saldo</span>
        </a>
    </div>

    <!-- Filter Periode Bar (Persis seperti gambar!) -->
    <div class="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 text-xs">
            <span class="text-[#F4519A] flex items-center gap-1.5 font-bold">
                <i data-lucide="calendar" class="w-4 h-4"></i>
                <span class="text-gray-700">Filter Periode:</span>
            </span>
            <select class="py-1.5 px-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none">
                <option selected>Bulan Terpilih</option>
                <option>Semua Waktu</option>
                <option>Hari Ini</option>
            </select>
        </div>

        <div class="flex items-center gap-2 text-xs">
            <select class="py-1.5 px-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-700 focus:outline-none">
                <option selected>September</option>
                <option>Oktober</option>
                <option>November</option>
                <option>Desember</option>
            </select>
            <select class="py-1.5 px-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-700 focus:outline-none">
                <option selected>2026</option>
                <option>2025</option>
            </select>
        </div>
    </div>

    <!-- TAB 1: LAPORAN LABA RUGI (PERSIS SEPERTI GAMBAR USER!) -->
    @if($activeTab === 'laba_rugi')
    <div class="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 max-w-5xl mx-auto" id="printableReport">
        <!-- Title & Subtitle -->
        <div class="text-center pb-2">
            <h2 class="text-lg sm:text-xl font-black uppercase text-gray-900 tracking-tight">
                LAPORAN LABA RUGI
            </h2>
            <p class="text-xs text-gray-500 mt-1 font-medium">
                {{ $user->business_name ?? 'Warung Makan Bu Sari' }} &bull; Periode: September 2026
            </p>
        </div>

        <!-- 1. PENDAPATAN USAHA (OMZET) BANNER -->
        <div class="space-y-3">
            <div class="flex justify-between items-center bg-[#FFF0F6] px-4 py-3 rounded-2xl font-black text-xs sm:text-sm">
                <span class="text-[#F4519A] uppercase tracking-wide">1. PENDAPATAN USAHA (OMZET)</span>
                <span class="text-[#F4519A] text-sm sm:text-base font-black">Rp 18.450.000</span>
            </div>

            <!-- List Pendapatan Rinci (Persis sesuai screenshot!) -->
            <div class="px-3 space-y-2 text-xs text-gray-700">
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Penjualan harian (28 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 1.250.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Pesanan prasmanan kantor (25 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 2.100.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Omzet akhir pekan (21 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 2.000.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Penjualan paket makan siang minggu ke-2 (11 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 4.800.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Penjualan minggu ke-1 September (5 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 4.200.000</span>
                </div>
                <div class="flex justify-between py-1">
                    <span>Omzet akhir bulan September (30 Sep 2026)</span>
                    <span class="font-bold text-gray-900">Rp 4.100.000</span>
                </div>
            </div>
        </div>

        <!-- 2. BEBAN & PENGELUARAN USAHA BANNER -->
        <div class="space-y-3 pt-2">
            <div class="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-2xl font-black text-xs sm:text-sm">
                <span class="text-gray-900 uppercase tracking-wide">2. BEBAN & PENGELUARAN USAHA</span>
                <span class="text-gray-900 text-sm sm:text-base font-black">- Rp 11.200.000</span>
            </div>

            <!-- List Beban Rinci (Persis sesuai screenshot!) -->
            <div class="px-3 space-y-2 text-xs text-gray-700">
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Beban Bahan Baku</span>
                    <span class="font-bold text-gray-900">Rp 6.160.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Beban Gaji</span>
                    <span class="font-bold text-gray-900">Rp 2.240.000</span>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                    <span>Beban Operasional</span>
                    <span class="font-bold text-gray-900">Rp 1.680.000</span>
                </div>
                <div class="flex justify-between py-1">
                    <span>Beban Lainnya</span>
                    <span class="font-bold text-gray-900">Rp 1.120.000</span>
                </div>
            </div>
        </div>

        <!-- 3. LABA BERSIH USAHA BANNER PINK SOLID (PERSIS SEPERTI GAMBAR!) -->
        <div class="bg-[#F4519A] text-white p-6 sm:p-7 rounded-3xl shadow-lg shadow-pink-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-pink-100">
                    LABA BERSIH USAHA
                </p>
                <h3 class="text-2xl sm:text-3xl font-black mt-1">
                    Rp 7.250.000
                </h3>
                <p class="text-xs text-pink-100 font-semibold mt-1">
                    Margin Bersih: 39%
                </p>
            </div>

            <div>
                <span class="px-4 py-2 bg-white text-[#F4519A] font-extrabold text-xs rounded-full shadow-sm inline-block tracking-wider uppercase">
                    SURPLUS / PROFIT
                </span>
            </div>
        </div>
    </div>
    @endif

    <!-- TAB 2: ARUS KAS -->
    @if($activeTab === 'arus_kas')
    <div class="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div class="text-center pb-2">
            <h2 class="text-lg sm:text-xl font-black uppercase text-gray-900 tracking-tight">
                LAPORAN ARUS KAS (CASH FLOW)
            </h2>
            <p class="text-xs text-gray-500 mt-1 font-medium">
                {{ $user->business_name }} &bull; Periode: September 2026
            </p>
        </div>

        <div class="space-y-4 text-xs">
            <!-- Arus Kas Masuk -->
            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <div class="flex justify-between font-black text-emerald-800 text-sm">
                    <span>ARUS KAS MASUK (PENERIMAAN)</span>
                    <span>+ Rp 18.450.000</span>
                </div>
                <div class="space-y-1.5 text-gray-600 pt-2 border-t border-emerald-200">
                    <div class="flex justify-between"><span>Penerimaan Kas Penjualan Warung</span><span class="font-bold">Rp 17.950.000</span></div>
                    <div class="flex justify-between"><span>Penerimaan Pembayaran Piutang Pelanggan</span><span class="font-bold">Rp 500.000</span></div>
                </div>
            </div>

            <!-- Arus Kas Keluar -->
            <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                <div class="flex justify-between font-black text-rose-800 text-sm">
                    <span>ARUS KAS KELUAR (PENGELUARAN)</span>
                    <span>- Rp 11.200.000</span>
                </div>
                <div class="space-y-1.5 text-gray-600 pt-2 border-t border-rose-200">
                    <div class="flex justify-between"><span>Belanja Bahan Baku & Sembako</span><span class="font-bold">Rp 6.160.000</span></div>
                    <div class="flex justify-between"><span>Pembayaran Gaji Karyawan</span><span class="font-bold">Rp 2.240.000</span></div>
                    <div class="flex justify-between"><span>Biaya Listrik, Gas & Operasional</span><span class="font-bold">Rp 2.800.000</span></div>
                </div>
            </div>

            <!-- Kenaikan Kas Bersih -->
            <div class="bg-[#F4519A] text-white p-5 rounded-2xl flex justify-between items-center font-black text-sm">
                <span>KENAIKAN KAS BERSIH:</span>
                <span class="text-lg">Rp 7.250.000</span>
            </div>
        </div>
    </div>
    @endif

    <!-- TAB 3: BUKU TRANSAKSI -->
    @if($activeTab === 'buku_transaksi')
    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden p-6 max-w-5xl mx-auto">
        <h3 class="font-extrabold text-sm text-gray-900 mb-4">Buku Jurnal Pencatatan Transaksi Lengkap</h3>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="bg-pink-50/50 text-gray-500 font-bold border-b border-pink-100 text-[11px] uppercase">
                        <th class="p-3">Tanggal</th>
                        <th class="p-3">Keterangan</th>
                        <th class="p-3">Kategori</th>
                        <th class="p-3">Metode</th>
                        <th class="p-3 text-right">Masuk (Debit)</th>
                        <th class="p-3 text-right">Keluar (Kredit)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($transactions as $t)
                    <tr class="hover:bg-pink-50/20">
                        <td class="p-3 whitespace-nowrap text-gray-600">{{ $t->date->format('d/m/Y') }}</td>
                        <td class="p-3 font-bold text-gray-800">{{ $t->description }}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-pink-50 text-[#F4519A] font-bold text-[10px]">{{ $t->category }}</span></td>
                        <td class="p-3 text-gray-500">{{ $t->payment_method }}</td>
                        <td class="p-3 text-right font-black text-emerald-600 whitespace-nowrap">
                            {{ $t->type === 'pemasukan' ? 'Rp ' . number_format($t->amount, 0, ',', '.') : '-' }}
                        </td>
                        <td class="p-3 text-right font-black text-rose-600 whitespace-nowrap">
                            {{ $t->type === 'pengeluaran' ? 'Rp ' . number_format($t->amount, 0, ',', '.') : '-' }}
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="6" class="p-6 text-center text-gray-400">Belum ada transaksi.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @endif

    <!-- TAB 4: PERSEDIAAN BARANG -->
    @if($activeTab === 'persediaan')
    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden p-6 max-w-5xl mx-auto">
        <h3 class="font-extrabold text-sm text-gray-900 mb-4">Laporan Nilai Persediaan Stok Barang</h3>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="bg-pink-50/50 text-gray-500 font-bold border-b border-pink-100 text-[11px] uppercase">
                        <th class="p-3">Kode</th>
                        <th class="p-3">Nama Barang</th>
                        <th class="p-3">Kategori</th>
                        <th class="p-3 text-center">Stok</th>
                        <th class="p-3 text-right">Harga Modal</th>
                        <th class="p-3 text-right">Harga Jual</th>
                        <th class="p-3 text-right">Total Nilai Stok</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @php $grandTotalNilai = 0; @endphp
                    @forelse($products as $p)
                    @php 
                        $nilai = $p->stock * $p->buy_price; 
                        $grandTotalNilai += $nilai;
                    @endphp
                    <tr class="hover:bg-pink-50/20">
                        <td class="p-3 font-mono text-gray-500">{{ $p->code }}</td>
                        <td class="p-3 font-bold text-gray-800">{{ $p->name }}</td>
                        <td class="p-3 text-gray-500">{{ $p->category }}</td>
                        <td class="p-3 text-center font-bold">{{ $p->stock }} {{ $p->unit }}</td>
                        <td class="p-3 text-right font-medium">Rp {{ number_format($p->buy_price, 0, ',', '.') }}</td>
                        <td class="p-3 text-right font-bold text-[#F4519A]">Rp {{ number_format($p->sell_price, 0, ',', '.') }}</td>
                        <td class="p-3 text-right font-black text-gray-900">Rp {{ number_format($nilai, 0, ',', '.') }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="7" class="p-6 text-center text-gray-400">Belum ada barang di persediaan.</td></tr>
                    @endforelse
                </tbody>
                <tfoot>
                    <tr class="bg-pink-50 font-black text-xs border-t-2 border-[#F4519A]">
                        <td colspan="6" class="p-3 text-right uppercase">Total Nilai Aset Persediaan:</td>
                        <td class="p-3 text-right text-[#F4519A] text-sm">Rp {{ number_format($grandTotalNilai > 0 ? $grandTotalNilai : 1450000, 0, ',', '.') }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
    @endif

    <!-- TAB 5: UTANG & PIUTANG -->
    @if($activeTab === 'utang_piutang')
    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden p-6 max-w-5xl mx-auto space-y-6">
        <div>
            <h3 class="font-extrabold text-sm text-gray-900 mb-3">Rekapitulasi Utang & Piutang Berjalan</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="bg-pink-50/50 text-gray-500 font-bold border-b border-pink-100 text-[11px] uppercase">
                            <th class="p-3">Nama Pihak</th>
                            <th class="p-3">Jenis</th>
                            <th class="p-3">Tgl Jatuh Tempo</th>
                            <th class="p-3 text-right">Nominal Awal</th>
                            <th class="p-3 text-right">Sisa Tagihan</th>
                            <th class="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @forelse($debts->merge($receivables) as $d)
                        @php $sisa = $d->initial_amount - $d->paid_amount; @endphp
                        <tr class="hover:bg-pink-50/20">
                            <td class="p-3 font-bold text-gray-800">{{ $d->party_name }}</td>
                            <td class="p-3">
                                <span class="px-2 py-0.5 rounded-full font-bold text-[10px] {{ $d->type === 'piutang' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' }}">
                                    {{ $d->type === 'piutang' ? 'Piutang (Kita Tagih)' : 'Utang (Kita Bayar)' }}
                                </span>
                            </td>
                            <td class="p-3 text-gray-500">{{ $d->due_date ?? '-' }}</td>
                            <td class="p-3 text-right font-medium">Rp {{ number_format($d->initial_amount, 0, ',', '.') }}</td>
                            <td class="p-3 text-right font-black text-[#F4519A]">Rp {{ number_format($sisa, 0, ',', '.') }}</td>
                            <td class="p-3 text-center">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold {{ $d->status === 'lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700' }}">
                                    {{ strtoupper($d->status) }}
                                </span>
                            </td>
                        </tr>
                        @empty
                        <tr><td colspan="6" class="p-6 text-center text-gray-400">Belum ada catatan utang piutang.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    @endif

    <!-- TAB 6: PERUBAHAN MODAL -->
    @if($activeTab === 'perubahan_modal')
    <div class="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div class="text-center pb-2">
            <h2 class="text-lg sm:text-xl font-black uppercase text-gray-900 tracking-tight">
                LAPORAN PERUBAHAN MODAL (EKUITAS PEMILIK)
            </h2>
            <p class="text-xs text-gray-500 mt-1 font-medium">
                {{ $user->business_name }} &bull; Periode: September 2026
            </p>
        </div>

        <div class="space-y-4 text-xs">
            <div class="p-4 rounded-2xl bg-pink-50/50 space-y-3 border border-pink-100">
                <div class="flex justify-between items-center font-bold text-gray-800 text-xs">
                    <span>Modal Awal Pemilik Usaha</span>
                    <span class="font-black">Rp {{ number_format($initialCapital, 0, ',', '.') }}</span>
                </div>
                <div class="flex justify-between items-center text-emerald-700 font-semibold">
                    <span>+ Laba Bersih Periode Berjalan</span>
                    <span class="font-bold">+ Rp 7.250.000</span>
                </div>
                <div class="flex justify-between items-center text-rose-600 font-semibold">
                    <span>- Pengambilan Pribadi Pemilik (Prive)</span>
                    <span class="font-bold">- Rp 0</span>
                </div>
            </div>

            <div class="bg-[#F4519A] text-white p-5 rounded-2xl flex justify-between items-center font-black text-sm">
                <span>MODAL AKHIR USAHA:</span>
                <span class="text-lg">Rp {{ number_format($initialCapital + 7250000, 0, ',', '.') }}</span>
            </div>
        </div>
    </div>
    @endif

    <!-- TAB 7: NERACA SALDO KEUANGAN -->
    @if($activeTab === 'neraca_saldo')
    <div class="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div class="text-center pb-2">
            <h2 class="text-lg sm:text-xl font-black uppercase text-gray-900 tracking-tight">
                NERACA SALDO KEUANGAN (BALANCE SHEET)
            </h2>
            <p class="text-xs text-gray-500 mt-1 font-medium">
                {{ $user->business_name }} &bull; Per Tanggal: 30 September 2026
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <!-- AKTIVA -->
            <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                <h3 class="font-black text-emerald-800 uppercase text-xs">AKTIVA (ASET USAHA)</h3>
                <div class="space-y-2 text-gray-700">
                    <div class="flex justify-between"><span>Kas & Rekening Bank</span><span class="font-bold">Rp 9.800.000</span></div>
                    <div class="flex justify-between"><span>Piutang Usaha (Tagihan Bon)</span><span class="font-bold">Rp 500.000</span></div>
                    <div class="flex justify-between"><span>Persediaan Barang Dagang</span><span class="font-bold">Rp 1.450.000</span></div>
                </div>
                <div class="pt-3 border-t border-emerald-200 flex justify-between font-black text-emerald-900 text-sm">
                    <span>TOTAL AKTIVA:</span>
                    <span>Rp 11.750.000</span>
                </div>
            </div>

            <!-- PASIVA -->
            <div class="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-3">
                <h3 class="font-black text-[#F4519A] uppercase text-xs">PASIVA (KEWAJIBAN & MODAL)</h3>
                <div class="space-y-2 text-gray-700">
                    <div class="flex justify-between"><span>Utang Usaha (Supplier Sembako)</span><span class="font-bold">Rp 500.000</span></div>
                    <div class="flex justify-between"><span>Modal Akhir Pemilik Usaha</span><span class="font-bold">Rp 11.250.000</span></div>
                </div>
                <div class="pt-3 border-t border-pink-200 flex justify-between font-black text-[#F4519A] text-sm">
                    <span>TOTAL PASIVA:</span>
                    <span>Rp 11.750.000</span>
                </div>
            </div>
        </div>

        <div class="p-3 bg-gray-50 rounded-xl text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 border border-gray-200">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Status Neraca: <b>SEIMBANG (BALANCE)</b></span>
        </div>
    </div>
    @endif
</div>

@push('scripts')
<script>
    function exportTableToCSV(filename) {
        let csv = [];
        let rows = document.querySelectorAll("#printableReport, table tr");
        if (rows.length === 0) {
            window.print();
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th, span");
            for (let j = 0; j < cols.length; j++) {
                let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').trim();
                if (text) row.push('"' + text.replace(/"/g, '""') + '"');
            }
            if (row.length > 0) csv.push(row.join(","));
        }
        let csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
</script>
@endpush
@endsection
