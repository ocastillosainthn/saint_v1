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
    <div></div>

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

    <div class="addUser">
      <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedio">
        <k-navbar  
          title="Agregar participantes"
          small
          isTralucent style="background-color: white;">
          <template #left>
            <k-link navbar @click="() => (popupOpened = false)">  
              <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;" />  
            </k-link>
          </template>
        </k-navbar>

        <div> 
          <k-fab
            class="fixed right-4-safe bottom-4-safe z-20"
            text=" + "
            style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 26px; width: 48px;"
            text-position="after"
            @click="openPersona"
          >
            <template>
              <Icon name="material-symbols:add" style="font-size: 17px;" />
            </template>
          </k-fab>

          <k-popup :opened="popupPersona" @backdropclick="() => (popupPersona = false)">
            <k-navbar  
              title="Crear Persona"
              small
              isTralucent style="background-color: white;">
              <template #left>
                <k-link navbar @click="() => (popupPersona = false)">  
                  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;" />  
                </k-link>
              </template>
            </k-navbar>

            <div class="container"> 
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
          </k-popup>
        </div>

        <ListBox v-model="personasSeleccionadas" :options="personas" optionLabel="nombre" multiple filter style="width: 100%; height: 500px;">
          <template #item="slotProps">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              {{ slotProps.option.name }}
              <Icon name="solar:check-circle-bold" style="font-size:25px; color: red;" />
            </div>
          </template>
        </ListBox>
      </k-popup>

      <k-popup :opened="popupEmpresa" @backdropclick="() => (popupEmpresa = false)"> 
        <k-navbar  
          title="Crear Empresa"
          small
          isTralucent style="background-color: white;">
          <template #left>
            <k-link navbar @click="() => (popupEmpresa = false)">  
              <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;" />  
            </k-link>
          </template>
        </k-navbar>

        <div class="container"> 
          <div style="margin-bottom: 10px;">
            <label for="empresaName">Nombre de empresa</label>
            <InputText v-model="empresaData.empresaName" id="empresaName" aria-describedby="empresaName-help" />
          </div>

          <div style="margin-bottom: 20px;"> 
            <label for="tipoEmpresa">Tipo de Empresa</label>
            <Dropdown v-model="empresaData.tipoEmpresa" editable :options="tipoEmpresaOptions" optionLabel="label" placeholder="Selecciona tipo empresa" class="w-full md:w-14rem" />
          </div>

          <div class="columnflex"> 
            <div class="columnForm" style="margin-right: 10px;">
              <label for="phoneEmpresa">Teléfono</label>
              <InputText id="phoneEmpresa" v-model="empresaData.phoneEmpresa" aria-describedby="phoneEmpresa-help" />
            </div>

            <div class="columnForm">
              <label for="emailEmpresa">Correo electrónico</label>
              <InputText id="emailEmpresa" v-model="empresaData.emailEmpresa" aria-describedby="emailEmpresa-help" />
            </div>
          </div>    

          <div class="columnflex"> 
            <div class="columnForm" style="margin-right: 10px;">
              <label for="departamento">Departamento</label>
              <Dropdown v-model="empresaData.selectDepartamento" :options="departamentoOptions" optionLabel="label" optionValue="value" placeholder="Departamento" class="w-full md:w-14rem" />
            </div>

            <div class="columnForm">
              <label for="municipio">Municipio</label>
              <Dropdown v-model="empresaData.selectMunicipio" editable :options="municipioOptions" optionLabel="label" placeholder="municipio" class="w-full md:w-14rem" />
            </div>
          </div>    

          <div style="margin-bottom: 10px;">
            <label for="direccion">Dirección</label>
            <textarea id="direccion" v-model="empresaData.direccion" aria-describedby="direccion-help" class="w-full md:w-14rem" rows="3"></textarea>
          </div>
        
          <div style="margin-bottom: 10px;">
            <label for="paginaWeb">Página web</label>
            <InputText id="paginaWeb" v-model="empresaData.paginaWeb" aria-describedby="paginaWeb-help" />
          </div>

          <k-button @click="crearEmpresa" type="submit" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
          </k-button>
        </div>
      </k-popup>

      <k-toast position="left" :opened="openedToast" :style="{ backgroundColor: toastColor }">
        <template #button>
          <k-button clear inline @click="closeToast">Cerrar</k-button>
        </template>
        <div class="shrink">{{ toastMessage }}</div>
      </k-toast>
    </div>

    <div style="width: 100%;" v-if="personasSeleccionadas.length > 0">
      <k-list strong inset style="width: 100%;">
        <k-list-item 
          v-for="(persona, index) in personasSeleccionadas" 
          :key="index" 
          :title="persona.nombre" 
          :footer="persona.email">
          <template #after>
            <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click.stop="removeSelectedPerson(index)" />
          </template>
        </k-list-item>
      </k-list>
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

const personasSeleccionadas = ref([]);
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
const departamentoOptions = ref([]);
const municipioOptions = ref([]);
const popupOpened = ref(false);
const popupPersona = ref(false);
const popupEmpresa = ref(false);

onMounted(async () => {
  const divisionId = route.params._id;
  await cargarDivision(divisionId);
  await cargarTiposPersona();
  await cargarEmpresasActivas();
  cargarDepartamentos();
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
    popupPersona.value = false;
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

const removeSelectedPerson = (index) => {
  personasSeleccionadas.value.splice(index, 1);
};

function openPersona() {
  popupPersona.value = true;
}

function openEmpresa() {
  popupEmpresa.value = true;
}

async function cargarDepartamentos() {
  let { data: TBdepartamentos, error } = await supabase
    .from('TBdepartamentos')
    .select('*');

  if (error) console.error('Error al cargar departamentos:', error);
  else {
    departamentoOptions.value = TBdepartamentos.map(dep => ({
      label: dep.nomDepto, 
      value: dep.IDdepto 
    }));
  }
}

watch(() => empresaData.value.selectDepartamento, (newValue) => {
  if (newValue) {
    cargarMunicipiosPorDepartamento(newValue); 
  } else {
    municipioOptions.value = []; 
  }
});

async function cargarMunicipiosPorDepartamento(departamentoId) {
  let { data: TBmunicipios, error } = await supabase
    .from('TBmunicipios')
    .select('*')
    .eq('IDdepto', departamentoId); 

  if (error) console.error('Error al cargar municipios:', error);
  else {
    municipioOptions.value = TBmunicipios.map(mun => ({
      label: mun.nomMuni, 
      value: mun.IDmuni 
    }));
  }
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

.p-inputtext {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(217, 217, 217);
  width: 100%;
}

.addUser {
  display: flex; 
  justify-content: center!important; 
  color: rgb(22, 74, 164);
}

.columnflex {
  display: flex;
}

.columnForm {
  margin-bottom: 10px;
  width: 100%;
}
</style>
