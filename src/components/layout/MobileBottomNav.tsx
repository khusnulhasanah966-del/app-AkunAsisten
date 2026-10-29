import React, { useState } from 'react';
import { Home, PlusCircle, FileText, User, ShoppingCart } from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-30 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {/* Beranda (Dashboard) */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
          activeTab === 'dashboard' ? 'text-[#F4519A] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'dashboard' ? 'bg-[#F4519A]' : 'bg-transparent'}`} />
        <Home size={19} />
        <span className="text-[10px]">Beranda</span>
      </button>

      {/* Kasir POS */}
      <button
        onClick={() => setActiveTab('kasir')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
          activeTab === 'kasir' ? 'text-[#F4519A] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'kasir' ? 'bg-[#F4519A]' : 'bg-transparent'}`} />
        <ShoppingCart size={19} />
        <span className="text-[10px]">Kasir</span>
      </button>

      {/* Catat Cepat */}
      <button
        onClick={onOpenAddModal}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors text-[#F4519A] font-bold"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F4519A]" />
        <PlusCircle size={22} className="stroke-[2.5]" />
        <span className="text-[10px]">Catat</span>
      </button>

      {/* Laporan */}
      <button
        onClick={() => setActiveTab('laporan')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
          activeTab === 'laporan' ? 'text-[#F4519A] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'laporan' ? 'bg-[#F4519A]' : 'bg-transparent'}`} />
        <FileText size={19} />
        <span className="text-[10px]">Laporan</span>
      </button>

      {/* Akun */}
      <button
        onClick={() => setActiveTab('profil')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
          activeTab === 'profil' ? 'text-[#F4519A] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'profil' ? 'bg-[#F4519A]' : 'bg-transparent'}`} />
        <User size={19} />
        <span className="text-[10px]">Akun</span>
      </button>
    </nav>
  );
};
