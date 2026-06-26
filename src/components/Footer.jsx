'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/AppContext';


export default function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFeedback({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ text: 'Connecting to farm server...', type: '' });

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alreadyExists) {
          setFeedback({ text: 'You are already subscribed to our farm bulletins!', type: 'success' });
          showToast('Already subscribed!');
        } else {
          setFeedback({ text: 'Thank you! You are now subscribed to Gourmet Garden bulletins.', type: 'success' });
          setEmail('');
          showToast('Subscribed successfully to harvest updates!');
        }
      } else {
        setFeedback({ text: 'Failed to connect to the farm database.', type: 'error' });
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setFeedback({ text: 'Network error. Try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-primary dark:bg-slate-950 text-white dark:text-gray-200 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left mb-12">
        
        {/* Brand Block */}
        <div className="flex flex-col gap-4">
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex items-center gap-2 text-xl font-heading font-bold text-accent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6 text-accent"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"/>
              <path d="M9 22v-4h2"/>
            </svg>
            <span>Sahara Garden</span>
          </a>
          <p className="text-xs font-light text-white/70 dark:text-gray-400 leading-relaxed">
            Reconnecting you to authentic farm-fresh food, grown responsibly, harvested dynamically, and packed safely for premium culinary homes.
          </p>
          
          <div className="flex gap-4 mt-2">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-white/10 dark:border-slate-800 hover:border-accent hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-white/10 dark:border-slate-800 hover:border-accent hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-full border border-white/10 dark:border-slate-800 hover:border-accent hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {/* Explore Block */}
        <div>
          <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-6">
            Explore
          </h3>
          <ul className="flex flex-col gap-3.5 text-xs font-light text-white/70 dark:text-gray-400">
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-accent transition-colors">
                Fresh Produce
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-accent transition-colors">
                Raw Sweets & Honey
              </a>
            </li>
            <li>
              <a href="#shop" onClick={(e) => handleLinkClick(e, 'shop')} className="hover:text-accent transition-colors">
                Pantry Oils
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-accent transition-colors">
                Our Soil Standard
              </a>
            </li>
          </ul>
        </div>

        {/* Support Block */}
        <div>
          <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-6">
            Support
          </h3>
          <ul className="flex flex-col gap-3.5 text-xs font-light text-white/70 dark:text-gray-400">
            <li>
              <a href="#" className="hover:text-accent transition-colors">Eco-Shipping Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Return & Fresh Guarantee</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Partner Farms Program</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">FAQ & Support</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Block */}
        <div>
          <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-6">
            Subscribe to Our Harvest
          </h3>
          <p className="text-xs font-light text-white/70 dark:text-gray-400 leading-relaxed mb-4">
            Sign up to receive morning harvest bulletins, rare artisan alerts, and recipes.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 dark:border-slate-800 focus:border-accent rounded p-2.5 text-xs text-white outline-none transition-colors"
              aria-label="Email address"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-primary font-bold text-xs tracking-wider uppercase rounded shadow transition-colors cursor-pointer"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {feedback.text && (
            <div className={`text-[0.7rem] font-semibold mt-2 ${
              feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 border-t border-white/5 pt-8 text-center text-[0.7rem] font-light text-white/40 dark:text-gray-500">
        <p>&copy; 2026 Sahara Garden Organic Store. All rights reserved. Supporting sustainable, small-scale regenerative farming.</p>
      </div> 
    </footer>
  );
}
