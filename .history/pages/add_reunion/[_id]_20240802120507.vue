<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">

    <div v-if="loading"  class="loadingPage"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
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
    <div> 
  
    </div>

<div class="container">

<div style="display: flex; justify-content: space-between; "> 
  <div v-if="division && division.entidad.tipo.id === 1"  class="flex align-items-center" 

    style="margin-bottom: 15px; display: flex;
    justify-content: space-between;">
      <label style="margin-right: 20px;"> Crear como <span style="font-weight: 800; color: black;"> Visita Privada </span></label>
       
  </div>

  <div  v-if="division && division.entidad.tipo.id === 2" class="flex align-items-center" 
    style="margin-bottom: 15px; display: flex;
    justify-content: space-between;">
      <label style="margin-right: 20px;"> Crear como <span style="font-weight: 800; color: black;"> Visita Privada </span></label>
  </div>
    
  <Checkbox v-model="checked" :binary="true" />
  
</div>


  <div style="margin-bottom: 10px;">

      <label for="username">Motivo de la visita </label>
      <InputText id="nameVisita" v-model="nameVisita" aria-describedby="username-help" />
  </div>


 <div style="display: flex; margin-bottom: 10px;">

  <div  style="min-width: 60%; margin-right: 10px;">
      <label for="fehaHoraVisita">Fecha y hora </label>
      <Calendar
            ref="calendarRef"
            showTime
            v-model="fehaHora"
            hourFormat="12"
            :minDate="minDate"
            :disabledDates="[]"
            :disabledHours="disabledHours"
            showButtonBar
            showIcon
            iconDisplay="input"
          >

      <template v-if="fehaHora" #footer>
      <Button class="closeCalendar" @click="closeCalendar" >Confirmar fecha</Button>
    </template>

    </Calendar> 
      
  </div>


  <div style="width: 35%;">
    <label for="duracion">Duración </label>
    <Dropdown v-model="selectedHour" 
    :options="hours" optionLabel="name" placeholder="Seleccionar" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />

  </div>


</div> 
<label for="cantidad">Acompañantes de visita </label>
<InputText id="numberVisita" v-model="numberVisit" type="number" aria-describedby="username-help" />

<div>


</div>

<div class="centerTittleAction"> 
    <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Participantes</k-block-title>
    <Icon name="solar:add-circle-bold" @click="openPopup" style="font-size:28px; color: #0586F0; "/>

</div>
 <div  class="center-content"  v-if="personasSeleccionadas.length == 0">

  <Icon name="solar:user-cross-broken" style="font-size:40px; color: #4d4d4d; margin-bottom: 10px;"/>
  <p>No se han agregado participantes</p>

  <Button @click="openPopup"  style="color:#0586F0; font-size: 15px; font-weight: 600; margin-bottom: 40px">Agregar Participante </Button>

</div>

<div class="addUser">


      <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedio">



          <k-navbar  
                title="Agregar participantes"
                small
                isTralucent style="background-color: white;">
                
              <template #left>
                <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
              </template>
            </k-navbar>

        <div > 

              <k-fab
              
              v-if="personasSeleccionadas.length > 0"
                class="fixed left-1/2 bottom-4-safe transform -translate-x-1/2 z-20 "
                text="Agregar "
                text-position="after"
                @click="() => (popupOpened = false)"
                
                >
              </k-fab>

              <k-fab
                  class="fixed right-4-safe bottom-4-safe z-20"
                  text=" + "
                  style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 26px; width: 48px;"
                  text-position="after"
                  @click="openPersona"
                >
                  <template>
                    <Icon name="material-symbols:add" style="font-size: 17px; "/>
                  </template>
                </k-fab>






        <k-popup :opened="popupPersona" @backdropclick="() => (popupPersona = false)" class="popMedio">
                <k-navbar  
                title="Crear Persona "
                small
                isTralucent style="background-color: white;">
                
              <template #left>
                <k-link navbar @click="() => (popupPersona = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
              </template>
            </k-navbar>

            <div class="container" > 

              <div style="margin-bottom: 10px;" v-if="division && division.entidad.tipo.id === 1"> 
          
          
          <div style="display: flex;"> 
            <div style="width: 90%;" > 
                <label  for="empresa">Empresa  </label>
                <Dropdown v-model="selectedEmpresa" editable :options="empresasActivas" optionLabel="name" placeholder="Buscar empresa" class="w-full md:w-14rem" />
            </div>

              <Icon name="solar:add-circle-bold" @click="openEmpresa" style="font-size:25px; color: #0586F0; margin-top: 29px; margin-left:25px"/>

            </div>
            
              <div style="margin-top: 10px;">
                <label for="puestoEmpresa"> Puesto </label>
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
                <label for="email">Correo electrónico </label>
                <InputText id="email" v-model="emailPersona" aria-describedby="email-help" />
            </div>


            <div style="display: flex;">

                  <div class="columnForm" style="margin-right: 10px;">
                    <label for="dni">DNI/ Pasaporte </label>
                    <InputText id="dni" v-model="dniPasaporte" aria-describedby="dniPasaporte-help" />
                </div>

                <div class="columnForm">
                    <label for="phone">Teléfono </label>
                    <InputText id="phone" v-model="phone" aria-describedby="phone-help" />
                </div>

            </div>

            <div style="margin-bottom: 10px;">
                <label for="placa">Placa vehicular </label>
                <InputText id="placa" v-model="placa" aria-describedby="placa-help" />
            </div>

            <k-button v-if="!loading" type="submit" @click="crearPersona" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
              </k-button>

              </div>
          
            </k-popup>

        
          


      </div>
      
      <ListBox v-model="personasSeleccionadas" :options="formattedPersonas" optionLabel="nombre" multiple filter style="width: 100%; height: 500px;">
        <template #option="slotProps">
          <div class="flex align-items-center spaceB">
            <div> 
              <span>{{ slotProps.option.id }} - </span>
              <span>{{ slotProps.option.nombre }}</span>
              <span style="color: gray; font-size: 13px; margin-left: 10px;">
                {{ slotProps.option.tipoPersona.tipoPersona }}
              </span>
            </div>
            <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click.stop="removePerson(slotProps.option.id)"/>
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
                <k-link navbar @click="() => (popupEmpresa = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
              </template>
            </k-navbar>


          <div class="container"> 
            <div style="margin-bottom: 10px;">
                <label for="empresaName">Nombre de empresa </label>
                <InputText v-model="empresaData.empresaName" id="empresaName"  aria-describedby="empresaName-help" />
            </div>

            <div style="margin-bottom: 20px;" > 
                <label for="tipoEmpresa">Tipo de Empresa </label>
                <Dropdown v-model="empresaData.tipoEmpresa" editable :options="tipoEmpresaOptions" optionLabel="label" placeholder="Selecciona tipo empresa" class="w-full md:w-14rem" />
            </div>


            <div class="columnflex"> 
                <div class="columnForm" style="margin-right: 10px;">

                        <label for="phoneEmpresa">Teléfono </label>
                        <InputText id="phoneEmpresa"  v-model="empresaData.phoneEmpresa" aria-describedby="phoneEmpresa-help" />
                    </div>

              
                      <div class="columnForm" >
                        <label for="emailEmpresa">Correo electrónico </label>
                        <InputText id="emailEmpresa"   v-model="empresaData.emailEmpresa" aria-describedby="emailEmpresa-help" />
                    </div>

              </div>    



              <div class="columnflex"> 

                <div class="columnForm" style="margin-right: 10px;">

                  <label for="departamento">Departamento </label>
                  <Dropdown v-model="empresaData.selectDepartamento" :options="departamentoOptions" optionLabel="label" optionValue="value" placeholder="Departamento" class="w-full md:w-14rem" />
                      
                    </div>

              
                <div class="columnForm" >
                    
                  <label for="municipio">Municipio </label>
                  <Dropdown v-model="empresaData.selectMunicipio" editable :options="municipioOptions" optionLabel="label" placeholder="municipio" class="w-full md:w-14rem" />

                    </div>

              </div>    

              <div style="margin-bottom: 10px;">
                <label for="direccion">Dirección</label>
                <textarea id="direccion" v-model="empresaData.direccion" aria-describedby="direccion-help" class="w-full md:w-14rem" rows="3"></textarea>
              </div>
            

            <div style="margin-bottom: 10px;">
                <label for="paginaWeb">Página web </label>
                <InputText id="paginaWeb" v-model="empresaData.paginaWeb" aria-describedby="paginaWeb-help" />
            </div>

            <k-button @click="crearEmpresa" type="submit" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0); ">
              </k-button>


            </div>


        

      </k-popup>

      <k-toast position="left" :opened="openedToast" :style="{backgroundColor: toastColor}">
          <template #button>
            <k-button clear inline @click="closeToast">
              Cerrar
            </k-button>
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
        :footer="persona.tipoPersona.tipoPersona">
        <template #after>
          <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click.stop="removeSelectedPerson(index)"/>
        </template>
      </k-list-item>
    </k-list>
</div>


<k-button v-if="!loading &&  personasSeleccionadas.length > 0" type="submit" @click="crearVisita" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
              </k-button>

</div>




  </k-page>




</template>

<script setup>
import { ref, onMounted, defineComponent } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../../db/supabaseClient";
import PrimeVue from "primevue/config";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dropdown from 'primevue/dropdown';
import { watch } from 'vue';
import ListBox from 'primevue/listbox';





const openedToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('black');

const checked = ref(false);

const route = useRoute();
const router = useRouter();
const division = ref(null);
const entidad = ref(null);
const searchQuery = ref('');
const popupOpened = ref(false);
const popupPersona = ref(false);
const popupEmpresa = ref(false);
const personas = ref([]);
const loading = ref(false);

const selectTipoPersona = ref(null);
const tipoPersonaOptions = ref([]);
const selectTipoEmpresa = ref(null);
const tipoEmpresaOptions = ref([]);
const departamentoId = ref(null);

const selectDepartamento = ref(null);
const selectMunicipio = ref(null);
const departamentoOptions = ref([]);
const personasSeleccionadas = ref([]);
const municipioOptions = ref([]);
const empresasActivas = ref([]);
const selectedEmpresa = ref(null);

const userData = ref(null);
const errors = ref({});


const puestoEmpresa = ref('');
const personaName = ref('');
const emailPersona = ref('');
const dniPasaporte = ref('');
const phone = ref('');
const placa = ref('');
const fehaHora = ref('');

const calendarRef = ref(null);
const numberVisit = ref(1);
const minDate = ref(new Date());
const disabledDates = ref([]);


const closeCalendar = () => {
  calendarRef.value.overlayVisible = false;
};

const selectedHour = ref();
const hours = ref([
    { name: '30 min', time: 30},
    { name: '1 hr', time: 1},
    { name: '1 hr 30 min', time: 130},
    { name: '2 hr', time: 2 },
    { name: '2 hr 30 min', time: 230},
    { name: '3 hr' , time: 3},
    { name: '3 hr 30 min', time: 330},
    { name: '4 hr', time: 4 },
    { name: '4 hr 30 min', time: 430},
    { name: '5 hr', time: 5},
    { name: '5 hr 30 min', time: 530},
    { name: '6 hr', time: 6},
    { name: '6 hr 30 min', time: 630},
    { name: '8 hr', time: 8},
    { name: '8 hr 30 min', time: 830},
    { name: '12 horas', time: 12},
    { name: '+ 12 horas', time: 13}
]);


function validarFormulario() {
  errors.value = {};

  if (!personaName.value.trim()) {
    errors.value.personaName = 'El nombre de la persona es obligatorio.';
  }

  if (!selectTipoPersona.value) {
    errors.value.selectTipoPersona = 'El tipo de persona es obligatorio.';
  }

  // Retorna false si hay errores
  return Object.keys(errors.value).length === 0;
}

const disabledHours = (date) => {
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
  const divisionId = route.params._id;
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
    loading.value = false;

  } else {
    triggerToast('Empresa creada exitosamente', 'black');
    popupEmpresa.value = false; 
    cargarEmpresasActivas();
    loading.value = false;
  }
}



const formattedPersonas = computed(() => personas.value.map(persona => ({
  ...persona,
  nombre: persona.nombre,
  id: persona.id,
})));

async function crearVisita() {
  loading.value = true;
  try {
    
    if (!nameVisita.value || !fehaHora.value || !selectedHour.value) { 
      triggerToast('Nombre, fecha, dirección y duración son campos requeridos', 'red');
      loading.value = false;

      return; 

    }

    const userId = userData.value?.id;

    const personasSeleccionadasArray = personasSeleccionadas._rawValue || personasSeleccionadas._value;
    const personasSeleccionadasArrayNormalized = Array.isArray(personasSeleccionadasArray) ? personasSeleccionadasArray : [personasSeleccionadasArray];
    const idsPersonasSeleccionadas = personasSeleccionadasArrayNormalized.map(persona => persona.id);


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
      loading.value = false;

    } else {
      throw new Error('No se pudo obtener el ID de la visita después de crearla.');
      loading.value = false;

    }
  } catch (error) {
    console.error('Error al crear visita:', error);
    triggerToast('Error al crear visita', 'red');
    loading.value = false;

  }
}


async function crearParticipantes(personasSeleccionadas, visita) {
  try {
    if (!personasSeleccionadas || personasSeleccionadas.length === 0) {
      throw new Error('No hay personas seleccionadas para crear participantes.');
    }

    for (const personaId of personasSeleccionadas) {
      const { data, error } = await supabase
        .from('participantes')
        .insert([{ persona: personaId, visita: visita }]);
      
      if (error) throw error;

      console.log(`Participante creado para persona ${personaId} en la visita ${visita}.`);
      loading.value = false;

    }
  } catch (error) {
    console.error('Error al crear participantes:', error.message);
    loading.value = false;

  }
}

async function crearPersona() {
  if (!validarFormulario()) {
    return; // Se detiene la ejecución si la validación falla
  }

  loading.value = true;

  const payload = {
    empresa: selectedEmpresa?.value?.value === "" ? null : selectedEmpresa?.value?.value,
    puesto: puestoEmpresa.value || '',
    nombre: personaName.value,
    tipoPersona: selectTipoPersona?.value?.value, 
    dniPasaporte: dniPasaporte.value,
    telefono: phone.value,
    correo: emailPersona.value,
    placa: placa.value,
    division: division?.value?.id ? division.value.id : null,
    entidad: entidad.value
  };

  const { data, error } = await supabase.from('persona').insert([payload]);

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
      .eq('delete', true ) // Excluir personas que tienen delete como true
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
      loading.value = false;
    } else {
      personas.value = data;
      console.log('personas', personas);
      loading.value = false;
    }
  } catch (error) {
    console.error('Error al cargar personas:', error);
    loading.value = false;
  }
}


async function cargarEmpresasActivas() {
  let { data: empresas, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('estado', 'activa')
    .order('nombre', { ascending: true });


  if (error) {
    console.error('Error al cargar empresas:', error);
    loading.value = false;

  } else {
    console.log('Listado empresas:', error);
    loading.value = false;


    empresasActivas.value = empresas.map(empresa => ({
      name: empresa.nombre, 
      value: empresa.id 
    
    }));
  }
}


const removeSelectedPerson = (index) => {
  personasSeleccionadas.value.splice(index, 1);
};


function triggerToast(message, color = 'black') {
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
    entidad.value = data.entidad.id;
  } catch (error) {
    console.error('Error al obtener la división:', error);
    loading.value = false;

  }
}


function goBack() {
  router.back();
}

function openPopup() {
  popupOpened.value = true;
  const personasSeleccionadasArray = personasSeleccionadas._rawValue || personasSeleccionadas._value;
  console.log(personasSeleccionadasArray)

  if (Array.isArray(personasSeleccionadasArray)) {
    const ids = personasSeleccionadasArray.map(persona => persona.id);
    console.log(ids); // Muestra los IDs de las personas seleccionadas
  } else {
    console.error('personasSeleccionadas no es un array');
  }
}

function openPersona() {
  popupPersona.value = true;
}

function openEmpresa() {
  popupEmpresa.value = true;
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


async function cargarTipoEmpresa() {
  let { data: TBtipoEmpresa, error } = await supabase
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


function navigateToVisita(visitaId) {
  router.push(`/visita/${visitaId}`);
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


async function removePerson(id) {
  try {
    // Verificar que el ID sea válido
    if (id) {
      // Realizar la actualización en la base de datos para marcar la persona como eliminada
      const { error } = await supabase
        .from('persona')
        .update({ delete: true }) // Asumiendo que la columna se llama "delete"
        .eq('id', id);

      if (error) {
        console.error('Error al marcar como eliminada a la persona:', error);
        triggerToast('Error al eliminar persona', 'red');
      } else {
        // Eliminar la persona de la lista de seleccionados
        personasSeleccionadas.value = personasSeleccionadas.value.filter(persona => persona.id !== id);
        triggerToast('Persona eliminada correctamente', 'green');
      }
    } else {
      console.error('ID inválido o persona no encontrada');
      triggerToast('ID inválido o persona no encontrada', 'red');
    }
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    triggerToast('Error al eliminar persona', 'red');
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

.spaceB{
  justify-content: space-between;
  align-items: center;
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
