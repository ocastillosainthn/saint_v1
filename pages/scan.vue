
<template>

<k-page  style="background-color: #f7f7f7;">

    <k-navbar 
      title=""
      small
      class="top-0 sticky"
      style="background-color: white;"
    >
      <template #left>
        <k-navbar-back-link text="" @click="goBack" />
      </template>
    </k-navbar>



    <div>
     
      <QrScannerComponent />   
      <div style="background-color:white; padding: 50px; margin-bottom: 0px;">
        <img src="../assets/saintLogo.jpg" alt="Logo" style="max-width: 250px; margin-bottom: 20px;" >
    
      </div>
    </div>

    </k-page>
  </template>


  
  <script setup>
  import QrScannerComponent from '@/components/QrScan.vue';
  import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";



const route = useRoute();
const router = useRouter();



  function goBack() {
  router.back();
}


  </script>
  

  <script>
  import { ref } from 'vue';
  import {
    kPage,
    kNavbar,
    kPanel,
    kBlock,
    kBlockTitle,
    kLink,
    kButton,
    kCard,
    kNavbarBackLink,
    kList,
    kListGroup,
    kListItem,
    kSearchbar,
    kFab,
    kPopup,
    kListInput,
    kToast,
    kPreloader



  } from 'konsta/vue';

  export default {
    components: {
      kPage,
      kNavbar,
      kNavbarBackLink,
      kPanel,
      kBlock,
      kBlockTitle,
      kLink,
      kButton,
      kCard,
      kList,
      kListGroup,
      kListItem,
      kSearchbar,
      kFab,
      kPopup,
      kListInput,
      kPreloader,

      kToast,
    },



  

  };
</script>