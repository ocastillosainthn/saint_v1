<template>



  <div style="display: flex; flex-direction: column;  align-items: flex-end; padding:20px;">
    <div >
       
       
       <div class="userButton" @click="toggleUserMenu"> 
        <div class="Lavatar" v-if="userData">{{ userData.name.charAt(0) }}
        </div>
        <Icon name="tabler:menu" style="font-size: 20px; "/>
       </div>


       <OverlayPanel ref="userMenu">
            <div class="usertext" >
              <div v-if="isFetchingData">Cargando usuario...</div>
              <div  v-if="userData" style="font-size: 15px;">{{ userData.name }} </div>
              <div style="color: rgb(112, 112, 112);" v-if="userData">{{ userData.email }}   </div>
              <button class="logout" v-if="isAuthenticated" @click="logout">Cerrar sesión</button>

            </div>
            
      </OverlayPanel>

      
    </div>

  </div>


  <div class="contenedor" >
    <div style="display: flex; align; align-items: center;">

    <div class="logo-container">
      <img v-if="clientData && clientData.image" :src="clientData.image" alt="Logo" class="logo" />
        </div>
        <p v-if="clientData" style="font-size:45px; font-weight: 500; margin-top: 30px; margin-left: 20px;" > {{ clientData.name }}</p>

  </div>
   <p v-if="!isAuthenticated">No estás autenticado.</p>

   <div class="project-grid" v-if="projectData && projectData.length">
      <ProjectCard
        v-for="project in projectData"
        :key="project.uuid"
        :name="project.name"
        :uuid="project.uuid"
        :state="project.state"
        :url="project.url"
        @click="handleProjectClick(project.uuid, project.id)"

        

      />
    </div>
    
  </div>
  
  
  

</template>

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
const clientData = ref(null);  // Agrega esta línea
const projectData = ref(null);
const userMenu = ref(null);


onMounted(async () => {
  userUUID.value = localStorage.getItem('userUUID') || '';

  if (userUUID.value) {

    const { data: userDataResponse, error: userError } = await supabase
      .from('userData')
      .select('name, email')
      .eq('user_id', userUUID.value);

    if (userError) {
      console.error('Error al obtener datos de usuario:', userError);
    } else {
      userData.value = userDataResponse[0];
    }

    const { data: clientDataResponse, error: clientError } = await supabase
      .from('client')
      .select('name, uuid, id, image') 
      .eq('user_uuid', userUUID.value);

    if (clientError) {
      console.error('Error al obtener datos del cliente:', clientError);
    } else {
      clientData.value = clientDataResponse[0];
      console.log("Datos del cliente obtenidos:", clientData.value);

    }
    

    

    if (clientData.value && 'id' in clientData.value) {
      console.log("Consultando proyectos para el cliente con ID:", clientData.value.id);

      // Consulta para projectData
      const { data: projectDataResponse, error: projectError } = await supabase
        .from('project')
        .select('*') // Ajusta según sea necesario
        .eq('client', clientData.value.id);

      if (projectError) {
        console.error('Error al obtener datos del proyecto:', projectError);
      } else {
        projectData.value = projectDataResponse;
        console.log("Datos del proyecto obtenidos:", projectData.value); // Imprime los datos del proyecto obtenidos
      }
    } else {
      console.log("No se puede consultar proyectos, clientData.id no disponible");
    }

    isFetchingData.value = false;
  }
});



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

</script>

<style >

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
  padding: 10px;
  margin: auto;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}


.userButton{
  
border-style: solid;
border-width: 1px;
border-color: rgb(191, 191, 191);
padding: 3px;
padding-right: 6px;
display: flex;
flex-direction: row;
border-radius: 20px;
max-width:65px;
align-items: center;
cursor: pointer;
background-color: transparent;
}

.userButton:hover {
    background-color: rgb(239, 239, 239);
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


@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;  /* En pantallas pequeñas, se muestran en una sola columna */
  }
}



</style>