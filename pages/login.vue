<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';
import { watch } from 'vue';

import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import InputOtp from 'primevue/inputotp';

import supabase from "../db/supabaseClient";
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref(null);
const store = useStore(); 
const toastMessage = ref('');
const opened = ref({left: false});
const openedCode = ref({left: false});
const value = ref(null);
const popupOpened = ref(false);
const loading = ref(false);
const code = ref('');
const codeActive = ref(null);
const registerUser = ref(null);
const response = ref(null);
const emailRegister = ref('');
const passwordRegister = ref('');
const nameRegister = ref('');
const celRegister = ref('');

const openToast = (message) => {
  opened.value = { left: false, right: false, top: false, bottom: false };
  opened.value.left = true; 
  toastMessage.value = message;

  setTimeout(() => {
    opened.value.left = false;
  }, 3000);
};


watch(code, (newValue) => {
  if (newValue && newValue.length === 5) {
    console.log('OTP completo:', newValue);
    fetchInvitationCode(newValue);
  }
});

watch(popupOpened, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    codeActive.value = null;
  }
});


async function signIn() {
  try {

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    errorMsg.value = error.message;
    openToast(error.message);
  }
}

onMounted(() => {

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      localStorage.setItem('authToken', session.access_token);
      localStorage.setItem('userUUID', session.user.id);

      store.dispatch('setAuthenticatedUser', {
        isAuthenticated: true,
        user: {
          uuid: session.user.id,
        },
      });


      router.push('/');
    }
  });


});

function testInputs() {
  console.log("Email:", email.value, "Password:", password.value);
}



async function fetchInvitationCode(invitationCode) {
  console.log('Buscando código de invitación:', invitationCode);
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('invitacion')
      .select('*')
      .eq('invitationCode', invitationCode)
      .single(); 

    if (error) throw error;

    if (!data) {
        console.log('No se encontró el código de invitación');
        errorMsg.value = 'No se encontró el código de invitación';
        openToast( 'No se encontró el código de invitación');
        loading.value = false;
        popupOpened.value= false; 
        codeActive.value= null;
        resetCode();

      } else {
        console.log('Data de invitación', data);
        codeActive.value = data;
        loading.value = false;
      }
  } catch (error) {
    console.error('Error buscando el código de invitación:', error.message);
    loading.value = false;
    errorMsg.value = ('Error buscando el código de invitación');
    openToast( errorMsg);
    popupOpened.value= false; 
    codeActive.value= null;
    resetCode();

  }
}

function onOtpInput(value) {
  if (value.length === 5) {
    fetchInvitationCode(value);
  }

  if (value.length === 0) {
    codeActive.value = null; 
  }
}



function resetCode() {
  code.value = ''; 
}


async function createUserAndRoles() {
  try {
    const { data, error } = await supabase.rpc('create_user_and_roles', {
      email: codeActive.value.email,
      password: passwordRegister.value,
      name: nameRegister.value,
      phone: celRegister.value,
      role: 3,
      entidad: codeActive.value.entidad,
      division: codeActive.value.division
    });

    if (error) {
      console.error('Error calling function:', error.message);
      alert(error.message);
    } else {
      response.value = data;  // Asegúrate de que usas 'response' definida como ref
      console.log('Function response:', data);
    }
  } catch (error) {
    console.error('Error in createUserAndRoles:', error.message);
    alert(error.message);
  }
}


async function signUpAndSetupUserData() {
  const { data, error } = await supabase.auth.signUp({
    email: codeActive.value.email,
    password: passwordRegister.value
  });

  if (error) {
    console.error('Error registering user:', error.message);
    return;
  }

  console.log('User registered:', data);

  await setupUserData(data.user.id, nameRegister.value, codeActive.value.email, celRegister.value, codeActive.value.entidad, codeActive.value.division);
  
}

async function setupUserData(userId, name, email, phone, entidad, division) {
  console.log('Inicio de inserción en userData');
  const { error } = await supabase.from('userData').insert([
    { name, email, phone, user_id: userId }
  ]);

  if (error) {
    console.error('Error saving user data:', error.message);
    return;
  }

  // Obtener el registro recién creado
  const { data: userData, error: userDataError } = await supabase
    .from('userData')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userDataError) {
    console.error('Error fetching user data:', userDataError.message);
    return;
  }

  console.log('User userdata saved:', userData);

  
}

</script>


<script>
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
    kPreloader,
    kSheet
    

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
      kPreloader,
    kListInput,
    kToast,
    kSheet


    },



  };
</script>

<template>

  <k-page style="display: flex;">

   
    <div style="width: 90%; margin:auto" >

      

    <k-popup style="z-index:10000000" :opened="popupOpened" @backdropclick="() => (popupOpened = false)" class="popMedium">
 
        <k-navbar  
              title=""
              small
              isTralucent style="background-color: white;">
              
            <template #left>
              <k-link navbar @click="() => (popupOpened = false)">  <Icon name="solar:close-circle-outline" style="font-size:32px; color: #141515;"/>  </k-link>
            </template>
          </k-navbar>
 

          <div class="paddingbig"> 


            <div class="input-group">
       
              <div  style="font-size: 13px; margin-bottom: 10px;">
                Código de invitación
              </div >


 


              <div class="flex"> 
                <InputOtp
                  id="code"
                  v-model="code"
                  :length="5"
                  type="text"
                  required
                  @complete="onOtpInput"/>
                
                  <ProgressSpinner v-if="loading"  style="width: 30px; height: 30px" strokeWidth="5" fill="var(--surface-ground)"
                  animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                
                  <Icon  v-if="codeActive" name="solar:check-square-bold" style="font-size: 40px; color: green; margin-left: 10px;" />


                </div>
                </div>
                          
            <!-- 
                 <k-button  type="submit"  label="REGISTRAR" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
                  " ></k-button>
                
                -->
  

               <div v-if="codeActive"> 

                    <form @submit.prevent="register" class="login-form">
                    <div class="input-group">
                      <InputText id="emailR" v-model="codeActive.email" label="Correo Electrónico" type="email" disabled required placeholder="Correo Electrónico"/>
                    </div>

                    <div class="input-group">
                      <InputText id="passwordR" v-model="passwordRegister" label="Contraseña" type="password" required placeholder="Contraseña"/>
                    </div>

                    <div class="input-group">
                      <InputText id="nameR" v-model="nameRegister" label="Nombre" type="text" required placeholder="Nombre"/>
                    </div>

                    <div class="input-group">
                      <InputText id="telefonoR" v-model="celRegister" label="Teléfono" type="number" required placeholder="Teléfono"/>
                    </div>

                  
                  <k-button @click="signUpAndSetupUserData"  type="submit"  label="Registrar" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
                      " ></k-button>


              </form>


               </div>
            
             


          </div>
            
   
         
    </k-popup>

      
   

     <k-block strong>
        <div >
          <div class="logo-container" style="margin-bottom: 50px;">
            <img src="../assets/saintLogo.jpg" alt="Logo" class="logo">
          </div>

          <form @submit.prevent="signIn" class="login-form">
            
        
            <div class="login-page">
              <form @submit.prevent="signIn" class="login-form">
                <div class="input-group">
                  <InputText id="email" v-model="email" label="Correo Electrónico" type="email" required placeholder="Correo Electrónico"/>
                </div>

              


                <div class="input-group">
                  <InputText id="password" v-model="password" label="Contraseña" type="password" required placeholder="Contraseña"/>
                </div>
              
              </form>
              <!-- Componentes para mensajes toast -->
            </div>
                          

            
                 <k-button @click="testInputs"  type="submit"  label="Ingresar" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
                  " ></k-button>
  



                <div style="display: flex; justify-content: space-between;">


              <div class="forgot-password">
              <a href="#">¿Olvidaste la contraseña?</a>
              </div>
            
        </div>  

      
          </form>

          
<div> 
          <Button  @click="() => (popupOpened = true)"    label="INGRESAR CON CÓDIGO" class="whiteB" style="margin-top: 40px;"
                   ></Button>
                  </div>

        </div>
     </k-block>
    </div>

    <k-toast position="left" :opened="opened.left" class="toast-above-all">
    <template #button>
      <k-button clear inline @click="() => (opened.left = false)">
        Cerrar
      </k-button>
    </template>
    <div class="shrink">{{ toastMessage }}</div>
    </k-toast>





  </k-page>


  

  </template>





<style scoped>


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

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  padding-top: 50px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgb(231, 231, 231);
  border-style: solid;
  height: 500px;
  background-color: white;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-top:20px;
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