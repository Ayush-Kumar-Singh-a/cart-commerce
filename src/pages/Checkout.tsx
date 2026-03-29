import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShippingAddress } from "@/types";

const Checkout = () => {
  const { items, getCartTotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderId = await placeOrder(address);
      navigate(`/order-confirmation/${orderId}`);
    } catch {
      setPlacing(false);
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Address form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="bg-card flipkart-shadow rounded-sm">
                <div className="p-4 border-b border-border bg-primary">
                  <h1 className="text-lg font-bold text-primary-foreground">
                    Delivery Address
                  </h1>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={address.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className="mt-1 rounded-sm"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        value={address.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="mt-1 rounded-sm"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Address Line 1 *
                    </label>
                    <Input
                      required
                      value={address.addressLine1}
                      onChange={(e) => handleChange("addressLine1", e.target.value)}
                      className="mt-1 rounded-sm"
                      placeholder="House No., Building, Street"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Address Line 2
                    </label>
                    <Input
                      value={address.addressLine2}
                      onChange={(e) => handleChange("addressLine2", e.target.value)}
                      className="mt-1 rounded-sm"
                      placeholder="Area, Colony (Optional)"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        City *
                      </label>
                      <Input
                        required
                        value={address.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="mt-1 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        State *
                      </label>
                      <Input
                        required
                        value={address.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className="mt-1 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Pincode *
                      </label>
                      <Input
                        required
                        value={address.pincode}
                        onChange={(e) => handleChange("pincode", e.target.value)}
                        className="mt-1 rounded-sm"
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={placing}
                    className="bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold rounded-sm h-12 w-full sm:w-auto sm:px-16 text-base"
                  >
                    {placing ? "PLACING ORDER..." : "PLACE ORDER"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Order summary */}
            <div className="bg-card flipkart-shadow rounded-sm mt-4">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Order Summary</h2>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-4 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price details */}
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
                  <span className="text-foreground">
                    {formatPrice(items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Discount</span>
                  <span className="text-flipkart-green">
                    − {formatPrice(
                      items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0) - getCartTotal()
                    )}
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
