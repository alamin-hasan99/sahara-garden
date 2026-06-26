'use client';

import React from 'react';

export default function About() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800" id="about">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Panel */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-accent to-secondary rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-md">
              <img 
                src="/assets/hero-bg.png" 
                alt="Gourmet Garden rustic kitchen" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-left flex flex-col justify-center">
            <span className="self-start text-[0.7rem] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
              Est. 2018
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary dark:text-accent mb-6 leading-tight">
              Nurtured by Nature, Delivered by Hand
            </h2>
            
            <p className="text-xs sm:text-sm font-light text-text-muted dark:text-gray-300 mb-4 leading-relaxed">
              At Gourmet Garden, we believe in a harmonious relationship with our soil. We collaborate exclusively with regenerative, family-owned orchards and farms. No industrial warehousing, no chemical gas preservation, and no long cooling cycles.
            </p>
            
            <p className="text-xs sm:text-sm font-light text-text-muted dark:text-gray-300 mb-8 leading-relaxed">
              Every fruit, jar, and bundle is harvested at the peak of ripeness, washed by fresh well water, and brought directly to your kitchen. We combine ancient crop wisdom with carbon-neutral logistics to bring absolute purity back into the modern dining table.
            </p>

            <div className="flex flex-col gap-3 font-semibold text-xs sm:text-sm text-primary dark:text-accent">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary/10 dark:bg-accent/10 rounded-full flex items-center justify-center text-primary dark:text-accent text-[0.7rem] shrink-0">✓</span>
                <span>100% Biodynamic Farming</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary/10 dark:bg-accent/10 rounded-full flex items-center justify-center text-primary dark:text-accent text-[0.7rem] shrink-0">✓</span>
                <span>Compostable Zero-Plastic Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary/10 dark:bg-accent/10 rounded-full flex items-center justify-center text-primary dark:text-accent text-[0.7rem] shrink-0">✓</span>
                <span>Fair Trade Organic Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
