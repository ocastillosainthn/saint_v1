<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <div v-if="loading" class="loadingPage">
      <k-preloader style="display: flex;" size="w-5 h-5" />
    </div>

    <k-navbar
      :title="dynamicTitle"
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
        <div
          v-if="division && division.entidad.tipo.id === 1"
          class="flex align-items-center"
          style="margin-bottom: 15px; display: flex; justify-content: space-between;"
        >
          <label style="margin-right: 20px;">
            Crear como
            <span style="font-weight: 800; color: black;">Visita Privada</span>
          </label>
        </div>

        <div
          v-if="division && division.entidad.tipo.id === 2"
          class="flex align-items-center"
          style="margin-bottom: 15px; display: flex; justify-content: space-between;"
        >
          <label style="margin-right: 20px;">
            Crear como
            <span style="font-weight: 800; color: black;">Visita Privada</span>
          </label>
        </div>

        <Checkbox v-model="checked" :binary="true" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="username">Motivo de la visita</label>
        <InputText
          id="nameVisita"
          v-model="nameVisita"
          aria-describedby="username-help"
        />
      </div>

      <div style="display: flex; margin-bottom: 10px;">
        <div style="min-width: 60%; margin-right: 10px;">
          <label for="fehaHoraVisita">Fecha y hora</label>
          <Calendar
            ref="calendarRef"
            showTime
            v-model="fehaHora"
            hourFormat="12"
            :minDate="minDate"
            :disabledDates="disabledDates"
            :disabledHours="disabledHours"
            showButtonBar
            showIcon
            iconDisplay="input"
          >
            <template v-if="fehaHora" #footer>
              <Button class="closeCalendar" @click="closeCalendar"
                >Confirmar fecha</Button
              >
            </template>
          </Calendar>
        </div>

        <div style="width: 35%;">
          <label for="duracion">Duración</label>
          <Dropdown
            v-model="selectedHour"
            :options="hours"
            optionLabel="name"
            placeholder="Seleccionar"
            checkmark
            :highlightOnSelect="false"
            class="w-full md:w-14rem"
          />
        </div>
      </div>

      <label for="cantidad">Acompañantes de visita</label>
      <InputText
        id="numberVisita"
        v-model="numberVisit"
        type="number"
        aria-describedby="username-help"
      />
      <!-- Resto del código -->
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from "../../db/supabaseClient";
import { Calendar, Checkbox, InputText, Dropdown, Button, ListBox, Icon } from 'primevue';

// Variables y métodos
const openedToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('black');

const checked = ref(false);

const route = useRoute();
const router = useRouter();
const division = ref<any>(null);
const entidad = ref<any>(null);
const searchQuery = ref('');
const popupOpened = ref(false);
const popupPersona = ref(false);
const popupEmpresa = ref(false);
const personas = ref<any[]>([]);
const loading = ref(false);

const selectTipoPersona = ref(null);
const tipoPersonaOptions = ref<any[]>([]);
const selectTipoEmpresa = ref(null);
const tipoEmpresaOptions = ref<any[]>([]);
const departamentoId = ref<number | null>(null);

const selectDepartamento = ref(null);
const selectMunicipio = ref(null);
const departamentoOptions = ref<any[]>([]);
const personasSeleccionadas = ref<any[]>([]);
const municipioOptions = ref<any[]>([]);
const empresasActivas = ref<any[]>([]);
const selectedEmpresa = ref<any>(null);

const userData = ref<any>(null);

const puestoEmpresa = ref('');
const personaName = ref('');
const emailPersona = ref('');
const dniPasaporte = ref('');
const phone = ref('');
const placa = ref('');
const fehaHora = ref<Date | null>(null);

const calendarRef = ref<any>(null);
const numberVisit = ref(1);

const closeCalendar = () => {
  calendarRef.value.overlayVisible = false;
};

const selectedHour = ref<any>(null);
const hours = ref([
  { name: '30 min', time: 30 },
  { name: '1 hr', time: 1 },
  { name: '1 hr 30 min', time: 130 },
  { name: '2 hr', time: 2 },
  { name: '2 hr 30 min', time: 230 },
  { name: '3 hr', time: 3 },
  { name: '3 hr 30 min', time: 330 },
  { name: '4 hr', time: 4 },
  { name: '4 hr 30 min', time: 430 },
  { name: '5 hr', time: 5 },
  { name: '5 hr 30 min', time: 530 },
  { name: '6 hr', time: 6 },
  { name: '6 hr 30 min', time: 630 },
  { name: '8 hr', time: 8 },
  { name: '8 hr 30 min', time: 830 },
  { name: '12 horas', time: 12 },
  { name: '+ 12 horas', time: 13 }
]);

const minDate = new Date();
const disabledDates = ref<Date[]>([]);
const disabledHours = (date: Date) => {
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return Array.from({ length: now.getHours() }, (_, i) => i);
  }
  return [];
};

onMounted(async () => {
  const divisionId = route.params._id as string;
  await cargarDivision(divisionId);
  await cargarTiposPersona();
  cargarTipoEmpresa();
  cargarDepartamentos();
  cargarPersonas();
  await cargarEmpresasActivas();

  if (process.client) {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      userData.value = JSON.parse(storedUserData);
    }
  }
});

const empresaData = ref({
  empresaName: '',
  tipoEmpresa: null,
  phoneEmpresa: '',
  emailEmpresa: '',
  selectDepartamento: null,
  selectMunicipio: null,
  paginaWeb: '',
  direccion: ''
});

async function crearEmpresa() {
  loading.value = true;
  const departamentoID = empresaData.value.selectDepartamento;
  const municipioID = empresaData.value.selectMunicipio.value;
  const tipoEmpresaID = empresaData.value.tipoEmpresa.value;

  const payload = {
    nombre: empresaData.value.empresaName,
    tipoEmpresa: tipoEmpresaID,
    telefono: empresaData.value.phoneEmpresa,
    email: empresaData.value.emailEmpresa,
    pais: 1,
    estado: "activa",
    departamento: departamentoID,
    municipio: municipioID,
    paginaWeb: empresaData.value.paginaWeb,
    direccion: empresaData.value.direccion,
  };

  const { error } = await supabase.from('empresa').insert([payload]);

  if (error) {
    console.error('Error al crear empresa:', error);
    triggerToast('Error al crear empresa', 'red');
  } else {
    triggerToast('Empresa creada exitosamente', 'black');
    popupEmpresa.value = false;
    cargarEmpresasActivas();
  }
  loading.value = false;
}

async function crearVisita() {
  loading.value = true;
  try {
    if (!nameVisita.value || !fehaHora.value || !selectedHour.value) {
      triggerToast('Nombre, fecha, dirección y duración son campos requeridos', 'red');
      loading.value = false;
      return;
    }

    const userId = userData.value?.id;

    const idsPersonasSeleccionadas = personasSeleccionadas.value.map(persona => persona.id);

    const payload = {
      nombre: nameVisita.value,
      fecha: fehaHora.value,
      duracion: selectedHour.value.time,
      visitaevento: checked.value,
      division: division?.value?.id ? division.value.id : null,
      personas_seleccionadas: idsPersonasSeleccionadas,
      entidad: entidad.value,
      created_by: userId,
      cant: numberVisit.value
    };

    console.log('Payload enviado para crear la visita:', payload);

    const { data: visitaId, error: visitaError } = await supabase.rpc('crear_visita', payload);

    if (visitaError) {
      console.error('Error al crear visita:', visitaError);
      throw visitaError;
    } else if (visitaId) {
      console.log('ID de la visita creada:', visitaId);
      triggerToast('Visita Creada exitosamente ', 'green');
      navigateToVisita(visitaId);
    } else {
      throw new Error('No se pudo obtener el ID de la visita después de crearla.');
    }
  } catch (error) {
    console.error('Error al crear visita:', error);
    triggerToast('Error al crear visita', 'red');
  } finally {
    loading.value = false;
  }
}

async function crearPersona() {
  loading.value = true;

  const payload = {
    empresa: selectedEmpresa.value ? selectedEmpresa.value.value : null,
    puesto: puestoEmpresa.value || '',
    nombre: personaName.value,
    tipoPersona: selectTipoPersona.value?.value,
    dniPasaporte: dniPasaporte.value,
    telefono: phone.value,
    correo: emailPersona.value,
    placa: placa.value,
    division: division?.value?.id ? division.value.id : null,
    entidad: entidad.value
  };

  console.log('Payload enviado:', payload);

  const { error } = await supabase.from('persona').insert([payload]);

  if (error) {
    console.error('Error al crear persona:', error);
    triggerToast('Error al crear persona', 'red');
  } else {
    cargarPersonas();
    triggerToast('Persona creada exitosamente', 'green');
    popupPersona.value = false;
  }
  loading.value = false;
}

async function cargarPersonas() {
  try {
    console.log('division.value:', division.value?.id);
    console.log('entidad.value:', entidad.value);
    console.log('tipo:', division.value?.entidad.tipo.id);

    let query = supabase
      .from('persona')
      .select('*,tipoPersona(*)')
      .order('nombre', { ascending: true });

    if (division.value?.entidad.tipo.id === 1) {
      console.log('Tipo 1 - Consulta a entidad', entidad.value);
      query = query.eq('entidad', entidad.value);
    } else if (division.value?.entidad.tipo.id === 2) {
      console.log('Tipo 2 - Consulta a division', division.value?.id);
      query = query.eq('division', division.value?.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al cargar personas:', error);
    } else {
      personas.value = data;
      console.log('personas', personas);
    }
  } catch (error) {
    console.error('Error al cargar personas:', error);
  } finally {
    loading.value = false;
  }
}

async function cargarEmpresasActivas() {
  const { data: empresas, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('estado', 'activa')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al cargar empresas:', error);
  } else {
    console.log('Listado empresas:', empresas);
    empresasActivas.value = empresas.map(empresa => ({
      name: empresa.nombre,
      value: empresa.id
    }));
  }
  loading.value = false;
}

const removeSelectedPerson = (index: number) => {
  personasSeleccionadas.value.splice(index, 1);
};

function triggerToast(message: string, color: string = 'black') {
  toastMessage.value = message;
  toastColor.value = color;
  openedToast.value = true;

  setTimeout(() => {
    openedToast.value = false;
  }, 3000);
}

function closeToast() {
  openedToast.value = false;
}

async function cargarDivision(divisionId: string) {
  if (!divisionId) return;

  try {
    const { data, error } = await supabase
      .from('division')
      .select('*,entidad(*,tipo(tipo,id))')
      .eq('id', divisionId)
      .single();

    if (error) throw error;
    division.value = data;
    entidad.value = data.entidad.id;
  } catch (error) {
    console.error('Error al obtener la división:', error);
  }
}

function goBack() {
  router.back();
}

function openPopup() {
  popupOpened.value = true;
}

function openPersona() {
  popupPersona.value = true;
}

function openEmpresa() {
  popupEmpresa.value = true;
}

async function cargarTiposPersona() {
  const { data: TBtipoPersona, error } = await supabase
    .from('TBtipoPersona')
    .select('*');

  if (error) {
    console.error('Error al cargar tipos de persona:', error);
  } else {
    tipoPersonaOptions.value = TBtipoPersona.map(tipo => ({
      label: tipo.tipoPersona,
      value: tipo.IDtipoPersona
    }));
  }
}

async function cargarTipoEmpresa() {
  const { data: TBtipoEmpresa, error } = await supabase
    .from('TBtipoEmpresa')
    .select('*');

  if (error) {
    console.error('Error al cargar tipos de empresa:', error);
  } else {
    tipoEmpresaOptions.value = TBtipoEmpresa.map(tipo => ({
      label: tipo.tipoempresaVisitante,
      value: tipo.IDtipoEmpresa
    }));
  }
}

function navigateToVisita(visitaId: number) {
  router.push(`/visita/${visitaId}`);
}

watch(() => empresaData.value.selectDepartamento, (newValue) => {
  if (newValue) {
    cargarMunicipiosPorDepartamento(newValue);
  } else {
    municipioOptions.value = [];
  }
});

async function cargarMunicipiosPorDepartamento(departamentoId: number) {
  const { data: TBmunicipios, error } = await supabase
    .from('TBmunicipios')
    .select('*')
    .eq('IDdepto', departamentoId);

  if (error) {
    console.error('Error al cargar municipios:', error);
  } else {
    municipioOptions.value = TBmunicipios.map(mun => ({
      label: mun.nomMuni,
      value: mun.IDmuni
    }));
  }
}

async function cargarDepartamentos() {
  const { data: TBdepartamentos, error } = await supabase
    .from('TBdepartamentos')
    .select('*');

  if (error) {
    console.error('Error al cargar departamentos:', error);
  } else {
    departamentoOptions.value = TBdepartamentos.map(dep => ({
      label: dep.nomDepto,
      value: dep.IDdepto
    }));
  }
}

const dynamicTitle = computed(() => {
  if (!division.value) return '';
  const tipoId = division.value.entidad.tipo.id;
  if (tipoId === 1) {
    return 'Crear nueva Reunión';
  } else if (tipoId === 2) {
    return 'Crear nueva Visita';
  } else {
    return 'Nueva';
  }
});
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
.container {
  padding: 20px;
  display: block;
  background-color: white;
}

.shrink {
font-size: 13px;
}

.p-inputtext{
  border-width: 1px;
  border-style: solid;
  border-color: rgb(217, 217, 217);
  width: 100%;
}

.p-calendar{
margin-left: 0px;
}

label{
  font-size: 14px;
  color: gray;
}

.p-checkbox-box{
  border-width: 1px;
  border-style: solid;
  border-color: rgb(217, 217, 217);
}

.p-dropdown{
  padding:0px
}

.addUser{

  display: flex; justify-content: center!important; color: rgb(22, 74, 164);
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.centerTittleAction{
  display: flex;
  align-items: center;
  justify-content:space-between ;
  margin-top: 20px;
  margin-bottom: 20px;
}

.containerSearch {
  background-color: #ebebeb4c; padding: 10px; display: flex;
  border-bottom-color: rgb(235, 235, 235);
  border-bottom-style:solid;
  border-bottom-width: 1px;


}

.columnflex{
  display: flex;
}

.columnForm{
  margin-bottom: 10px;
  width:100%;
}

.popMedio{
  height: 100vh;
}
</style>
