// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      stateSecret: `${process.env.STATE_SECRET}`,

      spotifyClientId: `${process.env.SPOTIFY_CLIENT_ID}`,
      spotifyClientSecret: `${process.env.SPOTIFY_CLIENT_SECRET}`,
      spotifyRedirectUri: `${process.env.SPOTIFY_REDIRECT_URI}`,
      githubClientId: `${process.env.GITHUB_CLIENT_ID}`,
      githubClientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
      githubRedirectUri: `${process.env.GITHUB_REDIRECT_URI}`,
    }
  },
})
