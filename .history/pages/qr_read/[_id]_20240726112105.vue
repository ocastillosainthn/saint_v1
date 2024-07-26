<template>
  <div>
    <div v-if="loading" class="loadingPage">
      <k-preloader style="display: flex;" size="w-5 h-5" />
    </div>

    <k-page style="background-color: #f7f7f7;">
      <k-navbar title="" small class="top-0 sticky" style="background-color: white;">
        <template #left>
          <k-navbar-back-link text="" @click="goBack" />
        </template>
      </k-navbar>

      <div v-if="visita && visita.division && visita.division.entidad">
        <div style="background-color:white; padding: 15px; margin-bottom: 0px;">
          <div>
            <p class="fontTitle">{{ visita.nombre }} </p>
            <div style="display:flex; margin-bottom: 15px; margin-top: px; align-items: center; color: gray;">
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.name }} </p>
              <Icon name="solar:arrow-right-linear" style="font-size: 17px; margin-right: 7px; margin-left:7px" />
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.entidad.name }} </p>
            </div>
            <div style="display: flex;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
                <div style="width: 1px; height: 34%; background-color:gray; margin-bottom: 3px;"> </div>
                <Icon name="solar:stopwatch-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 0px;" />
              </div>
              <div style="font-size: 11px; margin-left: 10px; width: 100%">
                <div> Válido Desde </div>
                <div style="font-size: 14px; margin-bottom: 15px;"> {{ fechaAmigable }} </div>
                <div> Hasta </div>
                <div style="font-size: 14px;"> {{ fechaFinAmigable }} </div>
              </div>
            </div>

            <div v-if="fechaFinPasada" class="alert">
              <Icon name="solar:shield-warning-bold" style="font-size: 22px; color: red; margin-top: 0px; margin-right: 0px;" />
              Esta visita ya no está disponible
            </div>

            <div style="display: flex; margin-top: 20px;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <Icon name="solar:user-check-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
              </div>
              <div style="font-size: 11px; margin-left: 10px; width: 100%;" >
                <div> Invitación creada por </div>
                <div style="font-size: 15px; margin-bottom: 1px;"> {{ visita.created_by.name }} </div>
                <p v-if="visita && visita.created_by">
                  {{ visita.created_by.player_id }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 15px; padding-top: 20px; background-color: white; margin-top: 10px;">
        <div style="display: flex; justify-content:space-between ;">
          <div style="font-weight: 700; margin-bottom: 10px;"> Participantes </div>
          <div style="font-size: 14px;">
            Acompañantes: {{ visita?.cant }}
          </div>
        </div>
        <Listbox :options="participantes" filter optionLabel="persona.nombre" class="w-full md:w-14rem">
          <template #option="{ option }">
            <div style="display: flex; justify-content: space-between;" @click="seleccionarParticipante(option)">
              <div style="width:60%;">
                <div style="display: flex; flex-direction: column;">
                  {{ option.persona.nombre }}
                  <span style="color:gray; font-size: 13px;">
                    {{ option.persona.empresa ? option.persona.empresa.nombre : '' }}  {{ option.persona.puesto }}
                  </span>
                </div>
              </div>

              <kButton v-if="!option.entrada" style="width:30%; height: 40px;" @click.stop="marcarEntrada(option.id)"> ENTRADA </kButton>
              <kButton v-if="option.entrada && !fechaFinPasada && !option.salida" style="width:30%; height: 40px; background-color: red;" @click.stop="marcarSalida(option.id)"> SALIDA </kButton>
              <Icon v-if="option.salida && !fechaFinPasada" name="solar:shield-check-bold" style="font-size: 40px; margin-right: 7px; margin-left:7px; color: #65AE2C;" />
            </div>
          </template>
        </Listbox>
      </div>
    </k-page>

    <k-popup :opened="noVisita" @backdropclick="() => {}" class="popMedia">
      <k-navbar title="Error buscando visita" small style="background-color: white; color: red;"></k-navbar>
      <div style="padding: 20px; text-align: center;">
        <p style="margin-bottom: 5px;">{{ errorMessage }}</p>
        <p style="margin-bottom: 20px;">{{ visita?.uuid }}</p>
        <kButton style="height: 40px; background-color: red;" @click="scanAgain">Escanear de nuevo</kButton>
      </div>
    </k-popup>

    <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedia">
      <k-navbar title="Participante" small style="background-color: white; ">
                <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>


      </k-navbar>
      
      <div style="padding: 20px;">

        {{ participanteSelected }}
        <div>

          <div class="itemPersona"> 
            <div>Nombre </div>
            <div> {{ participanteSelected.persona.nombre }} </div>
          </div>

          <div class="itemPersona"> 
            <div>Identidad </div>
            <div> {{ participanteSelected.persona.dniPasaporte }} </div>
          </div>


          <div class="itemPersona"> 
            <div>Teléfono </div>
            <div> {{ participanteSelected.persona.telefono }} </div>
          </div>

          <div class="itemPersona"> 
            <div>Correo electrónico </div>
            <div> {{ participanteSelected.persona.correo }} </div>
          </div>

          <div class="itemPersona"> 
            <div>Placa </div>
            <div> {{ participanteSelected.persona.placa }} </div>
          </div>

          <div class="itemPersona"> 
            <div>Tipo </div>
            <div> {{ participanteSelected.persona.tipoPersona }} </div>
          </div>


     <div>
          <div class="itemPersona"> 
            <div>Empresa </div>
            <div> {{ participanteSelected.persona.empresa }} </div>
          </div>

          <div class="itemPersona"> 
            <div>Cargo </div>
            <div> {{ participanteSelected.persona.puesto }} </div>
          </div>
        </div>


        <div>
          <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
         Entrada {{ participanteSelected.entrada }} 
        </div>

        <div>
          <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
         Salida {{ participanteSelected.salida }} 
        </div>



        </div>

      
      </div>
    </k-popup>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const visita = ref(null);
const participantes = ref([]);
const loading = ref(true);
const popupOpened = ref(false);
const noVisita = ref(false);
const errorMessage = ref('');
const participanteSelected = ref(null);

onMounted(async () => {
  if (route.params._id) {
    loading.value = true;
    await cargarVisita(route.params._id);
    if (visita.value && visita.value.id) {
      console.log('visita id', visita.value.id);
      const datosParticipantes = await cargarParticipantes(visita.value.id);
      participantes.value = datosParticipantes;
    }
    loading.value = false;
  } else {
    console.error("El ID de la visita no está definido");
    loading.value = false;
  }
});

async function cargarVisita(visitaId) {
  if (!visitaId) return;

  try {
    const { data, error, count } = await supabase
      .from('visita')
      .select('*, created_by(*), division(*, entidad(*))', { count: 'exact' })
      .eq('uuid', visitaId);

    if (error) throw error;

    if (count === 0) {
      errorMessage.value = 'No se encontró ninguna visita registrada con este código QR.';
      noVisita.value = true;
      return;
    } else if (count > 1) {
      errorMessage.value = 'Se encontraron múltiples visitas con el UUID proporcionado.';
      noVisita.value = true;
      return;
    }

    visita.value = data[0];  // Accede al primer (y único) elemento
    console.log('datos de Visita OK', visita);
  } catch (error) {
    errorMessage.value = 'Error al obtener la visita: ' + error.message;
    noVisita.value = true;
  }
}

async function cargarParticipantes(visitaId) {
  try {
    const { data, error } = await supabase
      .from('participantes')
      .select('*,persona(*, empresa(*))')
      .eq('visita', visitaId);

    if (error) throw error;
    console.log('resultadoCargar participantes', data);
    return data;
  } catch (error) {
    errorMessage.value = 'Error al cargar los participantes: ' + error.message;
    noVisita.value = true;
    return [];
  }
}

async function marcarEntrada(participanteId) {
  if (!participanteId) return;

  try {
    const { data, error } = await supabase
      .from('participantes')
      .update({
        entrada: new Date().toISOString(),
        estado: "iniciada"
      })
      .eq('id', participanteId)
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      const updatedParticipante = participantes.value.find(p => p.id === participanteId);
      if (updatedParticipante) {
        updatedParticipante.entrada = data[0].entrada;
      }

      console.log('Entrada del participante actualizada:', data[0]);

      try {
        await pushSend();
      } catch (error) {
        console.error("Error al enviar la notificación:", error);
      }
    } else {
      console.log('No se devolvieron datos tras la actualización');
    }
  } catch (error) {
    errorMessage.value = 'Error al actualizar la entrada del participante: ' + error.message;
    noVisita.value = true;
  }
}

async function marcarSalida(participanteId) {
  try {
    const { data, error } = await supabase
      .from('participantes')
      .update({
        salida: new Date().toISOString(),
        estado: "salida"
      })
      .eq('id', participanteId)
      .select();

    if (error) throw error;

    const participanteIndex = participantes.value.findIndex((p) => p.id === participanteId);
    if (participanteIndex !== -1 && data && data.length > 0) {
      participantes.value[participanteIndex] = { ...participantes.value[participanteIndex], salida: data[0].salida };
    }

    try {
      await pushOut();
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  } catch (error) {
    errorMessage.value = 'Error al marcar la salida del participante: ' + error.message;
    noVisita.value = true;
  }
}

const pushSend = async () => {
  const pushTitle = "SAINT - confirmación de visita";
  const pushContent = "Tu visita ha ingresado a la residencial";
  const playerIDsA = [visita.value.created_by.player_id];
  console.log('player id:', playerIDsA);

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: "0cad61c6-60db-4baf-94ed-02e0b602dcc6",
      include_player_ids: playerIDsA,
      headings: { en: pushTitle },
      contents: { en: pushContent }
    }, {
      headers: {
        'Authorization': 'Basic ZjRhYzliOTEtZTI2OS00ODA4LWI1ZjYtNjY0NjkyMDBmNzI4',
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    });
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error while sending notification:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
  }
};

const pushOut = async () => {
  const pushTitle = "SAINT - confirmación de salida de visita";
  const pushContent = "Tu visita ha salido de la residencial";
  const playerIDsA = [visita.value.created_by.player_id];
  console.log('player id:', playerIDsA);

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: "0cad61c6-60db-4baf-94ed-02e0b602dcc6",
      include_player_ids: playerIDsA,
      headings: { en: pushTitle },
      contents: { en: pushContent }
    }, {
      headers: {
        'Authorization': 'Basic ZjRhYzliOTEtZTI2OS00ODA4LWI1ZjYtNjY0NjkyMDBmNzI4',
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    });
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error while sending notification:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
  }
};

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

const fechaFinPasada = computed(() => {
  if (!visita.value || !visita.value.fecha || !visita.value.duracion) return false;

  const fechaInicio = new Date(visita.value.fecha);
  const fechaFin = new Date(fechaInicio.getTime() + visita.value.duracion * 60 * 60 * 1000);
  const ahora = new Date();

  return fechaFin < ahora;
});

function seleccionarParticipante(participante) {

  participanteSelected.value = participante;
  console.log('clic en participantes:', participanteSelected.value)


  popupOpened.value = true;
}

function goBack() {
  router.back();
}

function closeNoVisita() {
  noVisita.value = false;
}

function scanAgain() {
  noVisita.value = false;
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
input{
    border-width: 1px;
    border-style: solid;
    border-color: rgb(209, 209, 209);
}

.fontTitle{
    margin-top: 15px; 
    font-size: 30px;  
    line-height: 1 ; 
    font-weight: 700;
    margin-bottom: 20px;
}

.alert{
    width:100%;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.126) ;
    border-color: rgb(233, 72, 72);
    border-width: 1px;
    border-style: solid;
    border-radius: 7px;
    margin-top: 15px;
    color: red;
    font-weight: 700;
    font-size: 12px;
    text-align:center;
}

.itemPersona{
  display: flex;
  justify-content: space-between;
  padding: 6px 0px;
  border-bottom: 1px solid rgb(230, 230, 230);
}

.popMedia{
  height: 65vh!important;
  top: 70Vh;
}
</style>
