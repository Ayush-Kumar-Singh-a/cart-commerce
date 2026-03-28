import { useSearchParams } from "react-router-dom";
import { products, categories, searchProducts, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { useState, useMemo } from "react";
import { Filter } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }
    if (selectedCategory || categoryFilter) {
      const cat = selectedCategory || categoryFilter;
      result = result.filter((p) => p.category === cat);
    }
    return result;
  }, [searchQuery, selectedCategory, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="bg-card flipkart-shadow rounded-sm sticky top-[105px]">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-bold text-lg text-foreground">Filters</h2>
                <Filter className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory && !categoryFilter}
                      onChange={() => setSelectedCategory("")}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={(selectedCategory || categoryFilter) === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-card flipkart-shadow rounded-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-lg text-foreground">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory || categoryFilter
                    ? selectedCategory || categoryFilter
                    : "All Products"}
                </h1>
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-card flipkart-shadow rounded-sm p-16 text-center">
                <p className="text-muted-foreground text-lg">No products found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
