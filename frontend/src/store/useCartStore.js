import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find((item) => item._id === product._id);

        if (existingItem) {
          set({
            cartItems: currentItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cartItems: [...currentItems, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((item) => item._id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;