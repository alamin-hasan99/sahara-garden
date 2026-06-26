'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/AppContext';
import { X, Trash2, ShoppingCart, Percent } from 'lucide-react';

export default function CartSidebar() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    adjustQty,
    removeItem,
    appliedCoupon,
    applyCoupon,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    cartCount,
    triggerCheckout
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState({ text: '', type: '' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    const res = applyCoupon(promoCode.trim());
    if (res) {
      setPromoFeedback({
        text: res.message,
        type: res.success ? 'success' : 'error'
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const res = await triggerCheckout();
    setIsCheckingOut(false);
    if (res?.success) {
      setPromoCode('');
      setPromoFeedback({ text: '', type: '' });
    }
  };

  const handleBackToShop = () => {
    setCartOpen(false);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      window.scrollTo({
        top: shopEl.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-slate-800 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-500 animate-[slideInRight_0.4s_ease-out_forwards]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-primary dark:text-accent">
            Your Basket ({cartCount})
          </h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer text-text-dark dark:text-gray-100"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Body */}
        <div className="p-6 flex-grow overflow-y-auto flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted dark:text-gray-400">
              <ShoppingCart className="w-16 h-16 stroke-[1.2] mb-4 opacity-50 text-secondary dark:text-accent" />
              <p className="text-sm font-medium mb-6">Your basket is completely empty.</p>
              <button 
                onClick={handleBackToShop}
                className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-semibold text-xs rounded transition-all duration-300 cursor-pointer shadow-md"
              >
                Explore Our Fresh Harvest
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.product.id}
                className="flex items-center gap-4 bg-primary/[0.01] dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-left"
              >
                <img 
                  src={item.product.image.startsWith('/') ? item.product.image : `/${item.product.image}`}
                  alt={item.product.name} 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 shrink-0"
                />
                
                <div className="min-w-0 flex-grow">
                  <h4 className="font-heading font-bold text-sm text-primary dark:text-accent truncate" title={item.product.name}>
                    {item.product.name}
                  </h4>
                  <div className="text-xs text-text-muted dark:text-gray-400 font-medium mb-2.5">
                    ${item.product.price.toFixed(2)} each
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded h-8 overflow-hidden">
                      <button 
                        onClick={() => adjustQty(item.product.id, -1)}
                        className="px-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold h-full"
                      >
                        −
                      </button>
                      <span className="px-2 text-xs font-semibold text-text-dark dark:text-gray-200">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => adjustQty(item.product.id, 1)}
                        className="px-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold h-full"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product.id, item.product.name)}
                      className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Sticky Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60">
          
          {/* Promo code application box */}
          {cart.length > 0 && (
            <div className="mb-6">
              <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-1.5 focus-within:border-accent transition-colors">
                <input 
                  type="text" 
                  placeholder="Promo code (e.g. FRESH10)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-transparent text-sm pl-2 text-text-dark dark:text-gray-100 outline-none border-none"
                  autoComplete="off"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="px-4 py-1.5 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoFeedback.text && (
                <div className={`text-[0.7rem] font-semibold mt-1.5 text-left ${
                  promoFeedback.type === 'success' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {promoFeedback.text}
                </div>
              )}
            </div>
          )}

          {/* Pricing Details Breakdown */}
          <div className="flex flex-col gap-2.5 mb-6 text-sm text-text-dark dark:text-gray-200">
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Subtotal</span>
              <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold items-center">
                <span className="flex items-center gap-1 text-xs">
                  <Percent className="w-3.5 h-3.5" /> Discount (10% Off)
                </span>
                <span>-${cartDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Eco-Friendly Shipping</span>
              <span className="font-semibold">
                {cartShipping === 0 ? "FREE" : `$${cartShipping.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-muted dark:text-gray-400">Local Tax (8%)</span>
              <span className="font-semibold">${cartTax.toFixed(2)}</span>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800 my-1" />
            
            <div className="flex justify-between text-base font-bold text-primary dark:text-accent">
              <span>Grand Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full py-3.5 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-bold text-sm rounded shadow hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            {isCheckingOut ? "Processing Secure Order..." : "Proceed to Secure Checkout"}
          </button>
        </div>
      </aside>
    </>
  );
}
