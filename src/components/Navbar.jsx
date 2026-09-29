import React from 'react';
import { usePerfume } from '../context/PerfumeContext';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, LogOut, PlusCircle, LayoutDashboard, RotateCcw, Key } from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, restoreInitialData } = usePerfume();
  const { user, logout, token } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8DFD8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#85544D] text-[#F2DDCC] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#85544D] leading-tight group-hover:text-[#6E423C] transition-colors">
              Fragrance Corner
            </h1>
            <p className="text-[10px] text-[#85544D]/70 uppercase tracking-widest font-semibold">Catálogo & Dashboard</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF7F4] p-1 rounded-xl border border-[#E8DFD8]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#85544D] text-[#FAF7F4] shadow-xs'
                : 'text-[#85544D]/70 hover:text-[#85544D] hover:bg-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#F1C7A7]" />
            <span>Dashboard Inicial</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'add-product'
                ? 'bg-[#85544D] text-[#FAF7F4] shadow-xs'
                : 'text-[#85544D]/70 hover:text-[#85544D] hover:bg-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#F1C7A7]" />
            <span>Agregar Perfume</span>
          </button>
        </nav>

        {/* Right side user menu & JWT state */}
        <div className="flex items-center gap-3">
          {token && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F2DDCC]/40 border border-[#F1C7A7] text-[#85544D] text-[11px] font-mono" title={token}>
              <Key className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[100px]">JWT Inyectado</span>
            </div>
          )}

          <button
            onClick={restoreInitialData}
            title="Restablecer catálogo inicial"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DFD8] bg-[#FAF7F4] text-[#85544D]/80 hover:text-[#85544D] hover:border-[#85544D]/40 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Restablecer Muestras</span>
          </button>

          <div className="h-6 w-px bg-[#E8DFD8] hidden sm:block" />

          {/* User Profile Info from Zustand */}
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#85544D]/30"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#2D2321] leading-none">{user.name}</p>
                <p className="text-[10px] text-[#85544D]/70 mt-0.5">{user.role}</p>
              </div>
              <button
                onClick={logout}
                title="Cerrar Sesión (Destruir JWT)"
                className="p-2 text-[#85544D]/70 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
