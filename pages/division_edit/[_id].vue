<template>
  <k-page v-if="division" style="background-color: rgb(247, 247, 247);">
    <k-navbar 
      :title="division.name"
      small
      class="top-0 sticky"
      style="background-color: white;"
    >
      <template #left>
        <k-navbar-back-link text="" @click="goBack" />
      </template>
    </k-navbar>
 
    <div> 
  
    </div>
<div class="container">
Formulario para editar vision + Agregar usuario 
</div>

  </k-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import supabase from "../db/supabaseClient";

const route = useRoute();
const router = useRouter();
const division = ref(null);
const searchQuery = ref('');

onMounted(async () => {
  const divisionId = route.params._id;
  await cargarDivision(divisionId);
});

async function cargarDivision(divisionId) {
  if (!divisionId) return;

  try {
    const { data, error } = await supabase
      .from('division')
      .select('*,entidad(*,tipo(tipo,id))')
      .eq('id', divisionId)
      .single();

    if (error) throw error;
    division.value = data;
  } catch (error) {
    console.error('Error al obtener la división:', error);
  }
}

function goBack() {
  router.back();
}
</script>

<script>
import { kPage, kNavbar, kNavbarBackLink, kSearchbar } from 'konsta/vue';

export default {
  components: {
    kPage,
    kNavbar,
    kNavbarBackLink,
    kSearchbar,
  },
};
</script>

<style>
.container {
  padding: 20px;
}
</style>
