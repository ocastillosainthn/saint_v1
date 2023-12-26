<template>
  <div>
    <DataTable 
    v-model:selection="selectedProduct" 
    v-if="columns.length > 0" 
    selectionMode="single" 
    :value="products" 
    showGridlines  
    size="small"
    sortField="Id"  
    :sortOrder="-1" 
    scrollable 
    scrollHeight="95VH" 
    :virtualScrollerOptions="{ itemSize: 30 }"
    resizableColumns 
    columnResizeMode="fit" 
    style="font-size: 12px;"
    @selection-change="selectedProduct = $event.value"
      >
      <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :frozen="col.frozen"  :class="col.class"/>
      <template #footer> Total records: {{ products.length }} </template>
    </DataTable>
    <div v-else>...</div>
  </div>
</template>

<script>
import supabase from './db/supabaseClient'

export default {
  data() {
    return {
      products: [],
      columns: [],
      error: null,
      loading: true,
      pageIndex: 1,
      pageSize: 1000,
      totalRecords: 0,
      selectedProduct: null
    }
  },
  async mounted() {
    await this.loadPageData();
  },
  methods: {
    async loadPageData() {
  this.loading = true;
  try {
    let { data, error, count } = await supabase
      .from('promoUNOnavidad')
      .select('*', { count: 'exact' })
      .neq('email', '')
      .order('id', { ascending: false })
      .range((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize - 1);

    if (error) throw error;

    console.log(`Total de registros cargados desde Supabase: ${count}`); // Imprime el total de registros

    if (data && data.length > 0) {
      this.products = data;
      this.totalRecords = count;
      this.columns = this.generateColumns(data[0]);
      console.log(`Se encontraron ${data.length} registros en la página actual.`);
    } else {
      console.log('No se encontraron registros.');
    }
  } catch (error) {
    this.error = error.message;
    console.error(`Error: ${error.message}`);
  } finally {
    this.loading = false;
  }
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
