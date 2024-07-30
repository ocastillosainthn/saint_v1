<template>
  <k-page v-if="visita" style="background-color: rgb(247, 247, 247);">
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
      <label style="margin-right: 20px;"> Como <span style="font-weight: 800; color: black;"> Visita personal </span></label>
       
  </div>

  <div  v-if="division && division.entidad.tipo.id === 2" class="flex align-items-center" 
    style="margin-bottom: 15px; display: flex;
    justify-content: space-between;">
      <label style="margin-right: 20px;"> Crear como <span style="font-weight: 800; color: black;"> Evento </span></label>
  </div>
    
  <Checkbox v-model="checked" :binary="true" />
  
</div>


  <div style="margin-bottom: 10px;">
      <label for="username">Motivo de la visita </label>
      <InputText id="nameVisita" v-model="nombreVisita" aria-describedby="username-help" />
  </div>


 <div style="display: flex; margin-bottom: 10px;">

  <div  style="min-width: 60%; margin-right: 10px;">
      <label for="fehaHoraVisita">Fecha y hora</label>
      <Calendar
            ref="calendarRef"
            showTime
            v-model="fechaHora"
            hourFormat="12"
            :minDate="minDate"
            :disabledHours="disabledHours"
            :disabled="visita.estado === 'iniciada'"
            showButtonBar
            showIcon
            iconDisplay="input"
          >
    </div>


  <div style="width: 35%;">
    <label for="duracion">Duración </label>
    <Dropdown v-model="selectedHour"
    :options="hours" optionLabel="name" placeholder="Seleccionar" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />

  </div>

  


</div> 

<div style="margin-bottom: 10px;">
    <label for="acompanantesVisita">Acompañantes de visita</label>
    <InputText id="acompanantesVisita" v-model="cantVisita" type="number" aria-describedby="username-help" />
  </div>

<div class="centerTittleAction"> 
    <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Participantes</k-block-title>
    <Icon v-if="mostrarIcono" name="solar:add-circle-bold" @click="openPopup" style="font-size:28px; color: #0586F0; "/>
 
   
</div>


<div style="width: 100%;" v-if="participantes.length > 0">
    <k-list strong inset style="width: 100%;">
      <k-list-item 
      v-for="(participante, index) in participantes" 
        :key="index" 
        :title="participante.persona.nombre" 
        :footer="participante.email">
        <template #after> 
          <Icon  v-if="!participante.entrada" name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click="() => abrirDialogoConfirmacion(participante.id)" />
        </template>
      </k-list-item>
    </k-list>
</div>




<div class="addUser">


      <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedio">



          <k-navbar  
                title="Agregar participantes "
                small
                isTralucent style="background-color: white;">
                
              <template #left>
                <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
              </template>
            </k-navbar>

        <div > 


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






        <k-popup :opened="popupPersona" @backdropclick="() => (popupPersona = false)">
                <k-navbar  
                title="Crear Persona"
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
                <label for="personaName">Nombre de persona </label>
                <InputText id="personaName" v-model="personaName" aria-describedby="personaName-help" />
            </div>

            <div style="margin-bottom: 20px;" > 
                <label for="tipopersona">Tipo de persona </label>
                  <Dropdown v-model="selectTipoPersona" editable :options="tipoPersonaOptions" optionLabel="label" placeholder="Tipo persona" class="w-full md:w-14rem" />
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

            <k-button type="submit" @click="crearPersona" label="+ Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
              </k-button>

              </div>
          
            </k-popup>

        
          


      </div>

      <ListBox v-model="personasSeleccionadas" :options="personas" optionLabel="nombre" multiple filter style="width: 100%; height: 500px;">
        <template #item="slotProps">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            {{ slotProps.option.name }}
            <Icon name="solar:check-circle-bold" style="font-size:28px; color: red;" />
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
        :footer="persona.email">
        <template #after>
          <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click.stop="removeSelectedPerson(index)"/>
        </template>
      </k-list-item>
    </k-list>
</div>


<k-button type="submit" @click="actualizarVisita" label="Guardar " style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
              </k-button>

</div>



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


 
const nombreVisita = ref('');
const fechaHora = ref(null);
const selectedHour = ref(null);

const openedToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('black');

const checked = ref(false);

const cantVisita = ref(0);

const route = useRoute();
const router = useRouter();
const division = ref(null);
const entidad = ref(null);
const searchQuery = ref('');
const popupOpened = ref(false);
const popupPersona = ref(false);
const popupEmpresa = ref(false);
const personas = ref([]);
const participates = ref([]);
const participanteIdParaEliminar = ref(null);
const confirmOpened = ref(false);



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
const visita = ref(null);
const participantes = ref(null);


const puestoEmpresa = ref('');
const personaName = ref('');
const emailPersona = ref('');
const dniPasaporte = ref('');
const phone = ref('');
const placa = ref('');
const fehaHora = ref('');
const fechasalida = ref('');


const hours = ref([
    { name: '1 hora', time: 1},
    { name: '2 horas', time: 2 },
    { name: '3 horas' , time: 3},
    { name: '4 horas', time: 4 },
    { name: '5 horas', time: 5},
    { name: '6 horas', time: 6},
    { name: '8 horas', time: 8},
    { name: '12 horas', time: 12}
  ]);



onMounted(async () => {

 
  const visitaId = route.params._id;
  await cargarVisita(visitaId);

  if (visita.value) {
    checked.value = !!visita.value.visitaevento;
    nombreVisita.value = visita.value.nombre;

    fechaHora.value = new Date(visita.value.fecha);

    const duracionEncontrada = hours.value.find(h => h.time === visita.value.duracion);
    selectedHour.value = duracionEncontrada ? duracionEncontrada : null;
  }

  console.log('visita cargada',visita._value.division.id)
  const divisionId = visita._value.division.id

 const datosParticipantes = await cargarParticipantes(route.params._id);
  participantes.value = datosParticipantes;

  
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


async function actualizarVisita() {

  const payload = {
    nombre: nombreVisita.value,
    fecha: fechaHora.value.toISOString(),
    visitaevento: checked.value,
    duracion: selectedHour.value ? selectedHour.value.time : null,
    cant: cantVisita.value
  };

  const { data, error } = await supabase
    .from('visita')
    .update(payload)
    .eq('id', visita.value.id);

  if (error) {
    console.error('Error al actualizar la visita:', error);
    triggerToast('Error al actualizar la visita', 'red');
  } else {
    triggerToast('Visita actualizada exitosamente', 'green');

    const personasSeleccionadasIds = personasSeleccionadas.value.map(persona => persona.id);
    if (personasSeleccionadasIds.length > 0) {
      await crearParticipantes(personasSeleccionadasIds, visita.value.id);
    }
  }
}


const fechaSalida = computed(() => {
  if (!fechaHora.value || !selectedHour.value) return '';
  const salida = new Date(fechaHora.value.getTime());
  salida.setHours(salida.getHours() + selectedHour.value.time);
  return salida.toLocaleString();
});

const fechaSalidaObj = computed(() => {
  if (!fechaHora.value || !selectedHour.value) return null;
  const salida = new Date(fechaHora.value.getTime());
  salida.setHours(salida.getHours() + selectedHour.value.time);
  


  return salida;
});



const mostrarIcono = computed(() => {
  const ahora = new Date();
  const debeMostrarse = fechaSalidaObj.value && fechaSalidaObj.value > ahora;

  return debeMostrarse;
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
    cantVisita.value = data.cant;
  } catch (error) {
    console.error('Error al obtener la visita:', error.message);
  }
}




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
    direccion: empresaData.value.direccion
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
}

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


async function crearParticipantes(personasSeleccionadasIds, visitaId) {
  if (personasSeleccionadasIds.length === 0) {
    console.log('No hay personas seleccionadas para crear participantes.');
    return; 
  }

  try {
    for (const personaId of personasSeleccionadasIds) {
      const { error } = await supabase.from('participantes').insert([{ persona: personaId, visita: visitaId }]);
      if (error) throw error;
    }

    personasSeleccionadas.value = [];
    participantes.value = await cargarParticipantes(visitaId);
    triggerToast('Participantes agregados exitosamente', 'green');
  } catch (error) {
    console.error('Error al crear participantes:', error.message);
    triggerToast('Error al crear participantes', 'red');
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





async function crearPersona() {
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

  console.log('Payload enviado:', payload);

  const { data, error } = await supabase.from('persona').insert([payload]);

  if (error) {
    console.error('Error al crear persona:', error);
    triggerToast('Error al crear persona', 'red');
  } else {
   
    cargarPersonas();
    triggerToast('Persona creada exitosamente', 'green');
    popupPersona.value = false;

  }
}


const abrirDialogoConfirmacion = (id) => {
  console.log('ID del participante para eliminar:', id); 
  participanteIdParaEliminar.value = id;
  confirmOpened.value = true;
};


async function cargarPersonas() {
  try {
   


    let query = supabase.from('persona').select('*').order('nombre', { ascending: true });

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
  } else {
    console.log('Listado empresas:', error);

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
  }
}

function goBack() {
  router.back();
}

function openPopup() {
  popupOpened.value = true;
  const personasSeleccionadasArray = personasSeleccionadas._rawValue || personasSeleccionadas._value;

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



const dynamicTitle = computed(() => {
  if (!division.value) return ''; 
  const tipoId = division.value.entidad.tipo.id;
  if (tipoId === 1) {
    return 'Editar Reunión';
  } else if (tipoId === 2) {
    return 'Editar Visita';
  } else {
    return 'Editar'; 
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
    kDialog,
    kDialogButton
    



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
      kDialogButton
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


.my-8 {
  margin-top: 0px; 
  margin-bottom: 0px; 
}


.columnForm{
  margin-bottom: 10px;
  width:100%;
}
</style>
