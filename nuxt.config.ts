// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  devtools: { enabled: true },
  

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
        // Otros meta tags aquí
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