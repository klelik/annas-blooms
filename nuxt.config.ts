// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: './src',

  components: ['@/components', '@/components/atoms', { path: '@/components/blocks', global: true }],

  css: ['@/assets/scss/styles.scss'],
  modules: [
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-svgo',
    'nuxt-aos',
    '@nuxt/eslint',
    'nuxt-graphql-client',
    '@pinia/nuxt',
  ],
  'graphql-client': {
    clients: {
      default: {
        host: process.env.GQL_HOST,
        corsOptions: { mode: 'cors', credentials: 'include' },
        headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
      },
    },
  },
  alias: {
    '#woo': '../.nuxt/gql/default',
  },
  eslint: {},
  image: {
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
  },
  aos: {
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 400, // values from 0 to 3000, with step 50ms
    easing: 'ease-in-out', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    //anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    // Adding console log when AOS initializes
    init: () => {
      console.log('AOS has been initialized')
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        // {
        //   rel: 'apple-touch-icon',
        //   sizes: '60x60',
        //   href: '/favicon/apple-touch-icon.png'
        // },
        // {
        //   rel: 'icon',
        //   type: 'image/png',
        //   sizes: '32x32',
        //   href: '/favicon/favicon-32x32.png'
        // },
        // {
        //   rel: 'icon',
        //   type: 'image/png',
        //   sizes: '16x16',
        //   href: '/favicon/favicon-16x16.png'
        // },
        // { rel: 'manifest', href: '/favicon/site.webmanifest' },
        // {
        //   rel: 'mask-icon',
        //   href: '/favicon/safari-pinned-tab.svg',
        //   color: '#142e4a'
        // }
      ],
      script: [],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
        { charset: 'utf-8' },
        { name: 'msapplication-TileColor', content: '#2b5797' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  runtimeConfig: {
    public: {
      GQL_HOST: process.env.GQL_HOST,
    },
  },
})
