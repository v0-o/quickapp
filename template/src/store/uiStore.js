import { create } from 'zustand';

export const useUIStore = create((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  isContactOpen: false,
  setIsContactOpen: (isOpen) => set({ isContactOpen: isOpen }),

  showConfirmation: false,
  setShowConfirmation: (show) => set({ showConfirmation: show }),

  viewerOpen: false,
  viewerProduct: null,
  viewerStartIndex: 0,
  setViewer: (isOpen, product = null, startIndex = 0) =>
    set({ viewerOpen: isOpen, viewerProduct: product, viewerStartIndex: startIndex }),

  notification: { message: '', isVisible: false, type: 'success' },
  showNotification: (message, type = 'success') =>
    set({ notification: { message, isVisible: true, type } }),
  hideNotification: () =>
    set({ notification: { message: '', isVisible: false, type: 'success' } }),

  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  showWelcome: false,
  welcomeRendered: false,
  setShowWelcome: (show) => set({ showWelcome: show }),
  setWelcomeRendered: (rendered) => set({ welcomeRendered: rendered }),

  animations: [],
  addAnimation: (anim) => set((state) => ({ animations: [...state.animations, anim] })),
  removeAnimation: (id) => set((state) => ({ animations: state.animations.filter((a) => a.id !== id) })),
}));
