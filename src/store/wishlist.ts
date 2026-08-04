import { create } from "zustand";

interface WishlistStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem('veloura_wishlist') || '[]'),
  addItem: (id) => set((state) => {
    const newItems = [...state.items, id];
    localStorage.setItem('veloura_wishlist', JSON.stringify(newItems));
    return { items: newItems };
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(i => i !== id);
    localStorage.setItem('veloura_wishlist', JSON.stringify(newItems));
    return { items: newItems };
  }),
  toggleItem: (id) => {
    if (get().isInWishlist(id)) {
      get().removeItem(id);
    } else {
      get().addItem(id);
    }
  },
  isInWishlist: (id) => get().items.includes(id),
}));
