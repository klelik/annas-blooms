export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig()
    const { clearAllCookies, clearAllLocalStorage, getDomain } = useHelpers()
    const sessionToken = useCookie('woocommerce-session', {
      domain: getDomain(window.location.href),
    })
    if (sessionToken.value)
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` })

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
      if (initialised) {
        eventsToFireOn.forEach((event) => {
          window.removeEventListener(event, initStore)
        })
        return
      }

      initialised = true

      const initializationSuccessful = true

      useGqlError((err: any) => {
        const serverErrors = ['The iss do not match with this server', 'Invalid session token']
        if (serverErrors.includes(err?.gqlErrors?.[0]?.message)) {
          clearAllCookies()
          clearAllLocalStorage()
          window.location.reload()
        }
      })

      if (!initializationSuccessful) {
        clearAllCookies()
        clearAllLocalStorage()

        const reloadCount = useCookie('reloadCount')
        if (!reloadCount.value) {
          reloadCount.value = '1'
        } else {
          return
        }

        // Removed logoutUser
        if (!reloadCount.value) window.location.reload()
      }
    }

    const isDev = process.env.NODE_ENV === 'development'
    const pagesToInitializeRightAway = ['/checkout', '/my-account', '/order-summary']
    const isPathThatRequiresInit = pagesToInitializeRightAway.some((page) =>
      useRoute().path.includes(page)
    )

    const shouldInit =
      isDev || isPathThatRequiresInit || !storeSettings.initStoreOnUserActionToReduceServerLoad

    if (shouldInit) {
      initStore()
    } else {
      eventsToFireOn.forEach((event) => {
        window.addEventListener(event, initStore, { once: true })
      })
    }
  }
})
