<template>
    <div class="container-fluid">

        <div class="row">
            <div class="col-md-12 text-center">
                <h1>Resumen de Compensaciones</h1>
            </div>
        </div>

        <hr>

        <!-- Filtros -->
        <div class="row justify-content-center mb-4">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Filtros</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-8">
                                <label class="form-label fw-semibold">Gestiones a mostrar</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div
                                        v-for="a in anhosTodos"
                                        :key="a"
                                        class="form-check form-check-inline">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            :id="'chk_anho_' + a"
                                            :value="a"
                                            v-model="anhosSeleccionados"
                                        >
                                        <label class="form-check-label" :for="'chk_anho_' + a">{{ a }}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 d-flex justify-content-end gap-2">
                                <button class="btn btn-outline-secondary" @click="seleccionarTodosAnhos">
                                    Todos
                                </button>
                                <button
                                    class="btn btn-primary"
                                    @click="cargarResumen"
                                    :disabled="cargando || anhosSeleccionados.length === 0">
                                    <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
                                    <i v-else class="bi bi-search me-1"></i>
                                    Consultar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado vacío / cargando -->
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Cargando resumen...</p>
        </div>

        <div v-else-if="!consultado" class="text-center text-muted py-5">
            <i class="bi bi-table fs-1 d-block mb-2"></i>
            Seleccione una o más gestiones y haga clic en Consultar.
        </div>

        <div v-else-if="resumenAgrupado.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            No hay datos para las gestiones seleccionadas.
        </div>

        <!-- Tabla de resumen -->
        <div v-else class="row justify-content-center">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            Horas Extras No Pagadas — Gestiones: {{ anhosSeleccionados.join(', ') }}
                        </h5>
                        <small class="text-muted">{{ resumenAgrupado.length }} funcionario(s)</small>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover mb-0 text-center align-middle">
                                <thead>
                                    <!-- Fila 1: agrupadores de año -->
                                    <tr class="table-dark">
                                        <th rowspan="2" class="text-start align-middle" style="min-width:200px">
                                            Nombre Completo
                                        </th>
                                        <th
                                            v-for="a in anhosEnTabla"
                                            :key="a"
                                            colspan="3"
                                            class="text-center">
                                            Gestión {{ a }}
                                        </th>
                                    </tr>
                                    <!-- Fila 2: columnas por año -->
                                    <tr class="table-secondary">
                                        <template v-for="a in anhosEnTabla" :key="'hdr_' + a">
                                            <th class="text-nowrap">Horas Impagas</th>
                                            <th class="text-nowrap">Permisos (hs)</th>
                                            <th class="text-nowrap">Saldo Compensación</th>
                                        </template>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="fila in resumenAgrupado" :key="fila.personal_id">
                                        <td class="text-start fw-semibold">
                                            {{ fila.apellidos }}, {{ fila.nombres }}
                                        </td>
                                        <template v-for="a in anhosEnTabla" :key="'cel_' + fila.personal_id + '_' + a">
                                            <td>{{ formatHoras(fila.porAnho[a]?.horas_impagas) }}</td>
                                            <td>{{ formatHoras(fila.porAnho[a]?.permisos_tomados) }}</td>
                                            <td :class="getSaldoClass(fila.porAnho[a]?.saldo_compensacion)">
                                                <strong>{{ formatHoras(fila.porAnho[a]?.saldo_compensacion) }}</strong>
                                            </td>
                                        </template>
                                    </tr>
                                </tbody>
                                <!-- Totales por columna -->
                                <tfoot class="table-dark fw-bold">
                                    <tr>
                                        <td class="text-start">TOTAL</td>
                                        <template v-for="a in anhosEnTabla" :key="'tot_' + a">
                                            <td>{{ formatHoras(totalesPorAnho[a]?.horas_impagas) }}</td>
                                            <td>{{ formatHoras(totalesPorAnho[a]?.permisos_tomados) }}</td>
                                            <td :class="getSaldoClass(totalesPorAnho[a]?.saldo_compensacion)">
                                                {{ formatHoras(totalesPorAnho[a]?.saldo_compensacion) }}
                                            </td>
                                        </template>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detalle por persona (accordion) -->
        <div v-if="consultado && resumenAgrupado.length > 0" class="row justify-content-center mt-4">
            <div class="col-12">
                <h5 class="mb-3"><i class="bi bi-person-lines-fill me-2"></i>Detalle mensual por funcionario</h5>
                <div class="accordion" id="accordionDetalle">
                    <div
                        v-for="(fila) in resumenAgrupado"
                        :key="'acc_' + fila.personal_id"
                        class="accordion-item">
                        <h2 class="accordion-header">
                            <button
                                class="accordion-button collapsed fw-semibold"
                                type="button"
                                :data-bs-target="'#acc_body_' + fila.personal_id"
                                data-bs-toggle="collapse"
                                aria-expanded="false">
                                {{ fila.apellidos }}, {{ fila.nombres }}
                            </button>
                        </h2>
                        <div
                            :id="'acc_body_' + fila.personal_id"
                            class="accordion-collapse collapse"
                            data-bs-parent="#accordionDetalle">
                            <div class="accordion-body p-0">
                                <detalle-mensual
                                    :personal-id="fila.personal_id"
                                    :nombre="fila.apellidos + ', ' + fila.nombres"
                                    :anhos="anhosSeleccionados"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_API_URL;
import { useToast } from 'vue-toastification'

// Sub-componente inline: tabla mensual de una persona
const DetalleMensual = {
    name: 'DetalleMensual',
    props: {
        personalId: { type: Number, required: true },
        nombre:     { type: String, required: true },
        anhos:      { type: Array,  required: true }
    },
    data() {
        return {
            registros: [],
            cargando:  false,
            cargado:   false
        };
    },
    watch: {
        anhos: {
            handler() { this.cargado = false; this.registros = []; },
            deep: true
        }
    },
    mounted() {
        this.toast = useToast();
        this.cargar();
    },
    methods: {
        cargar() {
            if (this.cargado) return;
            this.cargando = true;

            const promesas = this.anhos.map(a =>
                fetch(`${API_BASE_URL}/compensaciones/persona-anho`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ personal_id: this.personalId, anho: a })
                })
                .then(r => r.json())
                .then(d => ({ anho: a, datos: d.status === 'success' ? d.data : [] }))
            );

            Promise.all(promesas)
                .then(resultados => {
                    this.registros = resultados;
                    this.cargado   = true;
                })
                .finally(() => { this.cargando = false; });
        },
        formatHoras(v) {
            if (v === null || v === undefined) return '—';
            return parseFloat(v).toFixed(2);
        },
        getSaldoClass(v) {
            if (v === null || v === undefined) return '';
            return parseFloat(v) >= 0 ? 'text-success' : 'text-danger';
        }
    },
    template: `
        <div class="p-3">
            <div v-if="cargando" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else-if="registros.length === 0" class="text-muted text-center py-2">Sin datos</div>
            <div v-else>
                <div v-for="bloque in registros" :key="bloque.anho" class="mb-3">
                    <h6 class="fw-bold text-primary mb-1">Gestión {{ bloque.anho }}</h6>
                    <div v-if="!bloque.datos || bloque.datos.length === 0" class="text-muted small">Sin registros</div>
                    <table v-else class="table table-sm table-bordered text-center mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Mes</th>
                                <th>Horas Programadas</th>
                                <th>Horas Pagadas</th>
                                <th>Permisos (hs)</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in bloque.datos" :key="r.mes">
                                <td>{{ nombreMes(r.mes) }}</td>
                                <td>{{ formatHoras(r.horas_programadas) }}</td>
                                <td>{{ formatHoras(r.horas_pagadas) }}</td>
                                <td>{{ formatHoras(r.permisos_horas) }}</td>
                                <td :class="getSaldoClass(r.saldo_horas)"><strong>{{ formatHoras(r.saldo_horas) }}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    computed: {
        nombreMesMixin() { return {}; }
    },
    setup() {
        const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        return {
            nombreMes: (n) => meses[(parseInt(n) - 1)] || n
        };
    }
};

export default {
    name: 'ResumenCompensaciones',

    components: { DetalleMensual },

    data() {
        const anhoActual = new Date().getFullYear();
        const anhosTodos = Array.from({ length: 7 }, (_, i) => anhoActual - 5 + i);

        return {
            anhosTodos,
            anhosSeleccionados: [anhoActual],
            resumenRaw:         [],
            cargando:           false,
            consultado:         false
        };
    },

    computed: {
        anhosEnTabla() {
            return [...this.anhosSeleccionados].sort((a, b) => a - b);
        },

        resumenAgrupado() {
            const mapa = {};
            this.resumenRaw.forEach(r => {
                if (!r.anho) return;
                const key = r.personal_id;
                if (!mapa[key]) {
                    mapa[key] = {
                        personal_id: r.personal_id,
                        nombres:     r.nombres,
                        apellidos:   r.apellidos,
                        porAnho:     {}
                    };
                }
                mapa[key].porAnho[r.anho] = {
                    horas_impagas:      parseFloat(r.horas_impagas)      || 0,
                    permisos_tomados:   parseFloat(r.permisos_tomados)   || 0,
                    saldo_compensacion: parseFloat(r.saldo_compensacion) || 0
                };
            });

            return Object.values(mapa).sort((a, b) =>
                a.apellidos.localeCompare(b.apellidos)
            );
        },

        totalesPorAnho() {
            const totales = {};
            this.anhosEnTabla.forEach(a => {
                totales[a] = { horas_impagas: 0, permisos_tomados: 0, saldo_compensacion: 0 };
            });
            this.resumenAgrupado.forEach(fila => {
                this.anhosEnTabla.forEach(a => {
                    if (fila.porAnho[a]) {
                        totales[a].horas_impagas      += fila.porAnho[a].horas_impagas;
                        totales[a].permisos_tomados   += fila.porAnho[a].permisos_tomados;
                        totales[a].saldo_compensacion += fila.porAnho[a].saldo_compensacion;
                    }
                });
            });
            return totales;
        }
    },

    methods: {

        seleccionarTodosAnhos() {
            this.anhosSeleccionados = [...this.anhosTodos];
        },

        cargarResumen() {
            if (this.anhosSeleccionados.length === 0) {
                this.toast.error('Seleccione al menos una gestión');
                return;
            }
            this.cargando   = true;
            this.consultado = false;

            fetch(`${API_BASE_URL}/compensaciones/resumen-multi-anho`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anhos: this.anhosSeleccionados })
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    this.resumenRaw = data.data || [];
                    this.consultado = true;
                } else {
                    this.toast.error(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.cargando = false; });
        },

        formatHoras(v) {
            if (v === null || v === undefined) return '—';
            return parseFloat(v).toFixed(2);
        },

        getSaldoClass(v) {
            if (v === null || v === undefined) return '';
            return parseFloat(v) >= 0 ? 'text-success' : 'text-danger';
        }
    }
};
</script>

<style scoped>
.table th, .table td {
    vertical-align: middle;
    white-space: nowrap;
}
.accordion-button:not(.collapsed) {
    background-color: #e8f0fe;
    color: #0d47a1;
}
</style>