import React from 'react';
import { usePerfume } from '../context/PerfumeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, setToast } = usePerfume();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#85544D] shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-[#F1C7A7] bg-[#FAF7F4] text-[#85544D]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-lg ${borderColors[toast.type || 'success']}`}>
        {icons[toast.type || 'success']}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={() => setToast(null)}
          className="p-1 text-[#85544D]/60 hover:text-[#85544D] rounded-lg transition-colors ml-auto cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
