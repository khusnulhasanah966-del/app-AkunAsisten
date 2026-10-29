import React, { useState } from 'react';
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Wallet,
  KeyRound,
  Check,
  LogOut,
  Users,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logout, registeredUsers, switchAccount } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessType, setBusinessType] = useState(user?.businessType || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [initialBalance, setInitialBalance] = useState<number>(user?.initialBalance || 0);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      businessName,
      businessType,
      phone,
      address,
      initialBalance: Number(initialBalance),
    });
    setToastMessage('Data profil usaha & saldo awal kas berhasil disimpan!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !newPassword) {
      alert('Harap masukkan kata sandi saat ini dan kata sandi baru');
      return;
    }
    setPassword('');
    setNewPassword('');
    setToastMessage('Kata sandi berhasil diperbarui dengan aman!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pengaturan Akun & Profil Usaha
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Atur identitas UMKM, informasi pemilik, kelola akun atau logout
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-2xl border border-rose-200 transition-colors self-start sm:self-auto"
        >
          <LogOut size={16} />
          <span>Keluar Akun (Logout)</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Switcher Card */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-pink-50 text-[#F4519A]">
              <Users size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Daftar Akun UMKM Anda</h3>
              <p className="text-[11px] text-gray-400">Pilih akun lain untuk berganti pembukuan usaha tanpa perlu logout</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs font-bold text-[#F4519A] hover:underline"
          >
            <Plus size={14} />
            <span>Tambah Akun Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {registeredUsers.map((regUser) => (
            <div
              key={regUser.id}
              onClick={() => switchAccount(regUser.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${regUser.id === user?.id
                  ? 'border-[#F4519A] bg-pink-50/50 shadow-xs'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${regUser.id === user?.id ? 'bg-[#F4519A] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {regUser.name ? regUser.name.slice(0, 2).toUpperCase() : 'UM'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{regUser.businessName || regUser.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{regUser.email}</p>
                </div>
              </div>
              {regUser.id === user?.id ? (
                <span className="text-[10px] font-black bg-[#F4519A] text-white px-2 py-0.5 rounded-full">
                  Sedang Aktif
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 hover:text-[#F4519A]">
                  Pilih &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-pink-100">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF0F6] text-[#F4519A] flex items-center justify-center font-black text-2xl border border-pink-200">
              {name.slice(0, 2).toUpperCase() || 'UM'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{businessName || 'Usaha Anda'}</h2>
              <p className="text-xs text-gray-400">{businessType || 'Sektor Usaha'} &bull; Pemilik: {name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Nama Pemilik */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Nama Pemilik Usaha</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Nama Usaha */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Nama Usaha / Toko</label>
              <div className="relative">
                <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Email Terdaftar</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Nomor Telepon / WhatsApp */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Nomor WhatsApp / HP</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Jenis Usaha */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Jenis / Bidang Usaha</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Kuliner, Fashion, Toko Kelontong, Jasa Fotografi"
                className="w-full px-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            {/* Saldo Awal Kas */}
            <div>
              <label className="font-semibold text-gray-600 block mb-1">
                Saldo Awal Kas Pembukuan (Rp)
              </label>
              <div className="relative">
                <Wallet size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-extrabold focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Uang kas modal kerja saat awal pembukuan dimulai ({formatRupiah(initialBalance)}).
              </p>
            </div>
          </div>

          {/* Alamat Usaha */}
          <div className="text-xs">
            <label className="font-semibold text-gray-600 block mb-1">Alamat Usaha / Lokasi Toko</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-3 text-gray-400" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap tempat usaha..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#F4519A] hover:bg-[#E03582] text-white font-bold text-xs rounded-2xl shadow-md transition-colors"
          >
            Simpan Perubahan Profil
          </button>
        </form>

        {/* Change Password Card */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <KeyRound size={16} className="text-[#F4519A]" />
            <span>Keamanan & Kata Sandi</span>
          </h3>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-2xl shadow-sm transition-colors"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
