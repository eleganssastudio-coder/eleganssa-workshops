import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, variant?: string) => void
  updateQuantity: (id: string, quantity: number, variant?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const key = item.variant ? `${item.id}-${item.variant}` : item.id
        const existing = items.find(
          (i) => (i.variant ? `${i.id}-${i.variant}` : i.id) === key
        )

        if (existing) {
          set({
            items: items.map((i) =>
              (i.variant ? `${i.id}-${i.variant}` : i.id) === key
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity ?? 1 }] })
        }
        set({ isOpen: true })
      },

      removeItem: (id, variant) => {
        set({
          items: get().items.filter((i) => {
            const key = i.variant ? `${i.id}-${i.variant}` : i.id
            const targetKey = variant ? `${id}-${variant}` : id
            return key !== targetKey
          }),
        })
      },

      updateQuantity: (id, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(id, variant)
          return
        }
        set({
          items: get().items.map((i) => {
            const key = i.variant ? `${i.id}-${i.variant}` : i.id
            const targetKey = variant ? `${id}-${variant}` : id
            return key === targetKey ? { ...i, quantity } : i
          }),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'eleganssa-cart',
    }
  )
)
