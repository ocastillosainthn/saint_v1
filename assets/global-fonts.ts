import { defineNuxtPlugin } from '#app'
import { useHead } from '@vueuse/head'

export default defineNuxtPlugin(nuxtApp => {
  useHead({
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400&family=Inter:wght@400&display=swap' }
    ]
  })
})