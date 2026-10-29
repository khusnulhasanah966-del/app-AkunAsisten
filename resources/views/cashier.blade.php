@extends('layouts.app')

@section('title', 'Kasir POS Cepat')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Kasir Penjualan Cepat (POS)</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Pilih produk, hitung total belanja, metode QRIS/Tunai, dan cetak struk nota instan</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Katalog Barang -->
        <div class="lg:col-span-7 space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @forelse($products as $p)
                <button type="button" onclick="addToCart({{ $p->id }}, '{{ addslashes($p->name) }}', {{ $p->sell_price }})"
                    class="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs hover:border-[#F4519A] hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-95">
                    <div>
                        <span class="text-[10px] font-bold text-[#F4519A] bg-pink-50 px-2 py-0.5 rounded">{{ $p->category }}</span>
                        <h4 class="text-xs font-bold text-gray-800 mt-2 line-clamp-2">{{ $p->name }}</h4>
                    </div>
                    <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span class="text-xs font-black text-gray-900">Rp {{ number_format($p->sell_price, 0, ',', '.') }}</span>
                        <span class="text-[10px] text-gray-400">Stok: <b>{{ $p->stock }}</b></span>
                    </div>
                </button>
                @empty
                <div class="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-pink-100">
                    Belum ada menu produk. Tambahkan di menu Stok Barang.
                </div>
                @endforelse
            </div>
        </div>

        <!-- Keranjang & Checkout -->
        <div class="lg:col-span-5">
            <div class="bg-white rounded-3xl p-5 border border-pink-100 shadow-md space-y-4 sticky top-16">
                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                    <h3 class="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                        <i data-lucide="shopping-cart" class="w-4 h-4 text-[#F4519A]"></i>
                        <span>Keranjang Belanja</span>
                    </h3>
                    <button type="button" onclick="clearCart()" class="text-[11px] text-gray-400 hover:text-rose-500 font-semibold">Kosongkan</button>
                </div>

                <!-- List Items -->
                <div id="cartItemsList" class="space-y-2 max-h-56 overflow-y-auto text-xs">
                    <p id="emptyCartText" class="text-gray-400 text-center py-6">Keranjang masih kosong.</p>
                </div>

                <!-- Total & Metode Bayar -->
                <div class="pt-3 border-t border-gray-100 space-y-3 text-xs">
                    <div class="flex justify-between items-center text-sm font-black text-gray-900">
                        <span>Total Tagihan:</span>
                        <span id="totalDisplay" class="text-base text-[#F4519A] font-black">Rp 0</span>
                    </div>

                    <div>
                        <label class="font-bold text-gray-500 block mb-1">Metode Pembayaran</label>
                        <div class="grid grid-cols-3 gap-2 text-[11px] font-bold">
                            <button type="button" onclick="setMethod('Tunai')" id="btnTunai" class="p-2 rounded-xl border border-[#F4519A] bg-pink-50 text-[#F4519A] text-center">Tunai</button>
                            <button type="button" onclick="setMethod('QRIS')" id="btnQRIS" class="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-center">QRIS</button>
                            <button type="button" onclick="setMethod('Transfer Bank')" id="btnTransfer" class="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-center">Transfer</button>
                        </div>
                    </div>

                    <div id="cashInputDiv" class="space-y-1">
                        <div class="flex justify-between font-semibold text-gray-600">
                            <span>Uang Diterima:</span>
                            <span>Kembalian: <b id="changeDisplay" class="text-emerald-600">Rp 0</b></span>
                        </div>
                        <input type="number" id="cashGiven" oninput="calculateChange()" placeholder="Rp 0" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                    </div>

                    <button type="button" onclick="processCheckout()" class="w-full py-3.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold rounded-2xl shadow-lg shadow-pink-500/25 transition-all active:scale-98">
                        PROSES TRANSAKSI & CETAK STRUK
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal Struk Hasil Checkout -->
<div id="receiptModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 text-center space-y-4">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <i data-lucide="check-circle" class="w-6 h-6"></i>
        </div>
        <h3 class="font-extrabold text-gray-900 text-base">Pembayaran Berhasil!</h3>
        
        <!-- Printable Paper -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 font-mono text-xs text-left text-gray-800 space-y-2">
            <div class="text-center pb-2 border-b border-dashed border-gray-300">
                <p class="font-black uppercase text-sm">{{ $user->business_name }}</p>
                <p class="text-[10px] text-gray-500">{{ $user->address ?? 'Bandung' }}</p>
            </div>
            <div class="space-y-1 text-[11px] py-1 border-b border-dashed border-gray-300" id="receiptItems"></div>
            <div class="flex justify-between font-black text-sm pt-1">
                <span>TOTAL:</span>
                <span id="receiptTotal" class="text-[#F4519A]"></span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
            <button onclick="window.print()" class="py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl">Cetak Printer</button>
            <button onclick="document.getElementById('receiptModal').classList.add('hidden')" class="py-2.5 bg-[#F4519A] text-white font-bold text-xs rounded-xl">Transaksi Baru</button>
        </div>
    </div>
</div>

@push('scripts')
<script>
    let cart = [];
    let paymentMethod = 'Tunai';

    function addToCart(id, name, price) {
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }
        renderCart();
    }

    function updateQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        }
        renderCart();
    }

    function clearCart() {
        cart = [];
        renderCart();
    }

    function setMethod(method) {
        paymentMethod = method;
        ['Tunai', 'QRIS', 'Transfer Bank'].forEach(m => {
            const btn = document.getElementById('btn' + (m === 'Transfer Bank' ? 'Transfer' : m));
            if (m === method) {
                btn.className = "p-2 rounded-xl border border-[#F4519A] bg-pink-50 text-[#F4519A] text-center font-bold";
            } else {
                btn.className = "p-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-center font-bold";
            }
        });
        document.getElementById('cashInputDiv').style.display = method === 'Tunai' ? 'block' : 'none';
    }

    function calculateChange() {
        const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
        const given = parseFloat(document.getElementById('cashGiven').value) || 0;
        const change = Math.max(0, given - total);
        document.getElementById('changeDisplay').innerText = 'Rp ' + change.toLocaleString('id-ID');
    }

    function renderCart() {
        const list = document.getElementById('cartItemsList');
        const emptyText = document.getElementById('emptyCartText');
        const totalDisplay = document.getElementById('totalDisplay');

        if (cart.length === 0) {
            list.innerHTML = '<p class="text-gray-400 text-center py-6">Keranjang masih kosong.</p>';
            totalDisplay.innerText = 'Rp 0';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach(item => {
            const sub = item.price * item.qty;
            total += sub;
            html += `
                <div class="flex justify-between items-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                        <p class="font-bold text-gray-800">${item.name}</p>
                        <p class="text-[10px] text-gray-400">Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button onclick="updateQty(${item.id}, -1)" class="w-5 h-5 bg-white border rounded text-center font-bold leading-none">-</button>
                        <span class="font-black px-1">${item.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)" class="w-5 h-5 bg-white border rounded text-center font-bold leading-none">+</button>
                    </div>
                </div>
            `;
        });

        list.innerHTML = html;
        totalDisplay.innerText = 'Rp ' + total.toLocaleString('id-ID');
        calculateChange();
    }

    function processCheckout() {
        if (cart.length === 0) {
            alert('Pilih minimal 1 menu barang!');
            return;
        }

        const cashGiven = parseFloat(document.getElementById('cashGiven').value) || 0;

        fetch('{{ route("cashier.checkout") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({
                items: cart,
                payment_method: paymentMethod,
                cash_given: cashGiven
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Tampilkan Modal Struk
                let itemsHtml = '';
                cart.forEach(i => {
                    itemsHtml += `<div class="flex justify-between"><span>${i.name} (${i.qty}x)</span><span>Rp ${(i.price*i.qty).toLocaleString('id-ID')}</span></div>`;
                });
                document.getElementById('receiptItems').innerHTML = itemsHtml;
                document.getElementById('receiptTotal').innerText = 'Rp ' + data.total.toLocaleString('id-ID');
                document.getElementById('receiptModal').classList.remove('hidden');

                clearCart();
                document.getElementById('cashGiven').value = '';
            } else {
                alert(data.message || 'Gagal memproses transaksi.');
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan saat memproses data.');
        });
    }
</script>
@endpush
@endsection

