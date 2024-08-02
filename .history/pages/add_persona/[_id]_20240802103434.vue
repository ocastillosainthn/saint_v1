<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <k-navbar 
    title="Agregar persona"
      small
      class="top-0 sticky"
      style="background-color: white;"
    >
      <template #left>
        <k-navbar-back-link text="" @click="goBack" />
      </template>
    </k-navbar>

    <div class="container">

      <div style="display: flex; justify-content: space-between;"> 

        <div> 
          <div style="margin-bottom: 10px;" v-if="division && division.entidad.tipo.id === 1"> 
            <div style="display: flex;"> 
              <div style="width: 90%;"> 
                <label for="empresa">Empresa</label>
                <Dropdown v-model="selectedEmpresa" editable :options="empresasActivas" optionLabel="name" placeholder="Buscar empresa" class="w-full md:w-14rem" />
              </div>
              <Icon name="solar:add-circle-bold" @click="openEmpresa" style="font-size:25px; color: #0586F0; margin-top: 29px; margin-left:25px" />
            </div>

            <div style="margin-top: 10px;">
              <label for="puestoEmpresa">Puesto</label>
              <InputText id="puestoEmpresa" v-model="puestoEmpresa" aria-describedby="puestoEmpresa-help" />
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <label for="personaName">Nombre de persona</label>
            <InputText id="personaName" v-model="personaName" aria-describedby="personaName-help" />
            <p v-if="errors.personaName" style="color: red;">{{ errors.personaName }}</p>
          </div>

          <div style="margin-bottom: 20px;"> 
            <label for="tipopersona">Tipo de persona</label>
            <Dropdown v-model="selectTipoPersona" editable :options="tipoPersonaOptions" optionLabel="label" placeholder="Tipo persona" class="w-full md:w-14rem" />
            <p v-if="errors.selectTipoPersona" style="color: red;">{{ errors.selectTipoPersona }}</p>
          </div>

          <div style="margin-bottom: 10px;">
            <label for="email">Correo electrónico</label>
            <InputText id="email" v-model="emailPersona" aria-describedby="email-help" />
          </div>

          <div style="display: flex;">
            <div class="columnForm" style="margin-right: 10px;">
              <label for="dni">DNI/ Pasaporte</label>
              <InputText id="dni" v-model="dniPasaporte" aria-describedby="dniPasaporte-help" />
            </div>
            <div class="columnForm">
              <label for="phone">Teléfono</label>
              <InputText id="phone" v-model="phone" aria-describedby="phone-help" />
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <label for="placa">Placa vehicular</label>
            <InputText id="placa" v-model="placa" aria-describedby="placa-help" />
          </div>

          <k-button type="submit" @click="crearPersona" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
          </k-button>
        </div>
      </div>
    </div>
  </k-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../../db/supabaseClient";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import ListBox from 'primevue/listbox';
import Icon from 'primevue/icon';

const openedToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('black');
const errors = ref({});

const route = useRoute();
const router = useRouter();
const division = ref(null);
const entidad = ref(null);
const selectedEmpresa = ref(null);
const personaName = ref('');
const selectTipoPersona = ref(null);
const tipoPersonaOptions = ref([]);
const puestoEmpresa = ref('');
const emailPersona = ref('');
const dniPasaporte = ref('');
const phone = ref('');
const placa = ref('');
const empresasActivas = ref([]);

onMounted(async () => {
  const divisionId = route.params._id;
  await cargarDivision(divisionId);
  await cargarTiposPersona();
  await cargarEmpresasActivas();
});

function validarFormulario() {
  errors.value = {};

  if (!personaName.value.trim()) {
    errors.value.personaName = 'El nombre de la persona es obligatorio.';
  }

  if (!selectTipoPersona.value) {
    errors.value.selectTipoPersona = 'El tipo de persona es obligatorio.';
  }

  return Object.keys(errors.value).length === 0;
}

async function crearPersona() {
  if (!validarFormulario()) {
    return;
  }

  const payload = {
    empresa: selectedEmpresa?.value?.value || null,
    puesto: puestoEmpresa.value || '',
    nombre: personaName.value,
    tipoPersona: selectTipoPersona?.value?.value || null, 
    dniPasaporte: dniPasaporte.value,
    telefono: phone.value,
    correo: emailPersona.value,
    placa: placa.value,
    division: division?.value?.id || null,
    entidad: entidad.value
  };

  const { error } = await supabase.from('persona').insert([payload]);

  if (error) {
    console.error('Error al crear persona:', error);
    triggerToast('Error al crear persona', 'red');
  } else {
    triggerToast('Persona creada exitosamente', 'green');
    cargarPersonas();
  }
}

async function cargarDivision(divisionId) {
  if (!divisionId) return;
  const { data, error } = await supabase
    .from('division')
    .select('*,entidad(*,tipo(tipo,id))')
    .eq('id', divisionId)
    .single();
  if (error) throw error;
  division.value = data;
  entidad.value = data.entidad.id;
}

async function cargarTiposPersona() {
  let { data: TBtipoPersona, error } = await supabase
    .from('TBtipoPersona')
    .select('*');

  if (error) console.error('Error al cargar tipos de persona:', error);
  else {
    tipoPersonaOptions.value = TBtipoPersona.map(tipo => ({ label: tipo.tipoPersona, value: tipo.IDtipoPersona }));
  }
}

async function cargarEmpresasActivas() {
  let { data: empresas, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('estado', 'activa')
    .order('nombre', { ascending: true });

  if (error) console.error('Error al cargar empresas:', error);
  else {
    empresasActivas.value = empresas.map(empresa => ({
      name: empresa.nombre, 
      value: empresa.id 
    }));
  }
}

function triggerToast(message, color = 'black') {
  toastMessage.value = message;
  toastColor.value = color;
  openedToast.value = true;
  setTimeout(() => {
    openedToast.value = false;
  }, 3000);
}

function goBack() {
  router.back();
}
</script>

<style>
.container {
  padding: 20px;
  background-color: white;
}

label {
  font-size: 14px;
  color: gray;
}

.addUser {
  display: flex; 
  justify-content: center!important; 
  color: rgb(22, 74, 164);
}
</style>
