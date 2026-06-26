'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme, useCart, useProducts } from '@/context/AppContext';
import { Sun, Moon, Search, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useProducts();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const searchInputRef = useRef(null);

  // Monitor scroll for glassmorphic transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Simple active link spy
      const sections = ['home', 'shop', 'planner', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    setIsMobileMenuOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 py-6 ${
      isScrolled 
        ? 'glass-nav !py-4' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavLinkClick(e, 'home')}
          className="flex items-center gap-2.5 font-heading text-xl md:text-2xl font-bold text-primary dark:text-accent group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-7 h-7 text-accent transition-transform duration-500 group-hover:rotate-[-15deg] group-hover:scale-110"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"/>
            <path d="M9 22v-4h2"/>
          </svg>
          <span className="tracking-wide font-medium">Sahara Garden</span>
        </a>

        {/* Desktop Navigation Link Menu */}
        <nav className="hidden md:flex gap-10">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop' },
            { id: 'planner', label: 'Budget Planner' },
            { id: 'about', label: 'Our Story' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavLinkClick(e, item.id)}
              className={`font-body font-medium text-[0.95rem] py-1 relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-500 ${
                activeSection === item.id 
                  ? 'text-primary dark:text-accent after:w-full' 
                  : 'text-text-muted dark:text-gray-300 hover:text-primary dark:hover:text-accent after:w-0'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Utility Menu: Search, Theme, Basket, Mobile Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Expandable Live Search Box */}
          <div className="flex items-center relative bg-primary/[0.04] dark:bg-white/[0.05] p-2 rounded-full border border-transparent focus-within:border-secondary dark:focus-within:border-accent focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-500 w-10 focus-within:w-48 sm:focus-within:w-56 overflow-hidden">
            <button 
              onClick={() => searchInputRef.current?.focus()} 
              className="text-primary dark:text-accent flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search our harvest..." 
              className="w-full bg-transparent pl-2 text-sm outline-none border-none text-text-dark dark:text-gray-100 placeholder-text-muted dark:placeholder-gray-400"
            />
          </div>

          {/* Elegant Dark/Light Mode Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="p-2 bg-primary/[0.04] dark:bg-white/[0.05] hover:bg-primary dark:hover:bg-accent hover:text-white dark:hover:text-primary-dark rounded-full transition-all duration-300 text-primary dark:text-accent"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart Basket Indicator Button */}
          <button 
            onClick={() => setCartOpen(true)} 
            className="relative p-2 bg-primary/[0.04] dark:bg-white/[0.05] hover:bg-primary dark:hover:bg-accent hover:text-white dark:hover:text-primary-dark rounded-full transition-all duration-300 text-primary dark:text-accent"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-primary font-bold text-[0.7rem] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-[pulse_2s_infinite]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburguer Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-primary dark:text-accent hover:bg-primary/[0.04] dark:hover:bg-white/[0.05] rounded-full transition-all duration-300"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden fixed top-[72px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col py-4 px-6 gap-4">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop' },
            { id: 'planner', label: 'Budget Planner' },
            { id: 'about', label: 'Our Story' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavLinkClick(e, item.id)}
              className={`font-body font-semibold text-lg py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                activeSection === item.id 
                  ? 'text-accent' 
                  : 'text-text-muted dark:text-gray-300'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
