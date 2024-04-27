<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // Asegúrate de importar useRouter
import { Html5Qrcode } from 'html5-qrcode';

const router = useRouter();
const cameraId = ref('');

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  console.log(`QR decoded: ${decodedText}`, decodedResult);
  router.push(`/qr_read/${decodedText}`);
};

let html5QrCode;

onMounted(() => {
  Html5Qrcode.getCameras().then((cameras) => {
    if (cameras.length > 0) {
      // Intenta seleccionar la cámara trasera por defecto
      const rearCamera = cameras.find(camera => /back|rear|trasera/i.test(camera.label));
      if (rearCamera) {
        cameraId.value = rearCamera.id;
      } else {
        // Si no se encuentra una cámara trasera, utiliza la primera disponible
        cameraId.value = cameras[0].id;
      }

      html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCode.start(
        cameraId.value, 
        {
          fps: 10,    // Frames per second
          qrbox: 250  // Tamaño del QR box
        },
        qrCodeSuccessCallback,
        (errorMessage) => {
          console.log(`QR scanning error: ${errorMessage}`);
        }
      ).catch((err) => {
        console.error(`Unable to start QR scanner: ${err}`);
      });
    }
  }).catch((err) => {
    console.error(`Unable to access camera: ${err}`);
  });
});

onUnmounted(() => {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      console.log("QR Scanning stopped.");
    }).catch((err) => {
      console.error(`Unable to stop QR scanner: ${err}`);
    });
  }
});
</script>


<template>
  <div>
    <div id="qr-reader" style=" width:100%; height: 65vh;"></div>
  </div>
</template>


<style>

video{
height: 100%;
}


</style>