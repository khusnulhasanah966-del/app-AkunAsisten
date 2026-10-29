@extends('layouts.app')

@section('title', 'Pelatihan Literasi Keuangan')
@section('path', 'pelatihan')

@section('content')
<div class="space-y-6">
    <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Pelatihan & Literasi Keuangan UMKM</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Materi ringkas dan panduan praktis pengelolaan keuangan usaha sehari-hari</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Modul 1 -->
        <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3">
            <span class="p-2 rounded-xl bg-pink-50 text-[#F4519A] inline-block font-black text-xs">Modul 1</span>
            <h3 class="font-extrabold text-gray-900 text-sm">Memisahkan Uang Pribadi & Kas Usaha</h3>
            <p class="text-xs text-gray-500">Kunci utama agar keuangan warung tidak boncos adalah jangan mencampur uang belanja dapur rumah dengan uang kas penjualan.</p>
            <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span class="text-emerald-600 font-bold flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Selesai Dibaca
                </span>
                <span class="text-gray-400">5 Menit</span>
            </div>
        </div>

        <!-- Modul 2 -->
        <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3">
            <span class="p-2 rounded-xl bg-pink-50 text-[#F4519A] inline-block font-black text-xs">Modul 2</span>
            <h3 class="font-extrabold text-gray-900 text-sm">Cara Menentukan Harga Jual (HPP & Margin)</h3>
            <p class="text-xs text-gray-500">Hitung seluruh modal bahan baku, kemasan, gas, dan tenaga kerja sebelum menetapkan harga menu agar selalu menguntungkan.</p>
            <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span class="text-emerald-600 font-bold flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Selesai Dibaca
                </span>
                <span class="text-gray-400">7 Menit</span>
            </div>
        </div>

        <!-- Modul 3 -->
        <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3">
            <span class="p-2 rounded-xl bg-pink-50 text-[#F4519A] inline-block font-black text-xs">Modul 3</span>
            <h3 class="font-extrabold text-gray-900 text-sm">Strategi Mengelola Utang & Piutang Pelanggan</h3>
            <p class="text-xs text-gray-500">Batasi batas nominal dan tanggal jatuh tempo bon makan pelanggan agar perputaran modal beli bahan tidak terganggu.</p>
            <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span class="text-gray-400 font-bold flex items-center gap-1">
                    <i data-lucide="clock" class="w-3.5 h-3.5"></i> Belum Selesai
                </span>
                <span class="text-gray-400">6 Menit</span>
            </div>
        </div>
    </div>
</div>
@endsection

