import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  QrCode, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  Receipt,
  Search,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { QRCodeSVG } from '../common/QRCodeSVG';
import { Product } from '../../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface PosCashierViewProps {
  onShowReceipt: (tx: any) => void;
}

export const PosCashierView: React.FC<PosCashierViewProps> = ({ onShowReceipt }) => {
  const { products, addTransaction, adjustStock, user } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer Bank'>('Tunai');
  const [cashGivenStr, setCashGivenStr] = useState<string>('');
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [completedTx, setCompletedTx] = useState<any | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  // Cart calculations
  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.sellPrice * item.quantity, 0);
  }, [cart]);

  const cashGiven = parseFloat(cashGivenStr.replace(/\D/g, '')) || 0;
  const changeAmount = Math.max(0, cashGiven - totalAmount);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja masih kosong!');
      return;
    }

    if (paymentMethod === 'Tunai' && cashGiven < totalAmount) {
      alert('Nominal uang tunai yang diterima kurang dari total belanja.');
      return;
    }

    // Build description from cart items
    const itemSummary = cart
      .map((item) => `${item.product.name} (${item.quantity}x)`)
      .join(', ');

    // Add transaction to AppContext
    const created = addTransaction({
      date: new Date().toISOString().slice(0, 10),
      type: 'pemasukan',
      amount: totalAmount,
      category: 'Penjualan Kasir (POS)',
      description: `Penjualan Kasir: ${itemSummary.slice(0, 80)}${itemSummary.length > 80 ? '...' : ''}`,
      paymentMethod,
      notes: `Detail items: ${itemSummary}. Bayar: ${paymentMethod} ${paymentMethod === 'Tunai' ? `(Kembalian: ${formatRupiah(changeAmount)})` : ''}`,
    });

    // Auto deduct stock for each product
    cart.forEach((item) => {
      adjustStock(
        item.product.id,
        'keluar',
        item.quantity,
        `Penjualan POS Ref #${created.id.slice(-6)}`
      );
    });

    setCompletedTx(created);
    setCart([]);
    setCashGivenStr('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-pink-100 text-[#F4519A] rounded-xl">
              <ShoppingCart size={20} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Kasir Penjualan Cepat (POS)
            </h1>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Pilih produk, hitung belanja otomatis, dukung QRIS dan cetak struk seketika
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama menu / barang..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addToCart(prod)}
                className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-xs hover:border-[#F4519A] hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#F4519A] bg-pink-50 px-2 py-0.5 rounded-md">
                    {prod.category}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 mt-1.5 group-hover:text-[#F4519A] transition-colors line-clamp-2">
                    {prod.name}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900">
                    {formatRupiah(prod.sellPrice)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Sisa: <b className={prod.stock <= prod.minStock ? 'text-amber-600' : 'text-gray-700'}>{prod.stock}</b>
                  </span>
                </div>
              </button>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-pink-100">
                Belum ada produk yang cocok. Tambah produk di menu Stok Barang.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart & Checkout Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-md space-y-4 sticky top-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <span>Keranjang Pesanan</span>
                <span className="px-2 py-0.5 bg-[#FFF0F6] text-[#F4519A] rounded-full text-xs font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)} item
                </span>
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] text-gray-400 hover:text-red-600 font-semibold"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-gray-400 font-semibold">
                      {formatRupiah(item.product.sellPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-extrabold text-xs w-5 text-center text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-300 hover:text-red-500 ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-xs">
                  Pilih barang di sebelah kiri untuk menambah ke kasir.
                </div>
              )}
            </div>

            {/* Total Ringkasan */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-sm font-black text-gray-900">
                <span>Total Tagihan:</span>
                <span className="text-[#F4519A] text-lg font-black">{formatRupiah(totalAmount)}</span>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tunai')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                      paymentMethod === 'Tunai'
                        ? 'border-[#F4519A] bg-pink-50 text-[#F4519A]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Banknote size={16} />
                    <span>Tunai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('QRIS');
                      setShowQrisModal(true);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'border-[#F4519A] bg-pink-50 text-[#F4519A]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode size={16} />
                    <span>QRIS Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transfer Bank')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                      paymentMethod === 'Transfer Bank'
                        ? 'border-[#F4519A] bg-pink-50 text-[#F4519A]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>Transfer</span>
                  </button>
                </div>
              </div>

              {/* Cash Input if Tunai */}
              {paymentMethod === 'Tunai' && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
                    <span>Uang Diterima:</span>
                    <span>Kembalian: <b className="text-emerald-600">{formatRupiah(changeAmount)}</b></span>
                  </div>
                  <input
                    type="text"
                    placeholder="Rp 0"
                    value={cashGivenStr ? new Intl.NumberFormat('id-ID').format(Number(cashGivenStr)) : ''}
                    onChange={(e) => setCashGivenStr(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                  {/* Quick cash shortcuts */}
                  <div className="flex gap-1.5 pt-1">
                    {[totalAmount, 20000, 50000, 100000].filter((v) => v > 0).map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCashGivenStr(String(val))}
                        className="py-1 px-2 bg-pink-50 hover:bg-pink-100 text-[#F4519A] rounded-lg text-[10px] font-bold"
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-2xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                cart.length > 0
                  ? 'bg-[#F4519A] hover:bg-[#E03582] shadow-pink-500/25 active:scale-98'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span>PROSES PEMBAYARAN</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">QRIS Pembayaran Digital</h3>
            <p className="text-[11px] text-gray-500">
              Pelanggan dapat memindai QRIS ini melalui GoPay, OVO, Dana, BCA, Mandiri, BRI, dll.
            </p>

            <div className="flex justify-center py-2">
              <QRCodeSVG
                value={`00020101021226${user?.phone || '081234567890'}5405${totalAmount}5802ID59${user?.businessName || 'AkunAsisten'}6007BANDUNG`}
                size={180}
                className="border-2 border-pink-200"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-pink-50 text-xs font-black text-[#F4519A]">
              Nominal: {formatRupiah(totalAmount)}
            </div>

            <button
              onClick={() => setShowQrisModal(false)}
              className="w-full py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Selesai Scan / Tutup
            </button>
          </div>
        </div>
      )}

      {/* Transaction Complete Success Prompt */}
      {completedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in zoom-in-95">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-pink-100 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              Transaksi Kasir Berhasil Dicatat!
            </h3>
            <p className="text-xs text-gray-500">
              Uang kas bertambah <b>{formatRupiah(completedTx.amount)}</b> dan stok barang telah dipotong otomatis.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onShowReceipt(completedTx);
                  setCompletedTx(null);
                }}
                className="w-full py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Receipt size={15} />
                <span>Lihat & Cetak Struk</span>
              </button>
              <button
                onClick={() => setCompletedTx(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

