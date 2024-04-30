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
const keyboardHeight = ref(0)

const openToast = (message) => {
  opened.value = { left: false, right: false, top: false, bottom: false };
  opened.value.left = true; 
  toastMessage.value = message;

  setTimeout(() => {
    opened.value.left = false;
  }, 3000);
};



async function resetPassword() {

console.log('data recovery',  password.value)

const { data, error } = await supabase.auth.updateUser({
  password: password.value
})
if (error) {
    alert(error.message);

    console.error('Error enviando el correo de recuperación:', error.message);
  } else {
    alert('Contraseña actualizada correctamente. Ingresa al App y autenticate con tu nueva contraseña');
  }

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

      

     <k-block strong>
        <div >
          <div class="logo-container" style="margin-bottom: 50px;">
            <img src="../assets/saintLogo.jpg" alt="Logo" class="logo">
          </div>

          <h1 style="font-size: 25px; margin-bottom: 40px; font-weight: 700;"> Recuperar contraseña</h1>

          <form  class="login-form">
            
            
        
            <div class="login-page">
              <form class="login-form">
            
                <div class="input-group">
                  <InputText id="password" v-model="password" label="Nueva contraseña" type="password" required placeholder="Nueva Contraseña"/>
                </div>
              
              </form>
              <!-- Componentes para mensajes toast -->
            </div>
                          

            
                 <k-button @click="resetPassword"   label="Cambiar contraseña" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
                  " ></k-button>

      
          </form>

          

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