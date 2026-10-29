import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transaction/TransactionsView';
import { PosCashierView } from './components/pos/PosCashierView';
import { StockView } from './components/stock/StockView';
import { DebtReceivableView } from './components/debt/DebtReceivableView';
import { ReportsView } from './components/reports/ReportsView';
import { TrainingView } from './components/training/TrainingView';
import { ProfileView } from './components/profile/ProfileView';
import { TransactionModal } from './components/transaction/TransactionModal';
import { ReceiptModal } from './components/transaction/ReceiptModal';
import { AuthView } from './components/auth/AuthView';
import { Logo } from './components/common/Logo';
import { Menu, Plus, LogOut, Users } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [receiptTransaction, setReceiptTransaction] = useState<any | null>(null);

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx: any) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleShowReceipt = (tx: any) => {
    setReceiptTransaction(tx);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FA] text-gray-800 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Sidebar for Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-white border-b border-pink-100 p-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl hover:bg-pink-50 text-gray-700"
            >
              <Menu size={22} />
            </button>
            <Logo size={28} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="w-8 h-8 rounded-full bg-[#F4519A] text-white flex items-center justify-center font-bold shadow-sm"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={logout}
              title="Keluar akun"
              className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-pink-50"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Prototype Browser Window Top bar decoration for Desktop */}
        <div className="hidden md:flex items-center justify-between bg-white px-8 py-2.5 border-b border-pink-100/70 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-4 font-mono text-[11px] text-gray-400 bg-pink-50/50 px-3 py-1 rounded-full border border-pink-100">
              app.akunasisten.id/{activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-[11px]">
              Halo, <b>{user?.name || 'Bu Sari'}</b> ({user?.businessName || 'Warung Makan'})
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
            <button
              onClick={logout}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition-colors ml-2"
            >
              <LogOut size={12} />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddModal={handleOpenAddModal}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'kasir' && (
            <PosCashierView onShowReceipt={handleShowReceipt} />
          )}
          {activeTab === 'transaksi' && (
            <TransactionsView
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onShowReceipt={handleShowReceipt}
            />
          )}
          {activeTab === 'stok' && <StockView />}
          {activeTab === 'utang_piutang' && <DebtReceivableView />}
          {activeTab === 'laporan' && <ReportsView />}
          {activeTab === 'pelatihan' && <TrainingView />}
          {activeTab === 'profil' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        editData={editingTransaction}
      />

      {/* Receipt Modal (Official Struk Digital + Share WA / PDF) */}
      <ReceiptModal
        isOpen={!!receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        transaction={receiptTransaction}
        user={user}
      />
    </div>
  );
};
