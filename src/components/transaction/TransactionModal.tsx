import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editData = null,
}) => {
  const { addTransaction, updateTransaction, user } = useApp();

  const [type, setType] = useState<TransactionType>(editData?.type || 'pemasukan');
  const [amountStr, setAmountStr] = useState<string>(
    editData ? String(editData.amount) : '1250000'
  );
  const [category, setCategory] = useState<string>(editData?.category || 'Penjualan');
  const [description, setDescription] = useState<string>(editData?.description || 'Penjualan harian');
  const [date, setDate] = useState<string>(
    editData?.date || new Date().toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    editData?.paymentMethod || 'Tunai'
  );
  const [notes, setNotes] = useState<string>(
    editData?.notes || 'Omzet warung hari ini'
  );
  const [receiptImage, setReceiptImage] = useState<string>(editData?.receiptImage || '');
  const [successToast, setSuccessToast] = useState(false);

  // Suggested categories based on type
  const incomeCategories = ['Penjualan', 'Pendapatan Jasa', 'Penerimaan Piutang', 'Pemasukan Lainnya'];
  const expenseCategories = ['Bahan Baku', 'Gaji', 'Operasional', 'Transportasi', 'Sewa', 'Listrik', 'Pembayaran Utang', 'Pengeluaran Lainnya'];

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amountStr.replace(/[^0-9]/g, '')) || 0;
    if (cleanAmount <= 0) {
      alert('Harap masukkan nominal transaksi yang valid (lebih besar dari 0).');
      return;
    }

    if (editData) {
      updateTransaction(editData.id, {
        date,
        type,
        amount: cleanAmount,
        category,
        description,
        paymentMethod,
        notes,
        receiptImage,
      });
    } else {
      addTransaction({
        date,
        type,
        amount: cleanAmount,
        category,
        description,
        paymentMethod,
        notes,
        receiptImage,
      });
    }

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 700);
  };

  // Format display in Rupiah input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmountStr(val);
  };

  const formattedAmountDisplay = amountStr
    ? new Intl.NumberFormat('id-ID').format(Number(amountStr))
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      {/* Mobile container resembling the prototype phone frame */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-auto">
        {/* Prototype Header with Greeting */}
        <div className="bg-[#F4519A] text-white p-5 pb-6 rounded-b-[2rem] relative shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-between pr-8">
            <div>
              <p className="text-xs text-pink-100 font-medium">
                Halo, {user?.name || 'Bu Sari'}!
              </p>
              <h2 className="text-2xl font-bold tracking-tight">
                {editData ? 'Ubah Transaksi' : 'Catat Transaksi'}
              </h2>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              +
            </div>
          </div>

          {/* Toggle Type Buttons (Pemasukan / Pengeluaran) matching prototype */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-white/20 p-1.5 rounded-2xl backdrop-blur-xs">
            <button
              type="button"
              onClick={() => {
                setType('pemasukan');
                if (!editData) setCategory('Penjualan');
              }}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'pemasukan'
                  ? 'bg-white text-[#F4519A] shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => {
                setType('pengeluaran');
                if (!editData) setCategory('Bahan Baku');
              }}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'pengeluaran'
                  ? 'bg-white text-[#F4519A] shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        {/* Form Body matching prototype pinkish input styles */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nominal Field with Rp inside */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nominal
            </label>
            <div className="relative rounded-2xl bg-[#FFF0F6] border border-pink-100 focus-within:border-[#F4519A] focus-within:ring-2 focus-within:ring-pink-200 transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-[#1F2937] text-base">
                Rp
              </span>
              <input
                type="text"
                value={formattedAmountDisplay}
                onChange={handleAmountChange}
                placeholder="0"
                required
                className="w-full bg-transparent pl-12 pr-4 py-3.5 text-base font-extrabold text-gray-900 rounded-2xl focus:outline-none"
              />
            </div>
          </div>

          {/* Tanggal & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#FFF0F6] border border-pink-100 rounded-2xl px-3 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Metode Bayar
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-[#FFF0F6] border border-pink-100 rounded-2xl px-3 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Kategori
            </label>
            <div className="relative">
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Misal: Penjualan harian, Bahan Baku"
                className="w-full bg-[#FFF0F6] border border-pink-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
              <datalist id="category-suggestions">
                {(type === 'pemasukan' ? incomeCategories : expenseCategories).map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Keterangan Transaksi
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Contoh: Omzet warung, Beli ayam & sayur"
              className="w-full bg-[#FFF0F6] border border-pink-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Catatan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan (opsional)"
              className="w-full bg-[#FFF0F6] border border-pink-100 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
            />
          </div>

          {/* Foto Nota (Opsional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Foto Nota (opsional)
            </label>
            <label className="border-2 border-dashed border-pink-200 hover:border-[#F4519A] bg-[#FFF0F6]/40 hover:bg-[#FFF0F6] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {receiptImage ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={receiptImage}
                    alt="Receipt preview"
                    className="w-14 h-14 object-cover rounded-xl border border-pink-200 shadow-sm"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">Foto nota tersimpan</p>
                    <p className="text-[11px] text-[#F4519A]">Klik untuk mengganti foto</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#F4519A] font-bold text-sm">
                  <Upload size={18} />
                  <span>+ Unggah foto nota</span>
                </div>
              )}
            </label>
          </div>

          {/* Submit Button in Prototype vibrant pink */}
          <button
            type="submit"
            className="w-full py-4 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            {editData ? 'PERBARUI TRANSAKSI' : 'SIMPAN TRANSAKSI'}
          </button>
        </form>

        {/* Success toast overlay */}
        {successToast && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in zoom-in-95">
            <CheckCircle2 size={56} className="text-[#F4519A] mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-gray-900">Transaksi Berhasil Disimpan!</h4>
            <p className="text-xs text-gray-500 text-center mt-1">
              Data transaksi dan kartu dashboard telah diperbarui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

