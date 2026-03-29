import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);
      if (data) setWishlistIds(data.map((r: any) => r.product_id));
      setLoading(false);
    };
    fetch();
  }, [user]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        toast({ title: "Please login", description: "Sign in to add items to your wishlist", variant: "destructive" });
        return;
      }
      const exists = wishlistIds.includes(productId);
      if (exists) {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
        toast({ title: "Removed from wishlist" });
      } else {
        setWishlistIds((prev) => [...prev, productId]);
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
        toast({ title: "Added to wishlist" });
      }
    },
    [user, wishlistIds]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
