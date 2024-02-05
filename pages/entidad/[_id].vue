<template>
  <k-page v-if="entidad" style="background-color: rgb(247, 247, 247); ">
    <k-navbar 
    
      :title="entidad.name" 
      medium
      class="top-0 sticky"
      style="background-color: white;"
    >
    <template #left>
      <k-navbar-back-link text="" @click="goBack" />  </template>

      <template #right>
        <div>
         
        </div>
      </template>
    </k-navbar>
 
<div > 
  <k-searchbar
    v-model="searchQuery"
    placeholder="Buscar"
    clearButton
  ></k-searchbar>

  <k-list strong-ios outline-ios >
    <k-list-item v-for="division in divisiones" 
    @click="goToEdit(division.id)"
    :key="division.id" 
    :title="division.name" 
    :footer="`${division.uuid}`">
  </k-list-item>

  </k-list>


  <k-fab
  class="fixed right-4-safe bottom-4-safe z-20"
  :text="fabText"
  style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 11px;"
  text-position="after"
>
  <template>
    <Icon name="material-symbols:add" style="font-size: 17px; "/>
  </template>
</k-fab>

  
</div>
</k-page>

</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'; 
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient"; 
import { watch } from 'vue';

const route = useRoute();
const router = useRouter();
const entidad = ref(null);
const divisiones = ref([]);


const fabText = computed(() => {
  
  if (!entidad.value || !entidad.value.tipo) {
    return 'Crear'; 
  }
  switch (entidad.value.tipo.id) {
    case 2:
      return '+ Residencia';
    case 1:
      return '+ División';
    default:
      return 'Crear'; 
  }
});



// Carga inicial de datos
onMounted(async () => {

  const entidadId = route.params._id;
  await cargarEntidad(entidadId);
  await cargarDivisiones(entidadId);
  
});

async function cargarDivisiones(entidadId) {
  try {
    const { data: divisionesData, error } = await supabase
      .from('division') 
      .select('*,entidad(*,tipo(tipo))')
      .eq('entidad', entidadId);

    if (error) throw error;

    console.log("Divisiones cargadas:", divisionesData); // Verifica los datos cargados
    divisiones.value = divisionesData;
    console.log ('divisiones montado',divisiones )
  } catch (error) {
    console.error('Error al obtener las divisiones:', error);
  }
}

async function cargarEntidad(entidadId) {
  if (!entidadId) {
    console.log("ID de entidad no está disponible.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('entidad')
      .select('*,tipo(id)')
      .eq('id', entidadId)
      .single();

    if (error) throw error;

    entidad.value = data;
    console.log('entidadCargada:',entidad)
  } catch (error) {
    console.error('Error al obtener la entidad:', error);
  }
}

function goBack() {
  router.back();
}


function goToEdit(id) {
  router.push(`/division_edit/${id}`);
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



    },

    
  
  };
</script>

<style>
.container {
  padding:20px
}
</style>