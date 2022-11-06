export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'chat-app-web',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  router: {
    middleware: ['auth'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vuesax/dist/vuesax.css',
    'boxicons/css/boxicons.min.css',
    '~assets/css/main.css',
    '~assets/scss/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/vuesax.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://color-mode.nuxtjs.org/
    '@nuxtjs/color-mode',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',
    '@nuxtjs/laravel-echo',
  ],
  echo: {
    broadcaster: 'socket.io',
    host: 'http://127.0.0.1:6002',
    authEndpoint: '/broadcasting/auth',
    authModule: true,
    path: '/ws/socket.io',
    connectOnLogin: true,
    disconnectOnLogout: true,
    plugins: ['@/plugins/echo'],
    forceTLS: false,
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/axios', '@nuxtjs/auth-next'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  axios: {
    proxy: true,
    baseURL: process.env.API_URL,
  },

  proxy: {
    '/api/': {
      target: process.env.API_URL,
      pathRewrite: { '^/api/': '' },
      secure: false,
      changeOrigin: true,
    },
  },

  auth: {
    redirect: {
      login: '/auth',
      logout: '/auth',
      callback: '/auth',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          property: 'accessToken',
          required: true,
          type: 'Bearer',
        },
        user: {
          property: 'data',
          // autoFetch: false,
        },
        endpoints: {
          login: { url: '/api/login', method: 'post' },
          logout: { url: '/api/users/logout', method: 'post' },
          user: { url: '/api/users/me', method: 'get' },
        },
      },
    },
  },
}
