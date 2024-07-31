<template>
  
<k-page style="background-color: rgb(247, 247, 247);">

  <div v-if="loading"  class="loadingPage"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
      </div>

  <k-navbar  v-if="rol !== 'user'"
      title=""
      class="top-0 sticky"
      style="background-color: white;"
    >
      
      <template #right>
       
        <div >
         
         <div class="userButton"  @click="openUserPanel">        
          <Icon name="tabler:menu" style="font-size: 26px; "/>
         </div>
  
      </div>
      </template>


      


</k-navbar>


   
  


      <div style="background-color:white; padding: 20px; margin-top: 0px;">
        <div style="height: 60px; width:100%; "> </div>
        <img src="../assets/saintLogo.jpg" alt="Logo" style="max-width: 250px; margin-bottom: 20px;" >
        <div   v-if="userData">Hola  <span style="font-weight: 700;"> {{ userData.name }}  </span>, Bienvenid@ de nuevo  </div> 
    
      </div>

     

<!-- ADMIN type-->  

 <div v-if="rol === 'admin'" class="contenedor">


    <div v-if="divisiones.length > 0">
    <div class="labelapp"> CREA VISTIAS Y REUNIONES </div>

    <k-card v-for="division in divisiones" :key="division.id" @click="goToDivision(division.id)" style="margin-bottom: 15px;">
  <div class="tittle">{{ division.name }}  <Icon name="solar:arrow-right-linear" style="font-size: 17px; "/> <span style="font-size: 15px; color: gray; font-weight: 500;"> {{ division.entidad.name }} </span> </div>

      <div v-if="division.entidad.tipo.id === 1" class="labelType">
        <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }}
      </div>

      <div v-if="division.entidad.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;">
        <img src="../assets/Polygon 3.svg" style="width: 12px; margin-right:6px;">
        {{ division.entidad.tipo.tipo }} 
      </div>
    </k-card>
    </div>

    <div v-if="empresas.length > 0" style="margin-bottom: 90px;">  
      <div class="labelapp" style="margin-top:0px;"> ADMINISTRA TUS UBICACIONES </div>

      <k-card v-for="empresa in empresas" :key="empresa.name"  @click="navegarADetalle(empresa.id)" >
        <div class="tittle">{{ empresa.name }}</div>
        
        <div  v-if="empresa.tipo.id === 1" class="labelType" > 
          <img src="../assets/Polygon 7.svg" style="width: 12px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        <div  v-if="empresa.tipo.id === 2" class="labelType" style="color:#00CDB8; background-color: #E3FFFC;"> 
          <img src="../assets/Polygon 3.svg" style="width: 12px; margin-right:6px;">
          {{ empresa.tipo?.tipo }}
        </div>

        
      </k-card>
    </div>

    </div>
        
<!-- USER type-->  

    <div v-if="rol === 'user'" class="contenedor" style="padding: 0px!important;">


        <div class="centerTittleAction"> 
          <k-block-title style="margin-bottom: 5px; margin-top: 5px;">Próximas Visitas  </k-block-title>
          
          <div style="margin-right: 10px; border-width:0; border-color: red; border-style: hidden;  text-align: center;">
                  <Calendar v-model="filterVisita"  showButtonBar  :manualInput="true" showIcon iconDisplay="input" inputId="icondisplay" />
              </div>              
        </div>

     <div v-if="loading" style="display: flex; width: 100%; justify-content:center;"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
      </div>

            <div style="padding: 10px; margin-bottom: 70px;" v-show="visitas.length  > 0">
                  <div class="card" v-for="visita in visitas" :key="visita.id" @click="navigateToVisita(visita.id)">
                    <p style="font-weight: 700; font-size: 20px; margin-bottom:7px;">{{ visita.nombre }}</p>
                    <p style="font-size: 14px; color: gray;">       <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 7px;" />
                      <span> {{ formatFechaAmigable(visita.fecha) }}</span>
 </p>
                    <p style="font-size: 11px; color: gray; margin-top: 20px; margin-bottom: 10px;"> Participantes</p>

                    <div class="chips-container">
                  <template v-for="(participante) in visita.participantes.slice(0, 3)" :key="participante.id">
                    <Chip class="chip"> 
                      <span class="labelAvatar">{{ participante.persona.nombre[0] }}</span>
                      <span>{{ participante.persona.nombre }}</span>
                    </Chip>
                  </template>
                  <!-- Mostrar cuántos participantes más hay si el total supera a 3 -->
                  <span v-if="visita.participantes.length > 3" class="chip" style="padding: 2px; margin-top: 5px; background-color: white; border-color: white;">
                    +{{ visita.participantes.length - 3 }}
                  </span>
                </div>
                  </div>
           </div>


           <div class="center-content" v-show="visitas.length === 0 && !loading">
                      <Icon name="solar:calendar-add-broken" style="font-size: 40px; color: #4d4d4d; margin-top: 20px; margin-bottom: 10px;" />
                      <p>No tienes visitas agendadas</p>
                      <div class="addUser">
                      </div>
                    </div>


    </div>



<!-- USER Guard-->  

<div v-if="rol === 'guard'" class="contenedor" style="padding: 20px!important;">

  <div class="itemQR"  @click="openScan">
           <div style="background-image: linear-gradient(to right, #20C4D6, #0586F0); padding: 8px; border-radius: 9px; margin-right:10px;">   <Icon name="material-symbols-light:qr-code-scanner" style="font-size: 36px; color: white;"/>  </div> 
           <div  class="itemText" > Escanear visita</div>
        </div>

</div>


<div  v-if="rol !== 'guard' && rol !== 'user' && rol !== 'admin' && !loading">

  <div class="sinPermiso"> 
    <div> Hemos finalizado de configurar el acceso a tu usuario.</div>
   
    <div @click="refreshview" class="refreshB"> <span> 
      <Icon name="ic:baseline-refresh" style="font-size:24px; margin-right: 10px; "/> 
    </span>Confirmar Acceso </div>
  </div>
</div>

  


  <k-popup style="z-index:10000000" :opened="popupOpened"  class="popSmall">
 
        <k-navbar  
              title=""
              small
              isTralucent style="background-color: white;">
              
            <template #left>
              <k-link navbar @click="() => (popupOpened = false)">  <Icon name="solar:close-circle-outline" style="font-size:32px; color: #141515;"/>  </k-link>
            </template>
          </k-navbar>
        
          <div v-if="inviteSended && inviteSended.guard === false" style="padding: 25px;" class="acceptInvitacion">
            <div style="display: flex; justify-content: center; margin-bottom:20px">
              <Icon name="solar:bell-broken" style="font-size:25px; color: #141515;"/>
            </div>

            Has recibido una invitación para administrar <span style="font-weight: 700;">{{ inviteSended.division.name }}</span>
            <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
              <Button @click="rejectInvitation">Rechazar</Button>
              <Button @click="acceptInvitation" class="botonInvitacion" style="margin-left: 20px;">Aceptar Invitación</Button>
            </div>
          </div>


          <div v-if="inviteSended && inviteSended.guard === true" style="padding: 25px;" class="acceptInvitacion">
            <div style="display: flex; justify-content: center; margin-bottom:20px">
              <Icon name="solar:bell-broken" style="font-size:25px; color: #141515;"/>
            </div>  

            Has recibido una invitación ser guardia de  <span style="font-weight: 700;"> {{inviteSended.entidad.name}} </span>
            <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
              <Button @click="acceptInvitationGuard" class="botonInvitacion" style="margin-left: 20px;">Aceptar Invitación</Button>
            </div>
          </div>

         
          
     
        



 </k-popup>

 
 <k-sheet
      class="pb-safe"
      :opened="sheetOpened"
      @backdropclick="() => (sheetOpened = false)"
    >
      
      <k-block   style="min-height: 340px; padding: 20px;  " >

        <p style="margin-bottom: 20px;">
          Selecciona
        </p>

        <div class="itemAcceso"  @click="openAddReunion ">
           <div style="background-color: black; padding: 8px; border-radius: 9px; margin-right:10px;">   <Icon name="solar:add-square-outline" style="font-size: 26px; color: white;"/>  </div> 
           <div  class="itemText" > Crear Visita Nueva </div>
        </div>


        <div @click="openAddPersona"  style="display: flex; padding: 10px; margin-top: 15px; " >
           <div style="margin-right:15px; margin-left: px; ">  <Icon name="solar:user-broken" style="font-size: 26px; color: gray;"/>  </div> 
           <div > Crear Persona  </div>
        </div>
<!-- 
        <div style="display: flex; padding: 10px; margin-top: 6px; margin-bottom: 20px;" >
           <div style="margin-right:15px; margin-left: 5px; ">  <Icon name="solar:case-linear" style="font-size: 22px; color: gray;"/>  </div> 
           <div > Crear Empresa  </div>
        </div>
      -->
     
        <div style="max-width: 100%;"> </div>
      </k-block>
    </k-sheet>
  

    <k-sheet
    :opened="userPanelOpened"
      class="pb-safe"
      @backdropclick="() => (userPanelOpened = false)"
    >
      
      <k-block   style="min-height: 500px; " >



        <div style="padding: 20px;">
            <div class="usertext" >
             
                  <div  v-if="userData" style="font-size: 20px;">{{ userData.name }} </div>
                  <div style="color: rgb(112, 112, 112); margin-bottom: 10px;" v-if="userData">{{ userData.email }}  </div>

                 <!--  <button class="lightButton" style="margin-bottom: 10px;"> Editar perfil </button>  -->

          <div> 

          
      
          <div class="cardRol" v-if="userRol"  style="margin-top:15px" > 

              Permisos asignados 
              <div   style="font-size:20px; margin-top: 7px; font-weight: 700; " >  
                      {{ userRol[0]?.division?.name }}
                      {{ userRol[0]?.tipo }}

                      <div class="flex" style="font-size: 15px; font-weight: 400; margin-top:5px; color:gray " > 
                    <Icon name="material-symbols-light:arrow-forward-rounded" />
                    <div style=" margin-top:-3px" > {{ userRol[0].division?.entidad?.name }} </div>
                    <div style=" margin-top:-3px" > {{ userRol[0].entidad?.name }} </div>

                      </div>
                      
            </div>
      </div> 
    



</div>
                  <button class="logout" @click="logout">Cerrar sesión  </button>
                  <div st> {{ version }}</div>



                </div>
          </div>
     
        <div style="max-width: 100%;"> </div>
      </k-block>
    </k-sheet>

</k-page>




<tab-bar style="z-index: 32000;" @onItemSelect="handleItemSelect" v-if="showtab" />

</template>

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


<script setup>
import supabase from "../db/supabaseClient";
import { useRouter } from "vue-router";
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ref, watch, onMounted } from 'vue';
import OverlayPanel from "primevue/overlaypanel";
import { defineProps, defineEmits } from 'vue'
import TabBar from '../components/tabBar.vue';
import axios from 'axios';



const emit = defineEmits(['update:activeTab'])


const router = useRouter();
const store = useStore();
const isAuthenticated = computed(() => store.state.isAuthenticated);
const authToken = ref('');
const userUUID = ref('');
const userData = ref(null);
const clientData = ref(null); 
const projectData = ref(null);
const userMenu = ref(null);
const userPanelOpened = ref(false);
const empresas = ref([]);
const divisiones = ref([]);
const popupOpened = ref(false);
const inviteSended = ref(null);
const sheetOpened = ref(false);
const visitas = ref([]);
const filterVisita = ref((''));
const loading = ref(false);
const showtab = ref(false);
const userRol= ref(null);
const version = ref ('0.8.1  31-07-24');
const userRolesById = ref([]);
const playerID = ref ('')
const userDataID = ref ('')

const rol = ref(null);




function handleItemSelect(item) {
  if (item === 3) {
    openUserPanel();
    sheetOpened.value = false;

  }else if (item === 1) {
    userPanelOpened.value = false; 
    sheetOpened.value = false;

  }else if (item === 2) {
    userPanelOpened.value = false; 
    sheetOpened.value = true;
  }
}


function formatFechaAmigable(fechaString) {
  if (!fechaString) return 'Cargando fecha...';
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }) + ' ' + fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
}



function ajustarFechaZonaHoraria(fecha) {
  const fechaUTC = new Date(fecha);
  const offset = fechaUTC.getTimezoneOffset() * 60000; // Convertir offset a milisegundos
  const fechaCST = new Date(fechaUTC.getTime() - offset - (3600000 * 6)); // Ajustar a zona horaria -6
  return fechaCST.toISOString().split('T')[0];
}




async function fetchInviteSended() { 
  if (!userData.value.email) {
    console.error("Email del usuario no disponible.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('invitacion')
      .select('*,division(*),entidad(*)')
      .eq('estado', 'enviada')
      .eq('email', userData.value.email)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      inviteSended.value = data;
      popupOpened.value = true;
    }
  } catch (error) {
    console.error('Error al buscar la invitación enviada:', error);
    inviteSended.value = null;
    popupOpened.value = false;
  }
}


onMounted(async () => {
  loading.value = true;
  userUUID.value = localStorage.getItem('userUUID') || '';
  playerID.value = localStorage.getItem('playerId') || '';

 console.log('playerStorage', playerID)

  if (userUUID.value) {

    const { data: userDataResponse, error: userError } = await supabase
      .from('userData')
      .select('name, email, id')
      .eq('user_id', userUUID.value);


    if (userError) {
      console.error('Error al obtener datos de usuario:', userError);
      refreshview();
    } else {
      userData.value = userDataResponse[0];
      userDataID.value = userDataResponse[0].id;
    
      await fetchInviteSended();

    }

    const { data: userRoles, error: rolesError } = await supabase
      .from('userRoles')
      .select('entidad(*, tipo(tipo,id))')
      .eq('user', userUUID.value)
      .eq('rol', 2);
      

      console.log('userRoles:', userRoles);

      if (rolesError) {
      console.error('Error obteniendo roles del usuario:', rolesError);
      console();
    } else {
      empresas.value = userRoles.filter(role => role.entidad !== null).map(role => role.entidad);
      
    }

    

    const { data: userRolesDivision, error: rolesErrorDivision } = await supabase
      .from('userRoles')
      .select('*, division(*,entidad(*,tipo(tipo,id)))')
      .eq('user', userUUID.value)
      .eq('rol', 3);
      ;

      console.log('userDivision:', userRolesDivision);
     

      if (rolesErrorDivision) {
        console.error('Error obteniendo roles de la división:', rolesErrorDivision);
      } else {
        divisiones.value = userRolesDivision.map(role => role.division).filter(division => division !== null);
      
    }

    await cargarRolesUsuario();
          

    if (empresas.value.length === 0 && divisiones.value.length === 0 && userRol.value.length === 0) {
            rol.value = 'empty';
        } else if (empresas.value.length === 0 && divisiones.value.length === 0 && userRol.value.length > 0) {
            rol.value = 'guard';
        } else if (empresas.value.length > 0 || divisiones.value.length > 1) {
            rol.value = 'admin';
        } else if (empresas.value.length === 0 || divisiones.value.length === 1) {
            rol.value = 'user';
        }

          console.log('Rol asignado:', rol.value);

          if (rol.value === 'user') {
             showtab.value = true;
            } else {
              showtab.value = false;
            }



          await cargarVisita();
         
          rolesByUsuario();

          loading.value = false;
          updateUserData(userDataID, playerID);
          insertPlayerId(playerID);
          
  }
 

  
  

});



async function cargarRolesUsuario() {
  const { data: userRoles, error: rolesError } = await supabase
    .from('userRoles')
    .select('entidad(*, tipo(tipo,id))')
    .eq('user', userUUID.value)
    .eq('rol', 4);


  if (rolesError) {
    console.error('Error obteniendo roles del usuario:', rolesError);
  } else {
    userRol.value = userRoles.filter(role => role.entidad !== null).map(role => role.entidad);


  }
}


async function rolesByUsuario() {
  const { data: userRoles, error: rolesError } = await supabase
    .from('userRoles')
    .select(' *, division(*, entidad(*)), entidad(*)')
    .eq('user', userUUID.value)
    

  if (rolesError) {
    console.error('Error obteniendo roles del usuario:', rolesError);
  } else {
    userRol.value = userRoles
console.log('userRol by user', userRol )
  }
}


async function cargarParticipantes(visitaId) {
  try {
    const { data, error } = await supabase
      .from('participantes') 
      .select('*,persona(*)')
      .eq('visita', visitaId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al cargar los participantes:', error.message);
    return []; 
  }
}

watch(filterVisita, async () => {
  await cargarVisita();
}, { immediate: true });



async function cargarVisita() {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establece la hora al inicio del día
    const fechaHoy = hoy.toISOString().split('T')[0];

    let consulta = supabase
      .from('visita')
      .select('*')
      .eq('division', divisiones.value[0].id);

    // Si no hay una fecha específica en el filtro, aplica el filtro para mostrar solo visitas futuras.
    if (!filterVisita.value) {
      consulta = consulta.gte('fecha', fechaHoy);
    }

    const { data, error } = await consulta;

    if (error) throw error;

    let visitasFiltradas = data;
    if (filterVisita.value) {
      const fechaFiltro = new Date(filterVisita.value).toISOString().split('T')[0];
      // Filtra las visitas por la fecha especificada en el filtro.
      visitasFiltradas = data.filter(visita => new Date(visita.fecha).toISOString().split('T')[0] === fechaFiltro);
    }

    // Ordenar visitas filtradas por fecha, de la más cercana a la más lejana
    visitasFiltradas.sort((a, b) => {
      return new Date(a.fecha) - new Date(b.fecha);
    });

    // Cargar participantes para cada visita filtrada
    for (const visita of visitasFiltradas) {
      visita.participantes = await cargarParticipantes(visita.id);
    }

    // Actualizar el estado con las visitas filtradas
    visitas.value = visitasFiltradas;
    haptic('medium');
    console.log('Visitas y participantes cargados:', visitas);
  } catch (error) {
    console.error('Error al cargar las visitas y participantes:', error.message);
  }
}
  


function haptic(style) {
  try {
    window.webkit.messageHandlers.connectHandler.postMessage({
      action: 'haptic',
      style: style
    });
    console.log('Haptic ejecutado con estilo:', style);
  } catch (error) {
    console.error("El manejador de mensajes de iOS no está disponible.", error);
  }
}


function openUserPanel() {
  userPanelOpened.value = true;
  haptic('soft')

}

function navigateToVisita(visitaId) {
  router.push(`/visita/${visitaId}`);
  haptic('medium');

}

function navegarADetalle(id) {
  router.push(`/entidad/${id}`);
  haptic('medium');

}

function goToDivision(id) {
  router.push(`/division/${id}`);
  haptic('medium');

}


// Función de logout
function logout() {
  supabase.auth.signOut();
  localStorage.removeItem('authToken');
  localStorage.removeItem('userUUID');
  store.dispatch('clearAuthentication');
  router.push('/login');
  haptic(error);

}



function getFechaInicialZonaHoraria(desfaseHorario = -6) {
  const ahoraUTC = new Date();

  const desfaseEnMilisegundos = desfaseHorario * 60 * 60 * 1000;

  const fechaZonaHoraria = new Date(ahoraUTC.getTime() + desfaseEnMilisegundos);

  return fechaZonaHoraria.toISOString().split('T')[0];
}
function handleProjectClick(uuid,id) {
  router.push(`/${uuid}/prime?id=${id}`);
}

function toggleUserMenu() {
  if (userMenu.value) {
    userMenu.value.toggle(event);
    haptic('soft');

  }
}

async function acceptInvitation() {
  if (!inviteSended.value || !userUUID.value) {
    console.error("Datos necesarios para aceptar la invitación no están disponibles.");
    return;
  }

  const { data: updatedInvite, error: updateError } = await supabase
    .from('invitacion')
    .update({ estado: 'aceptada' }) 
    .eq('id', inviteSended.value.id); 

  if (updateError) {
    console.error('Error al actualizar la invitación:', updateError);
    return;
  }

  console.log('Invitación actualizada:', updatedInvite);

  const { data: newUserRole, error: createUserRoleError } = await supabase
    .from('userRoles')
    .insert([
      {
        user: userUUID.value,
        rol: 3,
        division: inviteSended.value.division.id,
        userData: userData.value.id,
      },
    ]);

  if (createUserRoleError) {
    console.error('Error al crear el rol de usuario:', createUserRoleError);
    return;
  }


   const { data: userRolesDivision, error: rolesErrorDivision } = await supabase
      .from('userRoles')
      .select('*, division(*,entidad(*,tipo(tipo,id)))')
      .eq('user', userUUID.value)
      .eq('rol', 3);
      ;

      console.log('userDivision:', userRolesDivision);
      console.log(JSON.stringify(userRolesDivision, null, 3));

      if (rolesErrorDivision) {
        console.error('Error obteniendo roles de la división:', rolesErrorDivision);
      } else {
        divisiones.value = userRolesDivision.map(role => role.division).filter(division => division !== null);
      
    }
    haptic('medium');

    popupOpened.value = false;
    refreshData ();
    refreshview();
}

async function acceptInvitationGuard() {
  if (!inviteSended.value || !userUUID.value) {
    console.error("Datos necesarios para aceptar la invitación no están disponibles.");
    return;
  }

  const { data: updatedInvite, error: updateError } = await supabase
    .from('invitacion')
    .update({ estado: 'aceptada' }) 
    .eq('id', inviteSended.value.id); 

  if (updateError) {
    console.error('Error al actualizar la invitación:', updateError);
    return;
  }

  console.log('Invitación actualizada:', updatedInvite);

  const { data: newUserRole, error: createUserRoleError } = await supabase
    .from('userRoles')
    .insert([
      {
        user: userUUID.value,
        rol: 4,
        entidad: inviteSended.value.entidad.id,
        userData: userData.value.id,
      },
    ]);

  if (createUserRoleError) {
    console.error('Error al crear el rol de usuario:', createUserRoleError);
    return;
  }

    haptic('medium');

    popupOpened.value = false;
    refreshData ();
    refreshview ();
}


async function rejectInvitation() {
  if (!inviteSended.value || !inviteSended.value.id) {
    console.error("No hay una invitación seleccionada para rechazar.");
    return;
  }

  try {
    const { data: updatedInvite, error: updateError } = await supabase
      .from('invitacion')
      .update({ estado: 'rechazada' }) 
      .eq('id', inviteSended.value.id);

    if (updateError) {
      console.error('Error al actualizar la invitación:', updateError);
      return;
    }

    console.log('Invitación actualizada a rechazada:', updatedInvite);
    popupOpened.value = false;
  } catch (error) {
    console.error('Error al rechazar la invitación:', error);
  }
}


function openAddReunion() {
  if (divisiones.value.length > 0 && divisiones.value[0].id) {
    router.push({ path: `/add_reunion/${divisiones.value[0].id}` });
    haptic(medium);

  } else {
    console.error("No hay divisiones disponibles para crear una reunión.");
  }
}

function openAddPersona() {
  if (divisiones.value.length > 0 && divisiones.value[0].id) {
    router.push({ path: `/add_persona/${divisiones.value[0].id}` });
    haptic('medium');

  } else {
    console.error("No hay divisiones disponibles para crear una reunión.");
  }
}

const refreshview = () => {
    window.location.reload();
    haptic('medium');

};

function openScan() {
  router.push('/scan');
  haptic('medium');

}

async function insertPlayerId(playerID) {
console.log('user data', userData.value.id)
  const player_id = playerID._value;
  if (!player_id) {
    console.error('El valor de player_id está vacío o es inválido.');
    return null; 
  }

  const { data, error } = await supabase
    .from('playerId')
    .insert([
      { player_id: player_id,
        user: userData.value.id  }
    ]);

  if (error) {
    console.error('Error insertando en la tabla playerId:', error);
    return null;
  }
  return data;
}


async function updateUserData(userDataID, playerID) {
  const player_id = playerID._value;

    const { data, error } = await supabase
        .from('userData')
        .update({ player_id: player_id})
        .eq('id', userDataID.value);
    if (error) {
        console.error('Error actualizando la tabla userData:', error);
       
        return null;
    }
    return data;
}


const sendPushNotification = async () => {
  try {
    const { data, error } = await $fetch('/api/send-push-notification', {
      method: 'POST',
      body: {
        playerIds,
        pushTitle,
        pushContent,
      },
    });

    if (error.value) {
      console.error('Error al enviar la notificación push:', error.value);
    } else {
      console.log('Notificación push enviada con éxito:', data.value);
    }
  } catch (error) {
    console.error('Error al enviar la notificación push:', error);
  }
};


function refreshData() {
  const { nuxt } = useNuxtApp();
  nuxt.refresh();
  haptic('hard')
}





const pushSend = async (pushTitle, pushContent, playerIDs) => {
  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: "0cad61c6-60db-4baf-94ed-02e0b602dcc6",
      include_subscription_ids: playerIDs,
      headings: { en: pushTitle },
      contents: { en: pushContent }
    }, {
      headers: {
        'Authorization': 'Basic ZjRhYzliOTEtZTI2OS00ODA4LWI1ZjYtNjY0NjkyMDBmNzI4',
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


</script>

<style >

.w-72{
width: 100%;
}
.labelType{
  font-size: 12px; 
  font-weight: 150;
  display: flex;
  color: #006EAB;
  background-color: #DFF4FF;
  font-weight: 500;
  max-width: fit-content;
  padding: 5px;
  border-radius: 10px;
  padding-right: 10px;
}



.tittle{
  font-size: 18px; 
  font-weight: 600;
  margin-bottom: 10px;
}

.bg-ios-light-surface-1{
  margin: 0px;
  margin-bottom: 12px;
}


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
  padding: 20px;
  margin: auto;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

.acceptInvitacion{
  margin: auto;
  margin-top: 20px;
  padding: 10px;
  width: 90%;
  background-color: #fafafa; 
  border-width: 1px; 
  border-color: #eaeaeacb;
  border-style: solid;
  border-radius: 10px;
}

.userButton{
border-style: none;
border-width: 1px;
padding: 3px;
padding-right: 6px;
display: flex;
flex-direction: row;
border-radius: 20px;
max-width:85px;
align-items: center;
cursor: pointer;
background-color: transparent;
}

.botonInvitacion {
font-size: 12px;
padding: 10px;
border-radius: 7px;
color:white;
  background-color: rgb(0, 0, 0);
}

.centerTittleAction{
  display: flex;
  align-items: center;
  justify-content:space-between ;
  margin-top: 20px;
  margin-bottom: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.itemAcceso{
  display:flex;  
  border-color:rgb(207, 207, 207); 
  border-width:1px; 
  border-radius: 5px; 
  border-style: solid; 
  padding: 10px;
}

.itemQR{
  display:flex;  
  border-color:rgb(231, 231, 231); 
  border-width:1px; 
  border-radius: 5px; 
  border-style: solid; 
  padding: 10px;
  background-color: white;
  
}

.itemText{
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
}


.popSmall{
  height: 40vh;
  top: 80vh;
  z-index: 100000000;
}


@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;  /* En pantallas pequeñas, se muestran en una sola columna */
  }
}



.pb-safe{
  width: 100%;
}


</style>