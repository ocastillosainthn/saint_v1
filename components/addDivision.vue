<template>



hola {{ entidadId }}


    <div style="height: 100vh; padding: 25px;">
      <k-list>
        <div class="input-group">
        </div>
        <div class="input-group">
          <k-list-input
            style="margin: 0px!important;"
            outline
            v-model="email"
            label="Nombre"
            type="text"
            id="name"
            required
            placeholder="Escribe el nombre"
          />
        </div>
      
      </k-list>
      <k-button @click="testInputs" type="submit" label="Crear nueva" style="width: 100%; height:50px!important; background-image: linear-gradient(to right, #20C4D6, #0586F0);">
      </k-button>
    </div>
  </template>
  

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




    },

    
  
  };
</script>


  <script setup>
  import { ref } from 'vue';
  import supabase from "../db/supabaseClient"; 


  const props = defineProps({
  entidadId: Number
});
  const name = ref('');
  
 
  async function addDivision() {
    
  const { data, error } = await supabase
    .from('division')
    .insert([
      { name: name.value, entidad: props.entidadId }
    ]);

  if (error) {
    console.error('Error al insertar en Supabase:', error);
  } else {
    console.log('Inserción exitosa:', data);
  }
}



  </script>
  
  <style scoped>
  /* Tus estilos específicos del componente aquí */
  </style>
  