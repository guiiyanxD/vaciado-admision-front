<template>
    <div class="container-fluid">

        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Resumen de compensaciones</h1>
                <p class="text-muted">Horas pendientes de compensación por funcionario.</p>
            </div>
        </div>

        <!-- Filtros -->
        <div class="row justify-content-center mb-4">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Filtros</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-12">
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
                        </div>
                        <div class="row g-3 align-items-end mt-1">
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <select class="form-select" id="sel_funcionario" v-model="personalSeleccionado">
                                        <option :value="null">Todos</option>
                                        <option v-for="p in personal" :key="p.id" :value="p.id">
                                            {{ p.apellidos }}, {{ p.nombres }}
                                        </option>
                                    </select>
                                    <label for="sel_funcionario">Funcionario</label>
                                </div>
                            </div>
                            <div class="col-md-6 d-flex justify-content-end gap-2">
                                <button class="btn btn-outline-secondary" @click="seleccionarTodosAnhos">
                                    Todas las gestiones
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

        <div v-else-if="resumenAcumulado.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            No hay datos para el filtro seleccionado.
        </div>

        <!-- Tabla de resumen -->
        <div v-else class="row justify-content-center">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            Horas Pendientes de Compensación — Gestiones: {{ anhosEnTabla.join(', ') }}
                        </h5>
                        <div class="d-flex align-items-center gap-3">
                            <small class="text-muted">{{ resumenAcumulado.length }} funcionario(s)</small>
                            <button
                                class="btn btn-sm btn-outline-primary"
                                @click="descargarPdf"
                                :disabled="generandoPdf">
                                <span v-if="generandoPdf" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-file-earmark-pdf me-1"></i>
                                Descargar PDF
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover mb-0 text-center align-middle">
                                <thead class="table-dark">
                                    <tr>
                                        <th class="text-start align-middle" style="min-width:200px">Nombre Completo</th>
                                        <th class="text-nowrap">Horas Programadas</th>
                                        <th class="text-nowrap">Horas Pagadas</th>
                                        <th class="text-nowrap">Horas Impagas</th>
                                        <th class="text-nowrap">Permisos (hs)</th>
                                        <th class="text-nowrap">Saldo Pendiente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="fila in resumenAcumulado" :key="fila.personal_id">
                                        <td class="text-start fw-semibold">{{ fila.apellidos }}, {{ fila.nombres }}</td>
                                        <td>{{ formatHoras(fila.programadas) }}</td>
                                        <td>{{ formatHoras(fila.pagadas) }}</td>
                                        <td>{{ formatHoras(fila.impagas) }}</td>
                                        <td>{{ formatHoras(fila.permisos) }}</td>
                                        <td :class="getSaldoClass(fila.saldo)"><strong>{{ formatHoras(fila.saldo) }}</strong></td>
                                    </tr>
                                </tbody>
                                <tfoot v-if="resumenAcumulado.length > 1" class="table-dark fw-bold">
                                    <tr>
                                        <td class="text-start">TOTAL</td>
                                        <td>{{ formatHoras(totalGeneral.programadas) }}</td>
                                        <td>{{ formatHoras(totalGeneral.pagadas) }}</td>
                                        <td>{{ formatHoras(totalGeneral.impagas) }}</td>
                                        <td>{{ formatHoras(totalGeneral.permisos) }}</td>
                                        <td :class="getSaldoClass(totalGeneral.saldo)">{{ formatHoras(totalGeneral.saldo) }}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detalle por persona (accordion) -->
        <div v-if="consultado && resumenAcumulado.length > 0" class="row justify-content-center mt-4">
            <div class="col-12">
                <h5 class="mb-3"><i class="bi bi-person-lines-fill me-2"></i>Detalle mensual por funcionario</h5>
                <div class="accordion" id="accordionDetalle">
                    <div
                        v-for="fila in resumenAcumulado"
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
                                    :anhos="anhosEnTabla"
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
import { useToast } from 'vue-toastification'
import { getPersonalActivo, getResumenMultiAnho, getRegistrosPorPersonaAnho } from '@/services/compensacionesService';
import { formatHoras, getSaldoClass } from '@/utils/format';
import { generarPdfCompensacionesPendientes } from '@/services/pdfReporteGenerator';
import DetalleMensual from './reportes/DetalleMensualCompensacion.vue';
import imgMarcaAgua from '@/assets/cps_logo.png';

export default {
    name: 'ResumenCompensaciones',

    components: { DetalleMensual },

    mounted() {
        this.toast = useToast();
        this.cargarPersonal();
    },

    data() {
        const anhoActual = new Date().getFullYear();
        const anhosTodos = Array.from({ length: 7 }, (_, i) => anhoActual - 5 + i);

        return {
            anhosTodos,
            anhosSeleccionados:  [anhoActual],
            personal:            [],
            personalSeleccionado: null,
            resumenRaw:          [],
            cargando:            false,
            consultado:          false,
            generandoPdf:        false
        };
    },

    computed: {
        anhosEnTabla() {
            return [...this.anhosSeleccionados].sort((a, b) => a - b);
        },

        resumenAcumulado() {
            const mapa = {};
            this.resumenRaw.forEach(r => {
                if (!r.anho) return;
                const key = r.personal_id;
                if (!mapa[key]) {
                    mapa[key] = {
                        personal_id: r.personal_id,
                        nombres:     r.nombres,
                        apellidos:   r.apellidos,
                        programadas: 0,
                        pagadas:     0,
                        impagas:     0,
                        permisos:    0,
                        saldo:       0
                    };
                }
                mapa[key].programadas += parseFloat(r.total_programadas)   || 0;
                mapa[key].pagadas     += parseFloat(r.total_pagadas)       || 0;
                mapa[key].impagas     += parseFloat(r.horas_impagas)       || 0;
                mapa[key].permisos    += parseFloat(r.permisos_tomados)    || 0;
                mapa[key].saldo       += parseFloat(r.saldo_compensacion)  || 0;
            });

            let filas = Object.values(mapa);
            if (this.personalSeleccionado !== null) {
                filas = filas.filter(f => f.personal_id === this.personalSeleccionado);
            }
            return filas.sort((a, b) => b.saldo - a.saldo);
        },

        totalGeneral() {
            return this.resumenAcumulado.reduce((acc, f) => {
                acc.programadas += f.programadas;
                acc.pagadas     += f.pagadas;
                acc.impagas     += f.impagas;
                acc.permisos    += f.permisos;
                acc.saldo       += f.saldo;
                return acc;
            }, { programadas: 0, pagadas: 0, impagas: 0, permisos: 0, saldo: 0 });
        }
    },

    methods: {

        cargarPersonal() {
            getPersonalActivo()
                .then(data => {
                    if (data.status === 'success') this.personal = data.data;
                })
                .catch(err => this.toast.error('Error al cargar funcionarios: ' + err));
        },

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

            getResumenMultiAnho(this.anhosSeleccionados)
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

        descargarPdf() {
            if (this.resumenAcumulado.length === 0) return;
            this.generandoPdf = true;

            const promesas = this.resumenAcumulado.map(fila =>
                Promise.all(
                    this.anhosEnTabla.map(a =>
                        getRegistrosPorPersonaAnho({ personal_id: fila.personal_id, anho: a })
                        .then(d => ({ anho: a, datos: d.status === 'success' ? d.data : [] }))
                    )
                ).then(registrosPorAnho => ({ personal_id: fila.personal_id, registrosPorAnho }))
            );

            Promise.all(promesas)
                .then(resultados => {
                    const detallePorPersona = {};
                    resultados.forEach(r => { detallePorPersona[r.personal_id] = r.registrosPorAnho; });

                    generarPdfCompensacionesPendientes({
                        resumenAgrupado:    this.resumenAcumulado,
                        totalGeneral:       this.totalGeneral,
                        anhosSeleccionados: this.anhosEnTabla,
                        detallePorPersona,
                        logoUrl: imgMarcaAgua
                    });
                })
                .catch(err => this.toast.error('Error al generar el PDF: ' + err))
                .finally(() => { this.generandoPdf = false; });
        },

        formatHoras,
        getSaldoClass
    }
};
</script>

<style scoped>
.table th, .table td {
    vertical-align: middle;
    white-space: nowrap;
}
.accordion-button:not(.collapsed) {
    background-color: var(--color-primary-tint);
    color: var(--color-primary-darker);
}
</style>
