import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 38 }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-white shadow-sm border border-pink-100 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        {/* AK Stylized icon in prototype pink & dark grey */}
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" fill="none">
          {/* Bold stylized A in dark grey */}
          <path d="M22 75 L38 25 L48 25 L34 75 Z" fill="#2D3748" />
          <path d="M34 52 L56 52 L53 60 L31 60 Z" fill="#2D3748" />
          {/* Bold stylized K in vibrant pink #F4519A */}
          <path d="M52 25 L62 25 L62 75 L52 75 Z" fill="#F4519A" />
          <path d="M60 48 L76 25 L88 25 L68 53 Z" fill="#F4519A" />
          <path d="M67 50 L88 75 L76 75 L59 55 Z" fill="#F4519A" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-gray-900 leading-none text-base">
          AKUN <span className="text-[#F4519A]">ASISTEN</span>
        </span>
        <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
          Akuntansi Digital UMKM
        </span>
      </div>
    </div>
  );
};

