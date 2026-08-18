import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-950',
    info: 'border-blue-200 bg-blue-50/95 text-blue-950'
  };

  return (
    <div
      id="schoolos_global_toast"
      className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-slate-900/5 backdrop-blur-sm ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-md text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
