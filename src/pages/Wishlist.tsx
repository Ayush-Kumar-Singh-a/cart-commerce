import Header from "@/components/Header";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();

  const products = wishlistIds
    .map((id) => getProductById(id))
    .filter(Boolean);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-card flipkart-shadow rounded-sm p-16 text-center max-w-lg mx-auto">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Please login to view your wishlist</h2>
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground rounded-sm px-12">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="bg-card flipkart-shadow rounded-sm">
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-bold text-foreground">
              My Wishlist ({products.length})
            </h1>
          </div>
          {products.length === 0 ? (
            <div className="p-16 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty!</h2>
              <p className="text-sm text-muted-foreground mb-6">Add items to it now.</p>
              <Link to="/">
                <Button className="bg-primary text-primary-foreground rounded-sm px-12">
                  Shop Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-border">
              {products.map((product) => (
                <ProductCard key={product!.id} product={product!} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
