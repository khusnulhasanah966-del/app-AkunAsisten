@extends('layouts.app')

@section('title', 'Utang-Piutang')
@section('path', 'utang_piutang')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Catatan Utang & Piutang</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Kelola kewajiban bayar ke supplier dan tagihan ke pelanggan</p>
        </div>
        <button onclick="document.getElementById('modalAddDebt').classList.remove('hidden')" class="px-4 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Catat Utang / Piutang</span>
        </button>
    </div>

    <!-- Table Utang Piutang -->
    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="bg-pink-50/50 text-gray-500 font-bold border-b border-pink-100 text-[11px] uppercase">
                        <th class="p-3.5">Pihak / Nama</th>
                        <th class="p-3.5">Tipe</th>
                        <th class="p-3.5">Tgl Transaksi</th>
                        <th class="p-3.5">Jatuh Tempo</th>
                        <th class="p-3.5 text-right">Nominal Awal</th>
                        <th class="p-3.5 text-right">Sisa Tagihan</th>
                        <th class="p-3.5 text-center">Status</th>
                        <th class="p-3.5 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($debts as $d)
                    @php $sisa = $d->initial_amount - $d->paid_amount; @endphp
                    <tr class="hover:bg-pink-50/20">
                        <td class="p-3.5">
                            <span class="font-bold text-gray-900 block">{{ $d->party_name }}</span>
                            @if($d->notes)
                            <span class="text-[10px] text-gray-400 block">{{ $d->notes }}</span>
                            @endif
                        </td>
                        <td class="p-3.5">
                            <span class="px-2 py-0.5 rounded-full font-bold text-[10px] {{ $d->type === 'piutang' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700' }}">
                                {{ $d->type === 'piutang' ? 'Piutang (Kita Tagih)' : 'Utang (Kita Bayar)' }}
                            </span>
                        </td>
                        <td class="p-3.5 text-gray-500">{{ $d->transaction_date }}</td>
                        <td class="p-3.5 text-gray-500">{{ $d->due_date ?? '-' }}</td>
                        <td class="p-3.5 text-right font-medium">Rp {{ number_format($d->initial_amount, 0, ',', '.') }}</td>
                        <td class="p-3.5 text-right font-black text-[#F4519A]">Rp {{ number_format($sisa, 0, ',', '.') }}</td>
                        <td class="p-3.5 text-center">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold {{ $d->status === 'lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700' }}">
                                {{ strtoupper($d->status) }}
                            </span>
                        </td>
                        <td class="p-3.5 text-center whitespace-nowrap">
                            <form action="{{ route('debts.destroy', $d->id) }}" method="POST" onsubmit="return confirm('Hapus catatan utang/piutang ini?');" class="inline">
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
                        <td colspan="8" class="p-8 text-center text-gray-400">Belum ada catatan utang atau piutang. Klik tombol di atas untuk menambah.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Tambah Utang Piutang -->
<div id="modalAddDebt" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 class="font-extrabold text-gray-900 text-sm">Catat Utang / Piutang Baru</h3>
            <button onclick="document.getElementById('modalAddDebt').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 font-bold">&times;</button>
        </div>

        <form action="{{ route('debts.store') }}" method="POST" class="space-y-3 text-xs">
            @csrf
            <div>
                <label class="font-bold text-gray-600 block mb-1">Jenis</label>
                <div class="grid grid-cols-2 gap-2 font-bold">
                    <label class="p-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer bg-emerald-50 text-emerald-700">
                        <input type="radio" name="type" value="piutang" checked> Piutang (Pelanggan)
                    </label>
                    <label class="p-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer bg-amber-50 text-amber-700">
                        <input type="radio" name="type" value="utang"> Utang (Supplier)
                    </label>
                </div>
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Nama Pihak / Toko / Pelanggan</label>
                <input type="text" name="party_name" required placeholder="Contoh: Pak RT / Agen Sembako Barokah" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Tgl Transaksi</label>
                    <input type="date" name="transaction_date" value="{{ date('Y-m-d') }}" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Jatuh Tempo</label>
                    <input type="date" name="due_date" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Nominal (Rp)</label>
                <input type="number" name="initial_amount" required placeholder="Nominal tagihan..." class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Catatan Keterangan</label>
                <input type="text" name="notes" placeholder="Keterangan singkat..." class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
            </div>

            <button type="submit" class="w-full py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold rounded-xl shadow-md transition-all mt-3">
                Simpan Catatan
            </button>
        </form>
    </div>
</div>
@endsection
