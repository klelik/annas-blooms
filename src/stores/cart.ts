// stores/cart.ts
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    isShowingCart: false,
    isUpdatingCart: false,
  }),

  actions: {
    toggleCart() {
      this.isShowingCart = !this.isShowingCart
    },
  },
})
