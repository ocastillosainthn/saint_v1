<template>
  <div>
    <div  ref="datatable"></div>
  </div>
</template>

<script>
import DataTable from 'frappe-datatable';
import 'frappe-datatable/dist/frappe-datatable.min.css';
import supabase from '../../db/supabaseClient';


export default {
  async mounted() {


    let { data, error } = await supabase
      .from('product')
      .select('*');

    if (error) {
      console.error('Error al cargar datos:', error);
      return;
    }

    if (data && data.length > 0) {
      this.initializeDataTable(data);
    }
  },

  methods: {
    
    initializeDataTable(data) {
      const datatable = new DataTable(this.$refs.datatable, {
        columns: Object.keys(data[0]).map(key => ({ name: key })),
        data: data.map(Object.values)
      });

      // Aplicar estilos aquí
      datatable.style.setStyle('.dt-cell', { fontSize: '13px' });
      datatable.style.setStyle('.dt-header .dt-cell', { fontSize: '12px' });
    }
  }
}

</script>

<style>

.datatable-container {
  height: 100vh;
}

.datatable-container .dt-header .dt-cell {
  font-size: 9px;
}

.datatable-container .dt-row .dt-cell {
  font-size: 11px;
}
.datatable-container .dt-row:hover {
  background-color: #f2f2f2; /* Gris suave */
}
</style>
