// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  devtools: { enabled: true },
  
  plugins: ['~/assets/global-fonts.ts'],
  
  modules: ['nuxt-primevue', 'nuxt-icon' ],
  runtimeConfig: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    
    
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
  css: ['primevue/resources/themes/md-light-indigo/theme.css', '~/assets/main.css' ]
})

