import { create } from "zustand";

export interface CartItem {
  id: string; // Cart item unique ID
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; shipping: number; total: number };
}

const SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300; // Simplified for dummy logic

export const useCart = create<CartStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem('veloura_cart') || '[]'),
  isOpen: false,
  addItem: (item) => set((state) => {
    const existingIndex = state.items.findIndex(
      i => i.productId === item.productId && i.size === item.size && i.color === item.color
    );
    let newItems;
    if (existingIndex >= 0) {
      newItems = [...state.items];
      newItems[existingIndex].quantity += item.quantity;
    } else {
      newItems = [...state.items, { ...item, id: Math.random().toString(36).substring(7) }];
    }
    localStorage.setItem('veloura_cart', JSON.stringify(newItems));
    return { items: newItems, isOpen: true }; // Open drawer on add
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(i => i.id !== id);
    localStorage.setItem('veloura_cart', JSON.stringify(newItems));
    return { items: newItems };
  }),
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) return state;
    const newItems = state.items.map(i => i.id === id ? { ...i, quantity } : i);
    localStorage.setItem('veloura_cart', JSON.stringify(newItems));
    return { items: newItems };
  }),
  clearCart: () => set(() => {
    localStorage.removeItem('veloura_cart');
    return { items: [] };
  }),
  setIsOpen: (isOpen) => set({ isOpen }),
  getTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? STANDARD_SHIPPING : 0);
    return { subtotal, shipping, total: subtotal + shipping };
  }
}));
