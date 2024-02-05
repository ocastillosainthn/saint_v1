<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import supabase from "../db/supabaseClient";
import { useStore } from 'vuex';


const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref(null);
const store = useStore();
const toastMessage = ref('');
const opened = ref({left: false
      });

const openToast = (side, message) => {
  opened.value = { left: false };
  opened.value[side] = true;
  toastMessage.value = message; 
  
  setTimeout(() => {
    opened.value[side] = false;
  }, 3000); 
};
     

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
    openToast('left', error.message);
  }
}

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // Almacena el token de autenticación y el UUID del usuario en el localStorage
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
  
</script>


<script>
  // Konsta UI components
  import {
    kPage,
    kNavbar,
    kBlock,
    kButton,
    kList,
    kListItem,
    kLink,
    kBlockTitle,
    kToast,
    kListInput,
    

  } from 'konsta/vue';

  export default {
    components: {
      kPage,
      kNavbar,
      kBlock,
      kButton,
      kList,
      kListItem,
      kLink,
      kBlockTitle,
      kToast,
      kListInput,


    },



  };
</script>

<template>

  <k-page style="display: flex;">

   
    <div style="width: 90%; margin:auto" >

 



     <k-block strong>
        <div >
          <div class="logo-container">
            <img src="../assets/saintLogo.jpg" alt="Logo" class="logo">
          </div>

          <form @submit.prevent="signIn" class="login-form">
            
            <k-list inset-ios strong-ios> 
                  <div class="input-group">

                    </div>

                    <div class="input-group">
                      <k-list-input
                      style="margin: 0px!important;"
                      outline
                      :value="email" 
                         @input="email = $event.target.value"
                      label="Correo Electrónico"
                      type="email"
                      id="email"
                      required
                      placeholder="Correo Electrónico"
                    >
                    </k-list-input>
                  </div>

                    <div class="input-group">
                      <k-list-input
                      outline
                      :value="password" 
                         @input="password = $event.target.value"
                      label="Password"
                      type="password"
                      id="password"
                      required
                      placeholder="Contraseña"
                    >
                    </k-list-input>

                      <span class="password-toggle" @click="togglePasswordVisibility">
                      
                      </span>
                    </div>
                 
                    
            </k-list>

                

            
                 <k-button @click="testInputs"  type="submit"  label="Ingresar" style="width: 100%; height:50px!important;   background-image: linear-gradient(to right, #20C4D6, #0586F0);
                  " ></k-button>
  
                <div style="display: flex; justify-content: space-between;">


              <div class="forgot-password">
              <a href="#">¿Olvidaste la contraseña?</a>
              
              </div>
            
        </div>  

          </form>
        </div>
     </k-block>
    </div>

    <k-toast position="left" :opened="opened.left">
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
</style>