import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, Product } from '../types';

interface CartContextType {
  items: OrderItem[];
  addToOrder: (product: Product, quantity?: number, customNotes?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCustomNotes: (productId: string, notes: string) => void;
  removeFromOrder: (productId: string) => void;
  clearOrder: () => void;
  totalItemCount: number;
  estimatedSubtotal: number;
  hasQuoteItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'alifood_order_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addToOrder = (product: Product, quantity?: number, customNotes?: string) => {
    const qty = quantity && quantity > 0 ? quantity : (product.minQuantity || 1);
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                subtotal: (item.quantity + qty) * item.unitPrice,
                customNotes: customNotes || item.customNotes
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: qty,
          unit: product.unit,
          unitPrice: product.rate,
          priceVisible: product.priceVisible,
          subtotal: qty * product.rate,
          customNotes: customNotes || '',
          imageUrl: product.imageUrl,
          specification: product.processingSpecification
        }
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice
            }
          : item
      )
    );
  };

  const updateCustomNotes = (productId: string, customNotes: string) => {
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, customNotes } : item
      )
    );
  };

  const removeFromOrder = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearOrder = () => {
    setItems([]);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const estimatedSubtotal = items.reduce((sum, item) => {
    return item.priceVisible ? sum + item.subtotal : sum;
  }, 0);

  const hasQuoteItems = items.some(item => !item.priceVisible);

  return (
    <CartContext.Provider
      value={{
        items,
        addToOrder,
        updateQuantity,
        updateCustomNotes,
        removeFromOrder,
        clearOrder,
        totalItemCount,
        estimatedSubtotal,
        hasQuoteItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
