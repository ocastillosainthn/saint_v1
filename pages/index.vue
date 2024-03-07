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
                  <div style="color: rgb(112, 112, 112); margin-bottom: 20px;" v-if="userData">{{ userData.email }}   </div>
                  <div st> version dev: 0.2.15  06-03-24</div>
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

    <k-card v-for="division in divisiones" :key="division.id" @click="goToDivision(division.id)" style="margin-bottom: 15px;">
  <div class="tittle">{{ division.name }}  <Icon name="solar:arrow-right-linear" style="font-size: 17px; "/> <span style="font-size: 15px; color: gray; font-weight: 500;"> {{ division.entidad.name }} </span> </div>

      <div v-if="division.entidad.tipo.id === 1" class="labelType">
        <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }}
      </div>

      <div v-if="division.entidad.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;">
        <img src="../assets/Polygon 3.svg" style="width: 12px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }} 
      </div>
    </k-card>
    </div>

    <div v-if="empresas.length > 0">  
      <div class="labelapp" style="margin-top:0px"> ADMINISTRA TUS UBICACIONES </div>

      <k-card v-for="empresa in empresas" :key="empresa.name"  @click="navegarADetalle(empresa.id)" >
        <div class="tittle">{{ empresa.name }}</div>
        
        <div  v-if="empresa.tipo.id === 1" class="labelType" > 
          <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        <div  v-if="empresa.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;"> 
          <img src="../assets/Polygon 3.svg" style="width: 12px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        
      </k-card>
    </div>

    </div>
        

  <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popSmall">
 
        <k-navbar  
              title=""
              small
              isTralucent style="background-color: white;">
              
            <template #left>
              <k-link navbar @click="() => (popupOpened = false)">  <Icon name="solar:close-circle-outline" style="font-size:32px; color: #141515;"/>  </k-link>
            </template>
          </k-navbar>
        
          <div v-if="inviteSended" style="padding: 25px;" class="acceptInvitacion">

            <div style="  display: flex; justify-content: center; margin-bottom:20px "> <Icon name="solar:bell-broken" style="font-size:25px; color: #141515;"/> </div>

            Has recibido una invitación para administrar <span style="font-weight: 700;">{{ inviteSended.division.name }}</span>
            <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
              <Button @click="rejectInvitation">Rechazar</Button>
              <Button @click="acceptInvitation" class="botonInvitacion" style="margin-left: 20px;">Aceptar Invitación</Button>
            </div>
          </div>
          
     
        



 </k-popup>

  
  
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
      kPopup,
    kListInput,
    kToast,

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
const clientData = ref(null); 
const projectData = ref(null);
const userMenu = ref(null);
const userPanelOpened = ref(false);
const empresas = ref([]);
const divisiones = ref([]);
const popupOpened = ref(false);
const inviteSended = ref(null);



async function fetchInviteSended() {
  if (!userData.value.email) {
    console.error("Email del usuario no disponible.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('invitacion')
      .select('*,division(*)')
      .eq('estado', 'enviada')
      .eq('email', userData.value.email)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      inviteSended.value = data;
      popupOpened.value = true;
    }
  } catch (error) {
    console.error('Error al buscar la invitación enviada:', error);
    inviteSended.value = null;
    popupOpened.value = false;
  }
}


onMounted(async () => {
  userUUID.value = localStorage.getItem('userUUID') || '';

  

  if (userUUID.value) {

    const { data: userDataResponse, error: userError } = await supabase
      .from('userData')
      .select('name, email,id')
      .eq('user_id', userUUID.value);


    if (userError) {
      console.error('Error al obtener datos de usuario:', userError);
    } else {
      userData.value = userDataResponse[0];
      await fetchInviteSended();

    }

    const { data: userRoles, error: rolesError } = await supabase
      .from('userRoles')
      .select('entidad(*, tipo(tipo,id))')
      .eq('user', userUUID.value)
      .eq('rol', 2);
      

      console.log('userRoles:', userRoles);

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

async function acceptInvitation() {
  // Verifica si inviteSended y userUUID están definidos
  if (!inviteSended.value || !userUUID.value) {
    console.error("Datos necesarios para aceptar la invitación no están disponibles.");
    return;
  }

  const { data: updatedInvite, error: updateError } = await supabase
    .from('invitacion')
    .update({ estado: 'aceptada' }) 
    .eq('id', inviteSended.value.id); 

  if (updateError) {
    console.error('Error al actualizar la invitación:', updateError);
    return;
  }

  console.log('Invitación actualizada:', updatedInvite);

  const { data: newUserRole, error: createUserRoleError } = await supabase
    .from('userRoles')
    .insert([
      {
        user: userUUID.value,
        rol: 3,
        division: inviteSended.value.division.id,
        userData: userData.value.id,
      },
    ]);

  if (createUserRoleError) {
    console.error('Error al crear el rol de usuario:', createUserRoleError);
    return;
  }


  console.log('Nuevo rol de usuario creado:', newUserRole);
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

    popupOpened.value = false;
}


async function rejectInvitation() {
  if (!inviteSended.value || !inviteSended.value.id) {
    console.error("No hay una invitación seleccionada para rechazar.");
    return;
  }

  try {
    const { data: updatedInvite, error: updateError } = await supabase
      .from('invitacion')
      .update({ estado: 'rechazada' }) 
      .eq('id', inviteSended.value.id);

    if (updateError) {
      console.error('Error al actualizar la invitación:', updateError);
      return;
    }

    console.log('Invitación actualizada a rechazada:', updatedInvite);
    popupOpened.value = false;
  } catch (error) {
    console.error('Error al rechazar la invitación:', error);
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

.acceptInvitacion{
  margin: auto;
  margin-top: 20px;
  padding: 10px;
  width: 90%;
  background-color: #fafafa; 
  border-width: 1px; 
  border-color: #eaeaeacb;
  border-style: solid;
  border-radius: 10px;
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

.botonInvitacion {
font-size: 12px;
padding: 10px;
border-radius: 7px;
color:white;
  background-color: rgb(0, 0, 0);
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

.popSmall{
  height: 40vh;
  top: 80vh;
}


@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;  /* En pantallas pequeñas, se muestran en una sola columna */
  }
}






</style>