import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Edit3,
  Trash2,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { Product } from '../../types';

export const StockView: React.FC = () => {
  const {
    products,
    stockMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Adjustment Modal
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'masuk' | 'keluar' | 'penyesuaian'>('masuk');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustNotes, setAdjustNotes] = useState<string>('');

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Bahan Pokok');
  const [formStock, setFormStock] = useState(10);
  const [formUnit, setFormUnit] = useState('Pcs');
  const [formBuyPrice, setFormBuyPrice] = useState(10000);
  const [formSellPrice, setFormSellPrice] = useState(15000);
  const [formMinStock, setFormMinStock] = useState(5);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Overall Inventory stats
  const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.buyPrice, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormCode('BRG-' + String(products.length + 1).padStart(3, '0'));
    setFormName('');
    setFormCategory('Bahan Pokok');
    setFormStock(10);
    setFormUnit('Pcs');
    setFormBuyPrice(10000);
    setFormSellPrice(15000);
    setFormMinStock(5);
    setShowAddModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormCode(p.code);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormStock(p.stock);
    setFormUnit(p.unit);
    setFormBuyPrice(p.buyPrice);
    setFormSellPrice(p.sellPrice);
    setFormMinStock(p.minStock);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        code: formCode,
        name: formName,
        category: formCategory,
        stock: formStock,
        unit: formUnit,
        buyPrice: formBuyPrice,
        sellPrice: formSellPrice,
        minStock: formMinStock,
      });
    } else {
      addProduct({
        code: formCode,
        name: formName,
        category: formCategory,
        stock: formStock,
        unit: formUnit,
        buyPrice: formBuyPrice,
        sellPrice: formSellPrice,
        minStock: formMinStock,
      });
    }
    setShowAddModal(false);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;
    adjustStock(adjustTarget.id, adjustType, Number(adjustQty), adjustNotes || 'Penyesuaian stok');
    setAdjustTarget(null);
    setAdjustQty(1);
    setAdjustNotes('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Stok & Persediaan Barang
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Kontrol inventaris usaha, atur stok minimum, dan lacak mutasi barang
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto transform active:scale-95"
        >
          <Plus size={16} />
          <span>Tambah Barang Baru</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Jenis Barang</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{products.length} SKU</h3>
            <p className="text-xs text-gray-400 mt-0.5">{totalItems} unit item fisik</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#F4519A] flex items-center justify-center">
            <Package size={22} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai Total Persediaan</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{formatRupiah(totalInventoryValue)}</h3>
            <p className="text-xs text-[#F4519A] font-semibold mt-0.5">Berdasarkan harga modal beli</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#F4519A] flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Peringatan Stok Menipis</span>
            <h3 className={`text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {lowStockCount} Barang
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Mendekati / di bawah stok minimal</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode barang atau nama barang..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2.5 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF0F6]/50 border-b border-pink-100 text-[11px] font-bold uppercase text-gray-500">
                <th className="py-3.5 px-4">Kode</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-right">Harga Beli</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-right">Nilai Persediaan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredProducts.map((prod) => {
                const isLow = prod.stock <= prod.minStock;
                const invVal = prod.stock * prod.buyPrice;
                return (
                  <tr key={prod.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-500 whitespace-nowrap">
                      {prod.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {prod.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[10px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-xl ${isLow ? 'bg-red-50 text-red-600' : 'bg-pink-50 text-[#F4519A]'}`}>
                        {prod.stock} {prod.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 whitespace-nowrap">
                      {formatRupiah(prod.buyPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                      {formatRupiah(prod.sellPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#F4519A] whitespace-nowrap">
                      {formatRupiah(invVal)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle size={11} />
                          Menipis (min {prod.minStock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Aman
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setAdjustTarget(prod)}
                          title="Mutasi Stok (+ / -)"
                          className="px-2 py-1 rounded-lg bg-pink-100 text-[#F4519A] hover:bg-pink-200 font-bold text-[11px] transition-colors"
                        >
                          Atur Stok
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit barang"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#F4519A] hover:bg-pink-50"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus ${prod.name}?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          title="Hapus barang"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400">
                    Belum ada barang terdaftar. Klik <b>"Tambah Barang Baru"</b> untuk mulai mencatat stok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riwayat Mutasi Stok Terbaru */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <History size={18} className="text-[#F4519A]" />
          <h2 className="text-base font-bold text-gray-900">
            Riwayat Perubahan Stok (Audit Trail)
          </h2>
        </div>
        <div className="divide-y divide-gray-100 text-xs">
          {stockMovements.slice(0, 5).map((sm) => {
            const prod = products.find((p) => p.id === sm.productId);
            return (
              <div key={sm.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-xl ${sm.type === 'masuk' ? 'bg-emerald-50 text-emerald-600' :
                      sm.type === 'keluar' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {sm.type === 'masuk' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">
                      {prod?.name || 'Produk'} ({sm.type === 'masuk' ? '+' : '-'}{sm.quantity} {prod?.unit || 'unit'})
                    </p>
                    <p className="text-[11px] text-gray-400">{sm.notes}</p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {formatDateIndo(sm.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Ubah Informasi Barang' : 'Tambah Barang Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Kode Barang</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Nama Barang</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Beras Pandan Wangi 25kg"
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Jumlah Stok</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Kg, Pcs, Karung, Liter"
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Harga Beli / Modal (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formBuyPrice}
                    onChange={(e) => setFormBuyPrice(Number(e.target.value))}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formSellPrice}
                    onChange={(e) => setFormSellPrice(Number(e.target.value))}
                    className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Batas Minimum Stok (Peringatan)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formMinStock}
                  onChange={(e) => setFormMinStock(Number(e.target.value))}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold rounded-xl shadow-md transition-colors mt-2"
              >
                {editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adjust Stock */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-gray-900">
                Atur Stok: {adjustTarget.name}
              </h3>
              <button onClick={() => setAdjustTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Stok saat ini: <b className="text-gray-900">{adjustTarget.stock} {adjustTarget.unit}</b>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Jenis Mutasi</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAdjustType('masuk')}
                    className={`py-2 rounded-xl font-bold ${adjustType === 'masuk' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    + Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('keluar')}
                    className={`py-2 rounded-xl font-bold ${adjustType === 'keluar' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    - Keluar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('penyesuaian')}
                    className={`py-2 rounded-xl font-bold ${adjustType === 'penyesuaian' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Opname
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  {adjustType === 'penyesuaian' ? 'Jumlah Stok Fisik Riil' : 'Jumlah Perubahan'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Keterangan / Alasan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Restock dari pasar, barang rusak, stok opname"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full bg-[#FFF0F6] border border-pink-100 rounded-xl px-3 py-2 text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold rounded-xl shadow-md transition-colors mt-2"
              >
                Konfirmasi Perubahan Stok
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

