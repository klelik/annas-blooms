/**
 * Init plugin — matches WooNuxt's init.ts exactly.
 * Handles WooCommerce session restoration and lazy cart initialization.
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig()
    const { clearAllCookies } = useHelpers()

    // Restore session token from cookie (matches WooNuxt)
    const sessionToken = useCookie('woocommerce-session')
    if (sessionToken.value) {
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` })
    }

    // Wait for the user to interact with the page before refreshing the cart
    // This reduces excessive requests to the server (matches WooNuxt)
    let initialised = false
    const eventsToFireOn = [
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'click',
      'resize',
      'mousemove',
      'mouseover',
    ]

    async function initStore() {
      if (initialised) return

      initialised = true

      // Remove all event listeners immediately to prevent double-firing
      eventsToFireOn.forEach((event) => {
        window.removeEventListener(event, initStore)
      })

      const cartStore = useCartStore()
      let success: boolean = await cartStore.refreshCart()

      useGqlError((err: any) => {
        const serverErrors = [
          'The iss do not match with this server',
          'Invalid session token',
        ]
        if (serverErrors.includes(err?.gqlErrors?.[0]?.message)) {
          clearAllCookies()
          window.location.reload()
        }
      })

      // If cart refresh failed, clear cookies and try one more time (matches WooNuxt)
      if (!success) {
        clearAllCookies()

        // Remove the old session header
        useGqlHeaders({ 'woocommerce-session': '' })

        // Retry the cart refresh with clean state
        success = await cartStore.refreshCart()
      }
    }

    // If we are in development mode, initialise the store immediately
    const isDev = import.meta.dev || process.env.NODE_ENV === 'development'

    // Check if the current route path needs immediate initialization
    const pagesToInitializeRightAway = ['/checkout', '/my-account', '/order-summary']
    const isPathThatRequiresInit = pagesToInitializeRightAway.some((page) =>
      useRoute().path.includes(page),
    )

    const shouldInit =
      isDev || isPathThatRequiresInit || !storeSettings.initStoreOnUserActionToReduceServerLoad

    if (shouldInit) {
      initStore().catch((err) => console.error('Failed to initialize store:', err))
    } else {
      eventsToFireOn.forEach((event) => {
        window.addEventListener(event, initStore, { once: true })
      })
    }
  }
})
