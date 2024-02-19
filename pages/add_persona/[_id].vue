<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <k-navbar 
    title="Agregar Persona"
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


  <div v-if="division && division.entidad.tipo.id === 1"  class="flex align-items-center" 

    style="margin-bottom: 15px; display: flex;
    justify-content: space-between;">
      <label style="margin-right: 20px;"> Crear como <span style="font-weight: 800; color: black;"> Visita personal </span></label>
        <Checkbox v-model="checked" :binary="true" />
  </div>



  <div  v-if="division && division.entidad.tipo.id === 2" class="flex align-items-center" 
    style="margin-bottom: 15px; display: flex;
    justify-content: space-between;">
      <label style="margin-right: 20px;"> Crear como <span style="font-weight: 800; color: black;"> Evento </span></label>
        <Checkbox v-model="checked" :binary="true" />
  </div>
    
    



  <div style="margin-bottom: 10px;">
      <label for="username">Nombre </label>
      <InputText id="name" v-model="value" aria-describedby="username-help" />
  </div>


 <div style="display: flex; margin-bottom: 10px;">

  <div  style="min-width: 65%; margin-right: 10px;">
      <label for="username">Fecha </label>
      <Calendar showTime v-model="icondisplay" showIcon iconDisplay="input" />
  </div>


  <div>
    <label for="username">Duración </label>
    <Dropdown v-model="selectedHour" :options="hours" optionLabel="name" placeholder="Seleccionar hora" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />

  </div>

</div> 


<div class="centerTittleAction"> 
    <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Participantes</k-block-title>
    <Icon name="solar:add-circle-broken" @click="openPopup" style="font-size:25px; color: #0c2aa4; "/>

</div>
 <div  class="center-content">

  <Icon name="solar:user-cross-broken" style="font-size:40px; color: #4d4d4d; margin-bottom: 10px;"/>
  <p>No se han agregado participantes</p>
</div>


<div class="addUser">

<Button @click="openPopup" > Agregar Participante</Button>




<k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedio">


    <k-navbar  
          title="Agregar participantes"
          small
          isTralucent style="background-color: white;">
          
        <template #left>
          <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
        </template>
      </k-navbar>

    <div class="containerSearch"> 

      <IconField iconPosition="left" style="margin-right: 30px; width: 100%;">
            <InputIcon>
              <Icon name="solar:magnifer-linear" style="font-size:15px; color: #7d7d7d;"/> 
            </InputIcon>
            <InputText style="padding-left: 40px; background-color: white;" v-model="value1" placeholder="Buscar" />
        </IconField>
  
        <button style="width: 120px; font-size: 13px;" > 
          Crear Nuevo
        </button>

      


 </div>



</k-popup>


</div>



</div>




  </k-page>




</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../../db/supabaseClient";
import PrimeVue from "primevue/config";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';


const checked = ref(false);

const route = useRoute();
const router = useRouter();
const division = ref(null);
const searchQuery = ref('');
const popupOpened = ref(false);


const selectedHour = ref();
const hours = ref([
    { name: '1 hora'},
    { name: '2 horas' },
    { name: '3 horas' },
    { name: '4 horas' },
    { name: '5 horas'},
    { name: '6 horas'},
    { name: 'Indefinido'}
]);



onMounted(async () => {
  const divisionId = route.params._id;
  await cargarDivision(divisionId);
});

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

function goBack() {
  router.back();
}

function openPopup() {
  popupOpened.value = true;
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
    kbutton,



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
      kbutton,
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
</style>
