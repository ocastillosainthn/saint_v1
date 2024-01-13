<template>
  <div class="container">

    <div class="leftBar" style="display: flex">
      <div class="tablesList" style="display: none">
        <ul class="my-custom-list">
          <li v-for="table in tables" :key="table" @click="selectTable(table)">
            <i class="pi pi-table"></i> {{ table }}
          </li>
        </ul>
      </div>
    </div>

    <div class="tableD">
      <div class="header">
        <div
          class="headerLine"
        >
          <div style="display: flex; align-items: center;">
            <!-- <div> <Icon name="teenyicons:database-solid" style="font-size: 14px; margin-right: 10px;"/> </div> -->
            <div style="font-size: 16px; font-weight: 350; margin-right: 10px">
              Tabla
            </div>
            /
          </div>
          <div @click="toggleTables" style="cursor: pointer;">
            <span style="font-size: 16px; font-weight: 350; margin-left: 10px">
              {{ selectedTableName }}
            </span>
            <Icon name="quill:expand" style="
                font-size: 15px; margin-top: -3px; margin-left: 1px; margin-right: 10px;" />
          </div>
        </div>

<!-- Seleccionar Tabla -->

        <OverlayPanel ref="tables">

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

        <div style="height: 40px; display: flex; align-items: center;">

          <Button
            type="button"
            label="Recargar"
            iconPos="left"
            size="small"
            class="p-button-text"
            @click="reloadData"
          >
            <span v-if="loading">
              <Icon
                name="svg-spinners:bars-rotate-fade"
                style="font-size: 15px; margin-right: 10px"
              />
            </span>
            <span v-else>
              <Icon
                name="uil:spinner-alt"
                style="font-size: 15px; margin-right: 10px"
              />
            </span>
            Recargar
          </Button>

          <Button
            icon="pi pi-table"
            type="button"
            label="Columnas"
            iconPos="left"
            size="small"
            class="p-button-text"
            @click="toggleColumn"
          />

          <OverlayPanel ref="column">
            <div>opciones de columna <Icon name="ph:text-t-thin" /></div>
          </OverlayPanel>

          <Button
            icon="pi pi-filter"
            type="button"
            label="Filtrar"
            iconPos="left"
            size="small"
            class="p-button-text"
            @click="toggleFilter"
          />
          <OverlayPanel ref="filter">
            <div>Selecciona filtro</div>
          </OverlayPanel>

  <!-- Tab AGregar items -->

          <Button v-if="selectedTableName"
            size="small"
            style="padding-right: 14px;"
            class="p-button-text, customActionButton"
            @click="toggleAdd"
          >  <Icon
                name="material-symbols-light:add-rounded"
                style="font-size: 20px; margin-right: 5px"
              /> Agregar </Button>

          <OverlayPanel ref="add">
            <div @click="toggleNewItemSidebar" class="itemAgregar" style="cursor: pointer;">
              <Icon
                name="bx:columns"
                style="font-size: 18px; margin-right: 10px"
              />
              Insertar
              <span style="font-weight: 600">{{ selectedTableName }}</span>
            </div>



            <div @click="toggleAddColumnSidebar" style="font-size: 13px; cursor: pointer;" >
              <Icon name="clarity:view-columns-line" style="font-size: 18px; margin-right: 10px"
              />
              Agregar Columna
            </div>

          </OverlayPanel>
        </div>

        <!--
            Filtrar de   <Calendar showButtonBar style="max-width:125px; margin-right:10px; padding: 0px; font-size:11px; height:33px; border-color: rgba(241, 241, 241, 0.64); " v-model="startDate" showIcon iconDisplay="input"  />  
            hasta   <Calendar showButtonBar style="max-width:125px; padding: 0px; font-size:11px; height:33px;" v-model="endDate" showIcon iconDisplay="input" />
            <Button label="Descargar" @click="downloadCSV"  icon="pi pi-download" iconPos="right" size="small" style="height: 33px; font-size: 12px; font-weight: 100;"></Button>
          
          -->
      </div>

  <!-- Data Table primevue -->
      <DataTable
        v-model:selection="selectedProduct"
        v-if="columns.length > 0"
        selectionMode="single"
        :value="products"
        showGridlines
        size="normal"
        sortField="Id"
        :sortOrder="-1"
        :scrollable="true"
        scrollHeight="85vh"
        :virtualScrollerOptions="{ itemSize: 30 }"
        resizableColumns
        columnResizeMode="expand"
        tableStyle="min-width:50rem; font-size: 12px;"
        editMode="cell"
        @row-click="onRowClick($event)"
      >
        <Column
          header="#"
          :sortable="false"
          :frozen="true"
          style="
            min-width: 70px;
            z-index: 100;
            border-right-color: rgb(233, 233, 233);
            border-right-style: solid;
            border-right-width: 1px;
          "
        >
          <template v-slot:body="slotProps">
            {{ slotProps.data.index }}
            <Icon
              name="system-uicons:expand"
              class="row-hover-icon"
              :style="{
                opacity: slotProps.rowIndex === hoveredRowIndex ? 1 : 0,
              }"
            />
          </template>
        </Column>

        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :frozen="col.frozen"
          :class="col.class"
          :editable="col.editable"
          :editor="col.editor"
          style="max-width: 500px"
        >
          <template v-slot:body="slotProps">
            <template v-if="col.isBoolean">
              <Checkbox
                v-model="slotProps.data[col.field]"
                style="margin-left: 10px"
                :binary="true"
              />
            </template>

            <!-- Renderizar el valor del campo si no es booleano -->
            <template v-else>
              {{ slotProps.data[col.field] }}

              <Icon
                name="system-uicons:expand"
                class="row-hover-icon"
                :style="{
                  opacity: slotProps.rowIndex === hoveredRowIndex ? 1 : 0,
                }"
              />
            </template>
          </template>
        </Column>

        <template #footer>
          <div
            style="
              display: flex;
              flex-direction: row;
              font-size: 13px;
              font-weight: 500;
              align-items: center;
              justify-content: left;
            "
          >
            <Paginator
              :rows="100"
              :totalRecords="totalRecords"
              :rowsPerPageOptions="[100, 500, 1000]"
              :pageLinkSize="3"
              @page="onPageChange"
            >
            </Paginator>
            <span
              class="p-paginator-pag"
              style="display: flex; align-items: center; justify-content: left"
            >
              {{ totalRecords }} registros
              <ProgressSpinner
                v-if="loading"
                style="width: 30px; border-width: 5px; height: 15px"
                strokeWidth="6"
                animationDuration=".6s"
              />
            </span>
          </div>
        </template>
      </DataTable>

      <!--  NO HAY TALBA  -->

<div @click="toggleTables"  v-if="selectedTableName === null"  style="display: flex; max-width:fit-content; padding:20px; margin:auto; font-size: 13px; border-color: rgb(234, 234, 234); border-width: 1px; border-style: solid;" >  
 <Icon name="codicon:empty-window" style="font-size: 18px; margin-right: 10px"
       />
       Selecciona tabla
</div>


      <!--
        //  <div v-else> <ProgressSpinner style="width:30px; border-width:5px; height:25px;" strokeWidth="6" animationDuration=".6s"/> </div>
      -->

    </div>
  </div>

  <!-- Slide Editar -->

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    :style="{ width: '50%' }"
  >
    <!-- Encabezado personalizado con estilos -->

    <template #header>
      <h3 style="font-weight: 300; font-size: 15px; padding: 0px">
        {{ currentMode === 'editar' ? 'Editar' : 'Insertar' }} fila desde

        <Tag :value="this.selectedTableName" class="custom-tag"> </Tag>
      </h3>
    </template>

    <!-- Contenido del Sidebar -->

    <form
    @submit.prevent="currentMode === 'editar' ? saveChanges() : addNewRow()"
      style="font-weight: 300; font-size: 14px; padding: 10px; padding-top: 0px"
    >
      <div v-for="key in getFilteredRowDataKeys()" :key="key">
        <div class="formItem">
          <div
            style="
              min-width: 250px;
              display: flex;
              flex-direction: row;
              margin-bottom: 7px;
              align-items: center;
            "
          >
            <div style="font-size: 11px">{{ key }}</div>
            <div
              style="
                font-size: 9px;
                color: rgb(165, 165, 165);
                margin-left: 7px;
              "
            >
              {{ getColumnDetail(key).data_type }} /   {{ getColumnDetail(key).description }}
            </div>
          </div>

          <div style="width: 100%">

        <template v-if="!(currentMode === 'crear' && (key === 'id' || key === 'created_at' || key === 'update' || key === 'uuid' || key === 'created'))" >
         
          <InputText v-if="getColumnDetail(key).description === 'Texto plano'" class="inputInside" :id="key" v-model="formData[key]" 
          :disabled="currentMode !== 'crear' && (key === 'uuid')" />
          <Textarea v-if="getColumnDetail(key).description === 'Texto plano extendido'" class="inputInside" :id="key" v-model="formData[key]" autoResize rows="2" cols="30"  />
          <InputNumber v-if="getColumnDetail(key).description === 'Número'"  :id="key" v-model="formData[key]"/>

          <InputNumber v-if="getColumnDetail(key).description === 'Decimal'"
             class="inputInside" :id="key"  v-model="formData[key]"  :useGrouping="false"  :minFractionDigits="2" :maxFractionDigits="4" />


          <Calendar v-if="getColumnDetail(key).description === 'Fecha'"
            :id="key"
            v-model="formData[key]"
            showTime
            hourFormat="12"
            showIcon
            iconDisplay="input"
            :disabled="currentMode !== 'crear' && (key === 'created_at' || key === 'updated' || key === 'updated_at')">
          </Calendar>

        

          <div v-if="getColumnDetail(key).description === 'Imágen'">
          
            <uploadImage 
            :selectedRowData="selectedRowData" 
            :columnName="key"
            :selectedTableName="selectedTableName"
            >
            </uploadImage>
          </div>

          <div v-if="getColumnDetail(key).description === 'Relación única'">
          
            <oneRelation 
            :selectedRowData="selectedRowData" 
            :columnName="key"
            :selectedTableName="selectedTableName"
            >
            </oneRelation>
          </div>



          </template>


          </div>
        </div>
      </div>

      <Button label="Guardar" @click="currentMode === 'editar' ? saveChanges() : addNewRow()">{{ currentMode === 'editar' ? 'Guardar' : 'Crear' }}</Button>
      <ProgressSpinner v-if="loading" style="width: 30px; height: 30px" strokeWidth="6" />
      <Button v-if="currentMode === 'editar'" style="margin-left: 20px" label="Eliminar" class="p-button-text p-button-danger" @click="deleteRecord"></Button>

    </form>
  </Sidebar>


  

 <!-- Slidebar CREAR COLUMNA -->

  <Sidebar
    v-model:visible="newColumnSidebarVisible"
    position="right"
    :style="{ width: '50%' }"
  >
    <template #header>
      <h3 style="font-weight: 300; font-size: 15px; padding: 0px">
        Crear columna en
        <Tag :value="selectedTableName" class="custom-tag"> </Tag>
      </h3>
      
    </template>

    
    <form

    
      style="font-weight: 300; font-size: 14px; padding: 10px; padding-top: 0px"
    >
    

      <div>
       
        <div class="formItem"> <div style="width: 100%">
          <div style="font-size: 11px; margin-bottom: 7px;"  > Nombre de la Columna  </div>
           <InputText v-model="columnName" style="max-height: 300px" class="inputInside" placeholder="escribe el nombre de la columna" :id="columnName" 
           required
          
            @input="validateNoSpaces"/>
          </div>
        </div>
        
        <div class="formItem"> <div style="width: 100%">

          <div style="display: flex;">
            <div v-if="dataType" style="font-size: 10px; margin-bottom: 7px;">
              <Icon :name="dataType.icon" style="margin-right: 5px; font-size: 16px;" />
            </div> <div style="font-size: 11px; margin-bottom: 7px;" > Tipo de dato</div>
          </div>

          <Dropdown v-model="dataType" :options="dataTypeList" optionLabel="label" placeholder="Selecionar" style="width: 100%; heigh" class="w-full md:w-14rem">
              <template #option="slotProps">
                <div style="display: flex;">
                  <Icon :name="slotProps.option.icon" style="margin-right: 15px; width: 20px;" />
                  <div style="font-size: 14px;">{{ slotProps.option.label }} <span style="font-size: 11px; margin-left: 10px; color: rgb(146, 146, 146);">{{ slotProps.option.description }} </span> </div>
                </div>
              </template>
          </Dropdown>

        <div v-if="dataType && !['Imágen', 'Galería', 'Relación única', 'Relación múltiple'].includes(dataType.label)" style="padding-left: 20px;">
          <div style="margin-top: 10px; display: flex;">
            <Checkbox  v-model="isCheckedArray" :binary="true" style="margin-right: 10px;" />
            <div>
            <div>Definir como listado</div>  
              <div style="color:gray; font-size: 11px; margin-top: 5px;">
                Permitir que la columna se defina como arrays multidimensionales de longitud variable 
              </div>
            </div>
           </div>

            <div style="margin-top: 20px; margin-bottom: 20px;">
              <div style="margin-bottom: 7px;"  > Valor predeterminado </div>
              <InputText  v-model="defaultValue"  style="max-height: 300px" class="inputRegular"
              />
              <div style="color:gray; font-size: 11px; margin-top: 5px;">Agregar valor predeterminado para cada registro  </div>

            </div>

              <div style="margin-top: 10px; display: none;">
                <Checkbox  v-model="isCheckedNullable" :binary="true" style="margin-right: 10px;" />
                <div>
                <div>Permitir valores vacios <span style="font-size: 13px; color: gray;"> *campo no obligatorio </span> </div>  
                <div style="color:gray; font-size: 11px; margin-top: 5px;">Permitir que la columna asuma un valor NULL si no se proporciona ningún valor  </div>
                </div>
              </div>

          </div>
        </div>

        <div v-if="dataType && ['Relación única', 'Relación múltiple'].includes(dataType.label)" style="margin-top:15px; font-size: 11px;" >
           <div style="margin-bottom:5px;"> Tabla relacionada</div> 
              <Dropdown 
                v-model="relationTable" 
                :options="tables" 
                optionLabel="" 
                placeholder="Seleccionar relación" 
                class="w-full md:w-14rem">
              
              </Dropdown>
        </div>
     </div>


      </div>

      <Button   @click="addColumn()"  label="Crear Columna"></Button>
      <ProgressSpinner
        v-if="loading"
        style="width: 30px; height: 30px"
        strokeWidth="6"
      />
    

    </form>



  
  </Sidebar>

  <Toast ref="toast" />
</template>
 
 


   
   <script>
   
import supabase from "../db/supabaseClient";
import { PrimeIcons } from "primevue/api";
import "primeicons/primeicons.css";
import Checkbox from "primevue/checkbox";
import OverlayPanel from "primevue/overlaypanel";
import ListBox from "primevue/listbox";
import { h } from "vue";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Sidebar from "primevue/sidebar";
import Tag from "primevue/tag";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Editor from 'primevue/editor';
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";





export default {


  beforeDestroy() {
    this.unsubscribeFromRealtimeUpdates();
  },

  watch: {
    selectedTableName(newVal) {
      if (newVal) {
        this.selectTable(newVal);
      }
    },
  },

  components: {
    Checkbox,
    OverlayPanel,
    Sidebar,
    Tag,
    Calendar,
    Textarea,
    Editor,
  },

  data() {
    return {
      products: [],
      columns: [],
      error: null,
      loading: true,
      pageIndex: 1,
      pageSize: 100,
      totalRecords: 0,
      selectedProduct: null,
      startDate: null,
      endDate: null,
      tables: [],
      selectedTableName: null,
      selectedTableObject: null,
      hoveredRowIndex: null,
      sidebarVisible: false,
      selectedRowData: {},
      columnDetails: [],
      newItemSidebarVisible: false,
      newColumnSidebarVisible: false,
      newRowData: {},
      dataType:null, 
      columnName: '',         
      dataType: null,         
      defaultValue: '',   
      currentMode:'',
      isCheckedArray: false,   
      relationTable: '', 
      isCheckedNullable: true,
            dataTypeList: [
        { label: "Texto plano", typeSupabase: "text", icon: "material-symbols-light:text-fields-rounded", description: "Texto corto de linea única" },
        { label: "Texto plano extendido", typeSupabase: "text", icon: "material-symbols-light:text-fields-rounded", description: "Texto extendido sin formato" },
        { label: "Rich Text", typeSupabase: "varchar", icon: "material-symbols-light:text-ad-outline-rounded", description: "Texto extenso con formato enriquecido"  },
        { label: "Número", typeSupabase: "int", icon: "codicon:symbol-numeric", description: "Entero int8" },
        { label: "Decimal", typeSupabase: "numeric", icon: "ic:twotone-numbers", description: "Número exacto" },
        { label: "Fecha", typeSupabase: "timestamptz", icon: "material-symbols-light:calendar-today", description: "Día y hora con timezone" },
        { label: "Bool", typeSupabase: "Bool", icon: "ic:outline-toggle-off" , description: "Lógica condicional (si/no) "},
        { label: "Imágen", typeSupabase: "text", icon: "ph:image-light", description: "Subir imagen (png,jpg,svg)" },
        { label: "Galería", typeSupabase: "text", icon: "clarity:image-gallery-line", description: "Subir múltiples imagen (png,jpg,svg)" },
        { label: "Archivo", typeSupabase: "text", icon: "material-symbols:attach-file", description: "Subir archivo (pdf,doc,xcl )" },
        { label: "Relación única", typeSupabase: "int", icon: "mdi:relation-many-to-one", description: "Columna tipo dato único" },
        { label: "Relación múltiple", typeSupabase: "text", icon: "material-symbols-light:account-tree-outline-rounded", description: "Columna tipo relación a muchos" },

      ],
    };
  },


  computed: {
      filteredRowData() {
        return Object.keys(this.selectedRowData)
          .filter((key) => key !== "index")
          .reduce((obj, key) => {
            obj[key] = this.selectedRowData[key];
            return obj;
          }, {});
      },

      formData() {
          return this.currentMode === 'crear' ? this.newRowData : this.selectedRowData;
        },
      formattedTables() {
        return this.tables.map((name) => ({ name }));
      },
    },

  watch: {
    selectedTableName(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectTable(newVal);
      }
    },
    endDate() {
      this.pageIndex = 1; // Reiniciar el paginador al principio
      this.loadPageData();
    },
  },

  async mounted() {
    try {
      await this.fetchTables();
      await this.loadPageData();
      this.subscribeToRealtimeUpdates();
    } catch (error) {
      console.error("Error en mounted:", error);
    }
  },

  methods: {


    openSidebarForCreate() {
      this.sidebarVisible = true;
    },
    openSidebarForEdit(rowData) {
      this.currentMode = 'editar';
    this.selectedRowData = rowData; // Cargar los datos para editar
    this.sidebarVisible = true;
    },
    
      async addColumn() {
        try {
          this.loading = true;

        let description = this.isCheckedArray ? `${this.dataType.label} [array]` : this.dataType.label;
        let relation_table = ['Relación única', 'Relación múltiple'].includes(this.dataType.label) ? this.relationTable : null;

          const queryParameters = {
            table_name: this.selectedTableName, 
            column_name: this.columnName,
            column_type: this.dataType.typeSupabase, 
            is_nullable: this.isCheckedNullable,
            is_array: this.isCheckedArray,
            default_value: this.defaultValue === '' ? null : this.defaultValue,
            description: description, 
            relation_table: relation_table

          };
          console.log('Ejecutando RPC con parámetros:', queryParameters);

          const checkColumnExistence = await supabase
            .from(this.selectedTableName)
            .select(this.columnName)
            .limit(1);

            if (checkColumnExistence.data && checkColumnExistence.data.length > 0) {
              this.$toast.add({
                severity: "warn",
                summary: "Columna Existe",
                detail: "La columna ya existe en la tabla seleccionada",
                life: 3000,
              });
              this.loading = false;  // Desactivar indicador de carga
              return; 
            }
      
        const { data, error } = await supabase
          .rpc('add_column', {
            table_name: this.selectedTableName, 
            column_name: this.columnName,
            column_type: this.dataType.typeSupabase, 
            is_nullable: this.isCheckedNullable,
            is_array: this.isCheckedArray,
            default_value: this.defaultValue === '' ? null : this.defaultValue,
            description: description ,
            relation_table: relation_table

          });

        if (error) throw error;
        console.log('Columna añadida:', data);
        this.newColumnSidebarVisible = false; 
        await this.fetchColumnDetails();
        this.reloadData();
        this.getColumnDetail();
        this.getCreationRowDataKeys();


        this.$toast.add({
          severity: "success",
          summary: "Columna Añadida",
          detail: "La columna se ha añadido exitosamente",
          life: 3000,
        });

        this.reloadData();

      } catch (error) {
        console.error('Error al añadir la columna:', error);
        this.$toast.add({
        severity: "error",
        summary: "Error",
        detail: `${error.message}`,
        life: 3000,
        contentStyle: {'font-size': '10px'}
      });
      }finally {
        this.resetFormFields();
        this.loading = false; 
        
      }
    },
  
    
    validateNoSpaces() {
      this.columnName = event.target.value.replace(/\s+/g, '');
    },

   toggleAddColumnSidebar() {
    this.newColumnSidebarVisible = true;
    this.toggleAdd();
    
      
    },
    
    toggleNewItemSidebar() {
      this.currentMode = 'crear';
      this.initializeNewRowData();
      this.sidebarVisible = true;
      this.toggleAdd();
  },

    initializeNewRowData() {
      this.newRowData = this.columnDetails.reduce((obj, col) => {
        obj[col.column_name] = ""; // O un valor por defecto según el tipo de columna
        return obj;
      }, {});
      this.openSidebarForCreate();

    },

    async deleteRecord() {
      try {
        this.loading = true;
        const { error } = await supabase
          .from(this.selectedTableName)
          .delete()
          .match({ id: this.selectedRowData.id });

        if (error) throw error;

        // Cerrar el Sidebar y actualizar los datos
        this.sidebarVisible = false;
        this.reloadData();
        this.$toast.add({
          severity: "success",
          summary: "Eliminado",
          detail: "Registro eliminado exitosamente",
          life: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
      } finally {
        this.loading = false;
      }
    },

    async addNewRow() {
      try {
        this.loading = true; // Activar el indicador de carga

        // Preparar los datos para la inserción
        const newRow = { ...this.newRowData };
        delete newRow.id; // Excluir el id ya que se genera automáticamente
        delete newRow.uuid;
        newRow.created_at = new Date().toISOString(); // Establecer la fecha y hora actuales

        // Llamada a Supabase para insertar la nueva fila
        const { error } = await supabase
          .from(this.selectedTableName)
          .insert([newRow]);

        if (error) throw error;
        this.newItemSidebarVisible = false;
        this.$toast.add({
          severity: "success",
          summary: "Creado",
          detail: "Registro creado exitosamente",
          life: 3000,
        });
      } catch (error) {
        console.error("Error al agregar nueva fila:", error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error al crear registro ",
          life: 3000,
        });
      } finally {
        this.loading = false; // Desactivar el indicador de carga
        this.sidebarVisible = false;
      }
    },

    async saveChanges() {
      try {
        this.loading = true; // Activar el indicador de carga

        // Crear una copia de selectedRowData excluyendo los campos no necesarios
        const dataToUpdate = { ...this.selectedRowData };
        delete dataToUpdate.index; // Eliminar el campo 'index'

        console.log("Datos a guardar:", dataToUpdate);

        // Llamada a Supabase para actualizar los datos
        const { error } = await supabase
          .from(this.selectedTableName)
          .update(dataToUpdate)
          .match({ id: this.selectedRowData.id }); // Asegúrate de tener un campo 'id'

        if (error) throw error;

        // Mostrar un mensaje de éxito
        this.$toast.add({
          severity: "success",
          summary: "Guardado",
          detail: "Guardado exitosamente",
          life: 3000,
        });
        this.sidebarVisible = false; // Cerrar el Sidebar después de guardar
      } catch (error) {
        console.error("Error al guardar:", error);
        // Mostrar un mensaje de error
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error al guardar",
          life: 3000,
        });
      } finally {
        this.loading = false; // Desactivar el indicador de carga
      }
    },

    getFilteredRowDataKeys() {
    return Object.keys(this.formData).filter(key => {
      if (key === "index" || key.endsWith("_index")) return false;

      // Excluir campos específicos en modo 'crear'
      if (this.currentMode === 'crear' && (key === 'id' || key === 'created_at' || key === 'uuid' || key === 'updated' || key === 'updated_at')) {
        return false;
      }

      const columnDetail = this.columnDetails.find(
        (detail) => detail.column_name === key
      );

      return columnDetail && columnDetail.data_type !== "tsvector";
    });
  },

    getColumnDetail(columnName) {
        const detail = this.columnDetails.find(detail => detail.column_name === columnName);
        console.log(`Details for ${columnName}:`, detail);
        
        if (detail && detail.hasOwnProperty('is_array')) {
          return { ...detail, is_array: detail.is_array };
        }

        return detail || {};
      },

    getInputType(columnName) {
      const column = this.columnDetails.find(
        (col) => col.column_name === columnName
      );
      if (column) {
        switch (column.data_type) {
          case "integer":
            return "number";
          case "boolean":
            return "checkbox";
          // Añade más casos según los tipos de datos que necesites
          default:
            return "text";
        }
      }
      return "text"; // Tipo por defecto si no se encuentra la columna
    },

    onRowClick(event) {
      console.log("Fila clickeada:", event.data);
      this.currentMode = 'editar';
      this.selectedRowData = event.data; // Corrección aquí
      this.sidebarVisible = true;
      this.openSidebarForEdit(event.data);

      
    },

    selectTable(tableName) {
      this.selectedTableName = tableName;
      this.loadPageData();
      this.subscribeToRealtimeUpdates();
      this.fetchColumnDetails(tableName);
      this.newRowData = {};
      this.$refs.tables.hide();
    },

    getCreationRowDataKeys() {
      // Filtrar claves para el formulario de creación
      const excludedFields = ["id", "uuid"]; // Campos a excluir en creación
      return Object.keys(this.newRowData)
        .filter((key) => !excludedFields.includes(key))
        .filter((key) => {
          const columnDetail = this.columnDetails.find(
            (detail) => detail.column_name === key
          );
          return columnDetail && columnDetail.data_type !== "tsvector";
        });
    },


    async fetchTables() {
      try {
        // Realiza una llamada a la función almacenada
        const { data, error } = await supabase.rpc("get_tables", {
          target_schema: "public",

      
        });

        if (error) {
          console.error("Error al obtener las tablas:", error.message);
          throw error;
        }

        console.log("Tablas obtenidas:", data); // Depuración

        this.tables = data
          .map((item) => item.table_name)
          .sort((a, b) => a.localeCompare(b));
      } catch (err) {
        console.error("Error al obtener las tablas:", err.message);
      }
    },

    async fetchColumnDetails() {
      try {
        const { data, error } = await supabase.rpc("get_table_column_details", {
          target_schema: "public",
          target_table: this.selectedTableName,
        });

        if (error) throw error;

        this.columnDetails = data;
      } catch (error) {
        console.error(
          "Error al obtener detalles de las columnas:",
          error.message
        );
      }
    },

    reloadData() {
      console.log ("se inicio reloadData")
      this.fetchTables();
      this.loadPageData();
    },

    subscribeToRealtimeUpdates() {
      if (this.selectedTableName) {
        console.log(
          "Subscribiendo a cambios en tiempo real para la tabla:",
          this.selectedTableName
        );
        const channel = supabase
          .channel(`public:${this.selectedTableName}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: this.selectedTableName,
            },
            (payload) => {
              console.log("Cambio en tiempo real:", payload);
              this.handleRealtimeUpdate(payload);
            }
          )
          .subscribe();

        this.currentChannel = channel;
      }
    },

    unsubscribeFromRealtimeUpdates() {
      supabase.getSubscriptions().forEach((subscription) => {
        supabase.removeSubscription(subscription);
      });
    },

    async handleRealtimeUpdate(payload) {
      this.loading = true;
      console.log("Evento Realtime recibido:", payload.eventType, payload);

      const record = payload.new;

      switch (payload.eventType) {
        case "INSERT":
          console.log("Insertando nuevo registro:", record);
          // Agregar el nuevo registro al principio del array (o al final, según prefieras)
          this.products.unshift(record);
          await this.fetchColumnDetails();
          break;

        case "UPDATE":
          console.log("Actualizando registro:", record);
          const indexToUpdate = this.products.findIndex(
            (item) => item.id === record.id
          );
          if (indexToUpdate !== -1) {
            // Actualización directa del objeto en el índice encontrado
            this.products[indexToUpdate] = record;
          } else {
            console.log("Registro no encontrado para actualizar:", record.id);
            await this.fetchColumnDetails();
          }
          break;

        case "DELETE":
          console.log("Eliminando registro:", record);
          // Elimina el registro del array
          this.products = this.products.filter(
            (item) => item.id !== payload.old.id
          );
          await this.fetchColumnDetails();
          break;

        default:
          // Manejar otros casos si es necesario
          console.log("Tipo de evento no manejado:", payload.eventType);
          break;
      }

      this.products.forEach((product, index) => {
        product.index = index + 1;
      });
      this.loading = false;
    },

    toggleAdd(event) {
      this.$refs.add.toggle(event);
    },

    toggleFilter(event) {
      this.$refs.filter.toggle(event);
    },
    toggleColumn(event) {
      this.$refs.column.toggle(event);
    },

    toggleTables(event) {
      this.$refs.tables.toggle(event);
    },
    onPageChange(event) {
      console.log("onPageChange:", event.page, event.rows);
      this.pageIndex = event.page + 1;
      this.pageSize = event.rows;
      this.loadPageData();
    },

    async loadPageData() {
      console.log(
        "Cargando datos de la página:",
        this.pageIndex,
        "con tamaño de página:",
        this.pageSize
      );

      this.loading = true;
      try {

        if (this.selectedTableName === null) {         
        return;
        }

        let startIndex = (this.pageIndex - 1) * this.pageSize;
        let endIndex = startIndex + this.pageSize - 1;

        let query = supabase
          .from(this.selectedTableName)
          .select("*", { count: "exact" });
        // .order('created', { ascending: false });

        if (this.startDate) {
          let formattedStartDate = this.startDate.toISOString().split("T")[0];
          query = query.gte("created_at", formattedStartDate);
        }

        if (this.endDate) {
          let formattedEndDate = this.endDate.toISOString().split("T")[0];
          query = query.lte("created_at", formattedEndDate);
        }

        let { data, error, count } = await query.range(startIndex, endIndex);

        if (error) throw error;

        // Añadir un campo 'index' a cada elemento en los datos
        this.products = data.map((item, index) => ({
          ...item,
          index: startIndex + index + 1,
        }));

        this.totalRecords = count;
        console.log(`Datos cargados desde Supabase: ${data.length} registros`);

        if (data && data.length > 0) {
          this.columns = this.generateColumns(data[0]);
          console.log(
            `Se encontraron ${data.length} registros en la página actual.`
          );
        } else {
          console.log("No se encontraron registros.");
        }
      } catch (error) {
        this.error = error.message;
        console.error(`Error en la carga de datos: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    async fetchDataForCSV() {
      try {
        let records = [];
        let index = 0;
        const pageSize = 1000; // Tamaño máximo de lote
        let fetched = 0;

        do {
          let query = supabase
            .from(this.selectedTableName)
            .select("*", { count: "exact" })
            .range(index * pageSize, (index + 1) * pageSize - 1);

          if (this.startDate) {
            let formattedStartDate = this.startDate.toISOString().split("T")[0];
            query = query.gte("created_at", formattedStartDate);
          }

          if (this.endDate) {
            let formattedEndDate = this.endDate.toISOString().split("T")[0];
            query = query.lte("created_at", formattedEndDate);
          }

          const { data, error, count } = await query;
          if (error) throw error;

          records = records.concat(data);
          fetched = data.length;
          index++;
        } while (fetched === pageSize);

        return records;
      } catch (error) {
        console.error(
          "Error en la obtención de datos para CSV:",
          error.message
        );
        return [];
      }
    },

    async downloadCSV() {
      const data = await this.fetchDataForCSV();
      if (data.length === 0) {
        alert("No hay datos para descargar");
        return;
      }

      const csvData = this.convertToCSV(data);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "db-PromoUNO.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    },

    convertToCSV(arr) {
      const array = [Object.keys(arr[0])].concat(arr);

      return array
        .map((it) => {
          return Object.values(it).toString();
        })
        .join("\n");
    },

    generateColumns(dataObject) {
      return Object.keys(dataObject).map((key) => {
        let icon = "";
        if (typeof dataObject[key] === "string") {
          icon = "ph:text-t-thin";
        }

        return {
          field: key,
          header: key,
          icon: icon,
          // frozen: key === 'id',
          // class: key === 'id' ? 'frozen-column-border' : '',
          isBoolean: typeof dataObject[key] === "boolean",
        };
      });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    resetFormFields() {
      this.columnName = '';
      this.dataType = null;
      this.isCheckedArray = false;
      this.defaultValue = '';
      this.isCheckedNullable = true;
    }

  },
};
</script>
 
<style scoped>
.custom-tag {
  background-color: #f6f6f6;
  border-color: #e0e0e0;
  border-style: solid;
  border-width: 1px;
  color: #474747;
  font-size: 15px;
  font-weight: 300;
}

.inputRegular{
border: #cccccc;
border-style: solid;
border-width: 1px; 
width: 100%;
}

.p-dropdown {
  width: 100%;
}

.p-dropdown-panel .p-dropdown-items{

 font-size: 13px!important;
  height: 35px!important;
}

</style>