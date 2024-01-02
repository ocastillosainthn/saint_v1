// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  devtools: { enabled: true },
  
  plugins: ['~/assets/global-fonts.ts'],
  
  modules: ['nuxt-primevue', 'nuxt-icon' ],
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
  css: ['primevue/resources/themes/saga-purple/theme.css', '~/assets/main.css' ]
})

