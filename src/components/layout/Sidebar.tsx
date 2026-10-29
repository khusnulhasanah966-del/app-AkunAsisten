import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Scale,
  FileText,
  GraduationCap,
  HelpCircle,
  LogOut,
  X,
  PhoneCall,
  User,
  RotateCcw,
  ShoppingCart,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export type ActiveTab = 'dashboard' | 'kasir' | 'transaksi' | 'stok' | 'utang_piutang' | 'laporan' | 'pelatihan' | 'profil';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { user, logout, registeredUsers, switchAccount, resetToDemoData } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'kasir', label: 'Kasir POS (Cepat)', icon: <ShoppingCart size={20} />, badge: 'BARU' },
    { id: 'transaksi', label: 'Transaksi', icon: <Receipt size={20} /> },
    { id: 'stok', label: 'Stok Barang', icon: <Package size={20} /> },
    { id: 'utang_piutang', label: 'Utang-Piutang', icon: <Scale size={20} /> },
    { id: 'laporan', label: 'Laporan', icon: <FileText size={20} /> },
    { id: 'pelatihan', label: 'Pelatihan', icon: <GraduationCap size={20} /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar: Solid #F4519A match prototype */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F4519A] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-xl`}
      >
        {/* Top Header & Logo */}
        <div className="overflow-y-auto">
          <div className="p-5 flex items-center justify-between border-b border-pink-400/40">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm w-full">
              <Logo size={34} />
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 ml-2 text-white hover:bg-pink-600 rounded-lg transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${isActive
                      ? 'bg-white text-[#F4519A] shadow-md shadow-pink-900/10 scale-[1.02]'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-[#F4519A]' : 'bg-transparent'}`} />
                    <span className={isActive ? 'text-[#F4519A]' : 'text-white'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${isActive ? 'bg-pink-100 text-[#F4519A]' : 'bg-white/20 text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile, Account Switcher & Logout */}
        <div className="p-4 space-y-2.5 border-t border-pink-400/30 bg-[#E03582]/40">
          {/* User pill & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-pink-600/70 hover:bg-pink-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center font-bold text-xs text-white border border-white/30 shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : <User size={16} />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.businessName || 'Warung Makan'}</p>
                  <p className="text-[10px] text-pink-100 truncate">{user?.name || 'Pemilik Usaha'}</p>
                </div>
              </div>
              <Users size={14} className="text-white/80 shrink-0 ml-1" />
            </button>

            {/* Account Switch Dropdown Popup */}
            {showAccountDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-pink-100 p-2 text-gray-800 z-50 animate-in fade-in">
                <div className="p-2 border-b border-gray-100 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase">
                  <span>Ganti Akun UMKM</span>
                  <button onClick={() => setShowAccountDropdown(false)}>
                    <X size={12} />
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 py-1">
                  {registeredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchAccount(u.id);
                        setShowAccountDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${u.id === user?.id ? 'bg-pink-50 text-[#F4519A] font-bold' : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className="truncate">{u.businessName || u.name}</span>
                      {u.id === user?.id && <span className="text-[10px] bg-[#F4519A] text-white px-1.5 py-0.2 rounded-md">Aktif</span>}
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-gray-100 flex flex-col gap-1 text-[11px]">
                  <button
                    onClick={() => {
                      handleSelectTab('profil');
                      setShowAccountDropdown(false);
                    }}
                    className="w-full text-left py-1.5 px-2 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold"
                  >
                    Atur Profil Akun Ini
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowAccountDropdown(false);
                    }}
                    className="w-full text-left py-1.5 px-2 hover:bg-rose-50 rounded-lg text-rose-600 font-bold"
                  >
                    + Masuk / Buat Akun Baru
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Prototype "Butuh bantuan? Hubungi pendamping" */}
          <div className="bg-white/15 rounded-2xl p-2.5 border border-white/20 text-center backdrop-blur-xs">
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full py-1.5 px-2.5 bg-white text-[#F4519A] hover:bg-pink-50 font-bold text-xs rounded-xl shadow-xs transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={13} />
              <span>Bantuan Pendamping</span>
            </button>
          </div>

          {/* Quick Actions (Reset Data & Logout) */}
          <div className="flex items-center justify-between pt-1 px-1 text-xs text-white/90">
            <button
              onClick={resetToDemoData}
              title="Reset ke data awal Warung Bu Sari"
              className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset Data Bu Sari</span>
            </button>
            <button
              onClick={logout}
              title="Keluar akun"
              className="flex items-center gap-1 text-[11px] hover:text-white font-bold transition-colors bg-white/20 px-2 py-1 rounded-lg"
            >
              <LogOut size={12} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Modal Hubungi Pendamping */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#F4519A] flex items-center justify-center mx-auto mb-4">
              <PhoneCall size={28} />
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
              Konsultasi & Pendamping UMKM
            </h3>
            <p className="text-sm text-center text-gray-500 mb-5">
              Tim fasilitator AkunAsisten siap membantu Anda merapikan pembukuan, stok, dan laporan keuangan usaha.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="https://wa.me/6281234567890?text=Halo%20AkunAsisten,%20saya%20butuh%20pendampingan%20pembukuan%20usaha"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/50 text-[#F4519A] font-semibold text-sm transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  Chat WhatsApp Pendamping
                </span>
                <span>0812-3456-7890 &rarr;</span>
              </a>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">Jam Operasional Layanan:</p>
                <p>Senin - Sabtu: 08.00 - 18.00 WIB</p>
                <p>Layanan gratis pendampingan khusus UMKM terdaftar di AkunAsisten.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
