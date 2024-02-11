<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <k-navbar 
      :title="division.name"
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
<div class="container" >

  <k-list  style="width: 100%;" >
    <div class="input-group">
            <k-list-input
              style="margin: 0px!important; width: 100%;"
              floating-label
              :value="division.name"
              @input="name = $event.target.value; console.log('Input event:', $event.target.value);"
              label="Nombre"
              type="text"
              id="name"
              required
              placeholder="Nombre de la division/casa"
            />
          </div>
        </k-list>

        <FloatLabel>
          <InputText id="username" v-model="value" />
          <label for="username">Username</label>
      </FloatLabel>


 <div style="width: 100%;"> 
    <div class="labelText" style="margin-bottom: 20px;"> {{ division.uuid }} </div>

    <k-block-title style="margin-bottom: 1px;">Usuarios</k-block-title>

        <k-list strong inset style="width: 100%;">
          <k-list-item 
            v-for="(userRole, index) in userRoles" 
            :key="index" 
            :title="userRole.userData.name" 
            :footer="userRole.userData.email">
            <template #after>
              <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #4d4d4d;" @click.stop="() => removeUserRole(userRole.id)"/>
            </template>
          </k-list-item>
        </k-list>
 </div>

 <div v-if="userRoles.length === 0" class="center-content">
  <Icon name="solar:user-cross-broken" style="font-size:40px; color: #4d4d4d; margin-bottom: 10px;"/>
  <p>No se encontraron usuarios</p>
</div>

<div class="addUser">

  <Button @click="openPopup" > Agregar usuario</Button>
  


  <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedio">
 
 <k-navbar  
      title="Inivitar Usuario"
      small
       isTralucent style="background-color: white;">
      
     <template #left>
       <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
     </template>
   </k-navbar>
 
 <div style="padding: 25px; padding-bottom: 10px;">
 
    <k-list>
      <div style="display: flex; align-items: center; width: 100%; margin-top: 15px;">
      
          <div :key="index" class="input-group" style="width: 100%;">
            <div class="input-group">
            <k-list-input
              style="margin: 0px!important; width: 100%;"
              outline
              :value="emailList"
              @input="emailList = $event.target.value; console.log('Input event:', $event.target.value);"
              label="Invita usuarios"
              type="text"
              id="emails"
              required
              placeholder="Escribe los correos separados por comas"
            />
          </div>
        </div>

        <button class="iconButton" @click="submitEmails">
          <Icon name="solar:user-plus-broken" style="font-size:30px; color: white;"/>
        </button>

        
    </div>
    </k-list>

    <div style="margin-bottom: 20px;" v-if="mails.length > 0"> 

        <k-block-title>Invitaciones </k-block-title>
        <k-list strong inset>
          <k-list-item 
            v-for="(mail, index) in mails" 
            :key="index" 
            :title="mail">
            <template #after>
              <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #ef5a5a;" @click.stop="removeEmail(index)"/>
            </template>
          </k-list-item>
        </k-list>

        </div>

        <k-button 
        v-if="mails.length > 0"
        @click="addInvitations"  type="submit" label="Invitar" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
      </k-button>


    </div>
 


 
 </k-popup>


</div>

<div  v-if="invitaciones.length > 0"> 
<k-block-title style="margin-bottom: 1px;">Invitaciones pendientes</k-block-title>

        <k-list strong inset style="width: 100%;">
          <k-list-item 
            v-for="(invitacion, index) in invitaciones" 
            :key="index" 
            :title="invitacion.email" 
            :footer="formatearFecha(invitacion.created_at)">
            <template #after>
              <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #e43e3e;" @click.stop="() => removeInvitation(invitacion.id)"/>
            </template>
          </k-list-item>
        </k-list>
      </div>
</div>






  </k-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";

const route = useRoute();
const router = useRouter();
const division = ref(null);
const searchQuery = ref('');
const userRoles = ref([]);
const invitaciones = ref([]);
const popupOpened = ref(false);
const emailList = ref('');
const error = ref('');
const mails = ref([]);


function openPopup() {
  popupOpened.value = true;
}


onMounted(async () => {
  const divisionId = route.params._id;
  if (divisionId) {
    await cargarDivision(divisionId);
    await cargarUserRoles(divisionId); 
    await cargarInvitaciones(divisionId); 

  } else {
    console.error('No se proporcionó divisionId.');
  }
});

async function cargarDivision(divisionId) {
  if (!divisionId) return;

  try {
    const { data, error } = await supabase
      .from('division')
      .select('*,entidad(*,id,tipo(tipo,id))')
      .eq('id', divisionId)
      .single();

    if (error) throw error;
    division.value = data;
  } catch (error) {
    console.error('Error al obtener la división:', error);
  }
}

async function cargarUserRoles(divisionId) {
  try {
    const { data, error } = await supabase
      .from('userRoles')
      .select(`*, userData(id, name, email), entidad(*,id)`)
      .eq('division', divisionId);

    if (error) {
      console.error('Error al obtener los roles de usuario y datos de usuario:', error);
      return;
    }

    console.log('Roles de usuario y datos de usuario cargados:', data);
    userRoles.value = data;
  } catch (error) {
    console.error('Error al obtener los roles de usuario y datos de usuario:', error);
  }
}


async function cargarInvitaciones(divisionId) {
  console.log('Consultando invitaciones para divisionId:', divisionId); 


  try {
    const { data, error } = await supabase
    
      .from('invitacion') 
      .select(`*`)
        .eq('division', divisionId);

    if (error) throw error;
    console.log('Datos de invitaciones obtenidos:', data);
    invitaciones.value = data;
  } catch (error) {
    console.error('Error al obtener las invitaciones:', error);
  }
}


function removeEmail(index) {
  mails.value.splice(index, 1);
}
  
function submitEmails() {
  error.value = ''; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const emailsInput = emailList.value.split(',').map(email => email.trim());
  const invalidEmails = emailsInput.filter(email => !emailRegex.test(email)); 

  if (invalidEmails.length > 0) {
    
    error.value = 'Uno o más correos electrónicos son inválidos: ' + invalidEmails.join(', ');
  } else {

    mails.value = [...mails.value, ...emailsInput];
    console.log('Correos válidos enviados:', mails.value);
   
    emailList.value = '';
  }
}


function goBack() {
  router.back();
}

async function removeUserRole(userRoleId) {
  try {
    const { error } = await supabase
      .from('userRoles')
      .delete()
      .match({ id: userRoleId }); 

    if (error) throw error;

    console.log(`UserRole con id ${userRoleId} eliminado correctamente.`);

    await cargarUserRoles(division.value.id);
  } catch (error) {
    console.error('Error al eliminar el userRole:', error);
  }
}

const formatearFecha = (fecha) => {
  const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

  const fechaFormateada = new Date(fecha).toLocaleDateString('es', opcionesFecha);
  const horaFormateada = new Date(fecha).toLocaleTimeString('es', opcionesHora);

  return `${fechaFormateada}, ${horaFormateada}`;
};


async function addInvitations() {
  if (!division.value) {
    console.error("La información de la división no está disponible.");
    return;
  }

  if (!Array.isArray(mails.value)) {
    console.error("Error: mails no es un iterable.");
    return;
  }

  for (const mail of mails.value) {
    // Aquí va tu lógica para procesar cada mail...
    const invitationCode = generateInvitationCode();
    const userUUID = localStorage.getItem('userUUID');

    const { error: invitationError } = await supabase
      .from('invitacion')
      .insert([{
        email: mail,
        division: division.value.id,
        entidad: division.value.entidad.id,
        created_by: userUUID,
        invitationCode: invitationCode,
        estado: 'enviada'
      }]);

    if (invitationError) {
      console.error('Error al insertar invitación en Supabase:', invitationError);
      return;
    }
  }

  console.log('Invitaciones creadas exitosamente para todos los correos.');

  mails.value = [];
  emailList.value = '';
  popupOpened.value = false;

  await cargarInvitaciones(division.value.id);
}


async function removeInvitation(invitacionId) {
  try {
    const { error } = await supabase
      .from('invitacion')
      .delete()
      .match({ id: invitacionId });

    if (error) throw error;

    console.log(`Invitación con id ${invitacionId} eliminada correctamente.`);

    await cargarInvitaciones(division.value.id);
  } catch (error) {
    console.error('Error al eliminar la invitación:', error);
  }
}


function generateInvitationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#*';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



</script>




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
  display: flex;
  flex-direction: column;
}

.labelText{
 font-size:12px;
 color:rgb(141, 141, 141);
}




.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.shrink{
  font-size: 15px;
}


.addUser{
  display: flex; justify-content: center!important; color: rgb(22, 74, 164);
}

.iconButton {
  background-color: black; 
  padding: 8px; 
  border-radius: 9px; 
  width:45px; 
  height: 41px; 
  margin-top: 14px;
  margin-left: 8px;

}

.popMedio{
  height: 60vh;
  top: 70vh;
}



</style>
