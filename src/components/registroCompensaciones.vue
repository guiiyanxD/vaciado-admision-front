<template>
    <div class="container">

        <div class="row">
            <div class="col-md-12 text-center">
                <h1>Registro de Compensaciones</h1>
            </div>
        </div>

        <hr>

        <!-- Selector de persona / período -->
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="bi bi-search me-2"></i>Seleccionar Registro</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <!-- Funcionario -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <select
                                        class="form-select"
                                        id="sel_personal"
                                        v-model="seleccion.personal_id"
                                        @change="onCambioSeleccion">
                                        <option :value="null" disabled>Seleccione un funcionario</option>
                                        <option v-for="p in personal" :key="p.id" :value="p.id">
                                            {{ p.apellidos }}, {{ p.nombres }}
                                        </option>
                                    </select>
                                    <label for="sel_personal">Funcionario</label>
                                </div>
                            </div>
                            <!-- Mes -->
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select
                                        class="form-select"
                                        id="sel_mes"
                                        v-model="seleccion.mes"
                                        @change="onCambioSeleccion">
                                        <option :value="null" disabled>Mes</option>
                                        <option v-for="m in meses" :key="m.valor" :value="m.valor">
                                            {{ m.nombre }}
                                        </option>
                                    </select>
                                    <label for="sel_mes">Mes</label>
                                </div>
                            </div>
                            <!-- Año -->
                            <div class="col-md-3">
                                <div class="form-floating">
                                    <select
                                        class="form-select"
                                        id="sel_anho"
                                        v-model="seleccion.anho"
                                        @change="onCambioSeleccion">
                                        <option :value="null" disabled>Año</option>
                                        <option v-for="a in anhos" :key="a" :value="a">{{ a }}</option>
                                    </select>
                                    <label for="sel_anho">Año</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulario de ingreso -->
        <div class="row justify-content-center mt-4" v-if="mostrarFormulario">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center"
                         :class="registroExistente ? 'bg-warning text-dark' : 'bg-success text-white'">
                        <h5 class="mb-0">
                            <i :class="registroExistente ? 'bi bi-pencil-square me-2' : 'bi bi-plus-circle me-2'"></i>
                            {{ registroExistente ? 'Actualizar Registro' : 'Nuevo Registro' }}
                            — {{ nombrePersonaSeleccionada }} | {{ nombreMesSeleccionado }} {{ seleccion.anho }}
                        </h5>
                        <span v-if="registroExistente" class="badge bg-dark">Editando registro existente</span>
                        <span v-else class="badge bg-white text-success">Nuevo registro</span>
                    </div>
                    <div class="card-body">

                        <div v-if="buscandoRegistro" class="text-center py-3">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted">Buscando registro...</p>
                        </div>

                        <div v-else>
                            <div class="row g-3">
                                <!-- Horas Programadas -->
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input
                                            class="form-control"
                                            type="number"
                                            id="inp_programadas"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            v-model.number="form.horas_programadas"
                                            @input="calcularSaldo"
                                            :class="{ 'is-invalid': errores.horas_programadas }"
                                        >
                                        <label for="inp_programadas">
                                            <i class="bi bi-clock me-1"></i>Horas Programadas
                                        </label>
                                        <div class="invalid-feedback">{{ errores.horas_programadas }}</div>
                                    </div>
                                </div>
                                <!-- Horas Pagadas -->
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input
                                            class="form-control"
                                            type="number"
                                            id="inp_pagadas"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            v-model.number="form.horas_pagadas"
                                            @input="calcularSaldo"
                                            :class="{ 'is-invalid': errores.horas_pagadas }"
                                        >
                                        <label for="inp_pagadas">
                                            <i class="bi bi-cash-coin me-1"></i>Horas Pagadas
                                        </label>
                                        <div class="invalid-feedback">{{ errores.horas_pagadas }}</div>
                                    </div>
                                </div>
                                <!-- Permisos en Horas -->
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input
                                            class="form-control"
                                            type="number"
                                            id="inp_permisos"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            v-model.number="form.permisos_horas"
                                            @input="calcularSaldo"
                                            :class="{ 'is-invalid': errores.permisos_horas }"
                                        >
                                        <label for="inp_permisos">
                                            <i class="bi bi-calendar-check me-1"></i>Permisos (horas)
                                        </label>
                                        <div class="invalid-feedback">{{ errores.permisos_horas }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Saldo calculado -->
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <div class="alert d-flex align-items-center justify-content-between mb-0"
                                         :class="saldoCalculado >= 0 ? 'alert-success' : 'alert-danger'">
                                        <div>
                                            <i class="bi bi-calculator me-2 fs-5"></i>
                                            <strong>Saldo de Horas para Compensación:</strong>
                                        </div>
                                        <span class="fs-4 fw-bold">
                                            {{ saldoCalculado.toFixed(2) }} hs
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Fórmula -->
                            <div class="row mt-2">
                                <div class="col-md-12">
                                    <small class="text-muted">
                                        <i class="bi bi-info-circle me-1"></i>
                                        Saldo = Horas Programadas ({{ form.horas_programadas || 0 }})
                                        − Horas Pagadas ({{ form.horas_pagadas || 0 }})
                                        − Permisos ({{ form.permisos_horas || 0 }})
                                    </small>
                                </div>
                            </div>

                            <!-- Acciones -->
                            <div class="row mt-4">
                                <div class="col-md-12 d-flex justify-content-between">
                                    <button
                                        v-if="registroExistente"
                                        class="btn btn-outline-danger"
                                        @click="confirmarEliminar"
                                        :disabled="guardando">
                                        <i class="bi bi-trash me-1"></i> Eliminar registro
                                    </button>
                                    <div v-else></div>

                                    <div>
                                        <button
                                            class="btn btn-secondary me-2"
                                            @click="limpiarFormulario">
                                            <i class="bi bi-x-circle me-1"></i> Limpiar
                                        </button>
                                        <button
                                            class="btn btn-primary"
                                            @click="guardarRegistro"
                                            :disabled="guardando">
                                            <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                                            <i v-else class="bi bi-floppy me-1"></i>
                                            {{ registroExistente ? 'Actualizar' : 'Guardar' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="!mostrarFormulario" class="row justify-content-center mt-4">
            <div class="col-md-6 text-center text-muted">
                <i class="bi bi-arrow-up-circle fs-1 d-block mb-2"></i>
                Seleccione un funcionario, mes y año para continuar.
            </div>
        </div>

        <!-- Modal Confirmar Eliminar -->
        <div class="modal fade" id="modalEliminarComp" tabindex="-1" aria-hidden="true" ref="modalEliminar">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar eliminación
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Está seguro que desea eliminar el registro de:</p>
                        <p class="fw-bold">
                            {{ nombrePersonaSeleccionada }} — {{ nombreMesSeleccionado }} {{ seleccion.anho }}
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            @click="eliminarRegistro"
                            :disabled="eliminando">
                            <span v-if="eliminando" class="spinner-border spinner-border-sm me-1"></span>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_API_URL;
import { useToast } from 'vue-toastification'

const MESES = [
    { valor: 1,  nombre: 'Enero' },
    { valor: 2,  nombre: 'Febrero' },
    { valor: 3,  nombre: 'Marzo' },
    { valor: 4,  nombre: 'Abril' },
    { valor: 5,  nombre: 'Mayo' },
    { valor: 6,  nombre: 'Junio' },
    { valor: 7,  nombre: 'Julio' },
    { valor: 8,  nombre: 'Agosto' },
    { valor: 9,  nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
];

export default {
    name: 'RegistroCompensaciones',

    data() {
        const anhoActual = new Date().getFullYear();
        // Generar rango de años: 5 años atrás hasta el actual + 1
        const anhos = Array.from({ length: 7 }, (_, i) => anhoActual - 5 + i);

        return {
            personal:         [],
            meses:            MESES,
            anhos,
            seleccion: {
                personal_id: null,
                mes:         null,
                anho:        anhoActual
            },
            form: {
                horas_programadas: 0,
                horas_pagadas:     0,
                permisos_horas:    0
            },
            errores: {
                horas_programadas: '',
                horas_pagadas:     '',
                permisos_horas:    ''
            },
            saldoCalculado:    0,
            registroExistente: false,
            buscandoRegistro:  false,
            guardando:         false,
            eliminando:        false,
            modalEliminarInst: null
        };
    },

    computed: {
        mostrarFormulario() {
            return this.seleccion.personal_id && this.seleccion.mes && this.seleccion.anho;
        },
        nombrePersonaSeleccionada() {
            if (!this.seleccion.personal_id) return '';
            const p = this.personal.find(x => x.id === this.seleccion.personal_id);
            return p ? `${p.apellidos}, ${p.nombres}` : '';
        },
        nombreMesSeleccionado() {
            if (!this.seleccion.mes) return '';
            const m = this.meses.find(x => x.valor === this.seleccion.mes);
            return m ? m.nombre : '';
        }
    },

    mounted() {
        this.cargarPersonal();
        this.toast = useToast();
        this.modalEliminarInst = new bootstrap.Modal(this.$refs.modalEliminar);
    },

    methods: {

        cargarPersonal() {
            fetch(`${API_BASE_URL}/compensaciones/personal/activo`)
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'success') this.personal = data.data;
                })
                .catch(err => this.toast.error('Error al cargar personal: ' + err));
        },

        onCambioSeleccion() {
            if (!this.mostrarFormulario) return;
            this.buscarRegistro();
        },

        buscarRegistro() {
            this.buscandoRegistro  = true;
            this.registroExistente = false;
            this.resetForm();

            fetch(`${API_BASE_URL}/compensaciones/registro/buscar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personal_id: this.seleccion.personal_id,
                    anho:        this.seleccion.anho,
                    mes:         this.seleccion.mes
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    this.form.horas_programadas = parseFloat(data.data.horas_programadas);
                    this.form.horas_pagadas     = parseFloat(data.data.horas_pagadas);
                    this.form.permisos_horas    = parseFloat(data.data.permisos_horas);
                    this.registroExistente      = true;
                    this.calcularSaldo();
                }
            })
            .catch(err => this.toast.error('Error al buscar registro: ' + err))
            .finally(() => { this.buscandoRegistro = false; });
        },

        calcularSaldo() {
            const prog  = parseFloat(this.form.horas_programadas) || 0;
            const pag   = parseFloat(this.form.horas_pagadas)     || 0;
            const perm  = parseFloat(this.form.permisos_horas)    || 0;
            this.saldoCalculado = prog - pag - perm;
        },

        validarForm() {
            let valido = true;
            this.errores = { horas_programadas: '', horas_pagadas: '', permisos_horas: '' };

            if (this.form.horas_programadas === '' || this.form.horas_programadas === null) {
                this.errores.horas_programadas = 'Campo requerido';
                valido = false;
            } else if (this.form.horas_programadas < 0) {
                this.errores.horas_programadas = 'No puede ser negativo';
                valido = false;
            }

            if (this.form.horas_pagadas === '' || this.form.horas_pagadas === null) {
                this.errores.horas_pagadas = 'Campo requerido';
                valido = false;
            } else if (this.form.horas_pagadas < 0) {
                this.errores.horas_pagadas = 'No puede ser negativo';
                valido = false;
            }

            if (this.form.permisos_horas === '' || this.form.permisos_horas === null) {
                this.errores.permisos_horas = 'Campo requerido';
                valido = false;
            } else if (this.form.permisos_horas < 0) {
                this.errores.permisos_horas = 'No puede ser negativo';
                valido = false;
            }

            return valido;
        },

        guardarRegistro() {
            if (!this.validarForm()) return;
            this.guardando = true;

            fetch(`${API_BASE_URL}/compensaciones/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personal_id:      this.seleccion.personal_id,
                    anho:             this.seleccion.anho,
                    mes:              this.seleccion.mes,
                    horas_programadas: this.form.horas_programadas,
                    horas_pagadas:     this.form.horas_pagadas,
                    permisos_horas:    this.form.permisos_horas
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    this.toast.success(data.message);
                    this.registroExistente = true;
                } else {
                    this.toast.error(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.guardando = false; });
        },

        confirmarEliminar() {
            this.modalEliminarInst.show();
        },

        eliminarRegistro() {
            this.eliminando = true;

            fetch(`${API_BASE_URL}/compensaciones/registro`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personal_id: this.seleccion.personal_id,
                    anho:        this.seleccion.anho,
                    mes:         this.seleccion.mes
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    this.toast.success(data.message);
                    this.modalEliminarInst.hide();
                    this.limpiarFormulario();
                } else {
                    this.toast.error(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.eliminando = false; });
        },

        resetForm() {
            this.form = { horas_programadas: 0, horas_pagadas: 0, permisos_horas: 0 };
            this.errores = { horas_programadas: '', horas_pagadas: '', permisos_horas: '' };
            this.saldoCalculado = 0;
        },

        limpiarFormulario() {
            this.resetForm();
            this.registroExistente = false;
        }
    }
};
</script>