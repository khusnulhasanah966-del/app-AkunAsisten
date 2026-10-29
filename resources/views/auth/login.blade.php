<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk - AkunAsisten</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#FFF0F6] min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-xl border border-pink-100 max-w-md w-full p-6 sm:p-8 space-y-6">
        <!-- Logo Baru Akun Asisten -->
        <div class="text-center space-y-2">
            <img src="/images/logo.png" alt="Akun Asisten" class="h-16 mx-auto object-contain">
            <h2 id="formTitle" class="text-xl font-black text-gray-900 mt-2">Masuk ke AkunAsisten</h2>
            <p class="text-xs text-gray-500">Aplikasi Pembukuan & Keuangan Digital UMKM</p>
        </div>

        @if($errors->any())
        <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold text-center">
            {{ $errors->first() }}
        </div>
        @endif

        <!-- Form Login -->
        <form id="loginForm" action="{{ route('login.post') }}" method="POST" class="space-y-4 text-xs">
            @csrf
            <div>
                <label class="font-bold text-gray-600 block mb-1">Email</label>
                <input type="email" name="email" value="busari.warung@gmail.com" required class="w-full p-3 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>

            <div>
                <label class="font-bold text-gray-600 block mb-1">Kata Sandi</label>
                <input type="password" name="password" value="password123" required class="w-full p-3 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>

            <button type="submit" class="w-full py-3.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-black text-sm rounded-2xl shadow-lg shadow-pink-500/25 transition-all">
                MASUK KE APLIKASI
            </button>
        </form>

        <!-- Form Register (Hidden by default) -->
        <form id="registerForm" action="{{ route('register') }}" method="POST" class="hidden space-y-3 text-xs">
            @csrf
            <div>
                <label class="font-bold text-gray-600 block mb-1">Nama Pemilik Usaha</label>
                <input type="text" name="name" placeholder="Nama Anda" required class="w-full p-2.5 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>
            <div>
                <label class="font-bold text-gray-600 block mb-1">Nama Usaha / Toko</label>
                <input type="text" name="business_name" placeholder="Contoh: Toko Berkah" required class="w-full p-2.5 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>
            <div>
                <label class="font-bold text-gray-600 block mb-1">Email</label>
                <input type="email" name="email" placeholder="email@toko.com" required class="w-full p-2.5 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>
            <div>
                <label class="font-bold text-gray-600 block mb-1">Kata Sandi</label>
                <input type="password" name="password" placeholder="Minimal 6 karakter" required class="w-full p-2.5 bg-pink-50/40 border border-pink-100 rounded-2xl font-semibold">
            </div>

            <button type="submit" class="w-full py-3.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-black text-sm rounded-2xl shadow-lg shadow-pink-500/25 transition-all mt-2">
                DAFTAR AKUN BARU
            </button>
        </form>

        <div class="text-center pt-1">
            <button type="button" onclick="toggleForm()" id="btnToggle" class="text-xs font-bold text-[#F4519A] hover:underline">
                Belum punya akun? Buat akun UMKM baru
            </button>
        </div>

        <!-- Quick Login Cards for Existing Accounts -->
        <div class="pt-4 border-t border-gray-100 space-y-2">
            <p class="text-[11px] font-bold text-gray-400 text-center uppercase tracking-wider">Pilih Akun yang Tersedia</p>
            <div class="space-y-1.5">
                @foreach($users as $u)
                <a href="{{ route('user.switch', $u->id) }}" class="flex items-center justify-between p-2.5 rounded-2xl border border-pink-100 hover:bg-pink-50/60 transition-colors">
                    <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-xl bg-pink-100 text-[#F4519A] flex items-center justify-center font-bold text-xs">
                            {{ strtoupper(substr($u->name, 0, 2)) }}
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-800">{{ $u->business_name }}</p>
                            <p class="text-[10px] text-gray-400">{{ $u->email }}</p>
                        </div>
                    </div>
                    <span class="text-[11px] font-bold text-[#F4519A]">Masuk &rarr;</span>
                </a>
                @endforeach
            </div>
        </div>
    </div>

    <script>
        let isRegister = false;
        function toggleForm() {
            isRegister = !isRegister;
            document.getElementById('loginForm').classList.toggle('hidden', isRegister);
            document.getElementById('registerForm').classList.toggle('hidden', !isRegister);
            document.getElementById('formTitle').innerText = isRegister ? 'Daftar Akun UMKM Baru' : 'Masuk ke AkunAsisten';
            document.getElementById('btnToggle').innerText = isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Buat akun UMKM baru';
        }
        lucide.createIcons();
    </script>
</body>
</html>
