/**
 * @name useAuth
 * @description Authentication composable matching WooNuxt's useAuth pattern.
 * Manages customer, viewer, orders, downloads, and login clients state.
 */
export function useAuth() {
  const { clearAllCookies, clearAllLocalStorage } = useHelpers()

  const customer = useState<any>('customer', () => null)
  const viewer = useState<any>('viewer', () => null)
  const orders = useState<any[]>('orders', () => [])
  const downloads = useState<any[]>('downloads', () => [])
  const loginClients = useState<any[]>('loginClients', () => [])
  const isPending = useState<boolean>('isPending', () => false)

  const avatar = computed(() => viewer.value?.avatar?.url || null)

  /** Store return URL for post-login redirect */
  function setReturnUrl(): void {
    if (import.meta.client) {
      const route = useRoute()
      localStorage.setItem('returnUrl', route.fullPath)
    }
  }

  function getReturnUrl(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem('returnUrl')
  }

  function clearReturnUrl(): void {
    if (import.meta.client) {
      localStorage.removeItem('returnUrl')
    }
  }

  /** Navigate to login, storing current path as return URL */
  function navigateToLogin(): void {
    setReturnUrl()
    navigateTo('/my-account')
  }

  /** After login, redirect to return URL if set */
  function handlePostLoginRedirect(): void {
    const returnUrl = getReturnUrl()
    clearReturnUrl()
    if (returnUrl && returnUrl !== '/my-account') {
      navigateTo(returnUrl)
    }
  }

  /** Login with username and password */
  async function loginUser(credentials: { username: string; password: string }): Promise<{ success: boolean; error?: string }> {
    isPending.value = true
    try {
      const { login } = await GqlLogin(credentials)

      if (login?.sessionToken) {
        useGqlHeaders({ 'woocommerce-session': `Session ${login.sessionToken}` })
        const sessionCookie = useCookie('woocommerce-session')
        sessionCookie.value = login.sessionToken
      }

      if (login?.customer) {
        customer.value = login.customer
      }

      // Refresh cart after login to get user's cart
      const cartStore = useCartStore()
      await cartStore.refreshCart()

      handlePostLoginRedirect()
      return { success: true }
    } catch (error: any) {
      const errorMsg = error?.gqlErrors?.[0]?.message || 'Login failed'
      return { success: false, error: errorMsg }
    } finally {
      isPending.value = false
    }
  }

  /** Logout user */
  async function logoutUser(): Promise<void> {
    try {
      await GqlLogout()
    } catch (e) {
      // Ignore logout errors
    }

    clearAllCookies()
    clearAllLocalStorage()
    useGqlHeaders({ 'woocommerce-session': '' })

    customer.value = null
    viewer.value = null
    orders.value = []
    downloads.value = []

    const cartStore = useCartStore()
    cartStore.resetInitialState()
    await cartStore.refreshCart()

    navigateTo('/my-account')
  }

  /** Register a new customer */
  async function registerUser(input: any): Promise<{ success: boolean; error?: string }> {
    isPending.value = true
    try {
      const { registerCustomer } = await GqlRegisterCustomer({ input })
      if (registerCustomer?.customer) {
        customer.value = registerCustomer.customer
      }
      return { success: true }
    } catch (error: any) {
      const errorMsg = error?.gqlErrors?.[0]?.message || 'Registration failed'
      return { success: false, error: errorMsg }
    } finally {
      isPending.value = false
    }
  }

  /** Update customer state and persist session token */
  function updateCustomer(payload: any): void {
    customer.value = payload
    if (payload?.sessionToken) {
      useGqlHeaders({ 'woocommerce-session': `Session ${payload.sessionToken}` })
      const sessionCookie = useCookie('woocommerce-session')
      sessionCookie.value = payload.sessionToken
    }
  }

  /** Update viewer state */
  function updateViewer(payload: any): void {
    viewer.value = payload
  }

  /** Update login clients state */
  function updateLoginClients(payload: any[]): void {
    loginClients.value = payload
  }

  /** Fetch customer orders */
  async function getOrders(): Promise<void> {
    try {
      const { customer: customerData } = await GqlGetOrders()
      orders.value = customerData?.orders?.nodes || []
    } catch (error: any) {
      console.error('Error fetching orders:', error?.gqlErrors?.[0]?.message)
    }
  }

  /** Fetch downloadable items */
  async function getDownloads(): Promise<void> {
    try {
      const { customer: customerData } = await GqlGetDownloads()
      downloads.value = customerData?.downloadableItems?.nodes || []
    } catch (error: any) {
      console.error('Error fetching downloads:', error?.gqlErrors?.[0]?.message)
    }
  }

  /** Send reset password email */
  async function sendResetPasswordEmail(username: string): Promise<{ success: boolean; error?: string }> {
    try {
      await GqlResetPasswordEmail({ username })
      return { success: true }
    } catch (error: any) {
      const errorMsg = error?.gqlErrors?.[0]?.message || 'Failed to send reset email'
      return { success: false, error: errorMsg }
    }
  }

  return {
    customer,
    viewer,
    orders,
    downloads,
    loginClients,
    isPending,
    avatar,
    loginUser,
    logoutUser,
    registerUser,
    updateCustomer,
    updateViewer,
    updateLoginClients,
    getOrders,
    getDownloads,
    sendResetPasswordEmail,
    navigateToLogin,
  }
}
