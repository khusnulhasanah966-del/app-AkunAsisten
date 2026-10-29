import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, User, Store, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, registeredUsers } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copyDemoData, setCopyDemoData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!name || !email || !businessName || !password) {
        setErrorMsg('Harap lengkapi semua data pendaftaran.');
        return;
      }
      register(name, email, businessName, password, copyDemoData);
    } else {
      if (!email || !password) {
        setErrorMsg('Harap isi email dan kata sandi.');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Email atau kata sandi tidak valid.');
      }
    }
  };

  const handleQuickLogin = (userEmail: string, userPass = 'password123') => {
    setEmail(userEmail);
    setPassword(userPass);
    login(userEmail, userPass);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F6] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 space-y-6">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center">
          <div className="p-2 bg-pink-50 rounded-2xl mb-3">
            <Logo size={46} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-2">
            {isRegister ? 'Daftar Akun UMKM Baru' : 'Masuk ke AkunAsisten'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Aplikasi pencatatan akuntansi dan keuangan digital yang mudah dan praktis untuk UMKM.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Nama Pemilik Usaha</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso / Siti Rahma"
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Nama Usaha / Toko</label>
                <div className="relative">
                  <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Toko Berkah / Warung Kopi"
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
              </div>

              {/* Option to start fresh or with demo data */}
              <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyDemoData}
                    onChange={(e) => setCopyDemoData(e.target.checked)}
                    className="mt-0.5 rounded text-[#F4519A] focus:ring-pink-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">Sertakan contoh data awal</span>
                    <span className="text-[11px] text-gray-500">
                      Bila dicentang, akun baru akan diisi contoh data produk & transaksi. Jika tidak, akun akan dimulai dari nol (Rp 0).
                    </span>
                  </div>
                </label>
              </div>
            </>
          )}

          <div>
            <label className="font-semibold text-gray-600 block mb-1">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@usaha.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF0F6] border border-pink-100 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#F4519A] hover:bg-[#E03582] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-pink-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 mt-4"
          >
            <span>{isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE APLIKASI'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Switcher */}
        {!isRegister && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 text-center uppercase tracking-wider">
              Akses Cepat Akun Terdaftar
            </p>
            <div className="space-y-1.5">
              {registeredUsers.map((regUser) => (
                <button
                  key={regUser.id}
                  type="button"
                  onClick={() => handleQuickLogin(regUser.email, regUser.password || 'password123')}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-pink-100 hover:bg-pink-50/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#F4519A] flex items-center justify-center font-bold text-xs">
                      {regUser.name ? regUser.name.slice(0, 2).toUpperCase() : 'UM'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{regUser.businessName || regUser.name}</p>
                      <p className="text-[10px] text-gray-400">{regUser.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#F4519A] bg-pink-50 px-2 py-1 rounded-lg">
                    Masuk &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-1">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs font-bold text-[#F4519A] hover:underline"
          >
            {isRegister
              ? 'Sudah punya akun? Masuk di sini'
              : 'Belum punya akun? Buat akun UMKM gratis'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Keamanan Data & Privasi UMKM Terjamin</span>
        </div>
      </div>
    </div>
  );
};
