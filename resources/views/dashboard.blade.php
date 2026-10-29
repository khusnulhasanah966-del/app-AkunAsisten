@extends('layouts.app')

@section('title', 'Dashboard')
@section('path', 'dashboard')

@section('content')
<div class="space-y-6">
    <!-- Top Welcome & Quick Actions (Persis screenshot) -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Dashboard Keuangan
                </h1>
                <span class="p-1 rounded-lg bg-pink-100 text-[#F4519A]">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                </span>
            </div>
            <p class="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
                Selamat datang kembali, <b>{{ $user->name ?? 'Bu Sari' }}</b> ({{ $user->business_name ?? 'Warung Makan Bu Sari' }})
            </p>
        </div>

        <div class="flex items-center gap-2.5 self-start sm:self-auto">
            <!-- Mode Kasir POS -->
            <a href="{{ route('cashier') }}" class="flex items-center gap-1.5 px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#F4519A] text-xs font-bold rounded-2xl border border-pink-200 transition-all shadow-xs">
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                <span>Mode Kasir POS</span>
            </a>

            <!-- + Catat Transaksi -->
            <button onclick="document.getElementById('modalAdd').classList.remove('hidden')" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all transform active:scale-95">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Catat Transaksi</span>
            </button>

            <!-- Download Icon Button -->
            <button onclick="window.print()" title="Download / Cetak" class="p-2.5 rounded-2xl bg-white border border-pink-100 hover:bg-pink-50 text-gray-600 transition-colors shadow-xs">
                <i data-lucide="download" class="w-4 h-4"></i>
            </button>
        </div>
    </div>

    <!-- Filter Bar (Persis screenshot) -->
    <div class="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto text-xs">
            <span class="text-gray-400 font-bold flex items-center gap-1 mr-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Filter:
            </span>
            <a href="{{ route('dashboard', ['filter' => 'month']) }}" class="px-3 py-1.5 rounded-xl font-bold transition-colors {{ $filter === 'month' ? 'bg-[#F4519A] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                Bulan Pilihan
            </a>
            <a href="{{ route('dashboard', ['filter' => 'today']) }}" class="px-3 py-1.5 rounded-xl font-bold transition-colors {{ $filter === 'today' ? 'bg-[#F4519A] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                Hari Ini
            </a>
            <a href="{{ route('dashboard', ['filter' => 'week']) }}" class="px-3 py-1.5 rounded-xl font-bold transition-colors {{ $filter === 'week' ? 'bg-[#F4519A] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                7 Hari Terakhir
            </a>
            <a href="{{ route('dashboard', ['filter' => 'all']) }}" class="px-3 py-1.5 rounded-xl font-bold transition-colors {{ $filter === 'all' ? 'bg-[#F4519A] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                Semua Waktu
            </a>
        </div>

        <div class="flex items-center gap-2 text-xs">
            <select class="py-1.5 px-3 rounded-xl bg-[#FFF0F6] border border-pink-100 font-bold text-[#F4519A] focus:outline-none">
                <option selected>September</option>
                <option>Oktober</option>
                <option>November</option>
                <option>Desember</option>
            </select>
            <select class="py-1.5 px-3 rounded-xl bg-[#FFF0F6] border border-pink-100 font-bold text-[#F4519A] focus:outline-none">
                <option selected>2026</option>
                <option>2025</option>
            </select>
        </div>
    </div>

    <!-- 4 Main Cards (Persis screenshot) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Total Kas & Bank -->
        <div class="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400">Total Kas & Bank</span>
                <div class="w-10 h-10 rounded-2xl bg-pink-50 text-[#F4519A] flex items-center justify-center">
                    <i data-lucide="wallet" class="w-5 h-5"></i>
                </div>
            </div>
            <p class="text-xl sm:text-2xl font-black text-gray-900 mt-3 tracking-tight">
                Rp {{ number_format($currentCash, 0, ',', '.') }}
            </p>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                <span>Saldo awal modal: Rp {{ number_format($user->initial_balance / 1000000, 1, ',', '.') }} jt</span>
            </div>
        </div>

        <!-- 2. Pemasukan Periode Ini -->
        <div class="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400">Pemasukan Periode Ini</span>
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                </div>
            </div>
            <p class="text-xl sm:text-2xl font-black text-emerald-600 mt-3 tracking-tight">
                Rp {{ number_format($totalIncome, 0, ',', '.') }}
            </p>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span>{{ $transactions->where('type', 'pemasukan')->count() }} transaksi berhasil</span>
            </div>
        </div>

        <!-- 3. Pengeluaran Periode Ini -->
        <div class="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400">Pengeluaran Periode Ini</span>
                <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <i data-lucide="trending-down" class="w-5 h-5"></i>
                </div>
            </div>
            <p class="text-xl sm:text-2xl font-black text-rose-500 mt-3 tracking-tight">
                Rp {{ number_format($totalExpense, 0, ',', '.') }}
            </p>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-rose-500 font-medium">
                <span>{{ $transactions->where('type', 'pengeluaran')->count() }} transaksi belanja</span>
            </div>
        </div>

        <!-- 4. Laba Bersih Usaha -->
        <div class="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400">Laba Bersih Usaha</span>
                <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <i data-lucide="piggy-bank" class="w-5 h-5"></i>
                </div>
            </div>
            <p class="text-xl sm:text-2xl font-black {{ $netProfit >= 0 ? 'text-[#F4519A]' : 'text-rose-600' }} mt-3 tracking-tight">
                Rp {{ number_format($netProfit, 0, ',', '.') }}
            </p>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>Margin Keuntungan: <b>{{ $totalIncome > 0 ? round(($netProfit / $totalIncome) * 100) : 0 }}%</b></span>
            </div>
        </div>
    </div>

    <!-- Charts Section (Persis screenshot) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Bar Chart: Arus Kas Masuk vs Keluar (col-span-8) -->
        <div class="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-extrabold text-gray-900">
                        Arus Kas Masuk vs Keluar
                    </h3>
                    <p class="text-xs text-gray-400">Perbandingan per minggu pada periode terpilih</p>
                </div>
                <div class="flex items-center gap-3 text-xs font-semibold">
                    <div class="flex items-center gap-1.5">
                        <span class="w-3 h-3 rounded-full bg-[#F4519A]"></span>
                        <span class="text-gray-600">Masuk</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="w-3 h-3 rounded-full bg-gray-300"></span>
                        <span class="text-gray-600">Keluar</span>
                    </div>
                </div>
            </div>

            <div class="h-64 w-full relative">
                <canvas id="cashflowBarChart"></canvas>
            </div>
        </div>

        <!-- Donut Chart: Komposisi Pengeluaran (col-span-4) -->
        <div class="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm flex flex-col justify-between">
            <div>
                <h3 class="text-base font-extrabold text-gray-900">
                    Komposisi Pengeluaran
                </h3>
                <p class="text-xs text-gray-400">Alokasi biaya usaha terbesar</p>

                <div class="h-44 w-full my-2 relative flex items-center justify-center">
                    <canvas id="expenseDonutChart"></canvas>
                </div>
            </div>

            <!-- Bottom Breakdown list -->
            <div class="space-y-1.5 pt-2 border-t border-gray-100 max-h-36 overflow-y-auto text-xs">
                @php
                    $colors = ['#F4519A', '#FB7185', '#A78BFA', '#FBBF24', '#38BDF8'];
                @endphp
                @forelse($expenseCategories as $idx => $cat)
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: {{ $colors[$idx % count($colors)] }}"></span>
                        <span class="text-gray-700 font-medium">{{ $cat->category }}</span>
                    </div>
                    <span class="font-bold text-gray-900">Rp {{ number_format($cat->total, 0, ',', '.') }}</span>
                </div>
                @empty
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#F4519A]"></span>
                        <span class="text-gray-700">Bahan Baku</span>
                    </div>
                    <span class="font-bold text-gray-900">Rp 6,2 jt</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#FB7185]"></span>
                        <span class="text-gray-700">Operasional</span>
                    </div>
                    <span class="font-bold text-gray-900">Rp 1,7 jt</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#A78BFA]"></span>
                        <span class="text-gray-700">Gaji</span>
                    </div>
                    <span class="font-bold text-gray-900">Rp 2,2 jt</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
                        <span class="text-gray-700">Lainnya</span>
                    </div>
                    <span class="font-bold text-gray-900">Rp 1,1 jt</span>
                </div>
                @endforelse
            </div>
        </div>
    </div>
</div>

<!-- Modal Catat Transaksi Baru -->
<div id="modalAdd" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 class="font-extrabold text-gray-900 text-sm">Catat Transaksi Baru</h3>
            <button onclick="document.getElementById('modalAdd').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 font-bold text-base">&times;</button>
        </div>

        <form action="{{ route('transactions.store') }}" method="POST" class="space-y-3 text-xs">
            @csrf
            <div>
                <label class="font-bold text-gray-600 block mb-1">Jenis Transaksi</label>
                <div class="grid grid-cols-2 gap-2 font-bold">
                    <label class="p-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer border-emerald-400 bg-emerald-50 text-emerald-700">
                        <input type="radio" name="type" value="pemasukan" checked class="mr-1"> Pemasukan (+)
                    </label>
                    <label class="p-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer border-rose-300 bg-rose-50 text-rose-700">
                        <input type="radio" name="type" value="pengeluaran" class="mr-1"> Pengeluaran (-)
                    </label>
                </div>
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Tanggal</label>
                <input type="date" name="date" value="{{ date('Y-m-d') }}" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Nominal (Rp)</label>
                <input type="number" name="amount" required placeholder="Contoh: 50000" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Kategori</label>
                <input type="text" name="category" required placeholder="Penjualan, Bahan Baku, Operasional, dll" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Keterangan</label>
                <input type="text" name="description" required placeholder="Uraian transaksi..." class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Metode Pembayaran</label>
                <select name="payment_method" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS</option>
                </select>
            </div>

            <button type="submit" class="w-full py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold rounded-xl shadow-md transition-all mt-3">
                Simpan Transaksi
            </button>
        </form>
    </div>
</div>

@push('scripts')
<script>
    // 1. Chart Bar Arus Kas (Persis warna dan bentuk seperti screenshot)
    const ctxBar = document.getElementById('cashflowBarChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'],
            datasets: [
                {
                    label: 'Masuk',
                    data: [3500000, 4200000, 2000000, 7800000],
                    backgroundColor: '#F4519A',
                    borderRadius: 8,
                    barPercentage: 0.6,
                },
                {
                    label: 'Keluar',
                    data: [1200000, 5100000, 1500000, 2900000],
                    backgroundColor: '#D1D5DB',
                    borderRadius: 8,
                    barPercentage: 0.6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': Rp ' + context.raw.toLocaleString('id-ID');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    border: { dash: [4, 4] },
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + (value / 1000000) + ' jt';
                        }
                    }
                }
            }
        }
    });

    // 2. Donut Chart Komposisi Pengeluaran
    const ctxDonut = document.getElementById('expenseDonutChart').getContext('2d');
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Bahan Baku', 'Operasional', 'Gaji', 'Lainnya'],
            datasets: [{
                data: [6200000, 1700000, 2200000, 1100000],
                backgroundColor: ['#F4519A', '#FB7185', '#A78BFA', '#FBBF24'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
</script>
@endpush
@endsection
