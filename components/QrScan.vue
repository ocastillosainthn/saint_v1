<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const cameraId = ref('');
const cameras = ref([]);
const loading = ref(false);


const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  loading.value = true

  console.log(`QR decoded: ${decodedText}`, decodedResult);
  const fullUrl = `/qr_read/${decodedText}`;
  console.log('URL:', fullUrl );

  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      console.log("QR scanning stopped, navigating to:", fullUrl);
      window.location.href = fullUrl;
    }).catch(err => {
      console.error("Error stopping QR scanner:", err);
      window.location.href = fullUrl; 
    });
  } else {
    window.location.href = fullUrl; 
  }
};

let html5QrCode;

onMounted(() => {
  Html5Qrcode.getCameras().then((devices) => {
    cameras.value = devices;
    const rearCamera = cameras.value.find(camera => /back|rear|trasera/i.test(camera.label));
    cameraId.value = rearCamera ? rearCamera.id : cameras.value[0].id;
    startScanning();
  });
});  

function startScanning() {
  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start(
    cameraId.value, 
    { fps: 20, qrbox: 250 },
    qrCodeSuccessCallback,
    errorMessage => console.error(`QR scanning error: ${errorMessage}`)
  ).catch(err => console.error(`Unable to start QR scanner: ${err}`));
}

function switchCamera() {
  if (html5QrCode && cameras.value.length > 1) {
    let index = cameras.value.findIndex(cam => cam.id === cameraId.value);
    index = (index + 1) % cameras.value.length;
    cameraId.value = cameras.value[index].id;
    html5QrCode.stop().then(() => {
      console.log("Switching cameras");
      startScanning();
    });
  }
}

onUnmounted(() => {
  if (html5QrCode) {
    html5QrCode.stop().catch(err => console.error(`Unable to stop QR scanner: ${err}`));
  }
});
</script>



<template>

<div v-if="loading"  class="loadingPage"> 
        <k-preloader  style="display: flex;" size="w-5 h-5" />
      </div>

  <div>
    <div id="qr-reader" style=" width:100%; height: 65vh;"></div>
    <div class="cameraContainer" style="margin: 10px; display: flex; color:white;"> 

<div style="display:flex; width: 100%; justify-content: center; "> 
     <div class="cameraB" @click="switchCamera" >
      <span>     <Icon name="material-symbols:flip-camera-ios-outline-rounded"  style="font-size:28px; color: white; "/></span>
      Cambiar Cámaras</div>
    </div>
  </div>
  </div>
</template>


<style>

video{
height: 100%;
}


</style>