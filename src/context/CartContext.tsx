import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Product, Order, ShippingAddress } from "@/types";
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  placeOrder: (address: ShippingAddress) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("flipkart-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("flipkart-orders");
    return saved ? JSON.parse(saved) : [];
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("flipkart-cart", JSON.stringify(newItems));
  };

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [...prev, { product, quantity }];
      }
      localStorage.setItem("flipkart-cart", JSON.stringify(newItems));
      return newItems;
    });
    toast({ title: "Added to cart", description: product.name });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.product.id !== productId);
      localStorage.setItem("flipkart-cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const newItems = prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      localStorage.setItem("flipkart-cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    save([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const placeOrder = useCallback(
    (address: ShippingAddress) => {
      const orderId = "OD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      const order: Order = {
        id: orderId,
        items: [...items],
        total: getCartTotal(),
        address,
        date: new Date().toISOString(),
        status: "Confirmed",
      };
      const newOrders = [...orders, order];
      setOrders(newOrders);
      localStorage.setItem("flipkart-orders", JSON.stringify(newOrders));
      save([]);
      return orderId;
    },
    [items, orders, getCartTotal]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
