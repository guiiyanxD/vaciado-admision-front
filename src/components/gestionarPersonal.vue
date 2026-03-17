<template>
    <div class="container">

        <div class="row">
            <div class="col-md-12 text-center">
                <h1>Gestión de Personal</h1>
            </div>
        </div>

        <hr>

        <!-- Botón agregar + buscador -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar por nombre o apellido..."
                    v-model="busqueda"
                >
            </div>
            <div class="col-md-6 d-flex justify-content-end">
                <button class="btn btn-primary" @click="abrirModalCrear">
                    <i class="bi bi-person-plus-fill me-1"></i> Nuevo Funcionario
                </button>
            </div>
        </div>

        <!-- Tabla de personal -->
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body p-0">
                        <div v-if="cargando" class="text-center p-4">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted">Cargando personal...</p>
                        </div>

                        <table v-else class="table table-hover table-striped mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Apellidos</th>
                                    <th>Nombres</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="personalFiltrado.length === 0">
                                    <td colspan="5" class="text-center text-muted py-4">
                                        No se encontraron funcionarios.
                                    </td>
                                </tr>
                                <tr v-for="(p, index) in personalFiltrado" :key="p.id">
                                    <td class="text-muted">{{ index + 1 }}</td>
                                    <td>{{ p.apellidos }}</td>
                                    <td>{{ p.nombres }}</td>
                                    <td class="text-center">
                                        <span :class="p.activo ? 'badge bg-success' : 'badge bg-secondary'">
                                            {{ p.activo ? 'Activo' : 'Inactivo' }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button
                                            class="btn btn-sm btn-outline-primary me-1"
                                            @click="abrirModalEditar(p)"
                                            title="Editar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                            </svg>
                                        </button>
                                        <button
                                            class="btn btn-sm btn-outline-danger"
                                            @click="confirmarEliminar(p)"
                                            title="Eliminar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Crear / Editar -->
        <div class="modal fade" id="modalPersonal" tabindex="-1" aria-hidden="true" ref="modalPersonal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ modoEdicion ? 'Editar Funcionario' : 'Nuevo Funcionario' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <div class="form-floating">
                                    <input
                                        class="form-control"
                                        type="text"
                                        id="inp_apellidos"
                                        placeholder="Apellidos"
                                        v-model="form.apellidos"
                                        :class="{ 'is-invalid': errores.apellidos }"
                                    >
                                    <label for="inp_apellidos">Apellidos</label>
                                    <div class="invalid-feedback">{{ errores.apellidos }}</div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-floating">
                                    <input
                                        class="form-control"
                                        type="text"
                                        id="inp_nombres"
                                        placeholder="Nombres"
                                        v-model="form.nombres"
                                        :class="{ 'is-invalid': errores.nombres }"
                                    >
                                    <label for="inp_nombres">Nombres</label>
                                    <div class="invalid-feedback">{{ errores.nombres }}</div>
                                </div>
                            </div>
                            <div v-if="modoEdicion" class="col-12">
                                <div class="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="chk_activo"
                                        v-model="form.activo"
                                    >
                                    <label class="form-check-label" for="chk_activo">
                                        Funcionario activo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="guardarPersonal"
                            :disabled="guardando">
                            <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                            {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmar Eliminar -->
        <div class="modal fade" id="modalEliminar" tabindex="-1" aria-hidden="true" ref="modalEliminar">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar eliminación
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Está seguro que desea eliminar al funcionario:</p>
                        <p class="fw-bold">{{ personalAEliminar ? personalAEliminar.apellidos + ' ' + personalAEliminar.nombres : '' }}</p>
                        <p class="text-muted small">
                            Si el funcionario tiene registros de compensaciones, no podrá ser eliminado.
                            En ese caso, desactívelo editando su registro.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            @click="eliminarPersonal"
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

export default {
    name: 'GestionPersonal',

    data() {
        return {
            personal:          [],
            busqueda:          '',
            cargando:          false,
            guardando:         false,
            eliminando:        false,
            modoEdicion:       false,
            personalAEliminar: null,
            form: {
                id:        null,
                nombres:   '',
                apellidos: '',
                activo:    true
            },
            errores: {
                nombres:   '',
                apellidos: ''
            },
            modalPersonalInst: null,
            modalEliminarInst: null
        };
    },

    computed: {
        personalFiltrado() {
            if (!this.busqueda.trim()) return this.personal;
            const q = this.busqueda.toLowerCase();
            return this.personal.filter(p =>
                p.nombres.toLowerCase().includes(q) ||
                p.apellidos.toLowerCase().includes(q)
            );
        }
    },

    mounted() {
        this.cargarPersonal();
        this.toast = useToast();
        // Inicializar modales de Bootstrap
        this.modalPersonalInst = new bootstrap.Modal(this.$refs.modalPersonal);
        this.modalEliminarInst = new bootstrap.Modal(this.$refs.modalEliminar);
    },

    methods: {

        cargarPersonal() {
            this.cargando = true;
            fetch(`${API_BASE_URL}/compensaciones/personal`)
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'success') {
                        this.personal = data.data;
                    } else {
                        this.toast.error(data.message);
                    }
                })
                .catch(err => this.toast.error('Error al cargar personal: ' + err))
                .finally(() => { this.cargando = false; });
        },

        abrirModalCrear() {
            this.modoEdicion    = false;
            this.form           = { id: null, nombres: '', apellidos: '', activo: true };
            this.errores        = { nombres: '', apellidos: '' };
            this.modalPersonalInst.show();
        },

        abrirModalEditar(p) {
            this.modoEdicion = true;
            this.form        = { id: p.id, nombres: p.nombres, apellidos: p.apellidos, activo: p.activo };
            this.errores     = { nombres: '', apellidos: '' };
            this.modalPersonalInst.show();
        },

        validarForm() {
            let valido = true;
            this.errores = { nombres: '', apellidos: '' };

            if (!this.form.apellidos.trim()) {
                this.errores.apellidos = 'Los apellidos son requeridos';
                valido = false;
            }
            if (!this.form.nombres.trim()) {
                this.errores.nombres = 'Los nombres son requeridos';
                valido = false;
            }
            return valido;
        },

        guardarPersonal() {
            if (!this.validarForm()) return;

            this.guardando = true;
            const url    = `${API_BASE_URL}/compensaciones/personal`;
            const method = this.modoEdicion ? 'PUT' : 'POST';

            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.form)
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    this.toast.success(data.message);
                    this.modalPersonalInst.hide();
                    this.cargarPersonal();
                } else {
                    this.toast.errores(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.guardando = false; });
        },

        confirmarEliminar(p) {
            this.personalAEliminar = p;
            this.modalEliminarInst.show();
        },

        eliminarPersonal() {
            if (!this.personalAEliminar) return;
            this.eliminando = true;

            fetch(`${API_BASE_URL}/compensaciones/personal`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.personalAEliminar.id })
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    this.toast.success(data.message);
                    this.modalEliminarInst.hide();
                    this.cargarPersonal();
                } else {
                    this.toast.error(data.message);
                }
            })
            .catch(err => this.toast.error('Error de conexión: ' + err))
            .finally(() => { this.eliminando = false; this.personalAEliminar = null; });
        }
    }
};
</script>