'use client';

import React from 'react';
import { useCart } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';

export default function Toast() {
  const { toasts } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-[340px]">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="flex items-center gap-3 bg-primary dark:bg-gray-800 border border-primary/25 dark:border-slate-700 text-white dark:text-accent p-4 rounded-xl shadow-lg transition-all duration-300 pointer-events-auto animate-toast-slide"
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-accent" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-left">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
}
