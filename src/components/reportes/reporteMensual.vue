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

          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="detalleDiario"
              v-model="detalle"
              :disabled="loading"
            />
            <label class="form-check-label" for="detalleDiario">
              Mostrar detalle diario (si se desmarca, se resume por mes)
            </label>
          </div>

          <button
            @click="generarReporte"
            :disabled="loading || !fechaInicio || !fechaFin"
            class="btn btn-primary"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            {{ loading ? 'Generando...' : 'Generar Reporte' }}
          </button>
        </div>

        <!-- Mensajes de error -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Loading spinner -->
        <div v-if="loading" class="loading-spinner">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando datos...</p>
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
                    <!-- Fila de totales -->
                    <tr class="totals-row" v-if="datosReporte[movimientoActivo] && datosReporte[movimientoActivo].length > 0">
                      <td><strong>TOTAL</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).medicina_interna }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).medicina_cirugia }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).infectologia }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).pabellon }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).neuro_trauma }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).ginecologia }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).neonatologia }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).pediatria }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).onco_pediatria }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).ucim }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).uti_pediatria }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).uti_adultos }}</strong></td>
                      <td><strong>{{ calcularTotales(datosReporte[movimientoActivo]).total }}</strong></td>
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

<script>
import imgMarcaAgua from '@/assets/cps_logo.png';
import { reporteMensual as reporteMensualRequest } from '@/services/censoService';
import { generarPdfReporte } from '@/services/pdfReporteGenerator';
import { MOVIMIENTOS, calcularTotales as calcularTotalesUtil } from '@/utils/reporteMensualConfig';

export default {
  name: 'ReporteMensual',

  data() {
    return {
      fechaInicio: '',
      fechaFin: '',
      detalle: true,
      loading: false,
      error: null,
      datosReporte: null,
      movimientoActivo: 'ingreso',
      movimientos: MOVIMIENTOS
    };
  },

  methods: {
    getMovimientoLabel(key) {
      return this.movimientos.find(m => m.key === key)?.label || key;
    },

    calcularTotales(datos) {
      return calcularTotalesUtil(datos);
    },

    generarReporte() {
      if (!this.fechaInicio || !this.fechaFin) {
        this.error = 'Por favor, seleccione ambas fechas';
        return;
      }

      this.loading = true;
      this.error = null;
      this.datosReporte = null;

      reporteMensualRequest({ fechaInicio: this.fechaInicio, fechaFin: this.fechaFin, detalle: this.detalle })
        .then(result => {
          if (result.status === 'success') {
            this.datosReporte = result.data;
          } else {
            this.error = result.message || 'Error al obtener el reporte';
          }
        })
        .catch(err => {
          this.error = 'Error de conexión con el servidor';
          console.error('Error:', err);
        })
        .finally(() => { this.loading = false; });
    },

    descargarPDF() {
      if (!this.datosReporte) {
        this.error = 'No hay datos para generar el PDF';
        return;
      }

      generarPdfReporte({
        datosReporte: this.datosReporte,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        detalle: this.detalle,
        movimientos: this.movimientos,
        logoUrl: imgMarcaAgua
      });
    }
  }
};
</script>

<style scoped>
.reporte-mensual-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  background: var(--color-primary-darker);
  color: white;
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

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-error {
  background-color: #fbe9e7;
  color: var(--color-danger);
  border: 1px solid #f3c8c2;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
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
  color: var(--color-primary-dark);
  background-color: var(--color-primary-tint);
}

.tab.active {
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-primary);
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
  background-color: var(--color-primary-darker);
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table tbody tr:nth-child(even) {
  background-color: var(--color-bg);
}

.data-table tbody tr:hover {
  background-color: var(--color-primary-tint);
}

.data-table td:last-child {
  font-weight: 600;
  background-color: var(--color-bg);
}

.data-table .totals-row {
  background-color: var(--color-primary) !important;
  color: white;
  font-weight: bold;
  border-top: 3px solid var(--color-primary-darker);
}

.data-table .totals-row td {
  background-color: var(--color-primary) !important;
  color: white;
  font-size: 14px;
  padding: 12px 8px;
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