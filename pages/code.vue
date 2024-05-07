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
const opened = ref(false);
const openedCode = ref({left: false});
const value = ref(null);
const loading = ref(false);
const code = ref('');
const codeActive = ref(null);
const registerUser = ref(null);
const response = ref(null);
const emailRegister = ref('');
const passwordRegister = ref('');
const nameRegister = ref('');
const celRegister = ref('');
const keyboardHeight = ref(0)
const popupRecoveryOpened = ref(false);
const errorCode = ref(true)

const openToast = (message) => {
  toastMessage.value = message;
  opened.value = true;

  setTimeout(() => {
    opened.value = false;
  }, 3000);
};


watch(code, (newValue) => {
  if (newValue && newValue.length === 5) {
    console.log('OTP completo:', newValue);
    fetchInvitationCode(newValue);
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
  errorCode.value = false;
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
        codeActive.value= 'error';
        errorCode.value = true;
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
    codeActive.value= null;
    resetCode();

  }
}

const handleKeydown = (event) => {
  if (event.key === 'Tab') {
    keyboardHeight.value = window.innerHeight * 0.3 // Ajusta este valor según tus necesidades
  } else {
    keyboardHeight.value = 0
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

function goBack() {
  router.back();
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
  loading.value = true;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: codeActive.value.email,
      password: passwordRegister.value
    });

    if (error) {
      throw new Error('Error registering user: ' + error.message);
    }

    console.log('User registered:', data);

    await setupUserData(data.user.id, nameRegister.value, codeActive.value.email, celRegister.value, codeActive.value.entidad, codeActive.value.division);

    // Redirección a la página principal
    router.push('/');
  } catch (error) {
    console.error(error.message);
    openToast(error.message);
  } finally {
    loading.value = false;
  }
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

  <k-page > 
    <div >

      
<k-navbar  
        title=""
        small
        isTralucent style="background-color: white;">
        
      <template #left>
        <k-link  @click="goBack">  <Icon name="solar:close-circle-outline" style="font-size:32px; color: #141515;"/>  </k-link>
      </template>
    
    </k-navbar>



    <div class="paddingbig"> 


      <div class="input-group">
 
        <div  style="font-size: 13px; margin-bottom: 10px;">
          Código de invitación

        
        </div >





        <div class="flex"> 
          <InputText
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

<div >
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
                  <ProgressSpinner v-if="loading"  style="width: 30px; height: 30px" strokeWidth="5" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />



        </form>


         </div>
      
        </div>        


    </div>


</div>

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





<style >


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