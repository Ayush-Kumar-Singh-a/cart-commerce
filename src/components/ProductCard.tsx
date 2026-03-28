import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-card p-4 flex flex-col hover:flipkart-shadow-hover transition-shadow group"
    >
      <div className="aspect-square w-full flex items-center justify-center overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h3 className="text-sm text-foreground line-clamp-2 mb-1 font-medium">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
          {product.rating}
          <Star className="w-3 h-3 fill-white" />
        </span>
        <span className="text-muted-foreground text-xs">
          ({product.reviewCount.toLocaleString()})
        </span>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-base font-bold text-foreground">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(product.originalPrice)}
        </span>
        <span className="text-xs text-flipkart-green font-medium">
          {product.discount}% off
        </span>
      </div>
      {!product.inStock && (
        <span className="text-xs text-destructive font-medium mt-1">Out of Stock</span>
      )}
    </Link>
  );
};

export default ProductCard;
