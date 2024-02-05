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

  <k-list strong-ios outline-ios v-if="divisionesFiltradas.length">
    <k-list-item
      v-for="division in divisionesFiltradas"
      :key="division.id" 
      :title="division.name" 
      :footer="`${division.uuid}`"
      @click="navegarADivisionEdit(division.id)"
      >

    </k-list-item>
  </k-list>


  <k-fab
  class="fixed right-4-safe bottom-4-safe z-20"
  :text="fabText"
  style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 11px!important;"
  text-position="after"
  @click="abrirPopup"
  >

  <k-popup v-if="popupOpened=false" @close="popupOpened = false">
      <k-page>
        <k-navbar title="Agregar " fabText>
          <template #right>
            <k-link navbar @click="() => (popupOpened = false)"> Close </k-link>
          </template>
        </k-navbar>
        <k-block class="space-y-4">
          <p>
        Formulario  crear nueva división / residencia
          </p>
      
        </k-block>
      </k-page>
    </k-popup>


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
const searchQuery = ref('');
const popupOpened = ref(true);

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


const divisionesFiltradas = computed(() => {
  const filtradas = searchQuery.value.trim() ? 
    divisiones.value.filter(division =>
      division.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) : divisiones.value;
  console.log("Divisiones filtradas:", filtradas); // Verifica los datos filtrados
  return filtradas;
});

// Carga inicial de datos
onMounted(async () => {
  const entidadId = route.params._id;
  await cargarEntidad(entidadId);
  divisiones.value = await cargarDivisiones(entidadId); 
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

function abrirPopup() {
  popupOpened.value = true;
  console.log('iniciado Abrir Popup')
  console.log(popupOpened.value)
}


function navegarADivisionEdit(divisionId) {
  router.push(`/division_edit/${divisionId}`);
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



    },

    
  
  };
</script>

<style>
.container {
  padding:20px
}
</style>