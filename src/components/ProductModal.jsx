'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/AppContext';
import { X, Star } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  // Reset quantity when active product changes
  useEffect(() => {
    setQty(1);
  }, [product]);

  if (!product) return null;

  const handleAddAndClose = () => {
    addToCart(product, qty);
    onClose();
  };

  const nutrition = product.nutrition || {};

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[850px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 scale-100 flex flex-col md:flex-row text-left max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer text-text-dark dark:text-gray-100"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Box */}
        <div className="w-full md:w-1/2 relative bg-primary/[0.02] dark:bg-white/[0.01] flex items-center justify-center p-6 md:p-10 shrink-0">
          <span className="absolute top-6 left-6 z-10 px-3 py-1 bg-accent text-primary font-bold text-[0.7rem] uppercase tracking-wider rounded">
            {product.tag || 'Organic'}
          </span>
          <img 
            src={product.image.startsWith('/') ? product.image : `/${product.image}`}
            alt={product.name} 
            className="w-full max-h-[300px] md:max-h-[380px] object-contain drop-shadow-lg"
          />
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-accent mb-2.5 block">
              {product.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary dark:text-accent mb-4">
              {product.name}
            </h2>

            {/* Ratings row */}
            <div className="flex items-center gap-1 mb-6 text-sm text-text-muted dark:text-gray-300">
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current shrink-0" />
                ))}
              </div>
              <span className="text-[0.75rem] font-semibold text-text-muted dark:text-gray-400 pl-1.5">
                (46 farmer reviews)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-muted dark:text-gray-300 font-light mb-6 leading-relaxed">
              {product.longDesc}
            </p>

            {/* Nutritional Facts Grid */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mb-8">
              <h4 className="text-[0.7rem] font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                Nutritional Facts (Per 100g)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(nutrition).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="bg-primary/[0.02] dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-primary dark:text-accent mb-0.5">{val}</div>
                    <div className="text-[0.65rem] font-semibold text-text-muted dark:text-gray-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout buy row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-5 mt-auto">
            <div className="flex flex-col text-left w-full sm:w-auto">
              <span className="text-[0.65rem] text-text-muted dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                Unit Price
              </span>
              <strong className="text-2xl font-bold text-primary dark:text-accent">
                ${product.price.toFixed(2)}
              </strong>
            </div>

            {/* Qty increment controls */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-11 overflow-hidden shrink-0">
              <button 
                onClick={() => qty > 1 && setQty(qty - 1)}
                className="px-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold h-full"
              >
                −
              </button>
              <span className="px-4 text-sm font-semibold text-text-dark dark:text-gray-200 min-w-8 text-center">
                {qty}
              </span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold h-full"
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddAndClose}
              className="w-full sm:flex-grow h-11 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-semibold text-sm rounded shadow transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
