<template>
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
</template>

<script>
import { useToast } from 'vue-toastification';
import { getRegistrosPorPersonaAnho } from '@/services/compensacionesService';
import { formatHoras, getSaldoClass } from '@/utils/format';

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default {
    name: 'DetalleMensualCompensacion',

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
                getRegistrosPorPersonaAnho({ personal_id: this.personalId, anho: a })
                .then(d => ({ anho: a, datos: d.status === 'success' ? d.data : [] }))
            );

            Promise.all(promesas)
                .then(resultados => {
                    this.registros = resultados;
                    this.cargado   = true;
                })
                .finally(() => { this.cargando = false; });
        },
        formatHoras,
        getSaldoClass,
        nombreMes(n) {
            return MESES_CORTOS[parseInt(n) - 1] || n;
        }
    }
};
</script>
