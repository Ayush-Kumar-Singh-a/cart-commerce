import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const { orders } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card flipkart-shadow rounded-sm">
            <div className="p-4 border-b border-border">
              <h1 className="text-lg font-bold text-foreground">My Orders</h1>
            </div>

            {orders.length === 0 ? (
              <div className="p-16 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">No orders yet</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Looks like you haven't placed any orders
                </p>
                <Link to="/">
                  <Button className="bg-primary text-primary-foreground rounded-sm px-12">
                    Shop Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {[...orders].reverse().map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Order ID: </span>
                        <span className="text-sm font-bold text-primary">{order.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="inline-block text-xs bg-flipkart-green/10 text-flipkart-green px-2 py-0.5 rounded-sm font-medium mt-1">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 items-center">
                          <img
                            src={item.product.images[0]}
                            alt=""
                            className="w-12 h-12 object-contain"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-dashed border-border flex justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-bold text-foreground">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
