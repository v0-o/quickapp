import { useCallback, useMemo } from 'react';
import { useUIStore } from '../store/uiStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { useHaptic } from './useHaptic.js';
import { PRODUCTS } from '../app/data/products.js';
import { trackEvent } from '../app/utils/analytics.js';

export const useProductLogic = () => {
  const { selectedCategory, setSelectedCategory, setSelectedProduct, setViewer } = useUIStore();
  const { wishlist, setWishlist } = useSettingsStore();
  const { light, success } = useHaptic();

  const productsToDisplay = useMemo(() => {
    if (selectedCategory === 'all') {
      return PRODUCTS;
    }
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = useCallback(
    (categoryId) => {
      light();
      setSelectedCategory(categoryId);
      trackEvent('category_changed', { category: categoryId });
    },
    [setSelectedCategory, light]
  );

  const handleViewDetails = useCallback(
    (product) => {
      light();
      setSelectedProduct(product);
      trackEvent('product_viewed', { product: product.name });
    },
    [setSelectedProduct, light]
  );

  const handleOpenViewer = useCallback(
    (product, startIndex = 0) => {
      light();
      setViewer(true, product, startIndex);
      trackEvent('viewer_opened', { product: product.name });
    },
    [setViewer, light]
  );

  const handleCloseViewer = useCallback(() => {
    setViewer(false, null, 0);
  }, [setViewer]);

  const handleToggleWishlist = useCallback(
    async (product) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      let newWishlist;

      if (isInWishlist) {
        newWishlist = wishlist.filter((item) => item.id !== product.id);
      } else {
        newWishlist = [...wishlist, product];
        success();
      }

      await setWishlist(newWishlist);
      trackEvent('wishlist_toggled', { product: product.name, added: !isInWishlist });
    },
    [wishlist, setWishlist, success]
  );

  const isProductInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  return {
    productsToDisplay,
    selectedCategory,
    handleCategoryChange,
    handleViewDetails,
    handleOpenViewer,
    handleCloseViewer,
    handleToggleWishlist,
    isProductInWishlist,
  };
};
