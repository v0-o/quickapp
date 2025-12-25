import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ensureTangerineNamespace } from "./lib/registry.js";

// Config System
import { loadConfig } from "./config/loader.js";
import { initializeProducts } from "./app/data/products.js";
import { initializeConstants } from "./app/constants/index.js";

// Stores & Hooks
import { useCartStore } from "./store/cartStore.js";
import { useUIStore } from "./store/uiStore.js";
import { useSettingsStore } from "./store/settingsStore.js";
import { useCartLogic } from "./hooks/useCartLogic.js";
import { useTMALogic } from "./hooks/useTMALogic.js";
import { useDataLoad } from "./hooks/useDataLoad.js";
import { getVideoManager } from "./app/utils/videoManager.js";
import {
  disableUmamiForOwner,
  scheduleDeferredAnalyticsLoad,
  trackEvent,
} from "./app/utils/analytics.js";

// Constants & Data (will be initialized after config loads)
import {
  DELIVERY_PRICES,
  MIN_WEIGHT,
  PROMO_CODES,
  WELCOME_STORAGE_KEY,
} from "./app/constants/index.js";
import { PRODUCTS } from "./app/data/products.js";

// Components
import { MainLayout } from "./app/components/MainLayout.jsx";
import { Home } from "./app/pages/Home.jsx";
import { WebVitalsReporter } from "./app/components/WebVitalsReporter.jsx";

const App = () => {
  // 0. Config Loading State
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(null);

  // 1. Initialize Data & Logic
  const { isLoading } = useDataLoad();
  const { isFullscreen, homeScreenStatus, handleAddToHomeScreen, miniApp } =
    useTMALogic();
  const {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    clearCart,
  } = useCartLogic();

  // 2. Global State
  const {
    isCartOpen,
    setCartOpen,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    isContactOpen,
    setIsContactOpen,
    showConfirmation,
    setShowConfirmation,
    viewerOpen,
    viewerProduct,
    viewerStartIndex,
    setViewer,
    notification,
    showNotification,
    hideNotification,
    showWelcome,
    setShowWelcome,
    welcomeRendered,
    setWelcomeRendered,
    addAnimation,
  } = useUIStore();

  const {
    deliveryCity,
    setDeliveryCity,
    paymentMethod,
    setPaymentMethod,
    appliedPromo,
    setAppliedPromo,
    wishlist,
    setWishlist,
    orderHistory,
    setOrderHistory,
    theme,
    setTheme,
  } = useSettingsStore();

  // 3. Local UI State
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [horizontalScrollProgress, setHorizontalScrollProgress] = useState(0);

  // 4. Refs
  const welcomeTimerRef = useRef(null);
  const welcomeUnmountRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const cartButtonRef = useRef(null);
  const auroraRef = useRef(null);
  const videoManagerRef = useRef(getVideoManager());

  // 5. Computed Values
  const isTelegramIOS = useMemo(() => {
    try {
      if (typeof window === "undefined") return false;
      const plat = window.Telegram?.WebApp?.platform || "";
      return String(plat).toLowerCase() === "ios";
    } catch (error) {
      return false;
    }
  }, []);

  // Load configuration on mount
  useEffect(() => {
    async function initializeApp() {
      try {
        console.log("🔄 Loading configuration...");
        await loadConfig();
        console.log("✅ Configuration loaded");

        console.log("🔄 Initializing products...");
        initializeProducts();
        console.log("✅ Products initialized");

        console.log("🔄 Initializing constants...");
        initializeConstants();
        console.log("✅ Constants initialized");

        setConfigLoaded(true);
        console.log("🎉 App ready!");
      } catch (error) {
        console.error("❌ Failed to load configuration:", error);
        setConfigError(error.message || "Failed to load configuration");
      }
    }

    initializeApp();
  }, []);

  const productsToDisplay = useMemo(() => {
    if (!configLoaded) return [];
    if (selectedCategory === "all") {
      return PRODUCTS;
    }
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryPrice = DELIVERY_PRICES[deliveryCity]?.price || 0;
  const orderTotal = subtotal + deliveryPrice;
  const discount =
    appliedPromo && PROMO_CODES[appliedPromo]
      ? Math.round(orderTotal * PROMO_CODES[appliedPromo].discount)
      : 0;
  const total = orderTotal - discount;

  // 6. Effects
  useEffect(() => {
    ensureTangerineNamespace();
    if (typeof window !== "undefined") {
      window.videoManager = videoManagerRef.current;
    }
  }, []);

  useEffect(() => {
    const handleHorizontalScroll = (e) => {
      if (!e.target) return;
      const scrollLeft = e.target.scrollLeft;
      const scrollWidth = e.target.scrollWidth - e.target.clientWidth;
      const scrolled = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      setHorizontalScrollProgress(scrolled);
    };

    const productContainer = document.querySelector("[data-product-scroll]");
    if (productContainer) {
      productContainer.addEventListener("scroll", handleHorizontalScroll, {
        passive: true,
      });
      return () =>
        productContainer.removeEventListener("scroll", handleHorizontalScroll);
    }
  }, [isLoading]);

  useEffect(() => {
    let cleanup;
    try {
      const disabled = disableUmamiForOwner();
      if (!disabled) {
        cleanup = scheduleDeferredAnalyticsLoad();
      }
    } catch (error) {
      console.warn("Deferred analytics init failed", error);
    }
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  // Track notification clicks via UTM parameters
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source");
      const utmCampaign = urlParams.get("utm_campaign");

      if (utmSource === "telegram" && utmCampaign) {
        // Track in Umami Analytics
        trackEvent("notification_click", {
          campaign: utmCampaign,
          timestamp: new Date().toISOString(),
        });

        console.log("📊 Notification click tracked:", utmCampaign);
      }
    } catch (error) {
      console.warn("UTM tracking failed", error);
    }
  }, []);

  // Particles Logic
  useEffect(() => {
    try {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      const isFast = connection
        ? connection.saveData
          ? false
          : (connection.effectiveType || "").toLowerCase().includes("4g")
        : true;
      const allowParticles =
        isFast || (typeof window !== "undefined" && window.innerWidth >= 360);
      setShowParticles(allowParticles);
    } catch {
      if (typeof window !== "undefined") {
        setShowParticles(window.innerWidth > 700);
      }
    }
  }, []);

  // Video Preload Logic
  useEffect(() => {
    if (isLoading || isTelegramIOS) return;

    try {
      const isMobile =
        typeof window !== "undefined" &&
        (window.innerWidth <= 900 ||
          /Mobi|Android/i.test(navigator.userAgent || ""));
      const toPreload = PRODUCTS.slice(0, isMobile ? 5 : 8); // Increased from 3/5 to 5/8

      toPreload.forEach((product) => {
        if (product.thumbnail) {
          const img = new Image();
          img.src = product.thumbnail;
          img.fetchPriority = "high";
        }
      });

      toPreload.forEach((product, index) => {
        const videoUrls = (product.media || []).slice(0, 1);
        videoUrls.forEach((src) => {
          if (!src.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return;
          setTimeout(
            () => {
              videoManagerRef.current.preloadVideo(src);
            },
            index * (isMobile ? 20 : 100),
          ); // Reduced from 50/200 to 20/100
        });
      });
    } catch {
      /* ignore */
    }
  }, [isLoading, isTelegramIOS]);

  // Welcome Toast Logic
  const markWelcomeSeen = useCallback(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(WELCOME_STORAGE_KEY, "1");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const clearWelcomeTimers = useCallback(() => {
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    if (welcomeUnmountRef.current) {
      clearTimeout(welcomeUnmountRef.current);
      welcomeUnmountRef.current = null;
    }
  }, []);

  const handleDismissWelcome = useCallback(
    (source = "manual") => {
      setShowWelcome(false);
      markWelcomeSeen();
      if (source === "manual") clearWelcomeTimers();
    },
    [clearWelcomeTimers, markWelcomeSeen, setShowWelcome],
  );

  useEffect(() => {
    if (isLoading || welcomeRendered) return;

    let alreadySeen = false;
    try {
      if (typeof localStorage !== "undefined") {
        alreadySeen = localStorage.getItem(WELCOME_STORAGE_KEY) === "1";
      }
    } catch (error) {
      /* ignore */
    }

    setWelcomeRendered(true);

    if (alreadySeen) {
      markWelcomeSeen();
      return;
    }

    welcomeTimerRef.current = setTimeout(() => {
      welcomeTimerRef.current = null;
      setShowWelcome(true);
      markWelcomeSeen();
      trackEvent("welcome_shown");
    }, 200);

    welcomeUnmountRef.current = setTimeout(() => {
      welcomeUnmountRef.current = null;
      handleDismissWelcome("auto");
    }, 4200);

    return () => clearWelcomeTimers();
  }, [
    clearWelcomeTimers,
    handleDismissWelcome,
    isLoading,
    markWelcomeSeen,
    welcomeRendered,
    setWelcomeRendered,
    setShowWelcome,
  ]);

  // Aurora Effect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const layer = auroraRef.current;
    if (!layer) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    const maxOffset = 26;

    const applyOffset = () => {
      layer.style.setProperty("--aurora-offset-x", `${targetX}px`);
      layer.style.setProperty("--aurora-offset-y", `${targetY}px`);
      rafId = null;
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(applyOffset);
    };

    const handlePointer = (event) => {
      const normX = event.clientX / window.innerWidth - 0.5;
      const normY = event.clientY / window.innerHeight - 0.5;
      targetX = normX * maxOffset * 1.2;
      targetY = normY * maxOffset * 1.2;
      scheduleUpdate();
    };

    window.addEventListener("mousemove", handlePointer);
    return () => {
      window.removeEventListener("mousemove", handlePointer);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // 7. Handlers
  const handleAnimateAdd = useCallback(
    (product, quantity, sourceButton) => {
      try {
        const cartButton = cartButtonRef.current;
        if (!cartButton || !sourceButton) return;

        const startRect = sourceButton.getBoundingClientRect();
        const cartRect = cartButton.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;

        // Enhanced trajectory: higher arc and smoother curve
        const midX = startX + (endX - startX) * 0.5;
        const midY = Math.min(startY, endY) - 150; // Higher arc for better visibility

        addAnimation({
          id: Date.now(),
          emoji: product.emoji,
          startX,
          startY,
          midX,
          midY,
          endX,
          endY,
        });

        // Enhanced cart button feedback
        cartButton.classList.add("cart-button-pulse");
        setTimeout(() => cartButton.classList.remove("cart-button-pulse"), 800);
      } catch (error) {
        console.error("animateAdd failed", error);
      }
    },
    [addAnimation],
  );

  const handleCheckoutClick = useCallback(() => {
    if (cart.length === 0) {
      showNotification("Panier vide !", "error");
      return;
    }

    const totalWeight = cart.reduce((sum, item) => {
      if (item.product.category === "accessoires") return sum;
      if (item.product.isPack)
        return sum + (item.product.weight || 0) * item.quantity;
      return sum + item.quantity;
    }, 0);

    if (totalWeight < MIN_WEIGHT) {
      const remaining = MIN_WEIGHT - totalWeight;
      showNotification(
        `Minimum de ${MIN_WEIGHT}g requis. Ajoutez encore ${remaining}g de produits`,
        "error",
      );
      return;
    }

    trackEvent("checkout_initiated", { itemCount: cart.length });
    setShowConfirmation(true);
  }, [cart, subtotal, showNotification, setShowConfirmation]);

  const handleConfirmOrder = useCallback(async () => {
    const message = cart
      .map(
        (item) =>
          `${item.product.emoji} ${item.product.name} - ${item.quantity}g : ${item.totalPrice}€`,
      )
      .join("\n");

    const paymentText = paymentMethod === "cash" ? "💵 Espèces" : "🪙 Crypto";
    const promoText = appliedPromo
      ? `\n🎟️ Code promo ${appliedPromo}: -${discount}€`
      : "";

    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      deliveryPrice,
      discount,
      total,
      deliveryCity: DELIVERY_PRICES[deliveryCity]?.name || deliveryCity,
      paymentMethod,
      promoCode: appliedPromo || null,
      estimatedDelivery: DELIVERY_PRICES[deliveryCity]?.estimatedDays || 0,
    };

    const newOrderHistory = [order, ...orderHistory];
    setOrderHistory(newOrderHistory);

    const telegramURL = `https://t.me/Tangerine_212?text=${encodeURIComponent(
      `🎉 NOUVELLE COMMANDE TANGERINE\n\n${message}\n\n📦 Sous-total: ${subtotal}€${promoText}\n🚚 Livraison ${DELIVERY_PRICES[deliveryCity]?.name || deliveryCity}: ${deliveryPrice === 0 ? "GRATUIT" : `${deliveryPrice}€`}\n💳 Paiement: ${paymentText}\n\n💰 TOTAL: ${total}€`,
    )}`;

    trackEvent("order_confirmed", {
      total,
      itemCount: cart.length,
      deliveryCity: DELIVERY_PRICES[deliveryCity]?.name || deliveryCity,
      paymentMethod,
      promoCode: appliedPromo || "none",
      discount,
    });

    try {
      if (miniApp?.openTelegramLink) {
        miniApp.openTelegramLink(telegramURL);
      } else if (typeof window !== "undefined") {
        window.open(telegramURL, "_blank");
      }
    } catch (error) {
      /* ignore */
    }

    clearCart();
    setCartOpen(false);
    setShowConfirmation(false);
    setConfettiTrigger((prev) => prev + 1);
    showNotification("Commande envoyée ! ✅", "success");
  }, [
    cart,
    paymentMethod,
    appliedPromo,
    discount,
    subtotal,
    deliveryPrice,
    total,
    deliveryCity,
    orderHistory,
    setOrderHistory,
    miniApp,
    clearCart,
    setCartOpen,
    setShowConfirmation,
    showNotification,
  ]);

  const handleToggleWishlist = useCallback(
    async (product) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      let newWishlist;

      if (isInWishlist) {
        newWishlist = wishlist.filter((item) => item.id !== product.id);
        showNotification(
          `${product.emoji} ${product.name} retiré des favoris`,
          "info",
        );
      } else {
        newWishlist = [...wishlist, product];
        showNotification(
          `${product.emoji} ${product.name} ajouté aux favoris`,
          "success",
        );
      }

      setWishlist(newWishlist);
      trackEvent("wishlist_toggled", {
        product: product.name,
        added: !isInWishlist,
      });
    },
    [wishlist, setWishlist, showNotification],
  );

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setSelectedCategory(categoryId);
      trackEvent("category_changed", { category: categoryId });
    },
    [setSelectedCategory],
  );

  const handleThemeToggle = useCallback(async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    trackEvent("theme_changed", { theme: newTheme });
  }, [theme, setTheme]);

  const openViewer = useCallback(
    (product, startIndex = 0) => {
      setViewer(true, product, startIndex);
    },
    [setViewer],
  );

  const closeViewer = useCallback(() => {
    setViewer(false, null, 0);
  }, [setViewer]);

  // Show loading screen while config loads
  if (!configLoaded) {
    return (
      <>
        <WebVitalsReporter />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
            <div className="mb-4 text-6xl animate-bounce">⚙️</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chargement de la configuration...
            </h2>
            <p className="text-gray-400">Initialisation de l'application</p>
            {configError && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 font-semibold">
                  ❌ Erreur de chargement
                </p>
                <p className="text-red-400 text-sm mt-1">{configError}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Vérifiez que le fichier public/config.json existe
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WebVitalsReporter />
      <MainLayout
        isLoading={isLoading}
        auroraRef={auroraRef}
        cartButtonRef={cartButtonRef}
        isTelegramIOS={isTelegramIOS}
        showParticles={showParticles}
        welcomeRendered={welcomeRendered}
        showWelcome={showWelcome}
        handleDismissWelcome={handleDismissWelcome}
        homeScreenStatus={homeScreenStatus}
        handleAddToHomeScreen={handleAddToHomeScreen}
        handleThemeToggle={handleThemeToggle}
        horizontalScrollProgress={horizontalScrollProgress}
        handleCategoryChange={handleCategoryChange}
        confettiTrigger={confettiTrigger}
        handleUpdateQuantity={handleUpdateQuantity}
        handleRemoveFromCart={handleRemoveFromCart}
        handleCheckoutClick={handleCheckoutClick}
        setDeliveryCity={setDeliveryCity}
        setPaymentMethod={setPaymentMethod}
        setAppliedPromo={setAppliedPromo}
        handleAddToCart={handleAddToCart}
        openViewer={openViewer}
        closeViewer={closeViewer}
        handleConfirmOrder={handleConfirmOrder}
      >
        <Home
          theme={theme}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          productsToDisplay={productsToDisplay}
          handleAddToCart={handleAddToCart}
          handleAnimateAdd={handleAnimateAdd}
          setSelectedProduct={setSelectedProduct}
          wishlist={wishlist}
          handleToggleWishlist={handleToggleWishlist}
          categoryScrollRef={categoryScrollRef}
        />
      </MainLayout>
    </>
  );
};

export default App;
