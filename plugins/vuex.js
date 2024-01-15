import { store } from '@/store'; // Asegúrate de que la ruta al archivo store sea correcta
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
});
