import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const order = orders.find((o) => o.id === orderId);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-card flipkart-shadow rounded-sm text-center p-10">
          <CheckCircle className="w-20 h-20 text-flipkart-green mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-1">Your order has been confirmed</p>
          <p className="text-sm text-foreground font-medium mb-6">
            Order ID: <span className="text-primary font-bold">{orderId}</span>
          </p>

          {order && (
            <div className="text-left border border-border rounded-sm mb-6">
              <div className="p-4 border-b border-border bg-accent/30">
                <h2 className="font-bold text-sm text-foreground">Order Details</h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-3 items-center">
                    <img src={item.product.images[0]} alt="" className="w-12 h-12 object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(order.total)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link to="/orders">
              <Button variant="outline" className="rounded-sm">View All Orders</Button>
            </Link>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground rounded-sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
