<template>
  <div class="reportes-container">
    <div class="reportes-sidebar">
      <h3>Tipos de Reportes</h3>
      <ul>
        <li 
          @click="reporteActivo = 'mensual'"
          :class="{ active: reporteActivo === 'mensual' }"
        >
          📊 Reporte Mensual
        </li>
        <li 
          @click="reporteActivo = 'anual'"
          :class="{ active: reporteActivo === 'anual' }"
        >
          📈 Reporte Anual (próximamente)
        </li>
      </ul>
    </div>
    
    <div class="reportes-content">
      <ReporteMensual v-if="reporteActivo === 'mensual'" />
      <div v-else class="coming-soon">
        Este reporte estará disponible próximamente
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReporteMensual from './reporteMensual.vue'

const reporteActivo = ref('mensual')
</script>

<style scoped>
.reportes-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.reportes-sidebar {
  width: 250px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.reportes-sidebar ul {
  list-style: none;
  padding: 0;
}

.reportes-sidebar li {
  padding: 12px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.reportes-sidebar li:hover {
  background-color: #f0f0f0;
}

.reportes-sidebar li.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.reportes-content {
  flex: 1;
}

.coming-soon {
  text-align: center;
  padding: 100px 20px;
  color: #999;
  font-size: 18px;
}
</style>