// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  devtools: { enabled: true },
  

  app: {
    head: {
      title: 'SAINT - Sistemas de accesos inteligentes',
      meta: [
        { name: 'viewport', 
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },

      ]
    }
  },


  build: {
    transpile: ['konsta'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  plugins: ['~/assets/global-fonts.ts', '~/plugins/supabase.js','~/plugins/vuex.js'],
  
  modules: ['nuxt-primevue', 'nuxt-icon', '@nuxtjs/tailwindcss'], 

  nitro: {
    preset: 'node-server',
    devProxy: {
      '/api/': {
        target: 'https://api.resend.com',
        changeOrigin: true
      }
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
  css: ['primevue/resources/themes/md-light-indigo/theme.css', '~/assets/main.css' ]
})