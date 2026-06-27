// app/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

interface CartContextProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, qty: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('folden_cart');
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('folden_cart', JSON.stringify(items));
  }, [items]);

  const getKey = (id: number, size?: string) => `${id}-${size ?? 'default'}`;

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const key = getKey(item.id, item.size);
      const existing = prev.find(i => getKey(i.id, i.size) === key);
      if (existing) {
        return prev.map(i =>
          getKey(i.id, i.size) === key ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeFromCart = (id: number, size?: string) => {
    setItems(prev => prev.filter(i => getKey(i.id, i.size) !== getKey(id, size)));
  };

  const updateQuantity = (id: number, qty: number, size?: string) => {
    if (qty <= 0) { removeFromCart(id, size); return; }
    setItems(prev =>
      prev.map(i => getKey(i.id, i.size) === getKey(id, size) ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
