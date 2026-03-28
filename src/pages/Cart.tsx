import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const totalOriginal = items.reduce(
    (sum, i) => sum + i.product.originalPrice * i.quantity,
    0
  );
  const totalDiscount = totalOriginal - getCartTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-card flipkart-shadow rounded-sm p-16 text-center max-w-lg mx-auto">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Your cart is empty!</h2>
            <p className="text-sm text-muted-foreground mb-6">Add items to it now.</p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground rounded-sm px-12">
                Shop Now
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
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Cart items */}
          <div className="flex-1">
            <div className="bg-card flipkart-shadow rounded-sm">
              <div className="p-4 border-b border-border">
                <h1 className="text-lg font-bold text-foreground">
                  My Cart ({items.length})
                </h1>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-4">
                    <Link to={`/product/${item.product.id}`} className="w-28 h-28 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-sm text-foreground line-clamp-2 hover:text-primary">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                        <span className="text-base font-bold text-foreground">
                          {formatPrice(item.product.price)}
                        </span>
                        <span className="text-xs text-flipkart-green font-medium">
                          {item.product.discount}% off
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border rounded-full">
                          <button
                            onClick={() =>
                              item.quantity === 1
                                ? removeFromCart(item.product.id)
                                : updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium border-x border-border bg-accent/30">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-sm font-semibold text-foreground hover:text-destructive uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex justify-end">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold text-base rounded-sm px-12 h-12"
                >
                  PLACE ORDER
                </Button>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-card flipkart-shadow rounded-sm sticky top-[105px]">
              <div className="p-4 border-b border-border">
                <h2 className="text-muted-foreground font-bold text-sm uppercase">
                  Price Details
                </h2>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground">
                    Price ({items.length} item{items.length > 1 ? "s" : ""})
                  </span>
                  <span className="text-foreground">{formatPrice(totalOriginal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Discount</span>
                  <span className="text-flipkart-green">
                    − {formatPrice(totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Delivery Charges</span>
                  <span className="text-flipkart-green">FREE</span>
                </div>
                <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-foreground">{formatPrice(getCartTotal())}</span>
                </div>
                <p className="text-flipkart-green text-sm font-medium pt-2">
                  You will save {formatPrice(totalDiscount)} on this order
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
