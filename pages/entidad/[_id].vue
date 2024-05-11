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
             Seguridad 
            </div>
        </template>

        <div class="cardCompany" > 

            Seguridad
            <div style=" font-size: 17px"> 
            <p style="font-weight: 700;" >
              {{ security.name }}
            </p>
            <p >
              Encargado:
              {{ security.manager }}
            </p>
            <p >
              Teléfono:
              {{ security.phone }}
            </p>
            </div>
        </div>

        <div>

          <div>
<div style="width: 100%; display:flex ; justify-content: space-between; font-size: 15; width: 100%; font-weight: 700; margin-top: 30px"> 
           
  <div> Guardias</div>
  
  <div><Icon @click="openGuard" name="material-symbols:add-circle" style="font-size:25px; color: #0b75cc;" />   </div>

  
          </div>

            <div style="width: 100%; margin-top: 20px;"> 

              <k-list strong inset>
                <k-list-item 
                    v-for="guardia in guardias"
                    :key="guardia.id"
                   >

                    <template #header >
                        <div style="font-size: 16px; color: black;">
                            {{ guardia.guardia.name }}  - 
                            <span style="font-weight:700 ;">{{ guardia.invitacion.invitationCode }}</span>
                        </div>
                    </template>

                    <template #footer>
                        <div style="font-size: 12px; color: gray;">
                            {{ guardia.guardia.email }} 
                        </div>
                    </template>

                    <template #after>
                    </template>
                </k-list-item>
            </k-list>

            </div>

            </div>

        </div>



      </TabPanel>

  </TabView>

</div>


<k-popup :opened="popupGuard" @backdropclick="() => (popupGuard = false)">
 
      <k-navbar  title="Crear Guardia" isTralucent style="background-color: white;">

          <template #left>
            <k-link navbar @click="() => (popupGuard = false)">  <Icon name="material-symbols-light:cancel" style="font-size:32px; color: #31b4e0;"/>  </k-link>
          </template>
        </k-navbar>

      <div style="padding: 25px; padding-bottom: 10px;">


      </div>

      <div style="padding:20px">

        <div> 

            <form  class="login-form">
            <div class="input-group">
              <InputText id="emailR" v-model="mailGuard" label="Correo Electrónico" type="email"  required placeholder="Correo Electrónico"/>
            </div>

            <div class="input-group">
              <InputText id="passwordR" v-model="passGuard" label="Contraseña" type="password" required placeholder="Contraseña"/>
            </div>

            <div class="input-group">
              <InputText id="nameR" v-model="nameGuard" label="Nombre" type="text" required placeholder="Nombre"/>
            </div>

            <div class="input-group">
              <InputText id="identidad" v-model="idGuard" label="Identidad" type="text" required placeholder="Identidad"/>
            </div>


            <div class="input-group">
              <InputText id="telefonoR" v-model="phoneGuard" label="Teléfono" type="number" required placeholder="Teléfono"/>
            </div>


            <k-button  @click="createGuard()" label="Registrar" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
              " ></k-button>


            </form>


          </div>
        
      </div>

        
   
      
   


</k-popup>


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



<k-toast :opened="opened" position="left" class="toast-above-all">
  {{ toastMessage }}
  <template #button>
    <k-button clear inline @click="opened = false">
      Cerrar
    </k-button>
  </template>
</k-toast>



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
const popupGuard = ref(false);
const name = ref('');
const opened = ref(false); 
const entidadId = ref('')
const error = ref('');
const guardias = ref([]);
const security = ref('');
const mails = ref([]);
const toastMessage = ref('');
const mailGuard = ref('');
const passGuard = ref('');
const nameGuard = ref('');
const idGuard = ref('');
const phoneGuard = ref('');
const invitationId = ref('')

const openToast = (message) => {
  toastMessage.value = message;
  opened.value = true;  // Cambia el estado para mostrar el toast

  setTimeout(() => {
    opened.value = false;  // Oculta el toast después de 3 segundos
  }, 3000);
};

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

function openGuard() {
  popupGuard.value = true; 
}

onMounted(async () => {
  const entidadId = route.params._id;
  await cargarEntidad(entidadId);
  await cargarDivisiones(entidadId);
  await cargarGuardias()


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

 

  console.log('Invitaciones creadas exitosamente para todos los correos.');
  popupOpened.value = false;
  name.value = '';
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
      .select('*,tipo(id),empresa_seguridad(*)')
      .eq('id', entidadId)
      .single();

    if (error) throw error;

    entidad.value = data;
    console.log('entidadCargada:',entidad)
  
     security.value = entidad.value.empresa_seguridad
     console.log('Seguridad', security)

  } catch (error) {
    console.error('Error al obtener la entidad:', error);
  }
}


async function cargarGuardias() {
  if (!security) {
    console.log("Empresa de seguridad sin asingar");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('guardias')
      .select('*,guardia(*),empresa_seguridad(*), invitacion(*)')
      .eq('empresa_seguridad', security.value.id)
   

    if (error) throw error;

    guardias.value = data;
    console.log('Guardias :',guardias)
  


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


async function createGuard() {
    const userUUID = localStorage.getItem('userUUID');
    const entidadId = route.params._id;
    const invitationCode = generateInvitationCode();

      const { success: invSuccess, invitationId } = await addInvitations(mailGuard.value, entidadId, userUUID, invitationCode, passGuard.value);
    if (!invSuccess) return;

    const userDataSuccess = await addUserData(mailGuard.value, nameGuard.value, "guard", phoneGuard.value, true);
    if (!userDataSuccess) return;

    const guardiaSuccess = await newGuardia(mailGuard.value, security.value.id, invitationId);
    if (!guardiaSuccess) 
    return;

    console.log("Proceso de creación de guardia completado exitosamente con todos los pasos.");
    openToast('Guardia creado exitosamente');
    await cargarGuardias();
    popupGuard.value = false;
}

      async function addInvitations(email, entidadId, userUUID, invitationCode, pass) {
          console.log("Enviando invitación con los siguientes detalles:", email, entidadId, userUUID, invitationCode, pass);

          const response = await supabase
            .from('invitacion')
            .insert([
              { email, division: null, entidad: entidadId, created_by: userUUID, invitationCode, estado: 'enviada', guard: true, access: pass },
            ], { returning: 'representation' })
            .select('*');

          console.log("Respuesta completa de Supabase al intentar crear la invitación:", response);

          if (response.error) {
            console.error('Error al crear invitación:', response.error);
            return { success: false };
          }
          const invitationId = response.data[0].id;
          console.log('invitationId', invitationId )
          console.log('Invitación creada exitosamente para el correo:', email);
          return { success: true, invitationId: invitationId }; 
          
        }

    async function addUserData(email, name, tipoUser, phone, guardia) {
      console.log("Creando datos de usuario para:", email, name, tipoUser);
      const { error } = await supabase
        .from('userData')
        .insert([{
          email: email,
          name: name,
          tipoUser: tipoUser,
          phone: phone,
          guardia: guardia,
          estado: 'pendiente'
        }]);

      if (error) {
        console.error('Error al crear datos de usuario:', error);
        return false;
      }

      console.log('Datos de usuario creados exitosamente para:', email);
      return true;
    }

    async function newGuardia(email, empresa_seguridad, invitationId) {
    console.log("Registrando nueva guardia para el email:", email, "con empresa de seguridad ID:", empresa_seguridad, "y ID de invitación:", invitationId);
    
    // Primero, buscar el usuario para obtener su ID
    const { data: userData, error: userError } = await supabase
        .from('userData')
        .select('id') // Aquí cambiamos para seleccionar solo el ID, ya que es lo único que necesitamos.
        .eq('email', email)
        .single();  // Utiliza .single() para obtener directamente el objeto si estás esperando un solo resultado

    if (userError || !userData) {
        console.error('Error al obtener datos del usuario o usuario no encontrado:', userError);
        return false;
    }

    console.log("Usuario encontrado con ID:", userData.id, "Intentando insertar con ID de invitación:", invitationId);

    const { error: guardiaError } = await supabase
        .from('guardias')
        .insert([{
            guardia: userData.id,
            empresa_seguridad: empresa_seguridad,
            invitacion: invitationId  // Asegúrate de que esta columna exista en la tabla 'guardias'.
        }]);

    if (guardiaError) {
        console.error('Error al registrar nueva guardia:', guardiaError);
        return false;
    }

    console.log('Nueva guardia registrada exitosamente con ID:', userData.id, "y ID de invitación:", invitationId);
    return true;
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



.mr-4{
  margin-right: 0px!important;
}

.ml-4{
  margin-right: 0px!important;
}

.ps-4-safe{
  margin-right: 0px!important;
}


.ps-\34-safe {
  margin:0px!important;

}

.ml-\34-safe {
  margin-left:0px;
  margin-right:0px;

}

.container{
  width: 90%;
  margin: auto;
}






.logo {
  max-width: 70%;
  margin-bottom: 0px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 55px;
}

.input-group .password-toggle {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.btn-sign-in {
  width: 100%;
  padding: 10px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-msg {
  color: #d93025;
  text-align: left;
  margin-top: 10px;
  font-size: 12px;
  margin-bottom: 10px;
}

.forgot-password {
  text-align: center;
  font-size: 13px;
  margin-top: 20px;
}

.forgot-password a {
  color: #6c6c6c;
  text-decoration: none;
}

.popSmall{
  min-height: 40vh;
  top: 80vh;
  z-index: 100000000;
}

.inputOTP{
  background-color: gray;
}

.toast-above-all {
  position: fixed;

  z-index: 10000001; 
}



.whiteB{
    width: 100%; 
    height:50px!important;  
    border-width: 1px;
    border-style: solid;
    background-color: white;
    border-color: #0586F0;
    color: #0586F0;

  }




</style>