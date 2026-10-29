@extends('layouts.app')

@section('title', 'Pengaturan Profil Usaha')
@section('path', 'profil')

@section('content')
<div class="space-y-6 max-w-4xl">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Profil & Ganti Akun UMKM</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Atur data usaha dan beralih akun pembukuan dengan 1 klik</p>
        </div>
        <a href="{{ route('login') }}" class="px-4 py-2 bg-[#F4519A] text-white text-xs font-bold rounded-2xl shadow-sm self-start sm:self-auto transition-all active:scale-95">
            + Tambah / Masuk Akun Lain
        </a>
    </div>

    <!-- Account Switcher Box -->
    <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3">
        <h3 class="font-extrabold text-gray-900 text-sm">Akun UMKM Terdaftar di Sistem</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @foreach($allUsers as $u)
            <a href="{{ route('user.switch', $u->id) }}" class="p-3.5 rounded-2xl border flex justify-between items-center transition-all {{ $u->id === $user->id ? 'border-[#F4519A] bg-pink-50/50 shadow-xs' : 'border-gray-200 hover:border-pink-300' }}">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs {{ $u->id === $user->id ? 'bg-[#F4519A] text-white' : 'bg-gray-100 text-gray-600' }}">
                        {{ strtoupper(substr($u->name, 0, 2)) }}
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 text-xs">{{ $u->business_name }}</p>
                        <p class="text-[10px] text-gray-400">{{ $u->email }}</p>
                    </div>
                </div>
                @if($u->id === $user->id)
                    <span class="text-[10px] bg-[#F4519A] text-white font-bold px-2 py-0.5 rounded-full">Aktif</span>
                @else
                    <span class="text-[10px] text-gray-400 font-semibold">Pilih &rarr;</span>
                @endif
            </a>
            @endforeach
        </div>
    </div>

    <!-- Form Profil -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-5">
        <h3 class="font-extrabold text-gray-900 text-sm border-b pb-3 border-gray-100">Informasi Usaha & Pemilik</h3>

        <form action="{{ route('profile.update') }}" method="POST" class="space-y-4 text-xs">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Nama Pemilik Usaha</label>
                    <input type="text" name="name" value="{{ $user->name }}" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Nama Usaha / Toko</label>
                    <input type="text" name="business_name" value="{{ $user->business_name }}" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Nomor WhatsApp / HP</label>
                    <input type="text" name="phone" value="{{ $user->phone }}" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
                <div>
                    <label class="font-bold text-gray-600 block mb-1">Jenis / Sektor Usaha</label>
                    <input type="text" name="business_type" value="{{ $user->business_type }}" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold">
                </div>
                <div class="md:col-span-2">
                    <label class="font-bold text-gray-600 block mb-1">Saldo Awal Kas Pembukuan (Rp)</label>
                    <input type="number" name="initial_balance" value="{{ (int)$user->initial_balance }}" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
                </div>
                <div class="md:col-span-2">
                    <label class="font-bold text-gray-600 block mb-1">Alamat Usaha</label>
                    <textarea name="address" rows="2" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium">{{ $user->address }}</textarea>
                </div>
            </div>

            <button type="submit" class="px-6 py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold rounded-xl shadow-md transition-all">
                Simpan Profil Usaha
            </button>
        </form>
    </div>
</div>
@endsection
