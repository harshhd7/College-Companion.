import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-600 shrink-0" />,
    info: <Info size={18} className="text-sky-600 shrink-0" />,
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl rounded-xl p-3.5 flex items-center justify-between gap-3 text-stone-800">
        <div className="flex items-center gap-2.5">
          {icons[toast.type || "info"]}
          <p className="text-xs sm:text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
