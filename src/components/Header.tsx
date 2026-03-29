import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, ChevronDown, Heart, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { searchProducts } from "@/data/products";

const Header = () => {
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const suggestions = searchQuery.length > 1 ? searchProducts(searchQuery).slice(0, 5) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center shrink-0">
            <span className="text-primary-foreground font-bold text-xl italic">Flipkart</span>
            <span className="text-[10px] text-primary-foreground/80 -mt-1 flex items-center gap-0.5">
              Explore <span className="text-flipkart-yellow font-medium">Plus</span>
              <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header/helper/plus-logo-9ee20e.svg" alt="" className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <div className="flex bg-white rounded-sm overflow-hidden">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-sm text-foreground outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button type="submit" className="px-4 text-primary">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-sm shadow-lg z-50">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent truncate"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Nav items */}
          <nav className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-primary-foreground font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 text-primary-foreground font-medium text-sm"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
            <Link
              to="/wishlist"
              className="flex items-center gap-1 text-primary-foreground font-medium text-sm"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1 text-primary-foreground font-medium text-sm relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-flipkart-yellow text-flipkart-dark text-[10px] font-bold rounded-sm px-1 min-w-[16px] text-center">
                  {cartCount}
                </span>
              )}
              <span className="ml-1 hidden sm:inline">Cart</span>
            </Link>
            <Link
              to="/orders"
              className="text-primary-foreground font-medium text-sm hidden md:block"
            >
              My Orders
            </Link>
          </nav>
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto py-2 text-xs font-medium text-foreground no-scrollbar">
            {["Electronics", "Fashion", "Home & Furniture", "Appliances", "Beauty & Personal Care", "Sports & Fitness", "Books", "Grocery"].map((cat) => (
              <Link
                key={cat}
                to={`/?category=${encodeURIComponent(cat)}`}
                className="whitespace-nowrap hover:text-primary transition-colors flex items-center gap-0.5"
              >
                {cat}
                <ChevronDown className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
