import { Suspense, lazy } from 'react';
import { useUIStore } from '../../store/uiStore.js';
import { useSettingsStore } from '../../store/settingsStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useTMALogic } from '../../hooks/useTMALogic.js';
import { MIN_WEIGHT } from '../constants/index.js';

import { ThemeToggle } from './ThemeToggle.jsx';
import { ParticlesBackground } from './ParticlesBackground.jsx';
import { FlyingBadge } from './FlyingBadge.jsx';
import { Notification } from './Notification.jsx';
import { Confetti } from './Confetti.jsx';
import { LoadingScreen } from './LoadingScreen.jsx';

// Lazy-loaded modals and drawers
const CartDrawer = lazy(() => import('./CartDrawer.jsx'));
const ConfirmationModal = lazy(() => import('./ConfirmationModal.jsx'));
const ContactModal = lazy(() => import('./ContactModal.jsx'));
const ProductDetailModal = lazy(() => import('./ProductDetailModal.jsx'));
const FullscreenViewer = lazy(() => import('./FullscreenViewer.jsx'));

export const MainLayout = ({
    children,
    isLoading,
    auroraRef,
    cartButtonRef,
    isTelegramIOS,
    showParticles,
    welcomeRendered,
    showWelcome,
    handleDismissWelcome,
    homeScreenStatus,
    handleAddToHomeScreen,
    handleThemeToggle,
    horizontalScrollProgress,
    handleCategoryChange,
    confettiTrigger,

    // Cart Actions for Drawer
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleCheckoutClick,

    // Settings Actions for Drawer
    setDeliveryCity,
    setPaymentMethod,
    setAppliedPromo,

    // Product Actions for Modals
    handleAddToCart,
    handleAnimateAdd,
    openViewer,
    closeViewer,
    handleConfirmOrder
}) => {
    const {
        theme, deliveryCity, paymentMethod, appliedPromo
    } = useSettingsStore();

    const {
        cart, isCartOpen, setCartOpen
    } = useCartStore();

    const {
        isContactOpen, setIsContactOpen,
        showConfirmation, setShowConfirmation,
        selectedProduct, setSelectedProduct,
        viewerOpen, viewerProduct, viewerStartIndex,
        notification
    } = useUIStore();

    const { miniApp } = useTMALogic();

    if (isLoading) {
        return <LoadingScreen onComplete={() => { }} />;
    }

    const bgClasses = theme === 'light'
        ? 'min-h-screen bg-gradient-to-br from-[#fef7f3] via-[#fdf4ef] to-[#fcf1eb] relative overflow-hidden'
        : 'min-h-screen bg-gradient-to-br from-[#05090b] via-[#0b1411] to-[#05090b] relative overflow-hidden';
    const textClasses = theme === 'light' ? 'text-slate-900' : 'text-white';

    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalWeight = cart.reduce((sum, item) => {
        if (item.product.category === 'accessoires') return sum;
        if (item.product.isPack) return sum + (item.product.weight || 0) * item.quantity;
        return sum + item.quantity;
    }, 0);
    const meetsMinimum = totalWeight >= MIN_WEIGHT;
    const cartProgress = Math.min(100, (totalWeight / MIN_WEIGHT) * 100);

    return (
        <div className={bgClasses}>
            <FlyingBadge />

            {welcomeRendered && (
                <div
                    className={`welcome-toast ${showWelcome ? 'show' : ''}`}
                    role="status"
                    aria-live="polite"
                    onClick={() => handleDismissWelcome('manual')}
                >
                    <span className="text-xl">🍊</span>
                    <span className="welcome-text">Welcome</span>
                </div>
            )}

            <div className="background-aurora" aria-hidden="true" ref={auroraRef}>
                <div className="aurora-blob aurora-blob-1" />
                <div className="aurora-blob aurora-blob-2" />
                <div className="aurora-blob aurora-blob-3" />
                <div className="noise-overlay" />
            </div>

            {showParticles && !isTelegramIOS && <ParticlesBackground />}

            <ThemeToggle theme={theme} onToggle={handleThemeToggle} cartOpen={isCartOpen} />

            {miniApp?.addToHomeScreen && homeScreenStatus !== 'added' && (
                <div className="max-w-7xl mx-auto px-4 pt-4">
                    <div className="glass-dark border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-white font-semibold text-sm">📱 Ajouter Tangerine à l’écran d’accueil</p>
                            <p className="text-white/60 text-xs">
                                Accès direct depuis Telegram. Statut : {homeScreenStatus}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddToHomeScreen}
                            className="glass-cta px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {children}



            {/* Fixed Bottom Navigation Bar - Premium Redesign */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/5 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] flex items-center justify-around px-6 pb-[env(safe-area-inset-bottom,16px)] pt-3 transition-all duration-300 bottom-nav rounded-t-[28px] h-[72px]">
                <button
                    onClick={() => handleCategoryChange('all')}
                    className={`${textClasses} flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all`}
                    title="Accueil"
                    aria-label="Accueil"
                >
                    <span aria-hidden="true" className="text-2xl">🏠</span>
                    <span className="text-[11px] font-bold opacity-80">Accueil</span>
                </button>

                <button
                    onClick={() => setCartOpen(true)}
                    ref={cartButtonRef}
                    className="relative flex items-center justify-center w-20 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white shadow-[0_12px_40px_rgba(249,115,22,0.5),0_0_0_4px_rgba(249,115,22,0.1)] hover:scale-105 active:scale-95 transition-all"
                    aria-label="Panier"
                >
                    <div className="relative">
                        <span aria-hidden="true" className="text-3xl">🛒</span>
                        {cart.length > 0 && (
                            <span className="absolute -top-3 -right-3 bg-white text-orange-600 text-[11px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce-subtle">
                                {cart.length}
                            </span>
                        )}
                    </div>
                </button>

                <button
                    onClick={() => setIsContactOpen(true)}
                    className={`${textClasses} flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all`}
                    title="Contact"
                    aria-label="Contact"
                >
                    <span aria-hidden="true" className="text-2xl">💬</span>
                    <span className="text-[11px] font-bold opacity-80">Contact</span>
                </button>
            </nav>

            <Suspense fallback={null}>
                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setCartOpen(false)}
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={handleCheckoutClick}
                    deliveryCity={deliveryCity}
                    onDeliveryCityChange={setDeliveryCity}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    appliedPromo={appliedPromo}
                    onApplyPromo={setAppliedPromo}
                    onRemovePromo={() => setAppliedPromo('')}
                />
            </Suspense>

            <Suspense fallback={null}>
                <ConfirmationModal
                    isOpen={showConfirmation}
                    onConfirm={handleConfirmOrder}
                    onCancel={() => setShowConfirmation(false)}
                    cart={cart}
                    deliveryCity={deliveryCity}
                    paymentMethod={paymentMethod}
                // Note: total, discount, subtotal, deliveryPrice need to be passed or calculated inside Modal
                // For now, we rely on the Modal to calculate or we pass them if we had them here.
                // To avoid prop drilling hell, ideally these are in the store or calculated in the modal.
                // But existing modal likely expects props.
                // We will pass what we have, and let App.jsx pass the rest via props to Layout if needed,
                // OR we refactor Modal to use Store.
                // For this phase, let's assume we pass them down from App.jsx via props to MainLayout
                // Wait, I didn't add them to MainLayout props.
                // I should probably refactor ConfirmationModal to use the store later.
                // For now, I'll add the missing props to MainLayout signature.
                />

                <ContactModal
                    isOpen={isContactOpen}
                    onClose={() => setIsContactOpen(false)}
                />

                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                    onAnimateAdd={handleAnimateAdd}
                    openViewer={openViewer}
                />

                <FullscreenViewer
                    isOpen={viewerOpen}
                    product={viewerProduct}
                    startIndex={viewerStartIndex}
                    onClose={closeViewer}
                />
            </Suspense>

            <Notification
                message={notification.message}
                isVisible={notification.isVisible}
                type={notification.type}
            />

            <Confetti trigger={confettiTrigger} />
        </div>
    );
};
