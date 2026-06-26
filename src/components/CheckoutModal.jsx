'use client';

import React from 'react';
import { useCart } from '@/context/AppContext';
import { Truck } from 'lucide-react';

export default function CheckoutModal() {
  const { 
    checkoutModalOpen, 
    setCheckoutModal, 
    lastOrder, 
    clearCart 
  } = useCart();

  if (!checkoutModalOpen || !lastOrder) return null;

  const handleClose = () => {
    setCheckoutModal(false);
    clearCart();
  };

  const orderDate = new Date(lastOrder.date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = orderDate.toLocaleDateString('en-US', options);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-[500px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Checkmark Circle */}
        <div className="w-[72px] h-[72px] rounded-full border-4 border-green-500 flex items-center justify-center mb-6 relative">
          <svg 
            className="w-10 h-10 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="3.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary dark:text-accent mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-text-muted dark:text-gray-300 font-light mb-6 max-w-[380px] leading-relaxed">
          Thank you for supporting local biodynamic growers. An invoice has been generated for your record.
        </p>

        {/* Live Invoice Receipt Box */}
        <div className="w-full bg-primary/[0.02] dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 mb-6 text-left text-xs sm:text-sm text-text-dark dark:text-gray-200">
          <div className="flex justify-between font-semibold border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            <div>
              <span className="text-[0.65rem] uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-0.5">Invoice ID</span>
              <strong className="text-primary dark:text-accent font-heading font-bold text-sm">{lastOrder.id}</strong>
            </div>
            <div className="text-right">
              <span className="text-[0.65rem] uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-0.5">Date</span>
              <span className="font-semibold text-xs">{formattedDate}</span>
            </div>
          </div>

          {/* Invoice itemized list */}
          <div className="flex flex-col gap-2.5 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-text-muted dark:text-gray-300 max-w-[280px] truncate">
                  {item.product.name} <span className="font-bold text-primary dark:text-accent">x{item.quantity}</span>
                </span>
                <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing totals */}
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Subtotal</span>
              <span className="font-semibold">${lastOrder.subtotal.toFixed(2)}</span>
            </div>
            
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount (Promo Applied)</span>
                <span>-${lastOrder.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Shipping (Carbon Neutral)</span>
              <span className="font-semibold">{lastOrder.shipping === 0 ? "FREE" : `$${lastOrder.shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Local Tax (8%)</span>
              <span className="font-semibold">${lastOrder.tax.toFixed(2)}</span>
            </div>
            
            <hr className="border-gray-100 dark:border-gray-800/80 my-1" />
            
            <div className="flex justify-between font-bold text-sm text-primary dark:text-accent">
              <span>Total Paid</span>
              <span>${lastOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery banner */}
        <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-xl p-3.5 mb-6 text-xs sm:text-sm">
          <Truck className="w-5 h-5 shrink-0" />
          <span>Estimated Delivery: <strong>Tomorrow morning before 10:00 AM</strong></span>
        </div>

        <button 
          onClick={handleClose}
          className="w-full py-3 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-bold text-sm rounded shadow transition-all duration-300 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
