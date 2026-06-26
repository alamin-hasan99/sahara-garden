'use client';

import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';


// THEME CONTEXT

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('gg-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = preferDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('gg-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}


// PRODUCTS CONTEXT

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      refreshProducts: fetchProducts, 
      setProducts,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}


// CART CONTEXT & STATE REDUCER

const CartContext = createContext();

// Reducer for cart operations
const initialCartState = {
  cart: [],
  appliedCoupon: null,
  isCartOpen: false,
  checkoutModalOpen: false,
  lastOrder: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingIdx = state.cart.findIndex(item => item.product.id === product.id);
      let newCart = [...state.cart];

      if (existingIdx > -1) {
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity
        };
      } else {
        newCart.push({ product, quantity });
      }
      return { ...state, cart: newCart, isCartOpen: true };
    }
    case 'ADJUST_QTY': {
      const { productId, delta } = action.payload;
      let newCart = state.cart.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);

      return { ...state, cart: newCart };
    }
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const newCart = state.cart.filter(item => item.product.id !== productId);
      return { ...state, cart: newCart };
    }
    case 'APPLY_COUPON': {
      return { ...state, appliedCoupon: action.payload };
    }
    case 'SET_CART_OPEN': {
      return { ...state, isCartOpen: action.payload };
    }
    case 'SET_CHECKOUT_MODAL': {
      return { ...state, checkoutModalOpen: action.payload };
    }
    case 'SET_LAST_ORDER': {
      return { ...state, lastOrder: action.payload };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        cart: [],
        appliedCoupon: null,
        checkoutModalOpen: false,
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3300);
  };

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: qty } });
    showToast(`Added ${product.name} to your basket!`);
  };

  const adjustQty = (productId, delta) => {
    dispatch({ type: 'ADJUST_QTY', payload: { productId, delta } });
  };

  const removeItem = (productId, productName) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    showToast(`Removed ${productName} from basket.`);
  };

  const applyCoupon = (code) => {
    if (code === 'FRESH10') {
      dispatch({ type: 'APPLY_COUPON', payload: { code: 'FRESH10', value: 0.10 } });
      showToast('Discount FRESH10 applied!');
      return { success: true, message: "Coupon applied! 10% discount subtracted." };
    } else if (code === "") {
      return { success: false, message: "Please enter a coupon code." };
    } else {
      return { success: false, message: "Invalid promo code. Try 'FRESH10'!" };
    }
  };

  const setCartOpen = (isOpen) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
  };

  const setCheckoutModal = (isOpen) => {
    dispatch({ type: 'SET_CHECKOUT_MODAL', payload: isOpen });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const triggerCheckout = async () => {
    const subtotal = state.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const discount = state.appliedCoupon ? subtotal * 0.10 : 0;
    const shipping = subtotal > 50 ? 0 : 5;
    const tax = subtotal * 0.08;
    const total = subtotal - discount + shipping + tax;

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.cart,
          subtotal,
          discount,
          shipping,
          tax,
          total
        })
      });

      if (res.ok) {
        const order = await res.json();
        dispatch({ type: 'SET_LAST_ORDER', payload: order });
        dispatch({ type: 'SET_CART_OPEN', payload: false });
        dispatch({ type: 'SET_CHECKOUT_MODAL', payload: true });
        showToast('Order placed successfully!');
        return { success: true };
      } else {
        showToast('Checkout failed. Please try again.');
        return { success: false };
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Server connection error during checkout.');
      return { success: false };
    }
  };

  // Derived values
  const cartSubtotal = state.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartDiscount = state.appliedCoupon ? cartSubtotal * 0.10 : 0;
  const cartShipping = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 5;
  const cartTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal - cartDiscount + cartShipping + cartTax;
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        appliedCoupon: state.appliedCoupon,
        isCartOpen: state.isCartOpen,
        checkoutModalOpen: state.checkoutModalOpen,
        lastOrder: state.lastOrder,
        toasts,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartCount,
        addToCart,
        adjustQty,
        removeItem,
        applyCoupon,
        setCartOpen,
        setCheckoutModal,
        clearCart,
        triggerCheckout,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}


// COMBINED APP PROVIDER

export function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}
