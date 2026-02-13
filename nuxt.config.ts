export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})
