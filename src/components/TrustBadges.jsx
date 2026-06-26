'use client';

import React from 'react';
import { ShieldCheck, Truck, Heart } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="relative z-10 glass-nav border-t border-white/20 dark:border-slate-800/50 py-8">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Badge 1 */}
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-accent w-7 h-7 shrink-0" />
          <div className="text-left">
            <h3 className="font-body text-sm sm:text-base font-semibold text-primary dark:text-accent mb-1">
              100% Certified Organic
            </h3>
            <p className="text-[0.8rem] sm:text-xs text-text-muted dark:text-gray-300">
              Pesticide & GMO free crops
            </p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-start gap-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-6 md:pt-0 md:pl-8">
          <Truck className="text-accent w-7 h-7 shrink-0" />
          <div className="text-left">
            <h3 className="font-body text-sm sm:text-base font-semibold text-primary dark:text-accent mb-1">
              Same Day Dispatch
            </h3>
            <p className="text-[0.8rem] sm:text-xs text-text-muted dark:text-gray-300">
              Harvested & shipped in hours
            </p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-start gap-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-6 md:pt-0 md:pl-8">
          <Heart className="text-accent w-7 h-7 shrink-0" />
          <div className="text-left">
            <h3 className="font-body text-sm sm:text-base font-semibold text-primary dark:text-accent mb-1">
              Artisanal Excellence
            </h3>
            <p className="text-[0.8rem] sm:text-xs text-text-muted dark:text-gray-300">
              Supporting local family farms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
