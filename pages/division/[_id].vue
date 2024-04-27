<template>
  <k-page v-if="division" style="background-color: #f7f7f7;">
    <k-navbar 
      :title="division.name"
      small
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
    <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Mis Visitas  </k-block-title>
    
    <div style="margin-right: 10px; border-width:0; border-color: red; border-style: hidden;  text-align: center;">
            <Calendar v-model="filterVisita"  showButtonBar  :manualInput="true" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>

        
        
</div>

<div v-if="loading" style="display: flex; width: 100%; justify-content:center;"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
      </div>

<div style="padding: 10px; margin-bottom: 70px;" v-show="visitas.length  > 0">
  <div class="card" v-for="visita in visitas" :key="visita.id" @click="navigateToVisita(visita.id)">
    <p style="font-weight: 700; font-size: 20px; margin-bottom:7px;">{{ visita.nombre }}</p>
    <p style="font-size: 14px; color: gray;">       <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 7px;" />
      <span> {{ formatFechaAmigable(visita.fecha) }}</span>
</p>
    <p style="font-size: 11px; color: gray; margin-top: 20px; margin-bottom: 10px;"> Participantes</p>

    <div class="chips-container">
  <template v-for="(participante) in visita.participantes.slice(0, 3)" :key="participante.id">
    <Chip class="chip"> 
      <span class="labelAvatar">{{ participante.persona.nombre[0] }}</span>
      <span>{{ participante.persona.nombre }}</span>
    </Chip>
  </template>
  <!-- Mostrar cuántos participantes más hay si el total supera a 3 -->
  <span v-if="visita.participantes.length > 3" class="chip" style="padding: 2px; margin-top: 5px; background-color: white; border-color: white;">
    +{{ visita.participantes.length - 3 }}
  </span>
</div>
  </div>
</div>

    <div class="center-content" v-show="!cargandoVisitas && visitas.length === 0">
      <Icon name="solar:calendar-add-broken" style="font-size: 40px; color: #4d4d4d; margin-top: 20px; margin-bottom: 10px;" />
      <p>No tienes visitas agendadas</p>
      <div class="addUser">
        <Button @click="openAddReunion">Agregar Visita</Button>
      </div>
    </div>

</div>



<div class="tabbar-container"  style="height: 50px; background-color: white;"> 

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


</div>

  </k-page>




</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";
import Chip from 'primevue/chip';


const route = useRoute();
const router = useRouter();
const division = ref(null);
const searchQuery = ref('');
const filterVisita = ref('');
const visitas = ref([]);
const participantes = ref([]);
const cargandoVisitas = ref(true);
const loading = ref(false);


onMounted(async () => {
  loading.value = true;

  const divisionId = route.params._id;
  await cargarDivision(divisionId);
  await cargarVisita();

  loading.value = false;


  //cargarParticipantes();
   

});

function navigateToVisita(visitaId) {
  router.push(`/visita/${visitaId}`);
}


function formatFechaAmigable(fechaString) {
  if (!fechaString) return 'Cargando fecha...';
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }) + ' ' + fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
}



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

const cargarDatos = async () => {
  cargandoVisitas.value = true; 
  try {
    await cargarDivision(divisionId);
    await cargarVisita(); 
    // Puedes incluir aquí cualquier otra operación de carga necesaria
  } catch (error) {
    console.error("Error cargando datos:", error);
  } finally {
    cargandoVisitas.value = false; // Finalizamos la carga de datos
  }
};


async function cargarParticipantes(visitaId) {
  try {
    const { data, error } = await supabase
      .from('participantes') 
      .select('*,persona(*)')
      .eq('visita', visitaId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al cargar los participantes:', error.message);
    return []; 
  }
}

async function cargarVisita() {
  try {
    if (!division.value || !division.value.id) {
      throw new Error('El ID de la división no está definido o está vacío');
    }

    const { data, error } = await supabase
      .from('visita')
      .select('*')
      .eq('division', division.value.id);

    if (error) throw error;

    for (const visita of data) {
      visita.participantes = await cargarParticipantes(visita.id);
    }

    visitas.value = data;

    console.log('Visitas y participantes cargados:', visitas);
  } catch (error) {
    console.error('Error al cargar las visitas y participantes:', error.message);
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



.tabbar-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
   
  }


</style>
