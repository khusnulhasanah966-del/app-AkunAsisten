import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Receipt, 
  TrendingUp, 
  Package, 
  Scale, 
  FileText, 
  Coins, 
  Clock, 
  ChevronRight,
  X,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainingMaterial } from '../../types';
import confetti from 'canvas-confetti';

export const TrainingView: React.FC = () => {
  const { trainingMaterials, toggleTrainingCompleted } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<TrainingMaterial | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={20} />;
      case 'Receipt': return <Receipt size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'Package': return <Package size={20} />;
      case 'Scale': return <Scale size={20} />;
      case 'FileText': return <FileText size={20} />;
      case 'Coins': return <Coins size={20} />;
      default: return <GraduationCap size={20} />;
    }
  };

  const completedCount = trainingMaterials.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / trainingMaterials.length) * 100);

  const filteredMaterials = trainingMaterials.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleComplete = (id: string, currentlyCompleted: boolean) => {
    toggleTrainingCompleted(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pusat Pelatihan & Edukasi Akuntansi
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Pelajari konsep akuntansi praktis dengan bahasa yang sederhana khusus pelaku UMKM
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-pink-100 shadow-sm self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F6] text-[#F4519A] flex items-center justify-center font-black text-sm">
            {progressPercent}%
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Progres Belajar</p>
            <p className="text-[11px] text-gray-400">{completedCount} dari {trainingMaterials.length} materi selesai</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm relative">
        <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari materi pelatihan akuntansi, laba rugi, kas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#F4519A]"
        />
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="p-3 rounded-2xl bg-[#FFF0F6] text-[#F4519A] group-hover:scale-105 transition-transform">
                  {getIcon(material.iconName)}
                </span>
                <button
                  onClick={() => handleToggleComplete(material.id, material.completed)}
                  title={material.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors"
                >
                  {material.completed ? (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={13} /> Selesai
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full hover:text-gray-600">
                      <Circle size={13} /> Belum
                    </span>
                  )}
                </button>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4519A]">
                {material.category}
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2">
                {material.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                {material.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Clock size={12} />
                <span>{material.duration} baca</span>
              </span>
              <button
                onClick={() => setSelectedMaterial(material)}
                className="flex items-center gap-1 text-xs font-bold text-[#F4519A] hover:underline"
              >
                <span>Pelajari Selengkapnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Materi Pelatihan */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-pink-100 max-h-[85vh] overflow-y-auto relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#F4519A] uppercase tracking-wider mb-2">
              <BookOpen size={16} />
              <span>{selectedMaterial.category}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
              {selectedMaterial.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1">
                <Clock size={13} /> Durasi: {selectedMaterial.duration}
              </span>
              <span>&bull;</span>
              <span>AkunAsisten Academy</span>
            </div>

            {/* Content parsed simply */}
            <div className="prose prose-pink text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
              <div className="whitespace-pre-line">
                {selectedMaterial.content}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleComplete(selectedMaterial.id, selectedMaterial.completed);
                  setSelectedMaterial((prev) => prev ? { ...prev, completed: !prev.completed } : null);
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedMaterial.completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-[#F4519A] text-white hover:bg-[#E03582] shadow-md shadow-pink-500/20'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{selectedMaterial.completed ? 'Sudah Selesai Dibaca ✓' : 'Tandai Materi Ini Selesai'}</span>
              </button>

              <button
                onClick={() => setSelectedMaterial(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

