'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import BudgetPlanner from '@/components/BudgetPlanner';
import Shop from '@/components/Shop';
import About from '@/components/About';
import ProductModal from '@/components/ProductModal';
import CartSidebar from '@/components/CartSidebar';
import CheckoutModal from '@/components/CheckoutModal';
import Toast from '@/components/Toast';
import Footer from '@/components/Footer';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <TrustBadges />
        <Shop onOpenProduct={setSelectedProduct} />
        <BudgetPlanner />
        <About />
        
        {/* Contact Section */}
        <section className="py-24 bg-[#fcfaf6] dark:bg-slate-950/20 border-t border-gray-100 dark:border-slate-800" id="contact">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="max-w-[600px] mx-auto mb-12">
              <h2 className="text-4xl font-bold font-heading text-primary dark:text-accent mb-4 relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[3px] after:bg-accent">
                Contact Sahara Garden
              </h2>
              <p className="text-text-muted dark:text-gray-300 text-sm sm:text-base mt-3">
                Have questions about our harvest schedules or partner farms? Connect with our master growers today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-6">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-accent mb-2.5 block">Call Us</span>
                <p className="text-base font-heading font-semibold text-primary dark:text-accent">+8801770583739</p>
                <p className="text-[0.7rem] text-text-muted dark:text-gray-400 mt-1">Daily 7:00 AM — 5:00 PM EST</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-accent mb-2.5 block">Visit the Barn</span>
                <p className="text-base font-heading font-semibold text-primary dark:text-accent">Mohakhali DOHS</p>
                <p className="text-[0.7rem] text-text-muted dark:text-gray-400 mt-1">Dhaka, Bangladesh</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-accent mb-2.5 block">Email Inquiries</span>
                <p className="text-base font-heading font-semibold text-primary dark:text-accent">saharagarden@gmail.com</p>
                <p className="text-[0.7rem] text-text-muted dark:text-gray-400 mt-1">Fast answers within 30 minutes</p>
              </div>
            </div>
          </div>
        </section>
      </main> 
      
      <Footer />
      
      {/* Overlays / Modals */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartSidebar />
      <CheckoutModal />
      <Toast />
    </>
  );
}
