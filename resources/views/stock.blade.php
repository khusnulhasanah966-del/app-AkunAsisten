@extends('layouts.app')

@section('title', 'Stok Barang')
@section('path', 'stok')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Stok Barang</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Pantau persediaan bahan dan menu makanan warung Anda</p>
        </div>
        <button onclick="document.getElementById('modalAddProduct').classList.remove('hidden')" class="px-4 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Tambah Barang Baru</span>
        </button>
    </div>

    <!-- Grid Produk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @forelse($products as $p)
        <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3 relative group">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-[10px] font-bold text-[#F4519A] bg-pink-50 px-2 py-0.5 rounded">{{ $p->category }}</span>
                    <h3 class="font-bold text-gray-900 text-sm mt-1.5">{{ $p->name }}</h3>
                    <p class="text-[11px] text-gray-400">Kode: {{ $p->code }}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-black {{ $p->stock <= $p->min_stock ? 'text-amber-600' : 'text-emerald-600' }} block">
                        {{ $p->stock }} {{ $p->unit }}
                    </span>
                    <span class="text-[10px] text-gray-400">Min: {{ $p->min_stock }}</span>
                </div>
            </div>

            <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <div>
                    <span class="text-[10px] text-gray-400 block">Harga Modal</span>
                    <span class="font-bold text-gray-600">Rp {{ number_format($p->buy_price, 0, ',', '.') }}</span>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-gray-400 block">Harga Jual</span>
                    <span class="font-black text-[#F4519A]">Rp {{ number_format($p->sell_price, 0, ',', '.') }}</span>
                </div>
            </div>

            <!-- Tombol Hapus Barang -->
            <div class="pt-2 border-t border-gray-100 flex justify-end">
                <form action="{{ route('stock.destroy', $p->id) }}" method="POST" onsubmit="return confirm('Hapus barang {{ $p->name }} dari stok?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-gray-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        <span>Hapus Barang</span>
                    </button>
                </form>
            </div>
        </div>
        @empty
        <div class="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-pink-100">
            Belum ada barang di katalog. Klik tombol di atas untuk menambah.
        </div>
        @endforelse
    </div>
</div>

<!-- Modal Tambah Produk -->
<div id="modalAddProduct" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 class="font-extrabold text-gray-900 text-sm">Tambah Barang / Menu Baru</h3>
            <button onclick="document.getElementById('modalAddProduct').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 font-bold">&times;</button>
        </div>

        <form action="{{ route('stock.store') }}" method="POST" class="space-y-3 text-xs">
            @csrf
            <div>
                <label class="font-bold text-gray-600 block mb-1">Nama Barang / Menu</label>
                <input type="text" name="name" required placeholder="Contoh: Paket Ayam Penyet" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Kode Barang</label>
                    <input type="text" name="code" required value="BRG-{{ rand(100, 999) }}" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Kategori</label>
                    <input type="text" name="category" required placeholder="Makanan, Minuman, Sembako" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Stok Awal</label>
                    <input type="number" name="stock" required value="10" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Satuan</label>
                    <input type="text" name="unit" required value="Porsi" placeholder="Porsi, Pcs, Kg" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Harga Modal (Rp)</label>
                    <input type="number" name="buy_price" required placeholder="10000" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Harga Jual (Rp)</label>
                    <input type="number" name="sell_price" required placeholder="18000" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#F4519A]">
                </div>
            </div>

            <button type="submit" class="w-full py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold rounded-xl shadow-md transition-all mt-3">
                Simpan Barang
            </button>
        </form>
    </div>
</div>
@endsection
