// stores/cart.ts
import { defineStore } from 'pinia'
import type {
  AddToCartInput,
  CartFragment as Cart,
  PaymentGatewayFragment as PaymentGateway,
  SimpleProductFragment as SimpleProduct,
} from '#gql'

interface PaymentGateways {
  nodes: PaymentGateway[]
}

interface CartState {
  cart: Cart | null
  isShowingCart: boolean
  isUpdatingCart: boolean
  isUpdatingCoupon: boolean
  paymentGateways: PaymentGateways | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
    isShowingCart: false,
    isUpdatingCart: false,
    isUpdatingCoupon: false,
    paymentGateways: null,
  }),

  getters: {
    cartItemsCount: (state): number => {
      return state.cart?.contents?.itemCount || 0
    },

    cartTotal: (state): string => {
      return state.cart?.total || '0'
    },

    allProductsAreVirtual: (state): boolean => {
      const nodes = state.cart?.contents?.nodes || []
      return nodes.length === 0
        ? false
        : nodes.every((node) => (node.product?.node as SimpleProduct)?.virtual === true)
    },

    isBillingAddressEnabled(): boolean {
      const { storeSettings } = useAppConfig()
      return storeSettings.hideBillingAddressForVirtualProducts ? !this.allProductsAreVirtual : true
    },
  },

  actions: {
    handleSessionToken(customer: any) {
      if (!customer) return

      const sessionToken = customer.sessionToken
      if (sessionToken) {
        console.log('Setting session token:', sessionToken)

        useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` })

        const sessionCookie = useCookie('woocommerce-session')
        sessionCookie.value = sessionToken
      }
    },

    persistCart() {
      if (import.meta.client) {
        if (this.cart) {
          localStorage.setItem('cart-state', JSON.stringify(this.cart))
        } else {
          localStorage.removeItem('cart-state')
        }
      }
    },

    restoreCart() {
      if (import.meta.client) {
        const stored = localStorage.getItem('cart-state')
        if (stored) {
          try {
            this.cart = JSON.parse(stored)
          } catch (e) {
            console.error('Failed to parse cart state from localStorage', e)
            localStorage.removeItem('cart-state')
          }
        }
      }
    },

    updateCart(payload?: Cart | null): void {
      this.cart = payload || null
      this.persistCart()
      this.isUpdatingCart = false
    },

    updatePaymentGateways(payload: PaymentGateways): void {
      this.paymentGateways = payload
    },

    toggleCart(state?: boolean): void {
      this.isShowingCart = state ?? !this.isShowingCart
    },

    resetInitialState(): void {
      this.cart = null
      this.paymentGateways = null
      // Clear localStorage when reset
      if (import.meta.client) {
        localStorage.removeItem('cart-state')
      }
    },

    initCart() {
      this.restoreCart()
    },

    async refreshCart(): Promise<boolean> {
      // const { clearAllCookies } = useHelpers()
      this.isUpdatingCart = true

      try {
        // Fetch cart
        const { cart, customer, paymentGateways } = await GqlGetCart()

        if (customer) {
          this.handleSessionToken(customer)
        }

        if (cart) this.updateCart(cart)

        if (paymentGateways) this.updatePaymentGateways(paymentGateways)

        return true
      } catch (error: any) {
        console.error('Error refreshing cart:', error)

        // clear everything if the cart is not found
        if (error.message?.includes('Cart not found') || error.message?.includes('No cart')) {
          // clearAllCookies()
          this.resetInitialState()
        }

        return false
      } finally {
        this.isUpdatingCart = false
      }
    },

    async addToCart(input: AddToCartInput): Promise<void> {
      console.log('Adding to cart:', input)
      this.isUpdatingCart = true

      try {
        const { addToCart } = await GqlAddToCart({ input })
        if (addToCart?.cart) {
          this.updateCart(addToCart.cart)

          // First item might create the session, refresh
          if (this.cartItemsCount === 1) {
            await this.refreshCart()
          }
        }

        // Auto open the cart
        const { storeSettings } = useAppConfig()
        if (storeSettings.autoOpenCart && !this.isShowingCart) {
          this.toggleCart(true)
        }
      } catch (error: any) {
        console.error('Error adding to cart:', error)
        this.isUpdatingCart = false
      }
    },

    async removeItem(key: string): Promise<void> {
      this.isUpdatingCart = true

      try {
        const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 })
        this.updateCart(updateItemQuantities?.cart)
      } catch (error: any) {
        console.error('Error removing item:', error)
        this.isUpdatingCart = false
      }
    },

    async updateItemQuantity(key: string, quantity: number): Promise<void> {
      this.isUpdatingCart = true

      try {
        console.log('Updating item quantity:', { key, quantity })
        const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity })
        console.log('Update response:', updateItemQuantities)
        this.updateCart(updateItemQuantities?.cart)
      } catch (error: any) {
        console.error('Error updating quantity:', error)
        this.isUpdatingCart = false

        // If session error, refresh cart
        if (error.gqlErrors?.[0]?.message?.includes('Internal server error')) {
          console.log('Internal server error, attempting to refresh cart...')
          await this.refreshCart()
        }
      }
    },

    async emptyCart(): Promise<void> {
      this.isUpdatingCart = true

      try {
        const { emptyCart } = await GqlEmptyCart()
        this.updateCart(emptyCart?.cart)
      } catch (error: any) {
        console.error('Error emptying cart:', error)
        this.isUpdatingCart = false
      }
    },

    async updateShippingMethod(shippingMethods: string): Promise<void> {
      this.isUpdatingCart = true

      try {
        const { updateShippingMethod } = await GqlChangeShippingMethod({ shippingMethods })
        this.updateCart(updateShippingMethod?.cart)
      } catch (error: any) {
        console.error('Error updating shipping method:', error)
        this.isUpdatingCart = false
      }
    },

    async applyCoupon(code: string): Promise<{ message: string | null }> {
      this.isUpdatingCoupon = true

      try {
        const { applyCoupon } = await GqlApplyCoupon({ code })
        this.updateCart(applyCoupon?.cart)
        return { message: null }
      } catch (error: any) {
        console.error('Error applying coupon:', error)
        return { message: error.message || 'Failed to apply coupon' }
      } finally {
        this.isUpdatingCoupon = false
      }
    },

    async removeCoupon(code: string): Promise<{ message: string | null }> {
      this.isUpdatingCart = true

      try {
        const { removeCoupons } = await GqlRemoveCoupons({ codes: [code] })
        this.updateCart(removeCoupons?.cart)
        return { message: null }
      } catch (error: any) {
        console.error('Error removing coupon:', error)
        return { message: error.message || 'Failed to remove coupon' }
      } finally {
        this.isUpdatingCart = false
      }
    },
  },
})
