<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Dashboard de KPIs</h1>
                <p class="text-muted">Indicadores de ocupación, flujo de pacientes y aislamiento por servicio.</p>
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
                                    <input type="date" class="form-control" id="fechaInicio" v-model="fechaInicio" :disabled="loading">
                                    <label for="fechaInicio">Fecha inicio</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="date" class="form-control" id="fechaFin" v-model="fechaFin" :disabled="loading">
                                    <label for="fechaFin">Fecha fin</label>
                                </div>
                            </div>
                            <div class="col-md-4 d-flex align-items-center">
                                <button
                                    class="btn btn-primary w-100"
                                    @click="generarDashboard"
                                    :disabled="loading || !fechaInicio || !fechaFin"
                                >
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                                    <i v-else class="bi bi-search me-1"></i>
                                    {{ loading ? 'Generando...' : 'Generar' }}
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
            <p class="mt-2 text-muted">Generando dashboard...</p>
        </div>

        <div v-else-if="!haBuscado" class="text-center text-muted py-5">
            <i class="bi bi-bar-chart fs-1 d-block mb-2"></i>
            Completá el rango de fechas y presioná Generar.
        </div>

        <div v-else-if="kpis.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            No hay datos para el rango seleccionado.
        </div>

        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" v-for="grafico in graficos" :key="grafico.id">
                <div class="card shadow-sm h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">{{ grafico.titulo }}</h6>
                        <i
                            class="bi bi-info-circle text-muted"
                            style="cursor: pointer;"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            :title="grafico.info"
                        ></i>
                    </div>
                    <div class="card-body">
                        <div class="kpi-chart-container">
                            <canvas :ref="grafico.ref"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reporteKpis } from '@/services/censoService';
import { crearBarraMagnitud, crearBarraComposicion } from '@/utils/kpiCharts';

const GRAFICOS = [
    {
        id: 'ocupacion',
        ref: 'refOcupacion',
        titulo: 'Tasa de ocupación',
        info: 'Porcentaje de camas ocupadas respecto a la dotación total de cada servicio, en el período seleccionado.'
    },
    {
        id: 'bloqueadas',
        ref: 'refBloqueadas',
        titulo: '% de camas bloqueadas',
        info: 'Porcentaje de camas fuera de uso (bloqueadas) respecto a la dotación total de cada servicio.'
    },
    {
        id: 'dependencia',
        ref: 'refDependencia',
        titulo: 'Dependencia de camas prestadas',
        info: 'Porcentaje de la ocupación total de cada servicio que corresponde a camas prestadas a pacientes de otras especialidades.'
    },
    {
        id: 'ingreso',
        ref: 'refIngreso',
        titulo: 'Ingreso directo vs. traslado',
        info: 'De todos los ingresos de cada servicio, qué porcentaje llegó de forma directa y qué porcentaje por traslado desde otro servicio o institución.'
    },
    {
        id: 'egreso',
        ref: 'refEgreso',
        titulo: 'Egreso directo vs. traslado',
        info: 'De todos los egresos de cada servicio, qué porcentaje fue alta directa y qué porcentaje por traslado a otro servicio o institución.'
    },
    {
        id: 'aislamiento',
        ref: 'refAislamiento',
        titulo: 'Días-cama de aislamiento',
        info: 'Suma total de días-cama en aislamiento registrados por cada servicio durante el período seleccionado.'
    }
];

export default {
    name: 'DashboardKpis',

    data() {
        return {
            fechaInicio: '',
            fechaFin: '',
            kpis: [],
            loading: false,
            error: null,
            haBuscado: false,
            graficos: GRAFICOS
        };
    },

    beforeUnmount() {
        this.destruirGraficos();
    },

    methods: {
        generarDashboard() {
            if (!this.fechaInicio || !this.fechaFin) {
                this.error = 'Por favor, seleccioná ambas fechas';
                return;
            }

            this.loading = true;
            this.error = null;

            reporteKpis({ fechaInicio: this.fechaInicio, fechaFin: this.fechaFin })
                .then(result => {
                    if (result.status === 'success') {
                        this.kpis = result.data;
                        this.haBuscado = true;
                    } else {
                        this.error = result.message || 'Error al obtener el dashboard';
                    }
                })
                .catch(() => {
                    this.error = 'Error de conexión con el servidor';
                })
                .finally(() => {
                    this.loading = false;
                    // Esperar a que Vue termine de renderizar el bloque v-else
                    // (con los <canvas>) antes de intentar dibujar los gráficos.
                    this.$nextTick(() => {
                        if (this.kpis.length > 0) {
                            this.renderizarGraficos();
                            this.activarTooltips();
                        }
                    });
                });
        },

        destruirGraficos() {
            if (!this._charts) return;
            Object.values(this._charts).forEach(chart => chart.destroy());
            this._charts = {};
        },

        obtenerCanvas(refName) {
            const resuelto = this.$refs[refName];
            return Array.isArray(resuelto) ? resuelto[0] : resuelto;
        },

        renderizarGraficos() {
            this.destruirGraficos();
            this._charts = {};

            const servicios = this.kpis.map(k => k.servicio);

            this._charts.ocupacion = crearBarraMagnitud(this.obtenerCanvas('refOcupacion'), {
                servicios,
                valores: this.kpis.map(k => k.tasa_ocupacion ?? 0)
            });

            this._charts.bloqueadas = crearBarraMagnitud(this.obtenerCanvas('refBloqueadas'), {
                servicios,
                valores: this.kpis.map(k => k.pct_bloqueadas ?? 0)
            });

            this._charts.dependencia = crearBarraMagnitud(this.obtenerCanvas('refDependencia'), {
                servicios,
                valores: this.kpis.map(k => k.indice_dependencia_camas_prestadas ?? 0)
            });

            this._charts.aislamiento = crearBarraMagnitud(this.obtenerCanvas('refAislamiento'), {
                servicios,
                valores: this.kpis.map(k => k.dias_cama_aislamiento ?? 0),
                sufijo: ' días'
            });

            this._charts.ingreso = crearBarraComposicion(this.obtenerCanvas('refIngreso'), {
                servicios,
                directos: this.kpis.map(k => k.pct_ingreso_directo ?? 0),
                traslados: this.kpis.map(k => k.pct_ingreso_traslado ?? 0)
            });

            this._charts.egreso = crearBarraComposicion(this.obtenerCanvas('refEgreso'), {
                servicios,
                directos: this.kpis.map(k => k.pct_egreso_directo ?? 0),
                traslados: this.kpis.map(k => k.pct_egreso_traslado ?? 0)
            });
        },

        activarTooltips() {
            const elementos = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
            elementos.forEach(el => {
                bootstrap.Tooltip.getOrCreateInstance(el);
            });
        }
    }
};
</script>

<style scoped>
.kpi-chart-container {
    position: relative;
    height: 260px;
}
</style>
