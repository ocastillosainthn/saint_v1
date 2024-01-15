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
</script>




<template>
    <div class="login-container">
      <div class="login-card">
        <div class="logo-container">
          <img src="../assets/LOGO.svg" alt="Logo" class="logo">
        </div>
        <form @submit.prevent="signIn" class="login-form">
          <div class="input-group">
            <input type="email" id="email" v-model="email" placeholder="Correo electrónico" required>
          </div>
          <div class="input-group">
            <input type="password" id="password" v-model="password" placeholder="Contraseña" required>
            <span class="password-toggle" @click="togglePasswordVisibility">
              <!-- Icono para mostrar/ocultar contraseña -->
            </span>
          </div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>


        <div style="display: flex; justify-content: space-between;">
            <div class="forgot-password">
             <a href="#">¿Olvidaste la contraseña?</a>
            </div>

          <Button type="submit"  label="Ingresar" style="width: 100px;" ></Button>

        </div>  

        </form>

       
      </div>
    </div>
  </template>




<style scoped>
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
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 100px;
  margin-bottom: 30px;
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