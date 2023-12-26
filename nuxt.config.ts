// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  primevue: {
    usePrimeVue: true,
    options: {
      ripple: true
  },

  components:{
    include: '*'
   
  }
},
  css: ['primevue/resources/themes/lara-light-teal/theme.css', '~/assets/main.css' ]
})

