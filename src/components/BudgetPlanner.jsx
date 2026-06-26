'use client';

import React, { useState, useEffect } from 'react';
import { useProducts, useCart } from '@/context/AppContext';
import { Info, Plus, Trash2, ListMinus, ShoppingCart } from 'lucide-react';

export default function BudgetPlanner() {
  const { products } = useProducts();
  const { addToCart, showToast } = useCart();

  // Planner States
  const [budget, setBudget] = useState(100);
  const [draftItems, setDraftItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  // Synchronize inputs
  const handleBudgetChange = (value) => {
    let parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) parsed = 10;
    if (parsed > 1000) parsed = 1000;
    setBudget(parsed);
  };

  // Calculations
  const subtotal = draftItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const grandTotal = subtotal + tax + shipping;

  const remaining = budget - grandTotal;
  const percentage = Math.min((grandTotal / budget) * 100, 100);

  // Add Item handler
  const handleAddItem = () => {
    if (selectedProductId) {
      const product = products.find(p => p.id === parseInt(selectedProductId));
      if (!product) return;

      const existingIdx = draftItems.findIndex(item => item.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...draftItems];
        updated[existingIdx].quantity += 1;
        setDraftItems(updated);
        showToast(`Increased draft quantity for ${product.name}!`);
      } else {
        setDraftItems(prev => [...prev, {
          id: `catalog-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          isCatalog: true
        }]);
        showToast(`Added ${product.name} to draft list!`);
      }
      setSelectedProductId('');
    } else if (customName && customPrice && parseFloat(customPrice) >= 0) {
      setDraftItems(prev => [...prev, {
        id: `custom-${Date.now()}-${Math.random()}`,
        productId: null,
        name: customName,
        price: parseFloat(customPrice),
        quantity: 1,
        isCatalog: false
      }]);
      showToast(`Added custom item "${customName}" to draft list!`);
      setCustomName('');
      setCustomPrice('');
    } else {
      showToast("Please select a product or fill in custom item details!");
    }
  };

  const adjustQty = (id, delta) => {
    const updated = draftItems.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean);
    setDraftItems(updated);
  };

  const removeItem = (id, name) => {
    setDraftItems(prev => prev.filter(item => item.id !== id));
    showToast(`Removed "${name}" from draft list.`);
  };

  const clearPlanner = () => {
    setDraftItems([]);
    showToast("Planner list cleared!");
  };

  const transferToBasket = () => {
    const catalogItems = draftItems.filter(item => item.isCatalog);
    if (catalogItems.length === 0) {
      showToast("No standard catalog items found to transfer!");
      return;
    }

    catalogItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });

    const customItemsCount = draftItems.length - catalogItems.length;
    if (customItemsCount > 0) {
      setTimeout(() => {
        showToast(`Note: ${customItemsCount} custom item(s) could not be loaded into cart.`);
      }, 1200);
    }
  };

  return (
    <section className="py-24 bg-[#f6f3eb] dark:bg-slate-950/40 animate-fade" id="planner">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <h2 className="text-4xl font-bold font-heading text-primary dark:text-accent mb-4 relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[3px] after:bg-accent">
            Pre-Shopping Budget Planner
          </h2>
          <p className="text-text-muted dark:text-gray-300 text-sm sm:text-base mt-3">
            Set your target budget, draft your items list, and calculate estimated costs in real-time before you shop.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Panel: Budget Configuration & Visual Progress */}
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-heading font-semibold text-primary dark:text-accent mb-6">
                1. Configure Your Budget
              </h3>
              
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 mb-3">
                  Planned Budget Limit
                </label>
                
                <div className="flex items-center bg-primary/[0.04] dark:bg-white/[0.05] border border-white/40 dark:border-slate-800 rounded-lg p-3 mb-4">
                  <span className="text-primary dark:text-accent font-semibold text-lg pr-2">$</span>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    min="10" 
                    max="1000" 
                    className="w-full bg-transparent text-lg font-semibold text-primary dark:text-gray-100 outline-none border-none"
                    aria-label="Enter budget amount"
                  />
                </div>

                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="5" 
                  value={budget} 
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  aria-label="Adjust budget limit"
                />
              </div>

              {/* Dynamic Visual Gauge */}
              <div className="mb-6">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      grandTotal > budget 
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                        : percentage >= 80 
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                          : 'bg-accent shadow-[0_0_8px_rgba(204,164,59,0.5)]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-text-muted dark:text-gray-300">Spent: ${grandTotal.toFixed(2)}</span>
                  <span className={remaining < 0 ? 'text-red-500' : 'text-text-muted dark:text-gray-300'}>
                    {remaining < 0 
                      ? `Over by: $${Math.abs(remaining).toFixed(2)}` 
                      : `Remaining: $${remaining.toFixed(2)}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Recommendation Tips (Aesthetic alert box) */}
            <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors duration-300 text-left ${
              grandTotal === 0
                ? 'bg-primary/[0.04] dark:bg-white/[0.03] border-primary/10 dark:border-slate-800 text-text-muted dark:text-gray-300'
                : grandTotal > budget
                  ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                  : shipping > 0
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                    : 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
            }`}>
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">
                {grandTotal === 0 ? (
                  "Add items to see your progress and get custom savings recommendations!"
                ) : grandTotal > budget ? (
                  <><strong>Warning:</strong> Your draft list exceeds your budget by <strong>${Math.abs(remaining).toFixed(2)}</strong>! Remove custom items or lower quantities to align with your budget.</>
                ) : shipping > 0 ? (
                  <>Tip: Add catalog produce worth <strong>${(50 - subtotal).toFixed(2)}</strong> more to secure <strong>FREE Eco-friendly Shipping</strong> and save $5.00!</>
                ) : (
                  <>Awesome! You&apos;ve unlocked <strong>FREE carbon-neutral shipping</strong> and are comfortably within your budget constraint!</>
                )}
              </span>
            </div>
          </div>

          {/* Right Panel: Pre-Shopping Item Builder */}
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-heading font-semibold text-primary dark:text-accent mb-6">
                2. Add Items to Draft List
              </h3>
              
              <div className="flex flex-col gap-4 mb-6">
                {/* Select standard products from Catalog */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-text-muted dark:text-gray-400 mb-1.5">
                    Select Catalog Product
                  </label>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      setCustomName('');
                      setCustomPrice('');
                    }}
                    className="w-full bg-primary/[0.04] dark:bg-white/[0.05] border border-white/40 dark:border-slate-800 rounded-lg p-2.5 text-sm text-text-dark dark:text-gray-100 outline-none focus:border-accent"
                  >
                    <option value="">-- Choose from Harvest Catalog --</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between text-xs text-text-muted dark:text-gray-400 font-semibold my-1">
                  <hr className="w-1/3 border-gray-300 dark:border-gray-800" />
                  <span>OR Add Custom Item</span>
                  <hr className="w-1/3 border-gray-300 dark:border-gray-800" />
                </div>

                {/* Custom Item name and price inputs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 text-left">
                    <label className="block text-xs font-semibold text-text-muted dark:text-gray-400 mb-1.5">
                      Custom Item Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Milk, Organic Herbs" 
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setSelectedProductId('');
                      }}
                      className="w-full bg-primary/[0.04] dark:bg-white/[0.05] border border-white/40 dark:border-slate-800 rounded-lg p-2.5 text-sm text-text-dark dark:text-gray-100 outline-none focus:border-accent"
                    />
                  </div>
                  <div className="col-span-1 text-left">
                    <label className="block text-xs font-semibold text-text-muted dark:text-gray-400 mb-1.5">
                      Price ($)
                    </label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={customPrice}
                      onChange={(e) => {
                        setCustomPrice(e.target.value);
                        setSelectedProductId('');
                      }}
                      min="0" 
                      step="0.01" 
                      className="w-full bg-primary/[0.04] dark:bg-white/[0.05] border border-white/40 dark:border-slate-800 rounded-lg p-2.5 text-sm text-text-dark dark:text-gray-100 outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddItem}
                  className="w-full py-3 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-semibold text-sm rounded shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add to Draft List
                </button>
              </div>
            </div>

            {/* Live Draft List Table */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400 text-left mb-3 flex items-center justify-between">
                <span>My Draft List</span>
                <span className="bg-primary/10 dark:bg-white/10 text-primary dark:text-accent rounded-full px-2 py-0.5 text-[0.7rem] font-semibold">
                  {draftItems.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
              </h4>
              <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-col gap-2">
                {draftItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-text-muted dark:text-gray-400 opacity-60">
                    <ListMinus className="w-8 h-8 mb-2 stroke-[1.2]" />
                    <p className="text-xs">Your draft list is currently empty.</p>
                  </div>
                ) : (
                  draftItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-primary/[0.02] dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50 rounded-lg p-2 gap-2 text-left">
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-primary dark:text-gray-100 truncate block max-w-[120px]" title={item.name}>
                            {item.name}
                          </span>
                          <span className={`text-[0.6rem] font-semibold px-1 rounded ${
                            item.isCatalog 
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                          }`}>
                            {item.isCatalog ? 'Catalog' : 'Custom'}
                          </span>
                        </div>
                        <span className="text-[0.7rem] text-text-muted dark:text-gray-400 font-medium">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <button 
                            onClick={() => adjustQty(item.id, -1)}
                            className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-semibold text-text-dark dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => adjustQty(item.id, 1)}
                            className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.name)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary & Basket Integration Bar */}
        <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto text-left">
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-1">
                Subtotal
              </span>
              <strong className="text-base font-semibold text-primary dark:text-accent">
                ${subtotal.toFixed(2)}
              </strong>
            </div>
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-1">
                Tax (8%)
              </span>
              <span className="text-base text-text-dark dark:text-gray-200 font-medium">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-1">
                Eco-Shipping
              </span>
              <span className="text-base text-text-dark dark:text-gray-200 font-medium">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 block mb-1">
                Est. Total
              </span>
              <strong className="text-lg font-bold text-primary dark:text-accent">
                ${grandTotal.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button 
              type="button" 
              onClick={clearPlanner}
              className="px-5 py-2.5 border border-primary/20 hover:border-primary/55 text-primary dark:border-accent/20 dark:hover:border-accent dark:text-accent font-semibold text-sm rounded transition-all duration-300 cursor-pointer"
            >
              Clear Planner
            </button>
            <button 
              type="button" 
              onClick={transferToBasket}
              disabled={!draftItems.some(i => i.isCatalog)}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-primary font-semibold text-sm rounded shadow hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Transfer to Basket
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
