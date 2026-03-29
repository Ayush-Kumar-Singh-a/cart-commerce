import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, Product, Order, ShippingAddress } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  placeOrder: (address: ShippingAddress) => Promise<string>;
  loadingOrders: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("flipkart-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders from Supabase on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Order[] = data.map((row: any) => ({
          id: row.order_id,
          items: row.items as CartItem[],
          total: Number(row.total),
          address: {
            fullName: row.full_name,
            phone: row.phone,
            addressLine1: row.address_line1,
            addressLine2: row.address_line2 || "",
            city: row.city,
            state: row.state,
            pincode: row.pincode,
          },
          date: row.created_at,
          status: row.status,
        }));
        setOrders(mapped);
      }
      setLoadingOrders(false);
    };
    fetchOrders();
  }, []);

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
    async (address: ShippingAddress): Promise<string> => {
      const orderId =
        "OD" +
        Date.now().toString(36).toUpperCase() +
        Math.random().toString(36).substring(2, 6).toUpperCase();

      const { error } = await supabase.from("orders").insert({
        order_id: orderId,
        items: items as any,
        total: getCartTotal(),
        full_name: address.fullName,
        email: address.email,
        phone: address.phone,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2 || null,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        status: "Confirmed",
      });

      if (error) {
        toast({ title: "Error placing order", description: error.message, variant: "destructive" });
        throw error;
      }

      const newOrder: Order = {
        id: orderId,
        items: [...items],
        total: getCartTotal(),
        address,
        date: new Date().toISOString(),
        status: "Confirmed",
      };
      setOrders((prev) => [newOrder, ...prev]);
      save([]);
      return orderId;
    },
    [items, getCartTotal]
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
        loadingOrders,
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
