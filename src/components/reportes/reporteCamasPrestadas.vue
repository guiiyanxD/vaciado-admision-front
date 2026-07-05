<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Reporte de camas prestadas</h1>
                <p class="text-muted">Consultá las camas prestadas por rango de fechas, servicio, especialidad y tipo de ingreso.</p>
            </div>
        </div>

        <!-- Filtros -->
        <div class="row justify-content-center mb-4">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Filtros</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input
                                        type="date"
                                        class="form-control"
                                        id="fechaInicio"
                                        v-model="fechaInicio"
                                        :disabled="loading"
                                    >
                                    <label for="fechaInicio">Fecha inicio</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input
                                        type="date"
                                        class="form-control"
                                        id="fechaFin"
                                        v-model="fechaFin"
                                        :disabled="loading"
                                    >
                                    <label for="fechaFin">Fecha fin</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <select class="form-select" id="servicio" v-model="servicio" :disabled="loading">
                                        <option value="todos">Todos</option>
                                        <option v-for="s in servicios" :key="s.id" :value="s.nombre">{{ s.nombre }}</option>
                                    </select>
                                    <label for="servicio">Servicio (que presta la cama)</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <select class="form-select" id="especialidad" v-model="especialidad" :disabled="loading">
                                        <option value="todas">Todas</option>
                                        <option v-for="e in especialidades" :key="e.id" :value="e.nombre">{{ e.nombre }}</option>
                                    </select>
                                    <label for="especialidad">Especialidad (del paciente)</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <select class="form-select" id="tipoIngreso" v-model="tipoIngreso" :disabled="loading">
                                        <option value="AMBOS">Ambos</option>
                                        <option value="DIRECTO">Directo</option>
                                        <option value="TRASLADO">Traslado</option>
                                    </select>
                                    <label for="tipoIngreso">Tipo de ingreso</label>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12 d-flex justify-content-end">
                                <button
                                    class="btn btn-primary"
                                    @click="generarReporte"
                                    :disabled="loading || !fechaInicio || !fechaFin"
                                >
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                                    <i v-else class="bi bi-search me-1"></i>
                                    {{ loading ? 'Generando...' : 'Generar reporte' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="error" class="row justify-content-center mb-4">
            <div class="col-md-10">
                <div class="alert alert-danger mb-0">{{ error }}</div>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Generando reporte...</p>
        </div>

        <div v-else-if="!haBuscado" class="text-center text-muted py-5">
            <i class="bi bi-clipboard2-pulse fs-1 d-block mb-2"></i>
            Completá los filtros y presioná Generar reporte.
        </div>

        <div v-else-if="detalle.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            No hay camas prestadas para los filtros seleccionados.
        </div>

        <template v-else>
            <!-- Totales -->
            <div class="row justify-content-center mb-4">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Totales por especialidad y tipo de ingreso</h5>
                            <button class="btn btn-outline-primary btn-sm" @click="descargarPDF">
                                <i class="bi bi-file-earmark-pdf me-1"></i> Descargar PDF
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover mb-0 text-center">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Especialidad</th>
                                        <th>Tipo de ingreso</th>
                                        <th>Total camas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(t, idx) in totales" :key="idx">
                                        <td>{{ t.especialidad }}</td>
                                        <td>{{ t.tipo_ingreso }}</td>
                                        <td><strong>{{ t.total }}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detalle -->
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="mb-0">Detalle ({{ detalle.length }} registros)</h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover mb-0 text-center">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Servicio</th>
                                        <th>Especialidad</th>
                                        <th>Cantidad</th>
                                        <th>Tipo de ingreso</th>
                                        <th>Total acumulado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(d, idx) in detalleConAcumulado" :key="idx">
                                        <td>{{ d.fecha }}</td>
                                        <td>{{ d.servicio }}</td>
                                        <td>{{ d.especialidad }}</td>
                                        <td>{{ d.cantidad }}</td>
                                        <td>{{ d.tipo_ingreso }}</td>
                                        <td>{{ d.acumulado }}</td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-dark fw-bold">
                                    <tr class="row-total">
                                        <td colspan="3" class="text-end">TOTAL</td>
                                        <td>{{ totalCantidad }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import imgMarcaAgua from '@/assets/cps_logo.png';
import { fetchServicios, fetchEspecialidades } from '@/composables/useCatalogos';
import { reporteCamasPrestadas } from '@/services/censoService';
import { generarPdfCamasPrestadas } from '@/services/pdfReporteGenerator';

export default {
    name: 'ReporteCamasPrestadas',

    data() {
        return {
            fechaInicio: '',
            fechaFin: '',
            servicio: 'todos',
            especialidad: 'todas',
            tipoIngreso: 'AMBOS',
            servicios: [],
            especialidades: [],
            detalle: [],
            totales: [],
            loading: false,
            error: null,
            haBuscado: false
        };
    },

    computed: {
        detalleConAcumulado() {
            let acumulado = 0;
            return this.detalle.map(d => {
                acumulado += Number(d.cantidad) || 0;
                return { ...d, acumulado };
            });
        },

        totalCantidad() {
            return this.detalle.reduce((suma, d) => suma + (Number(d.cantidad) || 0), 0);
        }
    },

    created() {
        fetchServicios().then(data => {
            if (data.status === 'success') this.servicios = data.data;
        });
        fetchEspecialidades().then(data => {
            if (data.status === 'success') this.especialidades = data.data;
        });
    },

    methods: {
        generarReporte() {
            if (!this.fechaInicio || !this.fechaFin) {
                this.error = 'Por favor, seleccioná ambas fechas';
                return;
            }

            this.loading = true;
            this.error = null;

            reporteCamasPrestadas({
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFin,
                servicio: this.servicio,
                especialidad: this.especialidad,
                tipoIngreso: this.tipoIngreso
            })
            .then(result => {
                if (result.status === 'success') {
                    this.detalle = result.data.detalle;
                    this.totales = result.data.totales;
                    this.haBuscado = true;
                } else {
                    this.error = result.message || 'Error al obtener el reporte';
                }
            })
            .catch(() => {
                this.error = 'Error de conexión con el servidor';
            })
            .finally(() => { this.loading = false; });
        },

        descargarPDF() {
            generarPdfCamasPrestadas({
                detalle: this.detalle,
                totales: this.totales,
                filtros: {
                    fechaInicio: this.fechaInicio,
                    fechaFin: this.fechaFin,
                    servicio: this.servicio,
                    especialidad: this.especialidad,
                    tipoIngreso: this.tipoIngreso
                },
                logoUrl: imgMarcaAgua
            });
        }
    }
};
</script>
