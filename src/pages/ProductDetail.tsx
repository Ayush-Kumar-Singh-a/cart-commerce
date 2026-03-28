import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="bg-card flipkart-shadow rounded-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Image section */}
            <div className="lg:w-[40%] p-4 lg:border-r border-border">
              <div className="sticky top-[120px]">
                <div className="flex gap-4">
                  {/* Thumbnails */}
                  <div className="flex flex-col gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 border-2 rounded-sm overflow-hidden ${
                          selectedImage === i ? "border-primary" : "border-border"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {/* Main image */}
                  <div className="flex-1 aspect-square flex items-center justify-center relative">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/80 p-1 rounded-full shadow"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-card/80 p-1 rounded-full shadow"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 h-12 bg-flipkart-yellow hover:bg-flipkart-yellow/90 text-foreground font-bold text-base rounded-sm"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    ADD TO CART
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex-1 h-12 bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold text-base rounded-sm"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    BUY NOW
                  </Button>
                </div>
              </div>
            </div>

            {/* Details section */}
            <div className="lg:w-[60%] p-6">
              <nav className="text-xs text-muted-foreground mb-2">
                Home &gt; {product.category} &gt; {product.brand}
              </nav>

              <h1 className="text-lg font-medium text-foreground mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-white text-sm font-bold px-2 py-0.5 rounded-sm">
                  {product.rating}
                  <Star className="w-3.5 h-3.5 fill-white" />
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {product.reviewCount.toLocaleString()} Ratings & Reviews
                </span>
              </div>

              <div className="mb-4">
                <span className="text-flipkart-green text-sm font-medium">
                  Extra {formatPrice(product.originalPrice - product.price)} off
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-base text-flipkart-green font-medium">
                  {product.discount}% off
                </span>
              </div>

              {!product.inStock ? (
                <p className="text-destructive font-medium mb-4">Currently Out of Stock</p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  {product.stockCount} items in stock
                </p>
              )}

              {/* Services */}
              <div className="flex gap-6 py-4 border-y border-border mb-6">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RefreshCw className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">7 Day Return</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Warranty</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-foreground mb-3">Highlights</h2>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-foreground mb-3">Specifications</h2>
                <div className="border border-border rounded-sm overflow-hidden">
                  {Object.entries(product.specifications).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex text-sm ${i > 0 ? "border-t border-border" : ""}`}
                    >
                      <span className="w-1/3 px-4 py-3 text-muted-foreground bg-accent/50">
                        {key}
                      </span>
                      <span className="flex-1 px-4 py-3 text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-bold text-foreground mb-3">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
