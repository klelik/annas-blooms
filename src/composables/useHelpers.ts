/**
 * @name useHelpers
 * @description A collection of helper functions matching WooNuxt's useHelpers composable.
 */
export function useHelpers() {
  const route = useRoute()

  const isShowingMobileMenu = useState<boolean>('isShowingMobileMenu', () => false)
  const FALLBACK_IMG = '/images/placeholder.jpg'

  function toggleMobileMenu(state: boolean | undefined = undefined): void {
    isShowingMobileMenu.value = state ?? !isShowingMobileMenu.value
  }

  function clearAllCookies(): void {
    if (!import.meta.client) return
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
      document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    }
  }

  function clearAllLocalStorage(): void {
    if (import.meta.client) {
      localStorage.clear()
    }
  }

  function removeBodyClass(className: string): void {
    if (!import.meta.client) return
    document.body?.classList.remove(className)
  }

  function addBodyClass(className: string): void {
    if (!import.meta.client) return
    document.body?.classList.add(className)
  }

  function toggleBodyClass(className: string): void {
    if (!import.meta.client) return
    document.body?.classList.toggle(className)
  }

  const isQueryEmpty = computed<boolean>(() => Object.keys(route.query).length === 0)

  const formatDate = (date?: string | null): string => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-GB', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatPrice = (price: string): string => {
    const { currency } = useAppConfig()
    return parseFloat(price).toLocaleString('en-GB', {
      style: 'currency',
      currency: currency?.code || 'GBP',
    })
  }

  const scrollToTop = () => {
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const stripHtml = (str: string | null | undefined = ''): string => {
    return str === null ? '' : str.replace(/(<([^>]+)>)/gi, '')
  }

  const debounce = (func: Function, delay: number = 100) => {
    let inDebounce: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() => func.apply(this, args), delay)
    }
  }

  const getErrorMessage = (error: any): string | undefined => {
    // Just extract and return the error message.
    // Session error handling (clear cookies + reload) is done by the init plugin's
    // useGqlError handler to avoid reload loops during normal cart operations.
    return error?.gqlErrors?.[0]?.message
  }

  const checkGraphQLExtensions = (response: any): void => {
    const debugMessages = response?.extensions?.debug
    if (!Array.isArray(debugMessages)) return

    const serverErrors = ['invalid-secret-key', 'expired token', 'Invalid session token']
    const hasAuthError = debugMessages.some((debug: any) =>
      serverErrors.some((serverError) =>
        debug?.message?.toLowerCase().includes(serverError.toLowerCase()),
      ),
    )

    if (hasAuthError && import.meta.client) {
      console.warn('Auth error in GraphQL extensions. Clearing cookies and reloading...')
      clearAllCookies()
      clearAllLocalStorage()
      window.location.reload()
    }
  }

  return {
    isShowingMobileMenu,
    isQueryEmpty,
    FALLBACK_IMG,
    clearAllCookies,
    clearAllLocalStorage,
    addBodyClass,
    removeBodyClass,
    toggleBodyClass,
    toggleMobileMenu,
    formatDate,
    formatPrice,
    scrollToTop,
    stripHtml,
    debounce,
    getErrorMessage,
    checkGraphQLExtensions,
  }
}
