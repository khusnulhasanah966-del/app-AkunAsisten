@extends('layouts.app')

@section('title', 'Semua Transaksi')
@section('path', 'transaksi')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Semua Transaksi</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Kelola seluruh riwayat pemasukan dan pengeluaran usaha Anda</p>
        </div>
        <button onclick="document.getElementById('modalAdd').classList.remove('hidden')" class="px-4 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Tambah Transaksi</span>
        </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white p-4 rounded-3xl border border-pink-100 shadow-sm">
        <form method="GET" action="{{ route('transactions') }}" class="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            <div class="md:col-span-5 relative">
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari keterangan atau nota..." class="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div class="md:col-span-3">
                <select name="type" onchange="this.form.submit()" class="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-2xl font-semibold">
                    <option value="all">Semua Jenis</option>
                    <option value="pemasukan" {{ request('type') == 'pemasukan' ? 'selected' : '' }}>Pemasukan (+)</option>
                    <option value="pengeluaran" {{ request('type') == 'pengeluaran' ? 'selected' : '' }}>Pengeluaran (-)</option>
                </select>
            </div>
            <div class="md:col-span-4">
                <select name="category" onchange="this.form.submit()" class="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-2xl font-semibold">
                    <option value="all">Semua Kategori</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat }}" {{ request('category') == $cat ? 'selected' : '' }}>{{ $cat }}</option>
                    @endforeach
                </select>
            </div>
        </form>
    </div>

    <!-- Table Transaksi -->
    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="bg-pink-50/50 text-gray-500 font-bold border-b border-pink-100 text-[11px] uppercase">
                        <th class="p-3.5">Tanggal</th>
                        <th class="p-3.5">Keterangan</th>
                        <th class="p-3.5">Kategori</th>
                        <th class="p-3.5">Metode</th>
                        <th class="p-3.5 text-right">Nominal</th>
                        <th class="p-3.5 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($transactions as $tx)
                    <tr class="hover:bg-pink-50/20">
                        <td class="p-3.5 whitespace-nowrap text-gray-600 font-medium">{{ $tx->date->format('d M Y') }}</td>
                        <td class="p-3.5">
                            <span class="font-bold text-gray-900 block">{{ $tx->description }}</span>
                            @if($tx->notes)
                            <span class="text-[10px] text-gray-400 block">{{ $tx->notes }}</span>
                            @endif
                        </td>
                        <td class="p-3.5 whitespace-nowrap">
                            <span class="px-2.5 py-1 rounded-full bg-pink-50 text-[#F4519A] font-bold text-[10px]">{{ $tx->category }}</span>
                        </td>
                        <td class="p-3.5 whitespace-nowrap text-gray-500">{{ $tx->payment_method }}</td>
                        <td class="p-3.5 text-right whitespace-nowrap font-black {{ $tx->type === 'pemasukan' ? 'text-emerald-600' : 'text-gray-900' }}">
                            {{ $tx->type === 'pemasukan' ? '+' : '-' }} Rp {{ number_format($tx->amount, 0, ',', '.') }}
                        </td>
                        <td class="p-3.5 text-center whitespace-nowrap">
                            <form action="{{ route('transactions.destroy', $tx->id) }}" method="POST" onsubmit="return confirm('Hapus transaksi ini?');" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="p-8 text-center text-gray-400">Tidak ada transaksi yang sesuai.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if($transactions->hasPages())
        <div class="p-4 border-t border-gray-100">
            {{ $transactions->links() }}
        </div>
        @endif
    </div>
</div>

<!-- Modal Catat Transaksi -->
<div id="modalAdd" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 class="font-extrabold text-gray-900 text-sm">Catat Transaksi Baru</h3>
            <button onclick="document.getElementById('modalAdd').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 font-bold">&times;</button>
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
@endsection
