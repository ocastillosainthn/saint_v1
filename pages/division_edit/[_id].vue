<template>

<div v-if="loading"  class="loadingPage"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
      </div>


  <k-page v-if="division" style="background-color: white;">
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
  
      <TabView >


    <TabPanel header="Visitas">
    
        
             <div style="width: 100%;"> 
        
                  
                        <k-list strong inset style="width: 100%;">
                          <k-list-item 
                          
                            v-for="(visitaDivision, index) in visitaDivisions" 
                            :key="index" 
                            :title="visitaDivision.nombre" 
                            @click="navigateToVisita(visitaDivision.id)"
                            >
                            <template #footer>

                            <div> Creado por  <span style="font-weight: bold;"> {{ visitaDivision.created_by.name }} </span> </div> 
                            <div><Icon name="material-symbols-light:calendar-today-outline-rounded" style="font-size:17px;" />  {{ formatDate(visitaDivision.fecha) }} </div>
                            </template>

                            <template #after>
                              <Icon name="material-symbols-light:arrow-right-alt" style="font-size:17px;" /> 
                            </template>
                          </k-list-item>
                        </k-list>
                    </div>
        
                    
  
        
        
              </TabPanel>

    <TabPanel header="Usuarios">
    
    <div style="width: 100%;"> 

        
              <k-list strong inset style="width: 100%;">
                <k-list-item 
                  v-for="(userRole, index) in userRoles" 
                  :key="index" 
                  :title="userRole.userData.name" 
                  :footer="userRole.userData.email">
                  <template #after>
                    <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #f54e4e;" @click.stop="() => removeUserRole(userRole.id)"/>
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


    </TabPanel>


    <TabPanel header="Información" class="backgroundTab">
        

      <div class="" >
  
        <k-list  style="width: 100%;  margin-top: 0px; margin-bottom: 0px;" >
          <div class="input-group">
                  <k-list-input
                    style="margin: 0px!important; width: 100%; font-size: 14px;"
                    floating-label
                    :value="name"
                    @input="name = $event.target.value; console.log('Input event:', $event.target.value);"
                    label="Nombre"
                    type="text"
                    id="name"
                    placeholder="Nombre de la division/casa"
                  />
                </div>
              </k-list>

    <k-list  style="width: 100%;  margin-top: 0px; margin-bottom: 0px;" >
    <div class="input-group">
            <k-list-input
              style="margin: 0px!important; width: 100%; font-size: 14px;"
              floating-label
              :value="descripcion"
              @input="descripcion = $event.target.value; console.log('Input event:', $event.target.value);"
              label="Descripción"
              type="text"
              id="descripcion"
              placeholder="Decripción/Dirección"
            />
          </div>
        </k-list>


  <div class="bottomTAB"> 
    <Button @click="deleteDivision" style="margin-right: 20px; font-size: 14px; color: red;">Eliminar</Button>
    <Button @click="saveDivision" class="botonSave">GUARDAR</Button>
  </div>

  <k-toast position="left" :opened="opened.left" :style="{backgroundColor: toastColor}">
    <template #button>
      <k-button clear inline @click="() => (opened.left = false)">
        Cerrar
      </k-button>
    </template>
    <div class="shrink">{{ toastMessage }}</div>
  </k-toast>




</div>


     

    </TabPanel>

    

  </TabView>


    </div>






  </k-page>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";
import PrimeVue from "primevue/config";
import InputText from 'primevue/inputtext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';


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
const edit = ref(false);
const name = ref('');
const descripcion = ref('');
const opened = ref({ left: false });
const toastMessage = ref('');
const toastColor = ref('#FFFFFF'); 
const visitaDivisions = ref([]);
const loading = ref(false);


const openToast = (side, message, color) => {
  opened.value[side] = true;
  toastMessage.value = message; 
  toastColor.value = color;
  
  setTimeout(() => {
    opened.value[side] = false;
  }, 3000); 
};


  function openPopup() {
  popupOpened.value = true;
}


onMounted(async () => {
  loading.value = true;

  const divisionId = route.params._id;
  if (divisionId) {
    await cargarDivision(divisionId);
    await cargarUserRoles(divisionId); 
    await cargarVisitas(divisionId)
    await cargarInvitaciones(divisionId); 
    loading.value = false;

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
    
    name.value= division.value.name
    descripcion.value = division.value.descripcion

    console.log('constDescripcion:', descripcion)
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


async function cargarVisitas(divisionId) {
  try {
    const { data, error } = await supabase
      .from('visita')
      .select(`*, division(*), created_by(*)`)
      .eq('division', divisionId)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener las visitas:', error);
      return;
    }


    console.log('Visitas de division:', data);
    
    visitaDivisions.value = data;
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
      .eq('division', divisionId)
      .eq('estado', 'enviada');
  

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


function navigateToVisita(visitaId) {
  loading.value = true;
  router.push(`/visita/${visitaId}`);
}


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

    await sendEmail(mail, invitationCode);
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
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#*';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



function toggleEdit() {
  edit.value = !edit.value;
}


async function saveDivision() {
  if (!division.value || !division.value.id) {
    console.error("Información de división no disponible.");
    return;
  }
  
  const { error } = await supabase
    .from('division')
    .update({ name: name.value, descripcion: descripcion.value })
    .eq('id', division.value.id);

  if (error) {
    console.error('Error al guardar la división:', error);
  } else {
    console.log('División actualizada exitosamente.');
    openToast('left', 'Acción completada exitosamente.', '#14a248');
  await cargarDivision(division.value.id);
  }
}

const deleteDivision = async () => {
  if (!division.value || !division.value.id) {
    console.error("Información de división no disponible.");
    return;
  }

  try {
    const { error } = await supabase
      .from('division')
      .delete()
      .eq('id', division.value.id); 

    if (error) throw error;

    console.log('División eliminada exitosamente.');
    router.back();
  } catch (error) {
    console.error('Error al eliminar la división:', error);
    if (error.code === '23503') {
      openToast('left', 'La división tiene usuarios o invitaciones activas, debes eliminarlos antes de poder eliminarla.','#D56363');
    }
  }
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "PPpp", { locale: es });
};


async function sendEmail(mail, invitationCode) {
  const emailHtml = `
    <div>
      <div style="background-color:#F2F2F2; min-height:400px; padding-top:20px">
        <div style="max-width:500px; margin: auto; text-align: center; background-color:white; padding:20px; margin-top:20px">
          <img src="https://saintapp.up.railway.app/_nuxt/saintLogo.DvkUeMPE.jpg" style="width:45%">
          <div style="background-color:white; text-align: center;">
            <h2>Código de Activación de cuenta</h2>
            <p style="margin-top:30px">Haz sido invitado a administrar una vivienda, ingresa el siguiente código en el APP SAINT para iniciar tu registro.</p>
            <p><div style="background-color: #F2F2F2; font-size:40px; color: black !important; font-weight:900; padding:20px; border-radius:5px;">${invitationCode}</div></p>
          </div>
        </div>
      </div>
    </div>`;

    try {
    const response = await axios.post('/api/emails', {
      from: "SAINT HN <noreplay@sainthn.com>",
      to: [mail],
      subject: "Código de activación",
      html: emailHtml
    }, {
      headers: {
        'Authorization': 'Bearer re_gU5tiyA7_FkumLijHkufAuV64c4w3bk8B',
        'Content-Type': 'application/json',
        'X-Entity-Ref-ID': '123'
      }
    });
    console.log('Correo enviado con éxito a:', mail);
    alert("se envio el correo y se envio a:", mail);
    alert("este fue el mensjae que enviamos", html);

  } catch (error) {
    console.error('Error enviando el correo:', error.message);
    alert(error.message);
  }
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
      kToast
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


.bottomTAB{
  display: flex;
  position:fixed; 
  bottom: 0px; 
  left: 0px;
  z-index: 20;
  height: 65px; 
  width: 100%; 
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px;
}


.botonSave {
font-size: 12px;
padding: 10px;
border-radius: 7px;
color:white;
  background-color: rgb(1, 88, 181);
}

</style>
