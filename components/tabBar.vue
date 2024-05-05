<template>
  <div class="tabbar-container">
      <nav class="tabbar">
          <div
            class="tab-item"
            :class="{ active: activeTab === 1 }"
            @click="handleItemClick(1)"
          >
              <Icon name="solar:home-2-line-duotone" style="font-size:28px; "/>
              <div class="label">Inicio</div>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 2 }"
            @click="handleItemClick(2)"
          >
              <div class="button-plus">+</div>
              <div class="label">Crear</div>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 3 }"
            @click="handleItemClick(3)"
          >
              <Icon name="solar:user-broken" style="font-size:32px; "/>
              <div class="label">Usuario</div>
          </div>
      </nav>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const emit = defineEmits(['onItemSelect']);


function handleItemClick(item) {
  emit('onItemSelect', item);
  haptic('soft');
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




</script>

  
  <style scoped>
  .tabbar-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
   
  }
  .tabbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
   
  }
  .tab-item {
    flex-grow: 1;
    text-align: center;
    padding: 5px 0;
    color: gray; 
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .tab-item.active {
    color: rgb(35, 100, 204); /* color activo */
  }
  .tab-item .icon {
    font-size: 24px;
  }
  .tab-item .label {
    font-size: 12px;
  }
  .button-plus {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-image: linear-gradient(to right, #20C4D6, #0586F0);
    border-radius: 50%;
    color: white;
    font-size: 24px;
    margin-bottom: 5px;
    margin-top: -30px;
  }
  </style>
  