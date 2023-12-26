  <template>



    <div>
      <div class="header"> Filtrar de   <Calendar showButtonBar style="max-width:125px; margin-right:10px; padding: 0px; font-size:11px; height:35px; border-color: rgba(241, 241, 241, 0.64); " v-model="startDate" showIcon iconDisplay="input"  />  
        hasta   <Calendar showButtonBar style="max-width:125px; padding: 0px; font-size:11px; height:35px;" v-model="endDate" showIcon iconDisplay="input" />
        <Button label="Descargar" @click="downloadCSV"  icon="pi pi-download" iconPos="right" size="small"></Button>
      </div>
      <DataTable 
      v-model:selection="selectedProduct" 
      v-if="columns.length > 0" 
      selectionMode="single" 
      :value="products" 
      showGridlines  
      size="small"
      sortField="Id"  
      :sortOrder="-1" 
      scrollable="`"
      scrollHeight="85vh" 
      :virtualScrollerOptions="{ itemSize: 30 }"
      resizableColumns 
      columnResizeMode="expand" 
      tableStyle="font-size: 12px;"
      @selection-change="selectedProduct = $event.value"
      
        >
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :frozen="col.frozen"  :class="col.class" style="max-width:500px;"/>
        <template 
        #footer > 
        <div style="display: flex; flex-direction: row; font-size: 13px; font-weight: 500; align-items: center;  justify-content:left;"  > 
          <Paginator  :rows="100" :totalRecords="totalRecords"  :rowsPerPageOptions="[100, 500, 1000]" :pageLinkSize="4"  @page="onPageChange" >  </Paginator>
         <span class="p-paginator-pag" style="display: flex;  align-items: center; justify-content: left;"> {{ totalRecords }} registros   <ProgressSpinner v-if="loading" style="width:30px; border-width:5px; height:15px;" strokeWidth="6" animationDuration=".6s"/> </span>
        </div>
        
        </template> 
      </DataTable>
      <div v-else>...</div>
    </div>
  </template>

  <script>
  import supabase from './db/supabaseClient'
  import { PrimeIcons } from 'primevue/api';
  import 'primeicons/primeicons.css';
  
  

  export default {
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

      }
    },


    watch: {
    startDate() {
      this.pageIndex = 1; // Reiniciar el paginador al principio
      this.loadPageData();
    },
    endDate() {
      this.pageIndex = 1; // Reiniciar el paginador al principio
      this.loadPageData();
    }
  },

    async mounted() {
      await this.loadPageData();
    },
    methods: {

      onPageChange(event) {
    console.log('onPageChange:', event.page, event.rows);
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadPageData();
    },
    async loadPageData() {
  console.log('Cargando datos de la página:', this.pageIndex, 'con tamaño de página:', this.pageSize);

  this.loading = true;
  try {
    let startIndex = (this.pageIndex - 1) * this.pageSize;
    let endIndex = startIndex + this.pageSize - 1;

    let query = supabase
      .from('promoUNOnavidad')
      .select('*', { count: 'exact' })
      .neq('email', '')
      .order('id', { ascending: false });

    // Agregar filtro de fecha de inicio si está disponible
    if (this.startDate) {
      let formattedStartDate = this.startDate.toISOString().split('T')[0]; // Formatea la fecha para la consulta
      query = query.gte('created_at', formattedStartDate);
    }

    // Agregar filtro de fecha de finalización si está disponible
    if (this.endDate) {
      let formattedEndDate = this.endDate.toISOString().split('T')[0]; // Formatea la fecha para la consulta
      query = query.lte('created_at', formattedEndDate);
    }

    let { data, error, count } = await query
      .range(startIndex, endIndex); // Aplica los rangos de paginación

    if (error) throw error;

    this.products = data;
    this.totalRecords = count;

    console.log(`Datos cargados desde Supabase: ${data.length} registros`);

    if (data && data.length > 0) {
      this.columns = this.generateColumns(data[0]);
      console.log(`Se encontraron ${data.length} registros en la página actual.`);
    } else {
      console.log('No se encontraron registros.');
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
        .from('promoUNOnavidad')
        .select('*', { count: 'exact' })
        .neq('email', '')
        .range(index * pageSize, (index + 1) * pageSize - 1);

      if (this.startDate) {
        let formattedStartDate = this.startDate.toISOString().split('T')[0];
        query = query.gte('created_at', formattedStartDate);
      }

      if (this.endDate) {
        let formattedEndDate = this.endDate.toISOString().split('T')[0];
        query = query.lte('created_at', formattedEndDate);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      records = records.concat(data);
      fetched = data.length;
      index++;
    } while (fetched === pageSize);

    return records;
  } catch (error) {
    console.error('Error en la obtención de datos para CSV:', error.message);
    return [];
  }
},

async downloadCSV() {
  const data = await this.fetchDataForCSV();
  if (data.length === 0) {
    alert('No hay datos para descargar');
    return;
  }

  const csvData = this.convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'db-PromoUNO.csv';
  a.click();
  window.URL.revokeObjectURL(url);
},

convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array.map(it => {
    return Object.values(it).toString();
  }).join('\n');
},


      generateColumns(dataObject) {
        return Object.keys(dataObject).map(key => ({
          field: key,
          header: this.capitalizeFirstLetter(key),
          frozen: key === 'id',
          class: key === 'id' ? 'frozen-column-border' : ''
        }));
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }

  

  


  
  </script>
