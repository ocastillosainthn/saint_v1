<template>
<k-page style="background-color: rgb(247, 247, 247);">
<k-navbar 
      title=""
      class="top-0 sticky"
      style="background-color: white;"
    >
      
      <template #right>
       
        <div >
         
         <div class="userButton"  @click="openUserPanel">        
          <Icon name="tabler:menu" style="font-size: 26px; "/>
         </div>
  
      </div>
      </template>


      


    </k-navbar>

    <k-panel v-model:opened="userPanelOpened" side="right"
          @backdropclick="() => (userPanelOpened = false)">
          <div style="padding: 20px;">
            <div class="usertext" >
                  <div  v-if="userData" style="font-size: 20px;">{{ userData.name }} </div>
                  <div style="color: rgb(112, 112, 112);" v-if="userData">{{ userData.email }}   </div>
                  <button class="logout" v-if="isAuthenticated" @click="logout">Cerrar sesión</button>
  
                </div>
          </div>
        </k-panel>

  

    

      <div style="background-color:white; padding: 20px; margin-top: 0px;">
        <img src="../assets/saintLogo.jpg" alt="Logo" style="max-width: 250px; margin-bottom: 20px;" >
        <div   v-if="userData">Hola  <span style="font-weight: 700;"> {{ userData.name }}  </span>, Bienvenid@ de nuevo  </div> 
    
      </div>

  


  <div class="contenedor" >
  
    <div v-if="divisiones.length > 0">
    <div class="labelapp"> CREA VISTIAS Y REUNIONES </div>

    <k-card v-for="division in divisiones" :key="division.id" @click="goToDivision(division.id)" style="margin-bottom: 50px;">
  <div class="tittle">{{ division.name }}  <Icon name="material-symbols-light:arrow-forward-ios-rounded" style="font-size: 17px; "/> <span style="font-size: 15px; color: gray; font-weight: 500;"> {{ division.entidad.name }} </span> </div>

      <div v-if="division.entidad.tipo.id === 1" class="labelType">
        <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }}
      </div>

      <div v-if="division.entidad.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;">
        <img src="../assets/Polygon 3.svg" style="width: 15px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }}
      </div>
    </k-card>
    </div>

    <div v-if="empresas.length > 0">  
      <div class="labelapp"> ADMINISTRA TUS UBICACIONES </div>

      <k-card v-for="empresa in empresas" :key="empresa.name"  @click="navegarADetalle(empresa.id)" >
        <div class="tittle">{{ empresa.name }}</div>
        
        <div  v-if="empresa.tipo.id === 1" class="labelType" > 
          <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        <div  v-if="empresa.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;"> 
          <img src="../assets/Polygon 3.svg" style="width: 1px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        
      </k-card>
    </div>

    </div>
        

  
  
  
</k-page>

</template>

<script>
  import { ref } from 'vue';
  import {
    kPage,
    kNavbar,
    kNavbarBackLink,
    kPanel,
    kBlock,
    kBlockTitle,
    kLink,
    kButton,
    kCard,

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

    },
  
  };
</script>


<script setup>
import supabase from "../db/supabaseClient";
import { useRouter } from "vue-router";
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import OverlayPanel from "primevue/overlaypanel";


const router = useRouter();
const store = useStore();
const isAuthenticated = computed(() => store.state.isAuthenticated);
const authToken = ref('');
const userUUID = ref('');
const userData = ref(null);
const clientData = ref(null);  // Agrega esta línea
const projectData = ref(null);
const userMenu = ref(null);
const userPanelOpened = ref(false);
const empresas = ref([]);
const divisiones = ref([]);






onMounted(async () => {
  userUUID.value = localStorage.getItem('userUUID') || '';

  if (userUUID.value) {

    const { data: userDataResponse, error: userError } = await supabase
      .from('userData')
      .select('name, email')
      .eq('user_id', userUUID.value);




    if (userError) {
      console.error('Error al obtener datos de usuario:', userError);
    } else {
      userData.value = userDataResponse[0];

    }

    const { data: userRoles, error: rolesError } = await supabase
      .from('userRoles')
      .select('entidad(*, tipo(tipo,id))')
      .eq('user', userUUID.value)
      .eq('rol', 2);
      

      console.log('userRoles:', userRoles);
      console.log(JSON.stringify(userRoles, null, 2));

      if (rolesError) {
      console.error('Error obteniendo roles del usuario:', rolesError);
    } else {
      empresas.value = userRoles.filter(role => role.entidad !== null).map(role => role.entidad);
      
    }

    const { data: userRolesDivision, error: rolesErrorDivision } = await supabase
      .from('userRoles')
      .select('*, division(*,entidad(*,tipo(tipo,id)))')
      .eq('user', userUUID.value)
      .eq('rol', 3);
      ;

      console.log('userDivision:', userRolesDivision);
      console.log(JSON.stringify(userRolesDivision, null, 3));

      if (rolesErrorDivision) {
        console.error('Error obteniendo roles de la división:', rolesErrorDivision);
      } else {
        divisiones.value = userRolesDivision.map(role => role.division).filter(division => division !== null);
      
    }

  }

  


});


function openUserPanel() {
  userPanelOpened.value = true;
  
}

function navegarADetalle(id) {
  router.push(`/entidad/${id}`);
}

function goToDivision(id) {
  router.push(`/division/${id}`);
}


// Función de logout
function logout() {
  supabase.auth.signOut();
  localStorage.removeItem('authToken');
  localStorage.removeItem('userUUID');
  store.dispatch('clearAuthentication');
  router.push('/login');
}

function handleProjectClick(uuid,id) {
  router.push(`/${uuid}/prime?id=${id}`);
}

function toggleUserMenu() {
  if (userMenu.value) {
    userMenu.value.toggle(event);
  }
}

</script>

<style >

.labelType{
  font-size: 12px; 
  font-weight: 150;
  display: flex;
  color: #006EAB;
  background-color: #DFF4FF;
  font-weight: 500;
  max-width: fit-content;
  padding: 5px;
  border-radius: 10px;
  padding-right: 10px;
}



.tittle{
  font-size: 18px; 
  font-weight: 600;
  margin-bottom: 10px;
}

.bg-ios-light-surface-1{
  margin: 0px;
  margin-bottom: 12px;
}


.usertext{
font-size: 13px;
}

.logout{
  background-color: transparent;
  color: red;
  border-style: none;
  padding: 0;
  
}

body{
  background-color: #f8f8f8;
}

.contenedor{
  max-width: 1200px;
  padding: 20px;
  margin: auto;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}


.userButton{
  
border-style: none;
border-width: 1px;
padding: 3px;
padding-right: 6px;
display: flex;
flex-direction: row;
border-radius: 20px;
max-width:85px;
align-items: center;
cursor: pointer;
background-color: transparent;
}



.Lavatar{
 padding: 5px;
 background-color: black;
 width: 25px;
 height: 25px;
 border-radius: 15px;
 color: white;
 align-items: center;
 justify-content: center;
 align-content: center;
 text-align: center;
 margin-right: 7px;
 font-size: 15px;
}

.Lavatar:hover {
    background-color: rgb(67, 38, 199);
}


@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;  /* En pantallas pequeñas, se muestran en una sola columna */
  }
}



</style>