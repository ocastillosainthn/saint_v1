<template>

  <div id="my-dropzone" class="dropzone"></div>
  <div style="display: none;" class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-success-mark"><span  class="dz-upload" data-dz-uploadprogress > </span></div>
  <div class="dz-error-mark"><span  class="dz-upload" data-dz-uploadprogress></span></div>
</template>

<script>
import Dropzone from 'dropzone';
import supabase from "../db/supabaseClient";
import { v4 as uuidv4 } from 'uuid';
import "dropzone/dist/dropzone.css";


export default {
  props: {
    selectedRowData: Object,
    columnName: String,
    selectedTableName: String,
    isColumnArray: Boolean

  },
  
  mounted() {
    const myDropzone = new Dropzone("#my-dropzone", {
      url: "#", 
      autoProcessQueue: false,
      createImageThumbnails: true,
      maxFiles:2,

      //addRemoveLinks: true,
    });

    myDropzone.on("addedfile", async (file) => {
      file.previewElement.querySelector(".dz-progress").style.opacity = "1";

      try {
        const cleanedFileName = file.name.replace(/[^a-zA-Z0-9-_\.]/g, '_');
        const uniqueFileName = `${uuidv4()}-${cleanedFileName}`;
        const filePath = `cms/${uniqueFileName}`;

        // Subir archivo al storage de Supabase
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('storage')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Construir URL pública directamente
        const fileUrl = `https://wurdxmrnpdfgvgkzystf.supabase.co/storage/v1/object/public/storage/${filePath}`;

        // Crear registro en la tabla 'storage'
        const { error: storageError } = await supabase
          .from('storage')
          .insert([{ name: file.name, url: fileUrl, meta_data: JSON.stringify({ size: file.size, type: file.type }) }]);

            if (storageError) throw storageError;

            // Recuperar el registro recién creado desde 'storage'
            const { data: retrievedStorageData, error: retrievalError } = await supabase
              .from('storage')
              .select('*')
              .eq('url', fileUrl);

            if (retrievalError) throw retrievalError;

            // Verificar que se han recuperado datos
            if (retrievedStorageData && retrievedStorageData.length > 0) {
              const storageRecordId = retrievedStorageData[0].id;

              // Actualizar registro en la tabla seleccionada
              const { error: updateError } = await supabase
                .from(this.selectedTableName)
                .update({ [this.columnName]: storageRecordId })
                .match({ id: this.selectedRowData.id });

              if (updateError) throw updateError;
              console.log("Registro actualizado con éxito en la tabla:", this.selectedTableName);
            } else {
              console.error("No se pudo recuperar el registro después de la inserción en 'storage'");
            }
        } catch (error) {
         console.error("Error en la subida del archivo o creación del registro en 'storage':", error);
      }
      
    });
  
    myDropzone.on("sending", function(file) {
      // Mostrar algún tipo de loader o indicador de progreso
      console.log("Cargando:", file.name);
    });

    myDropzone.on("uploadprogress", function(file, progress) {
      // Actualizar la interfaz con el progreso
      file.previewElement.querySelector(".dz-progress").style.width = progress + '%';
    });

    // Ocultar loader y mostrar mensaje de éxito al completar
    myDropzone.on("complete", function(file) {
      file.previewElement.querySelector(".dz-progress").style.opacity = "0";
      if (file.status === Dropzone.SUCCESS) {
    console.log("Archivo cargado con éxito:", file.name);
    if (file.previewElement) {
      setTimeout(function() { 
        file.previewElement.classList.add("dz-complete");
        file.previewElement.querySelector(".dz-progress").style.opacity = "0";
      }, 1000); // ajusta este tiempo según tus necesidades
    }

      }
    
  
   });

}}
</script>

<style>
.tableImage {
    border-color: rgb(236, 236, 236);
    border-left-width: 0px;
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-style: solid;
    height: 50px;
    min-width: 40%;
}

.tableImageD {
    border-color: rgb(236, 236, 236);
    border-left-width: 1px;
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-style: solid;
    height: 50px;
    min-width: 60%;
}

::placeholder {
    color: rgb(191, 191, 191);
}

.dz-upload {
    width: 100%!important; 
    height: 100%!important;
    background: rgb(96, 36, 216); /* Color del indicador de progreso */
    transition: width 0.3s ease-in-out;
}

.dz-complete .dz-upload {
    width: 100%!important;
}

</style>
