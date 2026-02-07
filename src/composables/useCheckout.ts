/**
 * @name useCheckout
 * @description Checkout composable matching WooNuxt's useCheckout pattern.
 * Handles checkout process, payment, and order completion.
 */
export function useCheckout() {
  const cartStore = useCartStore()
  const { customer } = useAuth()

  const orderInput = useState<any>('orderInput', () => ({
    customerNote: '',
    paymentMethod: '',
    shipToDifferentAddress: false,
    metaData: [] as { key: string; value: string }[],
  }))

  const isProcessingOrder = useState<boolean>('isProcessingOrder', () => false)

  /**
   * Build the full checkout mutation payload.
   */
  function buildCheckoutPayload(billing: any, shipping: any): any {
    return {
      billing,
      shipping: orderInput.value.shipToDifferentAddress ? shipping : billing,
      paymentMethod: orderInput.value.paymentMethod,
      customerNote: orderInput.value.customerNote,
      shipToDifferentAddress: orderInput.value.shipToDifferentAddress,
      metaData: orderInput.value.metaData?.length ? orderInput.value.metaData : undefined,
    }
  }

  /**
   * Process the checkout — calls GqlCheckout, handles result.
   */
  async function processCheckout(billing: any, shipping: any): Promise<{ success: boolean; order?: any; error?: string; redirect?: string }> {
    isProcessingOrder.value = true

    try {
      const payload = buildCheckoutPayload(billing, shipping)
      const { checkout } = await GqlCheckout(payload)

      if (checkout?.result === 'success' && checkout.order) {
        // Empty cart after successful order
        await cartStore.emptyCart()

        return {
          success: true,
          order: checkout.order,
          redirect: checkout.redirect,
        }
      }

      return {
        success: false,
        error: 'Checkout failed. Please try again.',
      }
    } catch (error: any) {
      const errorMsg = error?.gqlErrors?.[0]?.message || 'An error occurred during checkout'
      return { success: false, error: errorMsg }
    } finally {
      isProcessingOrder.value = false
    }
  }

  /**
   * Update shipping location to recalculate shipping rates.
   */
  async function updateShippingLocation(shippingCountry: string, shippingState: string, billingCountry: string, billingState: string): Promise<void> {
    try {
      await GqlChangeShippingCounty({
        shippingCountry,
        shippingState,
        billingCountry,
        billingState,
      })
      // Refresh cart to get updated shipping rates
      await cartStore.refreshCart()
    } catch (error: any) {
      console.error('Error updating shipping location:', error?.gqlErrors?.[0]?.message)
    }
  }

  return {
    orderInput,
    isProcessingOrder,
    processCheckout,
    updateShippingLocation,
  }
}
