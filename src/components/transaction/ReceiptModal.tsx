import React, { useRef } from 'react';
import { X, Printer, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Transaction, UserProfile } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { QRCodeSVG } from '../common/QRCodeSVG';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  user: UserProfile | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  user,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*STRUK TRANSAKSI RESMI - ${user?.businessName || 'AkunAsisten'}*
----------------------------------------
No. Ref : #${transaction.id}
Tanggal : ${formatDateIndo(transaction.date)}
Tipe    : ${transaction.type === 'pemasukan' ? 'PEMASUKAN / PENJUALAN' : 'PENGELUARAN / BELANJA'}
Ket     : ${transaction.description}
Kategori: ${transaction.category}
Metode  : ${transaction.paymentMethod}
----------------------------------------
*TOTAL : ${formatRupiah(transaction.amount)}*
----------------------------------------
Terima kasih atas transaksi Anda!
Dicatat rapi dengan aplikasi AkunAsisten.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-pink-50/70 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4519A]" />
            <h3 className="text-sm font-bold text-gray-900">Struk / Bukti Transaksi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 flex justify-center">
          <div
            ref={receiptRef}
            className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-200 font-mono text-xs text-gray-800 space-y-4 relative"
          >
            {/* Top jagged paper decorative effect */}
            <div className="text-center pb-3 border-b border-dashed border-gray-300">
              <h2 className="text-base font-black tracking-tight uppercase text-gray-900">
                {user?.businessName || 'WARUNG BU SARI'}
              </h2>
              <p className="text-[10px] text-gray-500">{user?.address || 'Pusat Kuliner & Sembako'}</p>
              <p className="text-[10px] text-gray-500">Telp: {user?.phone || '0812-3456-7890'}</p>
            </div>

            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">No. Ref:</span>
                <span className="font-bold">#{transaction.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal:</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode:</span>
                <span>{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Berhasil Lunas
                </span>
              </div>
            </div>

            {/* Transaction Item Details */}
            <div className="space-y-2 py-1 border-b border-dashed border-gray-300">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{transaction.description}</span>
                <span>{formatRupiah(transaction.amount)}</span>
              </div>
              <div className="text-[10px] text-gray-500 flex justify-between">
                <span>Kategori: {transaction.category}</span>
                <span>Tipe: {transaction.type.toUpperCase()}</span>
              </div>
              {transaction.notes && (
                <p className="text-[10px] text-gray-400 italic">Catatan: {transaction.notes}</p>
              )}
            </div>

            {/* Total */}
            <div className="pt-2 flex justify-between items-center text-sm font-black text-gray-900">
              <span>TOTAL</span>
              <span className="text-[#F4519A] text-base">{formatRupiah(transaction.amount)}</span>
            </div>

            {/* QR Verification Code */}
            <div className="pt-3 flex flex-col items-center justify-center text-center">
              <QRCodeSVG
                value={`https://akunasisten.id/verify/${transaction.id}?amount=${transaction.amount}`}
                size={110}
                className="border border-gray-200"
              />
              <p className="text-[9px] text-gray-400 mt-1.5">
                Scan QR untuk verifikasi keabsahan transaksi digital
              </p>
            </div>

            <div className="text-center pt-2 text-[10px] text-gray-400">
              *** Terima Kasih atas Kepercayaan Anda ***
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Share2 size={14} />
            <span>Kirim WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F4519A] hover:bg-[#E03582] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Printer size={14} />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

