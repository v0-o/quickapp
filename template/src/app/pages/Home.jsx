import { CategoryList } from "../components/CategoryList.jsx";
import { ProductGrid } from "../components/ProductGrid.jsx";
import { getBrand } from "../../config/loader.js";

export const Home = ({
  selectedCategory,
  handleCategoryChange,
  productsToDisplay,
  handleAddToCart,
  handleAnimateAdd,
  setSelectedProduct,
  wishlist,
  handleToggleWishlist,
  categoryScrollRef,
}) => {
  // Get brand info from config
  let brandName = "Boutique";

  try {
    const brand = getBrand();
    brandName = brand.name || "Boutique";
  } catch (error) {
    console.warn("Failed to load brand from config:", error);
  }

  return (
    <>
      <div className="h-4" />

      <header className="relative z-10 max-w-7xl mx-auto px-4 pb-4 pt-2 telegram-header">
        {/* Simple Brand Header */}
        <div className="text-center mb-4">
          <h1 
            className="text-4xl font-black gradient-text tracking-wide leading-tight uppercase drop-shadow-lg"
            style={{
              fontFamily: 'var(--theme-font-family, inherit)',
              fontWeight: 'var(--theme-font-weight, 900)'
            }}
          >
            {brandName}
          </h1>
        </div>

        <CategoryList
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          scrollRef={categoryScrollRef}
        />
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <ProductGrid
          products={productsToDisplay}
          onAddToCart={handleAddToCart}
          onAnimateAdd={handleAnimateAdd}
          onViewDetails={setSelectedProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      </main>
    </>
  );
};
