<template>



  <!-- Wrap our app with App component -->
  <k-app theme="ios">
    <NuxtPage />
  </k-app>
 
</template>

<script>
  import { kApp } from 'konsta/vue';
  import './assets/main.css';
import tabBar from './components/tabBar.vue';

  export default {
    components: {
      kApp,
    },
  };
</script>

<style>
/* Tus estilos globales */
</style>