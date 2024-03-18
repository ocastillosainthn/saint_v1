<template>
  <k-page v-if="visita" style="background-color: #f7f7f7;">
    <k-navbar small class="top-0 sticky" style="background-color: transparent;">
      <template #left>
        <k-navbar-back-link text="" @click="goBack" />
      </template>
      <template #right>
        <k-link text="Editar" @click="goEdit" />
      </template>
    </k-navbar>

<!--  Print SHARE IMAGE  --> 
 <div id="content-to-share" ref="contentToShare" style="  background-image: linear-gradient(to left, #20C4D6, #0586F0); padding-top:10px; padding-bottom: 20px;"> 
    <div style="padding: 10px; margin-bottom: 30px; margin-top: 10px;">
      
      <div class="card" style="padding: 0px;">
        <img src="../../assets/saintLogo.jpg" alt="Logo" style="max-width: 200px; margin:auto; margin-top:10px;" >
        <div style="padding: 15px;">
          <div style="display: flex; justify-content: center;">
            <img style="margin: 20px; min-height: 220px;" :src="'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + visita.uuid" alt="Código QR de la Visita" />
          </div>
          <div>
            <p style=" margin-top: 15px; font-size: 24px; font-weight: 700;">{{ visita.nombre }} </p> 
            <div style="display:flex; margin-bottom: 15px; margin-top: px; align-items: center; color: gray;"> 
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.name }} </p> 
              <Icon name="solar:arrow-right-linear" style="font-size: 17px; margin-right: 7px; margin-left:7px"/>
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.entidad.name }} </p> 
            </div>
            <div style="display: flex;"> 
              <div style="display: flex; flex-direction: column; align-items: center;"> 
                <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
                <div style="width: 1px; height: 34%; background-color:gray; margin-bottom: 3px;"> </div> 
                <Icon name="solar:stopwatch-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 0px;" />
              </div> 
              <div style="font-size: 11px; margin-left: 10px;">  
                <div>  Válido Desde   </div>
                <div style="font-size: 15px; margin-bottom: 15px; "> {{ fechaAmigable }} </div>  
                <div> Hasta    </div>
                <div style="font-size: 15px;"> {{ fechaFinAmigable }} </div>  
              </div>  
            </div>
            <div style="display: flex; margin-top: 20px;"> 
              <div style="display: flex; flex-direction: column; align-items: center;"> 
                <Icon name="solar:user-check-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
              </div> 
              <div style="font-size: 11px; margin-left: 10px;">  
                <div>  Invitación creada por   </div>
                <div style="font-size: 15px; margin-bottom: 15px; "> {{ visita.created_by.name }} </div>  
              </div>  
            </div>
          </div>
        </div>

      </div>
       
    </div>
  </div>



<!-- -->


    <div style="padding: 10px; margin-bottom: 70px; margin-top: 20px;">
      <div class="card" style="padding: 0px;">
        <div style="padding: 15px;">
          <div style="display: flex; justify-content: center;">
            <img style="margin: 20px; min-height: 220px;" :src="'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + visita.uuid" alt="Código QR de la Visita" />
          </div>
          <div>
            <p style=" margin-top: 15px; font-size: 24px; font-weight: 700;">{{ visita.nombre }} </p> 
            <div style="display:flex; margin-bottom: 15px; margin-top: px; align-items: center; color: gray;"> 
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.name }} </p> 
              <Icon name="solar:arrow-right-linear" style="font-size: 17px; margin-right: 7px; margin-left:7px"/>
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.entidad.name }} </p> 
            </div>
            <div style="display: flex;"> 
              <div style="display: flex; flex-direction: column; align-items: center;"> 
                <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
                <div style="width: 1px; height: 34%; background-color:gray; margin-bottom: 3px;"> </div> 
                <Icon name="solar:stopwatch-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 0px;" />
              </div> 
              <div style="font-size: 11px; margin-left: 10px;">  
                <div>  Válido Desde   </div>
                <div style="font-size: 15px; margin-bottom: 15px; "> {{ fechaAmigable }} </div>  
                <div> Hasta    </div>
                <div style="font-size: 15px;"> {{ fechaFinAmigable }} </div>  
              </div>  
            </div>
            <div style="display: flex; margin-top: 20px;"> 
              <div style="display: flex; flex-direction: column; align-items: center;"> 
                <Icon name="solar:user-check-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
              </div> 
              <div style="font-size: 11px; margin-left: 10px;">  
                <div>  Invitación creada por   </div>
                <div style="font-size: 15px; margin-bottom: 15px; "> {{ visita.created_by.name }} </div>  
              </div>  
            </div>
          </div>
        </div>

        <div class="borderTop" style="font-size: 15px;">
          <div style="width: 100%; display: flex; align-items: center;  font-weight:700; color: #0586F0;" @click="openPopup"> 
            <Icon name="solar:user-broken" style="font-size: 17px; color: #0586F0; margin-top: 0px; margin-right: 8px;" />
            Participantes <span style="font-weight: 400;"> ({{ participantes.length }}) </span>
          </div>
          <div class="buttonShare" @click="convertToImage" > 
            <Icon name="solar:square-share-line-line-duotone" style="font-size: 17px; color: white; margin-top: 0px; margin-right: 8px;" />
            Compartir
          </div>
        </div>
      </div>
          <div style="margin-top: 50px; color: red; font-size: 13px; text-align: center;" @click="() => dialogoDeleteVisita(visita.id)" > 
          Eliminar visita
          </div>
    </div>


   



 
  </k-page>


  <k-popup  class="popMedia"  :opened="popupOpened" @backdropclick="() => (popupOpened = false)"  >
      <k-navbar title="Participantes" small isTralucent style="background-color: white;">
        <template #left>
          <k-link navbar @click="() => (popupOpened = false)">
            <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>
          </k-link>
        </template>
      </k-navbar>
        <div style="padding: 20px;" > 
          
          
          <Listbox :options="participantes" filter optionLabel="persona.nombre" class="w-full md:w-14rem">
            <template #option="{ option }">
              <div style="display: flex; justify-content: space-between;">
                <span>{{ option.persona.nombre }}</span>
                <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #ef5a5a; margin-right: 8px;" @click="() => abrirDialogoConfirmacion(option.id)" />
              </div>
            </template>
          </Listbox>


      


        </div>
    </k-popup>


    <k-dialog
        :opened="confirmOpened"
        @backdropclick="() => (confirmOpened = false)"
      >
        <template #title>Eliminar Participante</template>
        Seguro que deseas eliminar el participante?
        <template #buttons>
          <k-dialog-button @click="() => (confirmOpened = false)"
            >No</k-dialog-button
          >
          <k-dialog-button strong @click="eliminarParticipante">
            Si
          </k-dialog-button>
        </template>
      </k-dialog>



      <k-dialog
        :opened="confirmOpenedVisita"
        @backdropclick="() => (confirmOpenedVisita = false)"
      >
        <template #title>Eliminar Visita</template>
        Seguro que deseas eliminar la visita?
        <template #buttons>
          <k-dialog-button @click="() => (confirmOpenedVisita = false)"
            >No</k-dialog-button
          >
          <k-dialog-button strong @click="eliminarVisita">
            Si
          </k-dialog-button>
        </template>
      </k-dialog>




      <div v-if="loading" class="fixedScreen"> 
        <k-preloader  size="w-6 h-6" />
      </div>


</template>



<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";
import Chip from 'primevue/chip';
import { useStore } from 'vuex';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';



const route = useRoute();
const router = useRouter();
const division = ref(null);
const visita = ref(null);
const searchQuery = ref('');
const participantes = ref([]);
const popupOpened = ref(false);
const confirmOpened = ref(false);
const confirmOpenedVisita = ref(false);
const participanteIdParaEliminar = ref(null);
const visitaIdParaEliminar = ref(null);
const contentToShare = ref(null);
const loading = ref(false);

const store = useStore();
const user = store.getters.getUser;
const userUuid = user.uuid;


const openToast = (side, message) => {
  opened.value = { left: false };
  opened.value[side] = true;
  toastMessage.value = message; 
  
  setTimeout(() => {
    opened.value[side] = false;
  }, 3000); 
};
   


onMounted(async () => {
  if (route.params._id) { // Comprueba si _id existe
    await cargarVisita(route.params._id);
  } else {
    console.error("El ID de la visita no está definido");
  }

  const datosParticipantes = await cargarParticipantes(route.params._id);
  participantes.value = datosParticipantes;
 
});

async function cargarVisita(visitaId) {
  if (!visitaId) return;

  try {
    const { data, error } = await supabase
      .from('visita') 
      .select('*, created_by(*), division(*, entidad(*))')
      .eq('id', visitaId)
      .single();

    if (error) throw error;
    visita.value = data; 
  } catch (error) {
    console.error('Error al obtener la visita:', error.message);
  }
}


const convertToImage = () => {
  if (!contentToShare.value) return;

  loading.value = true; 

  domtoimage.toPng(contentToShare.value)
    .then((dataUrl) => {
      shareImage(dataUrl);
    })
    .catch((error) => {
      console.error('Error convirtiendo a imagen:', error);
      openToast('left', error.message);
    })
    .finally(() => {
      loading.value = false; 
    })
    ;
};


const shareImage = (imageData) => {
  console.log('Imagen para compartir:', imageData);

  if (window.Functions) {
    window.Functions.shareImage(imageData);
  } else {
    console.error("La función de interfaz de Android no está definida.");
  }
  
};

const abrirDialogoConfirmacion = (id) => {
  console.log('ID del participante para eliminar:', id); 
  participanteIdParaEliminar.value = id;
  confirmOpened.value = true;
};


const dialogoDeleteVisita = (id) => {
  console.log('ID del participante para eliminar:', id); 
  visitaIdParaEliminar.value = id;
  confirmOpenedVisita.value = true;
};

function openPopup() {
  popupOpened.value = true;
}

const fechaAmigable = computed(() => {
  if (!visita.value || !visita.value.fecha) return 'Cargando fecha...';
  
  const fecha = new Date(visita.value.fecha);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }) + ' ' + fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
});


const fechaFinAmigable = computed(() => {
  if (!visita.value || !visita.value.fecha || !visita.value.duracion) return 'Cargando fecha de fin...';
  
  const fechaInicio = new Date(visita.value.fecha);
  const fechaFin = new Date(fechaInicio.getTime() + visita.value.duracion * 60 * 60 * 1000);

  return fechaFin.toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }) + ' ' + fechaFin.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true
  });
});



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



const eliminarParticipante = async () => {
  if (participanteIdParaEliminar.value === null) {
    console.error('No se ha especificado el ID del participante para eliminar');
    return;
  }

  try {
    const { error } = await supabase
      .from('participantes')
      .delete()
      .eq('id', participanteIdParaEliminar.value);

    if (error) throw error;

    participanteIdParaEliminar.value = null;
    confirmOpened.value = false;

    const datosActualizados = await cargarParticipantes(route.params._id);
    participantes.value = datosActualizados;

  } catch (error) {
    console.error('Error al eliminar el participante:', error.message);
  }
};


const eliminarVisita = async () => {
  if (visitaIdParaEliminar.value === null) {
    console.error('No se ha especificado el ID de la visita para eliminar');
    return;
  }

  try {
    let { error: errorEliminarParticipantes } = await supabase
      .from('participantes')
      .delete()
      .eq('visita', visitaIdParaEliminar.value);

    if (errorEliminarParticipantes) throw errorEliminarParticipantes;

    let { error: errorEliminarVisita } = await supabase
      .from('visita')
      .delete()
      .eq('id', visitaIdParaEliminar.value);

    if (errorEliminarVisita) throw errorEliminarVisita;

    visitaIdParaEliminar.value = null;
    confirmOpenedVisita.value = false;

    await goBack();

  } catch (error) {
    console.error('Error al eliminar la visita:', error.message);
  }
};


function goBack() {
  router.back();
}

function goEdit() {
  router.push(`/edit_reunion/${route.params._id}`);

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
    kDialog,
    kDialogButton,
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
      kToast,
      kDialog,
      kDialogButton,
      kPreloader
    },



  

  };
</script>

<style >


.popMedia{
  height: 60vh!important;
  top: 70vh;
}



.borderTop{ 
  border-top-color: rgb(223, 223, 223);
  border-top-width: 1px;
  border-top-style: solid;
  display: flex;
  padding: 10px;
  width: 100%;

}


.buttonShare{
  display: flex;
  align-items: center; 
  justify-content: center;
  background-image: linear-gradient(to right, #20C4D6, #0586F0);
  padding: 7px;
  border-radius: 20px;
  color: white;
  padding-left: 13px;
  padding-right: 12px;
}


.p-listbox-filter-container{
  border-color: rgb(232, 232, 232);
  border-width: 1px;
}


#content-to-share {
 z-index: -1;
  position: absolute;
margin-top: -45px;
max-height: 550px;
  
  
}


.fixedScreen{
  z-index: 3000;
  background-color: rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 100vh;
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
}

</style>
