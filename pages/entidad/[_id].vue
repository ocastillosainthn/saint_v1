<template>



  <k-page v-if="entidad" style="background-color: rgb(247, 247, 247); ">
    <k-navbar 
    
      :title="entidad.name" 
      medium
      class="top-0 sticky"
      style="background-color: white;"
    >
    <template #left>
      <k-navbar-back-link text="" @click="goBack" />  </template>

      <template #right>
        <div>
         
        </div>
      </template>
    </k-navbar>
 
<div> 

  <TabView>
    <TabPanel style="background-color: red; width: 100%">
      <template #header>
            <div class="flex" style="min-width:37vw;">
              {{fabText}}            </div>
        </template>

      <div  style="margin-top: 20px;"> 

            <k-searchbar
              v-model="searchQuery"
              placeholder="Buscar"
              clearButton
            ></k-searchbar>

            <div  >

              <div style="width: 100%; margin-top: 20px;"> 

              <k-list strong inset>
                <k-list-item 
                v-for="division in divisiones" 
                @click="goToEdit(division.id)"
                :key="division.id" 
                :title="division.name" 
                :footer="`${division.uuid}`">
                <template #after>
                          <Icon name="solar:arrow-right-linear" style="font-size:17px; color: #4d4d4d;" @click.stop="() => removeUserRole(userRole.id)"/>
                </template>
              </k-list-item>
              </k-list>

            </div>

            </div>

            <k-fab
            class="fixed right-4-safe bottom-4-safe z-20"
            :text=" fabText"
            style="background-image: linear-gradient(to right, #20C4D6, #0586F0); font-size: 11px;"
            text-position="after"
            @click="openPopup"
            >
            <template>
              <Icon name="material-symbols:add" style="font-size: 17px; "/>
            </template>
            </k-fab>


            </div>


    </TabPanel>

    <TabPanel >
        
      <template #header>
            <div class="flex" style="min-width: 37vw;">
             Seguridad         </div>
        </template>



      </TabPanel>

  </TabView>

</div>





<k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)">
 
<k-navbar   isTralucent style="background-color: white;">
    <template #left>
      <k-link navbar @click="() => (popupOpened = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
    </template>
  </k-navbar>

<div style="padding: 25px; padding-bottom: 10px;">

  <span style="font-weight: 700;"> Crear {{fabText}} </span> <span> <Icon name="material-symbols-light:arrow-right-alt" style="font-size:20px; color: #858585;"/> </span>  <span style="color: #626262;"> {{ entidad.name }}</span> 

</div>
  <div style="height: 100vh; padding: 25px; padding-top: 0;  margin: 4px;">
      <k-list >
        <div class="input-group">
          <k-list-input
            style="margin:1px;"
            outline
            :value="name"
            @input="name = $event.target.value;"
            label="Nombre"
            type="text"
            id="name"
            required
            placeholder="Escribe el nombre"
          />
        </div>

      
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

     <k-block-title>Invitaciones</k-block-title>
     <k-list strong inset>
        <k-list-item 
          v-for="(mail, index) in mails" 
          :key="index" 
          :title="mail">
          <template #after>
            <Icon name="solar:trash-bin-minimalistic-line-duotone" style="font-size:17px; color: #4d4d4d;" @click.stop="removeEmail(index)"/>
          </template>
        </k-list-item>
      </k-list>

    </div>
      
    <k-button @click="addDivision" type="submit" label="Crear" style="width: 100%; margin-top: 10px; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
      </k-button>
   
            
     </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
      
   


</k-popup>

</k-page>

</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'; 
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient"; 
import { watch } from 'vue';
import AddDivision from '../../components/addDivision.vue';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';


const route = useRoute();
const router = useRouter();
const entidad = ref(null);
const divisiones = ref([]);
const popupOpened = ref(false);
const name = ref('');

const emailList = ref('');
const error = ref('');
const mails = ref([]);

const fabText = computed(() => {
  
  if (!entidad.value || !entidad.value.tipo) {
    return 'Crear'; 
  }
  switch (entidad.value.tipo.id) {
    case 2:
      return 'Residencia';
    case 1:
      return 'División';
    default:
      return 'Crear'; 
  }
});




function openPopup() {
  popupOpened.value = true;
}

// Carga inicial de datos
onMounted(async () => {

  const entidadId = route.params._id;
  await cargarEntidad(entidadId);
  await cargarDivisiones(entidadId);
});

async function cargarDivisiones(entidadId) {
  try {
    const { data: divisionesData, error } = await supabase
      .from('division') 
      .select('*,entidad(*,tipo(tipo))')
      .eq('entidad', entidadId);

    if (error) throw error;

    console.log("Divisiones cargadas:", divisionesData); // Verifica los datos cargados
    divisiones.value = divisionesData;
    console.log ('divisiones montado',divisiones )
  } catch (error) {
    console.error('Error al obtener las divisiones:', error);
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


async function addDivision() {
  console.log('Nombre a insertar:', name.value);
  const entidadId = entidad.value?.id;

  // Intenta insertar la nueva división
  const { data: insertData, error: insertError } = await supabase
    .from('division')
    .insert([{ name: name.value, entidad: entidadId }]);

  if (insertError) {
    console.error('Error al insertar en Supabase:', insertError);
    return;
  }

  let divisionId = null;
  if (!insertData || insertData.length === 0) {
    console.log('No se recibieron datos de la nueva división, buscando por nombre...');

    // Realiza la consulta de seguimiento para obtener la división por nombre
    const { data: followUpData, error: followUpError } = await supabase
      .from('division')
      .select('*')
      .eq('name', name.value)
      .single();

    if (followUpError || !followUpData) {
      console.error('Error al obtener la división recién creada:', followUpError);
      return;
    }

    divisionId = followUpData.id;
    console.log('Obtenido el ID de la división recién creada mediante consulta de seguimiento:', divisionId);
  } else {
    divisionId = insertData[0].id;
    console.log('Inserción exitosa de división, ID:', divisionId);
  }

  for (const mail of mails.value) {
    const invitationCode = generateInvitationCode();
    const userUUID = localStorage.getItem('userUUID'); // Asegúrate de que esto esté correctamente configurado

    const { error: invitationError } = await supabase
      .from('invitacion')
      .insert([{
        email: mail,
        entidad: entidadId,
        division: divisionId,
        created_by: userUUID,
        invitationCode: invitationCode,
        estado: 'enviada'
      }]);

    if (invitationError) {
      console.error('Error al insertar invitación en Supabase:', invitationError);
    }
  }

  console.log('Invitaciones creadas exitosamente para todos los correos.');
  popupOpened.value = false;
  name.value = '';
  emailList.value = '';
  mails.value = [];
  await cargarDivisiones(entidadId);

}



async function cargarEntidad(entidadId) {
  if (!entidadId) {
    console.log("ID de entidad no está disponible.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('entidad')
      .select('*,tipo(id)')
      .eq('id', entidadId)
      .single();

    if (error) throw error;

    entidad.value = data;
    console.log('entidadCargada:',entidad)
  } catch (error) {
    console.error('Error al obtener la entidad:', error);
  }
}

function goBack() {
  router.back();
}


function goToEdit(id) {
  router.push(`/division_edit/${id}`);
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
  padding:20px
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

.error-message{
  font-size:10px;
  color: red;
}






</style>