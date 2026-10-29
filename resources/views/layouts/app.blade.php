<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'AkunAsisten') - Akuntansi Digital UMKM</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#F4519A',
                        primaryHover: '#E03582',
                        primaryLight: '#FFF0F6',
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Chart.js for smooth responsive dashboard charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
</head>
<body class="bg-[#FDF8FA] text-gray-800 min-h-screen flex flex-col md:flex-row pb-16 md:pb-0">

    <!-- Sidebar Desktop: Solid #F4519A (persis seperti gambar) -->
    <aside class="fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F4519A] text-white hidden md:flex flex-col justify-between shadow-2xl">
        <div class="overflow-y-auto">
            <!-- Logo Card Putih (Persis seperti gambar kedua) -->
            <div class="p-4 border-b border-pink-400/30">
                <div class="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3">
                    <img src="/images/logo.png" alt="Akun Asisten" class="h-10 w-auto object-contain">
                    <div class="min-w-0">
                        <span class="font-black text-gray-900 tracking-tight text-sm block leading-tight">AKUN ASISTEN</span>
                        <span class="text-[9px] text-[#F4519A] font-extrabold tracking-wider block">AKUNTANSI DIGITAL UMKM</span>
                    </div>
                </div>
            </div>

            <!-- Navigation Menu Items -->
            <nav class="p-3.5 space-y-1.5 text-xs font-bold">
                <!-- Dashboard -->
                <a href="{{ route('dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('dashboard') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('dashboard') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="layout-grid" class="w-4 h-4"></i>
                    <span class="text-xs">Dashboard</span>
                </a>

                <!-- Kasir POS (Cepat) -->
                <a href="{{ route('cashier') }}" class="flex items-center justify-between px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('cashier') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <div class="flex items-center gap-3">
                        <span class="w-2 h-2 rounded-full {{ request()->routeIs('cashier') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                        <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                        <span class="text-xs">Kasir POS (Cepat)</span>
                    </div>
                    <span class="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md font-black {{ request()->routeIs('cashier') ? 'bg-pink-100 text-[#F4519A]' : 'text-white' }}">BARU</span>
                </a>

                <!-- Transaksi -->
                <a href="{{ route('transactions') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('transactions') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('transactions') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="receipt" class="w-4 h-4"></i>
                    <span class="text-xs">Transaksi</span>
                </a>

                <!-- Stok Barang -->
                <a href="{{ route('stock') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('stock') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('stock') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="package" class="w-4 h-4"></i>
                    <span class="text-xs">Stok Barang</span>
                </a>

                <!-- Utang-Piutang -->
                <a href="{{ route('debts') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('debts') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('debts') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="scale" class="w-4 h-4"></i>
                    <span class="text-xs">Utang-Piutang</span>
                </a>

                <!-- Laporan -->
                <a href="{{ route('reports') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('reports') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('reports') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="file-text" class="w-4 h-4"></i>
                    <span class="text-xs">Laporan</span>
                </a>

                <!-- Pelatihan -->
                <a href="{{ route('training') }}" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all {{ request()->routeIs('training') ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]' : 'text-white/90 hover:bg-white/15' }}">
                    <span class="w-2 h-2 rounded-full {{ request()->routeIs('training') ? 'bg-[#F4519A]' : 'bg-transparent' }}"></span>
                    <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                    <span class="text-xs">Pelatihan</span>
                </a>
            </nav>
        </div>

        <!-- Bottom Section (Persis seperti gambar kedua) -->
        <div class="p-3.5 space-y-2.5">
            <!-- User Pill Card -->
            <a href="{{ route('profile') }}" class="flex items-center justify-between p-2.5 rounded-2xl bg-pink-600/70 hover:bg-pink-600 transition-colors text-white">
                <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs text-white border border-white/30 shrink-0">
                        {{ strtoupper(substr($user->name ?? 'BU', 0, 2)) }}
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-bold truncate">{{ $user->business_name ?? 'Warung Makan Bu Sari' }}</p>
                        <p class="text-[10px] text-pink-100 truncate">{{ $user->name ?? 'Bu Sari' }}</p>
                    </div>
                </div>
                <i data-lucide="user" class="w-4 h-4 text-white/80 shrink-0"></i>
            </a>

            <!-- Bantuan Pendamping Button -->
            <button onclick="document.getElementById('modalHelp').classList.remove('hidden')" class="w-full py-2 px-3 bg-white text-[#F4519A] hover:bg-pink-50 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all">
                <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
                <span>Bantuan Pendamping</span>
            </button>

            <!-- Footer: Reset Data Bu Sari & Keluar -->
            <div class="flex items-center justify-between px-1 text-[11px] text-white/80 pt-1">
                <a href="{{ route('reset.demo') }}" onclick="return confirm('Reset semua data kembali ke default Warung Bu Sari?')" class="flex items-center gap-1 hover:text-white transition-colors">
                    <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
                    <span>Reset Data Bu Sari</span>
                </a>
                <form action="{{ route('logout') }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="flex items-center gap-1 hover:text-white transition-colors">
                        <i data-lucide="log-out" class="w-3 h-3"></i>
                        <span>Keluar</span>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 md:pl-64 flex flex-col min-h-screen">
        <!-- Prototype Browser Window Top Bar Decoration (Persis seperti screenshot!) -->
        <header class="bg-white border-b border-pink-100/70 px-8 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span class="ml-4 font-mono text-[11px] text-gray-400 bg-pink-50/50 px-3 py-1 rounded-full border border-pink-100">
                    app.akunasisten.id/@yield('path', 'dashboard')
                </span>
            </div>

            <div class="flex items-center gap-3 text-xs text-gray-500">
                <span class="text-[11px]">
                    Halo, <b>{{ $user->name ?? 'Bu Sari' }}</b> ({{ $user->business_name ?? 'Warung Makan Bu Sari' }})
                </span>
                <span class="w-2 h-2 rounded-full bg-emerald-500" title="Online"></span>
                <form action="{{ route('logout') }}" method="POST" class="inline ml-2">
                    @csrf
                    <button type="submit" class="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition-colors">
                        <i data-lucide="log-out" class="w-3 h-3"></i>
                        <span>Keluar</span>
                    </button>
                </form>
            </div>
        </header>

        <!-- Flash Success Notification -->
        @if(session('success'))
            <div class="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            @yield('content')
        </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-30 px-3 py-2 flex items-center justify-around shadow-lg">
        <a href="{{ route('dashboard') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('dashboard') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="layout-grid" class="w-5 h-5"></i>
            <span>Dashboard</span>
        </a>
        <a href="{{ route('cashier') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('cashier') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            <span>Kasir</span>
        </a>
        <a href="{{ route('transactions') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('transactions') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="receipt" class="w-5 h-5"></i>
            <span>Transaksi</span>
        </a>
        <a href="{{ route('stock') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('stock') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="package" class="w-5 h-5"></i>
            <span>Stok</span>
        </a>
        <a href="{{ route('reports') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('reports') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="file-text" class="w-5 h-5"></i>
            <span>Laporan</span>
        </a>
        <a href="{{ route('profile') }}" class="flex flex-col items-center text-[10px] font-semibold {{ request()->routeIs('profile') ? 'text-[#F4519A]' : 'text-gray-400' }}">
            <i data-lucide="user" class="w-5 h-5"></i>
            <span>Profil</span>
        </a>
    </nav>

    <!-- Modal Bantuan Pendamping (Bisa Hubungi & Ubah Nomor WhatsApp Anda) -->
    @php
        $whatsappNumber = $user->phone ?? '081234567890';
        // Clean format for WhatsApp link (e.g. convert 08xx to 628xx)
        $cleanWa = preg_replace('/[^0-9]/', '', $whatsappNumber);
        if (str_starts_with($cleanWa, '0')) {
            $cleanWa = '62' . substr($cleanWa, 1);
        }
    @endphp
    <div id="modalHelp" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-pink-100 text-[#F4519A] flex items-center justify-center mx-auto">
                <i data-lucide="phone-call" class="w-7 h-7"></i>
            </div>
            <h3 class="text-lg font-extrabold text-gray-900">Konsultasi Pendamping UMKM</h3>
            <p class="text-xs text-gray-500">Tim fasilitator AkunAsisten siap membantu Anda merapikan pembukuan, stok, dan laporan keuangan usaha.</p>
            
            <a href="https://wa.me/{{ $cleanWa }}?text=Halo%20AkunAsisten,%20saya%20butuh%20pendampingan%20pembukuan%20usaha" target="_blank" class="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors">
                Chat WhatsApp Pendamping: {{ $whatsappNumber }} &rarr;
            </a>

            <!-- Form Ubah Nomor WhatsApp Langsung di Modal -->
            <div class="pt-3 border-t border-gray-100 text-left">
                <button type="button" onclick="document.getElementById('editWaDiv').classList.toggle('hidden')" class="text-[11px] font-bold text-[#F4519A] hover:underline flex items-center gap-1 mx-auto">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    <span>Ingin ganti ke nomor WhatsApp Anda sendiri? Klik di sini</span>
                </button>

                <div id="editWaDiv" class="hidden mt-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
                    <form action="{{ route('support.phone.update') }}" method="POST">
                        @csrf
                        <label class="block text-[10px] font-bold text-gray-600 uppercase">Masukkan Nomor WhatsApp Anda</label>
                        <div class="flex gap-2 mt-1">
                            <input type="text" name="phone" value="{{ $whatsappNumber }}" placeholder="08xxxxxxxxxx" required class="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800">
                            <button type="submit" class="px-3 py-2 bg-[#F4519A] text-white text-xs font-bold rounded-xl shadow-xs">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <button onclick="document.getElementById('modalHelp').classList.add('hidden')" class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                Tutup
            </button>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
    @stack('scripts')
</body>
</html>
