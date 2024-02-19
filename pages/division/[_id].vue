<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <k-navbar 
      :title="division.name"
      large
      class="top-0 sticky"
      style="background-color: white;"
    >
      <template #left>
        <k-navbar-back-link text="" @click="goBack" />
      </template>
    </k-navbar>
 
    <div> 
  
    </div>


<div >




<div class="centerTittleAction"> 
    <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Mis Vistias  </k-block-title>
    
    <div style="width: 10px0px;">
            <Calendar v-model="icondisplay"  selectionMode="range"  :manualInput="false" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>

        
        
</div>

  <div  class="center-content" >

      <Icon name="solar:calendar-add-broken" style="font-size:40px; color: #4d4d4d; margin-top: 20px; margin-bottom: 10px;"/>
      <p>No tienes visitas agendadas</p>
      
    
      <div class="addUser">
      <Button  @click="openAddReunion" > Agregar Visita</Button>
       </div>

    </div>

</div>




<k-fab
  class="fixed right-4-safe bottom-4-safe z-20"
  text=" + "
  style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 26px; width: 48px;"
  text-position="after"
  @click="openAddReunion"
>
  <template>
    <Icon name="material-symbols:add" style="font-size: 17px; "/>
  </template>
</k-fab>




  </k-page>




</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";

const route = useRoute();
const router = useRouter();
const division = ref(null);
const searchQuery = ref('');

onMounted(async () => {
  const divisionId = route.params._id;
  await cargarDivision(divisionId);
});

async function cargarDivision(divisionId) {
  if (!divisionId) return;

  try {
    const { data, error } = await supabase
      .from('division')
      .select('*,entidad(*,tipo(tipo,id))')
      .eq('id', divisionId)
      .single();

    if (error) throw error;
    division.value = data;
  } catch (error) {
    console.error('Error al obtener la división:', error);
  }
}

function openAddReunion() {
  if (division.value && division.value.id) {
    router.push({ path: `/add_reunion/${division.value.id}` });

    
  }
}

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
      kToast,
    },



  

  };
</script>



<style>

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}


.container {
  padding: 20px;
}

.shrink {
font-size: 13px;
}

.centerTittleAction{
  display: flex;
  align-items: center;
  justify-content:space-between ;
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
