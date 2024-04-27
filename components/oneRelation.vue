<template>

<div>
          <div @click="toggleTables" style="cursor: pointer;">
            <span style="font-size: 16px; font-weight: 350; margin-left: 10px">
              {{ selectedTableName }}
            </span>
            <Icon name="quill:expand" style="
                font-size: 15px; margin-top: -3px; margin-left: 1px; margin-right: 10px;" />
          </div>
        </div>

<!-- Seleccionar Tabla -->

        <OverlayPanel ref="relation">

          <div>
            <div style="font-size: 12px; margin-bottom: 10px; ">
              Selecciona Tabla
              <div style="margin-top: 4px">
                <Listbox
                  v-model="selectedTableName"
                  :options="tables"
                  filter
                  optionLabel=""
                  style="
                    font-size: 13px;
                    max-height: 350px;
                    width: 300px;
                    overflow-y: scroll;
                  "
                />
              </div>
            </div>
          </div>
        </OverlayPanel>

</template>

<script>

import supabase from "../db/supabaseClient";
import { v4 as uuidv4 } from 'uuid';


export default {



mounted() {


}
}


</script>
