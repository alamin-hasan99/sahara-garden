'use client';

import React from 'react';
import { useProducts, useCart } from '@/context/AppContext';
import { Star, Plus } from 'lucide-react';

export default function Shop({ onOpenProduct }) {
  const { products, loading, activeCategory, setActiveCategory, searchQuery } = useProducts();
  const { addToCart } = useCart();

  // Categories list
  const categories = [
    { id: 'all', label: 'All Harvest' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'pantry', label: 'Pantry' }
  ];

  // Filtering products
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="shop">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <h2 className="text-4xl font-bold font-heading text-primary dark:text-accent mb-4 relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[3px] after:bg-accent">
            Shop Our Fresh Harvest
          </h2>
          <p className="text-text-muted dark:text-gray-300 text-sm sm:text-base mt-3">
            Select from our daily freshly picked farm treasures, sorted and packed under strict quality control.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-10">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary dark:bg-accent text-white dark:text-primary shadow-sm'
                    : 'text-text-muted dark:text-gray-300 hover:text-primary dark:hover:text-accent hover:bg-primary/[0.04] dark:hover:bg-white/[0.03]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-text-muted dark:text-gray-400">
            {loading ? "Loading catalog..." : `Showing ${filteredProducts.length} results`}
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 font-medium text-text-muted dark:text-gray-400 animate-pulse">
            Loading today&apos;s fresh catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center text-text-muted dark:text-gray-400 italic">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-text-muted dark:text-gray-400 opacity-60 mb-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p className="text-base">No organic treasures match your search criteria. Try another filter!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id}
                className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/25 hover:-translate-y-2 transition-all duration-500 text-left relative"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Image Box */}
                <div className="relative aspect-square overflow-hidden bg-primary/[0.02] dark:bg-white/[0.01]">
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-accent text-primary font-bold text-[0.7rem] uppercase tracking-wider rounded">
                    {product.tag || 'Fresh Harvest'}
                  </span>
                  
                  <img 
                    src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/30 dark:bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                    <button 
                      onClick={() => onOpenProduct(product)}
                      className="px-6 py-2.5 bg-white/75 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-900 backdrop-blur text-primary dark:text-accent font-semibold text-xs rounded shadow-md transition-all duration-300 cursor-pointer"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-text-muted dark:text-gray-400 mb-2">
                      <span className="uppercase tracking-wider text-[0.65rem]">{product.category}</span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.9</span>
                      </span>
                    </div>
                    
                    <h3 className="font-heading font-bold text-lg text-primary dark:text-accent mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-muted dark:text-gray-300 font-light mb-6 line-clamp-2">
                      {product.shortDesc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-50 dark:border-gray-700/50 pt-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] text-text-muted dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Per Basket
                      </span>
                      <strong className="text-xl font-bold text-primary dark:text-gray-100">
                        ${product.price.toFixed(2)}
                      </strong>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="p-3 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary rounded-full transition-all duration-300 cursor-pointer hover:scale-105 shadow-md flex items-center justify-center"
                      aria-label={`Add ${product.name} to basket`}
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
