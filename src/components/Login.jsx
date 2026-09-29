import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Mail, Lock, LogIn, AlertCircle, Key } from 'lucide-react';

export const Login = () => {
  const { login, setJwtToken, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('alice123');
  const [customJwt, setCustomJwt] = useState('');
  const [showJwtOption, setShowJwtOption] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(username, password);
  };

  const handleCustomJwtSubmit = (e) => {
    e.preventDefault();
    if (customJwt.trim()) {
      setJwtToken(customJwt.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-3xl p-8 sm:p-10 shadow-lg shadow-[#85544D]/5">
        {/* Brand Header Clásico */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#85544D] text-[#F2DDCC] mb-4 shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-[#85544D]">
            Fragrance Corner
          </h1>
          <p className="text-sm font-serif italic text-[#85544D]/80 mt-1 tracking-wide">
            Catálogo
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold">Error de autenticación:</span>
              <p className="text-rose-700 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form LDAP */}
        {!showJwtOption ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#85544D] uppercase tracking-wider mb-2">
                Correo Electrónico / Usuario
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85544D]/60" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alice"
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-3 pl-10 pr-4 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D] focus:ring-1 focus:ring-[#85544D] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#85544D] uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85544D]/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-3 pl-10 pr-4 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D] focus:ring-1 focus:ring-[#85544D] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#85544D] hover:bg-[#6E423C] text-white font-serif font-bold py-3 px-4 rounded-xl shadow-md shadow-[#85544D]/15 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#F1C7A7]" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Opción Inyección manual de JWT */
          <form onSubmit={handleCustomJwtSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#85544D] uppercase tracking-wider mb-2">
                Pegar JWT Token directamente
              </label>
              <textarea
                rows="4"
                value={customJwt}
                onChange={(e) => setCustomJwt(e.target.value)}
                placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6..."
                className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl p-3 text-xs text-[#2D2321] font-mono focus:outline-none focus:border-[#85544D]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#85544D] hover:bg-[#6E423C] text-white font-serif font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-[#F1C7A7]" />
              <span>Inyectar Token en Zustand</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#E8DFD8] flex items-center justify-between text-xs text-[#85544D]/70 font-serif">
          <span>Fragrance Corner</span>
          <button
            type="button"
            onClick={() => setShowJwtOption(!showJwtOption)}
            className="text-[11px] underline hover:text-[#85544D] cursor-pointer"
          >
            {showJwtOption ? 'Usar formulario de login' : 'Inyectar JWT manual'}
          </button>
        </div>
      </div>
    </div>
  );
};
