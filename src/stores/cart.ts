// stores/cart.ts — Exact WooNuxt useCart logic in Pinia store form
import { defineStore } from 'pinia'
import type { AddToCartInput } from '#gql'

export const useCartStore = defineStore('cart', () => {
  const { storeSettings } = useAppConfig()
  const { clearAllCookies, getErrorMessage } = useHelpers()

  // State — matches WooNuxt useState declarations exactly
  const cart = ref<any>(null)
  const isShowingCart = ref(false)
  const isUpdatingCart = ref(false)
  const isUpdatingCoupon = ref(false)
  const paymentGateways = ref<any>(null)

  // Getters
  const cartItemsCount = computed(() => cart.value?.contents?.itemCount || 0)
  const cartTotal = computed(() => cart.value?.total || '0')

  const allProductsAreVirtual = computed(() => {
    const nodes = cart.value?.contents?.nodes || []
    return nodes.length === 0
      ? false
      : nodes.every((node: any) => node.product?.node?.virtual === true)
  })

  const isBillingAddressEnabled = computed(() =>
    storeSettings.hideBillingAddressForVirtualProducts ? !allProductsAreVirtual.value : true,
  )

  // Stop the loading spinner when the cart is updated (matches WooNuxt watch)
  watch(cart, () => {
    isUpdatingCart.value = false
  })

  // Actions — exact WooNuxt useCart functions

  function resetInitialState() {
    cart.value = null
    paymentGateways.value = null
  }

  function updateCart(payload?: any): void {
    cart.value = payload || null
  }

  function updatePaymentGateways(payload: any): void {
    paymentGateways.value = payload
  }

  function toggleCart(state?: boolean): void {
    isShowingCart.value = state ?? !isShowingCart.value
  }

  async function refreshCart(): Promise<boolean> {
    try {
      const { cart: cartData, customer, viewer, paymentGateways: pg, loginClients } =
        await GqlGetCart()
      const { updateCustomer, updateViewer, updateLoginClients } = useAuth()

      if (cartData) updateCart(cartData)
      if (customer) updateCustomer(customer)
      if (viewer) updateViewer(viewer)
      if (pg) updatePaymentGateways(pg)
      if (loginClients) updateLoginClients(loginClients.filter((c: any) => c !== null))

      return true
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error refreshing cart:', errorMsg)
      clearAllCookies()
      resetInitialState()
      return false
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function addToCart(input: AddToCartInput): Promise<void> {
    isUpdatingCart.value = true

    try {
      const { addToCart: result } = await GqlAddToCart({ input })
      if (result?.cart) cart.value = result.cart

      // Auto open cart (matches WooNuxt)
      const { storeSettings } = useAppConfig()
      if (storeSettings.autoOpenCart && !isShowingCart.value) toggleCart(true)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error adding to cart:', errorMsg)
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function removeItem(key: string): Promise<void> {
    isUpdatingCart.value = true
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 })
      updateCart(updateItemQuantities?.cart)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error removing item:', errorMsg)
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
    isUpdatingCart.value = true
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity })
      updateCart(updateItemQuantities?.cart)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error updating quantity:', errorMsg)
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function emptyCart(): Promise<void> {
    try {
      isUpdatingCart.value = true
      const { emptyCart: result } = await GqlEmptyCart()
      updateCart(result?.cart)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      if (errorMsg && !errorMsg.toLowerCase().includes('cart is empty')) {
        console.error('Error emptying cart:', errorMsg)
      }
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function updateShippingMethod(shippingMethods: string): Promise<void> {
    isUpdatingCart.value = true
    try {
      const { updateShippingMethod: result } = await GqlChangeShippingMethod({ shippingMethods })
      updateCart(result?.cart)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error updating shipping method:', errorMsg)
    } finally {
      isUpdatingCart.value = false
    }
  }

  async function applyCoupon(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      isUpdatingCoupon.value = true
      const { applyCoupon: result } = await GqlApplyCoupon({ code })
      updateCart(result?.cart)
      return { success: true }
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      return { success: false, error: errorMsg || 'Failed to apply coupon' }
    } finally {
      isUpdatingCoupon.value = false
    }
  }

  async function removeCoupon(code: string): Promise<void> {
    try {
      isUpdatingCart.value = true
      const { removeCoupons } = await GqlRemoveCoupons({ codes: [code] })
      updateCart(removeCoupons?.cart)
    } catch (error: any) {
      const errorMsg = getErrorMessage(error)
      console.error('Error removing coupon:', errorMsg)
    } finally {
      isUpdatingCart.value = false
    }
  }

  return {
    // State
    cart,
    isShowingCart,
    isUpdatingCart,
    isUpdatingCoupon,
    paymentGateways,
    // Getters
    cartItemsCount,
    cartTotal,
    allProductsAreVirtual,
    isBillingAddressEnabled,
    // Actions
    updateCart,
    refreshCart,
    toggleCart,
    addToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,
    updateShippingMethod,
    applyCoupon,
    removeCoupon,
    resetInitialState,
  }
})
