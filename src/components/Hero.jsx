'use client';

import React from 'react';

export default function Hero() {
  const handleShopClick = (e) => {
    e.preventDefault();
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      window.scrollTo({
        top: shopEl.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handlePhilosophyClick = (e) => {
    e.preventDefault();
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      window.scrollTo({
        top: aboutEl.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex flex-col justify-center bg-cover bg-center pt-24 overflow-hidden"
      style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/20 dark:from-slate-950/90 dark:via-slate-900/75 dark:to-slate-900/25 z-1" />

      {/* Premium Animated Fish & Bubble Aquarium */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
        {/* Animated Swimming Fish */}
        <div className="absolute w-[130px] h-auto top-[38%] left-[-150px] animate-swim drop-shadow-[0_6px_16px_rgba(18,43,30,0.25)] opacity-85">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" className="w-full h-full">
            {/* Tail fin */}
            <path 
              d="M75,30 C90,15 95,5 90,30 C95,55 90,45 75,30 Z" 
              className="animate-tail-wiggle fill-accent" 
              transformOrigin="75px 30px"
            />
            {/* Fish body */}
            <path 
              d="M15,30 C30,10 65,15 75,30 C65,45 30,50 15,30 Z" 
              fill="url(#fish-gradient)" 
            />
            {/* Dorsal fin */}
            <path 
              d="M40,18 C45,5 55,8 60,16 Z" 
              className="animate-dorsal-flap fill-accent opacity-90" 
              transformOrigin="50px 15px"
            />
            {/* Pectoral fin */}
            <path 
              d="M35,35 C32,45 42,48 45,40 Z" 
              className="animate-fin-flap fill-accent opacity-80" 
              transformOrigin="35px 35px"
            />
            {/* Eye */}
            <circle cx="28" cy="26" r="2.5" fill="#1b1b1a" />
            <circle cx="27" cy="25" r="1" fill="#ffffff" />
            {/* Gills */}
            <path d="M35,22 C37,25 37,35 35,38" stroke="rgba(27,27,26,0.3)" strokeWidth="1.5" fill="none" />
            
            <defs>
              <linearGradient id="fish-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffdf7a" />
                <stop offset="50%" stopColor="#cca43b" />
                <stop offset="100%" stopColor="#b58d2d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Aquarium Bubbles */}
        <div className="bubble absolute bottom-[-20px] w-2.5 h-2.5 bg-white/15 border border-white/25 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] left-[18%] animate-float-bubble [animation-duration:9s]" />
        <div className="bubble absolute bottom-[-20px] w-4 h-4 bg-white/15 border border-white/25 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] left-[42%] animate-float-bubble [animation-duration:13s] [animation-delay:3s]" />
        <div className="bubble absolute bottom-[-20px] w-2 h-2 bg-white/15 border border-white/25 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] left-[68%] animate-float-bubble [animation-duration:11s] [animation-delay:1s]" />
        <div className="bubble absolute bottom-[-20px] w-3 h-3 bg-white/15 border border-white/25 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] left-[85%] animate-float-bubble [animation-duration:10s] [animation-delay:5s]" />
      </div>

      {/* Hero Content */}
      <div className="max-w-[1200px] w-full mx-auto px-6 py-16 relative z-10 flex-grow flex items-center">
        <div className="max-w-[650px] text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white leading-tight mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-pop">
            Keep Freshness in your body.
          </h1>
          <p className="text-base sm:text-lg text-white/85 mb-10 font-light max-w-[550px] animate-fade leading-relaxed">
            Sahara Garden brings farm-fresh produce and artisan goods directly to you. From garden to table, experience the best in quality, flavor, and nutrition.
          </p>
          <div className="flex gap-4 animate-fade">
            <a 
              href="#shop" 
              onClick={handleShopClick}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-light dark:bg-accent dark:hover:bg-accent-hover text-white dark:text-primary font-semibold tracking-wide rounded border border-primary dark:border-accent hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(18,43,30,0.15)] transition-all duration-300"
            >
              Shop The Harvest
            </a>
            <a 
              href="#about" 
              onClick={handlePhilosophyClick}
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent hover:bg-white text-white hover:text-primary font-medium tracking-wide rounded border border-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Our Philosophy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
