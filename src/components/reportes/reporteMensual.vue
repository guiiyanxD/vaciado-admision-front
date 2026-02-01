<template>
  <div class="reporte-mensual-container">
    <div class="card">
      <div class="card-header">
        <h2>Reporte Mensual de Movimientos</h2>
      </div>
      
      <div class="card-body">
        <!-- Formulario de búsqueda -->
        <div class="form-group">
          <div class="date-inputs">
            <div class="input-wrapper">
              <label for="fechaInicio">Fecha Inicio:</label>
              <input 
                type="date" 
                id="fechaInicio"
                v-model="fechaInicio"
                :disabled="loading"
              />
            </div>
            
            <div class="input-wrapper">
              <label for="fechaFin">Fecha Fin:</label>
              <input 
                type="date" 
                id="fechaFin"
                v-model="fechaFin"
                :disabled="loading"
              />
            </div>
          </div>

          <button 
            @click="generarReporte" 
            :disabled="loading || !fechaInicio || !fechaFin"
            class="btn btn-primary"
          >
            {{ loading ? 'Generando...' : 'Generar Reporte' }}
          </button>
        </div>

        <!-- Mensajes de error -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Loading spinner -->
        <div v-if="loading" class="loading-spinner">
          <div class="spinner"></div>
          <p>Cargando datos...</p>
        </div>

        <!-- Vista previa de datos -->
        <div v-if="datosReporte && !loading" class="preview-section">
          <div class="preview-header">
            <h3>Vista Previa del Reporte</h3>
            <button @click="descargarPDF" class="btn btn-success">
              📄 Descargar PDF
            </button>
          </div>

          <!-- Tabs para cada movimiento -->
          <div class="tabs">
            <button 
              v-for="movimiento in movimientos" 
              :key="movimiento.key"
              @click="movimientoActivo = movimiento.key"
              :class="['tab', { active: movimientoActivo === movimiento.key }]"
            >
              {{ movimiento.label }}
            </button>
          </div>

          <!-- Contenido de la tab activa -->
          <div class="tab-content">
            <div v-if="datosReporte[movimientoActivo]">
              <h4>{{ getMovimientoLabel(movimientoActivo) }}</h4>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Periodo</th>
                      <th>Medicina Interna</th>
                      <th>Medicina Cirugía</th>
                      <th>Infectología</th>
                      <th>Pabellón</th>
                      <th>Neuro Trauma</th>
                      <th>Ginecología</th>
                      <th>Neonatología</th>
                      <th>Pediatría</th>
                      <th>Onco Pediatría</th>
                      <th>UCIM</th>
                      <th>UTI Pediatría</th>
                      <th>UTI Adultos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(fila, index) in datosReporte[movimientoActivo]" :key="index">
                      <td>{{ fila.periodo }}</td>
                      <td>{{ fila.medicina_interna }}</td>
                      <td>{{ fila.medicina_cirugia }}</td>
                      <td>{{ fila.infectologia }}</td>
                      <td>{{ fila.pabellon }}</td>
                      <td>{{ fila.neuro_trauma }}</td>
                      <td>{{ fila.ginecologia }}</td>
                      <td>{{ fila.neonatologia }}</td>
                      <td>{{ fila.pediatria }}</td>
                      <td>{{ fila.onco_pediatria }}</td>
                      <td>{{ fila.ucim }}</td>
                      <td>{{ fila.uti_pediatria }}</td>
                      <td>{{ fila.uti_adultos }}</td>
                      <td>{{ fila.total }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="no-data">
              No hay datos disponibles para este movimiento
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { jsPDF } from 'jspdf'; 
import 'jspdf-autotable';
import API_BASE_URL from '../config/api'; 

// Estado reactivo
const fechaInicio = ref('');
const fechaFin = ref('');
const loading = ref(false);
const error = ref(null);
const datosReporte = ref(null);
const movimientoActivo = ref('ingreso');

// Definición de movimientos con labels formateados
const movimientos = [
  { key: 'ingreso', label: 'Ingreso' },
  { key: 'ingreso_traslado', label: 'Ingreso por Traslado' },
  { key: 'egreso', label: 'Egreso' },
  { key: 'egreso_traslado', label: 'Egreso por Traslado' },
  { key: 'obito', label: 'Óbito' },
  { key: 'aislamiento', label: 'Camas en Aislamiento' },
  { key: 'bloqueada', label: 'Camas Bloqueadas' },
  { key: 'total', label: 'Total' }
];

// Función para obtener el label de un movimiento
const getMovimientoLabel = (key) => {
  return movimientos.find(m => m.key === key)?.label || key;
};

// Función para generar el reporte
const generarReporte = async () => {
  if (!fechaInicio.value || !fechaFin.value) {
    error.value = 'Por favor, seleccione ambas fechas';
    return;
  }

  const data = {
    fechaInicio: fechaInicio.value,
    fechaFin: fechaFin.value
  };

  const validarFechas = () => {
  const inicio = new Date(fechaInicio.value)
  const fin = new Date(fechaFin.value)
  const hoy = new Date()
  
  // Validar que fecha fin no sea anterior a inicio
  if (fin < inicio) {
    error.value = 'La fecha fin no puede ser anterior a la fecha inicio'
    return false
  }
  
  // Validar que no exceda un año
  const diffTime = Math.abs(fin - inicio)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays > 365) {
    error.value = 'El rango no puede exceder 365 días'
    return false
  }
  
  // Validar que no sean fechas futuras
  if (inicio > hoy || fin > hoy) {
    error.value = 'No se pueden seleccionar fechas futuras'
    return false
  }
  
  return true
}

  loading.value = true;
  error.value = null;
  datosReporte.value = null;
    if (validarFechas()) {
        try {
            const response = await fetch(`${API_BASE_URL}/reporte-mensual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (result.status === 'success') {
            datosReporte.value = result.data;
            } else {
            error.value = result.message || 'Error al obtener el reporte';
            }
        } catch (err) {
            error.value = 'Error de conexión con el servidor';
            console.error('Error:', err);
        } finally {
            loading.value = false;
        }
    }else{
        loading.value = false;
        return;
    }
  
};

// Función para descargar el PDF
const descargarPDF = () => {
  if (!datosReporte.value) {
    error.value = 'No hay datos para generar el PDF';
    return;
  }

  // Crear nuevo documento PDF en orientación horizontal
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Configuración de encabezados de columnas
  const headers = [
    'Periodo',
    'Medicina Interna',
    'Medicina Cirugía',
    'Infectología',
    'Pabellón',
    'Neuro Trauma',
    'Ginecología',
    'Neonatología',
    'Pediatría',
    'Onco Pediatría',
    'UCIM',
    'UTI Pediatría',
    'UTI Adultos',
    'Total'
  ];

  let isFirstPage = true;

  // Iterar sobre cada movimiento y crear una página por movimiento
  movimientos.forEach((movimiento) => {
    const datos = datosReporte.value[movimiento.key];

    if (!datos || datos.length === 0) {
      return; // Saltar si no hay datos
    }

    // Agregar nueva página (excepto para la primera)
    if (!isFirstPage) {
      doc.addPage();
    }
    isFirstPage = false;

    // Título de la página
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporte Mensual - ${movimiento.label}`, 14, 15);

    // Subtítulo con rango de fechas
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${fechaInicio.value} al ${fechaFin.value}`, 14, 22);

    // Preparar datos para la tabla
    const tableData = datos.map(fila => [
      fila.periodo || '-',
      fila.medicina_interna || 0,
      fila.medicina_cirugia || 0,
      fila.infectologia || 0,
      fila.pabellon || 0,
      fila.neuro_trauma || 0,
      fila.ginecologia || 0,
      fila.neonatologia || 0,
      fila.pediatria || 0,
      fila.onco_pediatria || 0,
      fila.ucim || 0,
      fila.uti_pediatria || 0,
      fila.uti_adultos || 0,
      fila.total || 0
    ]);

    // Generar tabla con autoTable
    doc.autoTable({
      startY: 28,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'center'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 22 }, // Periodo
        13: { fontStyle: 'bold', fillColor: [236, 240, 241] } // Total
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 28, left: 14, right: 14 }
    });

    // Agregar pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Página ${pageCount} - Generado por Williams Alvarez Zabala, el ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );
  });

  // Descargar el PDF
  const nombreArchivo = `reporte_mensual_${fechaInicio.value}_${fechaFin.value}.pdf`;
  doc.save(nombreArchivo);
};
</script>

<style scoped>
.reporte-mensual-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.date-inputs {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.input-wrapper {
  flex: 1;
  min-width: 200px;
}

.input-wrapper label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.input-wrapper input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-wrapper input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(17, 153, 142, 0.4);
}

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-error {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.preview-section {
  margin-top: 30px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.preview-header h3 {
  margin: 0;
  color: #333;
}

.tabs {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  overflow-x: auto;
  flex-wrap: wrap;
}

.tab {
  padding: 10px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab:hover {
  color: #667eea;
  background-color: #f8f9fa;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 500;
}

.tab-content {
  padding: 20px 0;
}

.tab-content h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th,
.data-table td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.data-table th {
  background-color: #667eea;
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.data-table tbody tr:hover {
  background-color: #e9ecef;
}

.data-table td:last-child {
  font-weight: 600;
  background-color: #f0f0f0;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .date-inputs {
    flex-direction: column;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .data-table {
    font-size: 11px;
  }

  .data-table th,
  .data-table td {
    padding: 6px 4px;
  }
}
</style>