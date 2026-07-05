<template>
    <div class="container">

        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Descontar horas de compensación</h1>
                <p class="text-muted">Registrá pagos parciales o permisos otorgados contra el saldo pendiente de una gestión.</p>
            </div>
        </div>

        <!-- Selector de funcionario -->
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="bi bi-search me-2"></i>Seleccionar Funcionario</h5>
                    </div>
                    <div class="card-body">
                        <div class="form-floating">
                            <select class="form-select" id="sel_personal" v-model="personalSeleccionado" @change="onCambioFuncionario">
                                <option :value="null" disabled>Seleccione un funcionario</option>
                                <option v-for="p in personal" :key="p.id" :value="p.id">
                                    {{ p.apellidos }}, {{ p.nombres }}
                                </option>
                            </select>
                            <label for="sel_personal">Funcionario</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulario de descuento -->
        <div v-if="personalSeleccionado" class="row justify-content-center mt-4">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"><i class="bi bi-dash-circle me-2"></i>Nuevo descuento — {{ nombrePersonaSeleccionada }}</h5>
                    </div>
                    <div class="card-body">

                        <div v-if="cargandoSaldos" class="text-center py-3">
                            <div class="spinner-border text-primary" role="status"></div>
                        </div>

                        <div v-else-if="gestionesConSaldo.length === 0" class="text-center text-muted py-3">
                            <i class="bi bi-check-circle fs-1 d-block mb-2"></i>
                            Este funcionario no tiene saldo pendiente en ninguna gestión.
                        </div>

                        <div v-else>
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="sel_gestion" v-model="form.anho" :class="{ 'is-invalid': errores.anho }">
                                            <option
                                                v-for="g in gestionesConSaldo"
                                                :key="g.anho"
                                                :value="g.anho">
                                                Gestión {{ g.anho }} — pendiente {{ formatHoras(g.saldo_neto) }} hs
                                            </option>
                                        </select>
                                        <label for="sel_gestion">Gestión (sugerida: la más antigua con saldo)</label>
                                        <div class="invalid-feedback">{{ errores.anho }}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input
                                            class="form-control"
                                            type="number"
                                            id="inp_horas"
                                            placeholder="0"
                                            min="0.01"
                                            step="0.01"
                                            v-model.number="form.horas_descontadas"
                                            :class="{ 'is-invalid': errores.horas_descontadas }"
                                        >
                                        <label for="inp_horas"><i class="bi bi-clock-history me-1"></i>Horas a descontar</label>
                                        <div class="invalid-feedback">{{ errores.horas_descontadas }}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input class="form-control" type="date" id="inp_fecha" v-model="form.fecha_descuento">
                                        <label for="inp_fecha">Fecha del descuento</label>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-floating">
                                        <input
                                            class="form-control"
                                            type="text"
                                            id="inp_motivo"
                                            placeholder="Motivo"
                                            v-model="form.motivo"
                                            maxlength="255"
                                        >
                                        <label for="inp_motivo">Motivo (ej. pago parcial en efectivo, permiso adicional otorgado)</label>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <small class="text-muted">
                                        <i class="bi bi-info-circle me-1"></i>
                                        Saldo pendiente de la gestión seleccionada: <strong>{{ formatHoras(saldoSeleccionado) }} hs</strong>
                                    </small>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12 text-end">
                                    <button class="btn btn-primary" @click="guardarDescuento" :disabled="guardando">
                                        <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                                        <i v-else class="bi bi-floppy me-1"></i>
                                        Registrar descuento
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Historial de descuentos -->
        <div v-if="personalSeleccionado && !cargandoDescuentos && descuentos.length > 0" class="row justify-content-center mt-4">
            <div class="col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Historial de descuentos</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover mb-0 text-center align-middle">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Gestión</th>
                                        <th>Horas descontadas</th>
                                        <th>Fecha</th>
                                        <th>Motivo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="d in descuentos" :key="d.id">
                                        <td>{{ d.anho }}</td>
                                        <td>{{ formatHoras(d.horas_descontadas) }}</td>
                                        <td>{{ d.fecha_descuento }}</td>
                                        <td class="text-start">{{ d.motivo || '—' }}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-danger" @click="confirmarEliminar(d)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmar Eliminar -->
        <div class="modal fade" id="modalEliminarDescuento" tabindex="-1" aria-hidden="true" ref="modalEliminar">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar eliminación</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="descuentoAEliminar">
                        <p>¿Está seguro que desea eliminar este descuento?</p>
                        <p class="fw-bold">
                            Gestión {{ descuentoAEliminar.anho }} — {{ formatHoras(descuentoAEliminar.horas_descontadas) }} hs
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" @click="eliminarDescuentoConfirmado" :disabled="eliminando">
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
import { useToast } from 'vue-toastification';
import {
    getPersonalActivo,
    getSaldoPendientePorGestion,
    registrarDescuento,
    getDescuentosPorPersona,
    eliminarDescuento
} from '@/services/compensacionesService';
import { formatHoras } from '@/utils/format';

export default {
    name: 'CompensacionesDescuento',

    data() {
        return {
            personal:             [],
            personalSeleccionado: null,
            saldosPorGestion:     [],
            cargandoSaldos:       false,
            descuentos:           [],
            cargandoDescuentos:   false,
            form: {
                anho:               null,
                horas_descontadas:  null,
                motivo:             '',
                fecha_descuento:    new Date().toISOString().slice(0, 10)
            },
            errores: { anho: '', horas_descontadas: '' },
            guardando:          false,
            eliminando:         false,
            descuentoAEliminar: null,
            modalEliminarInst:  null
        };
    },

    computed: {
        nombrePersonaSeleccionada() {
            const p = this.personal.find(x => x.id === this.personalSeleccionado);
            return p ? `${p.apellidos}, ${p.nombres}` : '';
        },
        gestionesConSaldo() {
            return this.saldosPorGestion.filter(g => parseFloat(g.saldo_neto) > 0);
        },
        saldoSeleccionado() {
            const g = this.gestionesConSaldo.find(x => x.anho === this.form.anho);
            return g ? parseFloat(g.saldo_neto) : 0;
        }
    },

    mounted() {
        this.toast = useToast();
        this.cargarPersonal();
        this.modalEliminarInst = new bootstrap.Modal(this.$refs.modalEliminar);
    },

    methods: {

        cargarPersonal() {
            getPersonalActivo()
                .then(data => {
                    if (data.status === 'success') this.personal = data.data;
                })
                .catch(err => this.toast.error('Error al cargar funcionarios: ' + err));
        },

        onCambioFuncionario() {
            this.resetForm();
            this.cargarSaldos();
            this.cargarDescuentos();
        },

        cargarSaldos() {
            this.cargandoSaldos = true;
            getSaldoPendientePorGestion(this.personalSeleccionado)
                .then(data => {
                    if (data.status === 'success') {
                        this.saldosPorGestion = data.data || [];
                        const primeraConSaldo = this.gestionesConSaldo[0];
                        this.form.anho = primeraConSaldo ? primeraConSaldo.anho : null;
                    }
                })
                .catch(err => this.toast.error('Error al cargar el saldo pendiente: ' + err))
                .finally(() => { this.cargandoSaldos = false; });
        },

        cargarDescuentos() {
            this.cargandoDescuentos = true;
            getDescuentosPorPersona(this.personalSeleccionado)
                .then(data => {
                    if (data.status === 'success') this.descuentos = data.data || [];
                })
                .catch(err => this.toast.error('Error al cargar el historial: ' + err))
                .finally(() => { this.cargandoDescuentos = false; });
        },

        validarForm() {
            let valido = true;
            this.errores = { anho: '', horas_descontadas: '' };

            if (!this.form.anho) {
                this.errores.anho = 'Seleccione una gestión';
                valido = false;
            }

            const horas = parseFloat(this.form.horas_descontadas);
            if (!horas || horas <= 0) {
                this.errores.horas_descontadas = 'Debe ser mayor a cero';
                valido = false;
            } else if (horas > this.saldoSeleccionado) {
                this.errores.horas_descontadas = `Supera el saldo pendiente (${this.formatHoras(this.saldoSeleccionado)} hs)`;
                valido = false;
            }

            return valido;
        },

        guardarDescuento() {
            if (!this.validarForm()) return;
            this.guardando = true;

            registrarDescuento({
                personal_id:        this.personalSeleccionado,
                anho:               this.form.anho,
                horas_descontadas:  this.form.horas_descontadas,
                motivo:             this.form.motivo,
                fecha_descuento:    this.form.fecha_descuento
            })
            .then(data => {
                if (data.status === 'success') {
                    this.toast.success(data.message);
                    this.form.horas_descontadas = null;
                    this.form.motivo = '';
                    this.cargarSaldos();
                    this.cargarDescuentos();
                } else {
                    this.toast.error(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.guardando = false; });
        },

        confirmarEliminar(descuento) {
            this.descuentoAEliminar = descuento;
            this.modalEliminarInst.show();
        },

        eliminarDescuentoConfirmado() {
            this.eliminando = true;
            eliminarDescuento(this.descuentoAEliminar.id)
                .then(data => {
                    if (data.status === 'success') {
                        this.toast.success(data.message);
                        this.modalEliminarInst.hide();
                        this.cargarSaldos();
                        this.cargarDescuentos();
                    } else {
                        this.toast.error(data.message);
                    }
                })
                .catch(err => this.toast.error('Error de conexión: ' + err))
                .finally(() => { this.eliminando = false; });
        },

        resetForm() {
            this.saldosPorGestion = [];
            this.descuentos = [];
            this.form = {
                anho: null,
                horas_descontadas: null,
                motivo: '',
                fecha_descuento: new Date().toISOString().slice(0, 10)
            };
            this.errores = { anho: '', horas_descontadas: '' };
        },

        formatHoras
    }
};
</script>
