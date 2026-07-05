<template>
    <div class="container">
        
        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Censo diario</h1>
                <p class="text-muted">Registrá los movimientos del día por servicio.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <form v-on:submit.prevent="verificaGuarda">
                    <div class="col-lg-12 g-2 mb-3">
                                <div class="row">
                                    <!-- COLUMNA IZQUIERDA: Datos principales del censo -->
                                    <div class="col-lg-7 g-2 mb-3">
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <dia-anterior :fecha-actual="this.censo.fecha" :servicio="this.censo.servicio"/>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input
                                                        class="form-control"
                                                        type="date"
                                                        id="fecha"
                                                        name="fecha"
                                                        v-model="censo.fecha"
                                                        :min="rangoFechasEditable.min"
                                                        :max="rangoFechasEditable.max"
                                                        autofocus
                                                        required
                                                    >
                                                    <label for="fecha">Fecha:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <servicios :show-cant-camas="true" name="servicio" id="servicio" v-model="censo.servicio" />
                                            </div>
                                        </div> 
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="ingreso" name="ingreso" v-model="censo.ingreso" required>
                                                    <label for="ingreso">Ingresos:</label>
                                                </div> 
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="ingreso_traslado" name="ingreso_traslado" required v-model="censo.ingreso_traslado">
                                                    <label for="ingreso_traslado">Ingresos por traslado:</label>
                                                </div>                       
                                            </div>
                                            
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="egreso" name="egreso" v-model="censo.egreso" required>
                                                    <label for="egreso">Egresos:</label>
                                                </div>
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="egreso_traslado" name="egreso_traslado" required v-model="censo.egreso_traslado">
                                                    <label for="egreso_traslado">Egresos por traslado:</label>
                                                </div> 
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="obito" name="obito" v-model="censo.obito" required>
                                                    <label for="obito">Óbitos:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="aislamiento" name="aislamiento" required v-model="censo.aislamiento">
                                                    <label for="aislamiento">Aislamientos:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="bloqueada" name="bloqueada" required v-model="censo.bloqueada">
                                                    <label for="bloqueada">Camas bloqueadas:</label>
                                                </div>                        
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="libres" name="libres" :value="this.camasLibres" disabled>
                                                    <label for="libres">Camas libres:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="total" name="total" min="0" max="40" required v-model="censo.total" @change="calculoCamasLibres()">
                                                    <label for="total">Total 24 Hrs.:</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- COLUMNA DERECHA: Camas Prestadas (REFACTORIZADA) -->
                                    <div class="col-lg-5 g-2 mb-3">
                                        <div class="row g-2 mb-3">
                                            <div class="col-md d-flex justify-content-between align-items-center">
                                                <h3>Camas Prestadas</h3>
                                                <button 
                                                    type="button" 
                                                    class="btn btn-primary btn-sm"
                                                    @click="agregarCamaPrestada"
                                                    title="Agregar cama prestada">
                                                    <i class="bi bi-plus-lg"></i> Agregar
                                                </button>
                                            </div>
                                        </div>

                                        <div class="camas-prestadas-lista">
                                            <!-- Mensaje si no hay camas prestadas -->
                                            <div v-if="camasPrestadas.length === 0" class="alert alert-info mb-0">
                                                <small>No hay camas prestadas registradas. Haga clic en "Agregar" para agregar una.</small>
                                            </div>

                                            <!-- Lista dinámica de camas prestadas -->
                                            <div
                                                v-for="(cama, index) in camasPrestadas"
                                                :key="index"
                                                class="card mb-3 border-secondary">
                                                <div class="card-body p-3">
                                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                                        <small class="text-muted fw-bold">Cama Prestada #{{ index + 1 }}</small>
                                                        <button
                                                            type="button"
                                                            class="btn btn-danger btn-sm"
                                                            @click="eliminarCamaPrestada(index)"
                                                            title="Eliminar">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>

                                                    <div class="row g-2 mb-2">
                                                        <div class="col-12">
                                                            <div class="form-floating">
                                                                <select
                                                                    class="form-select"
                                                                    :id="'especialidad_' + index"
                                                                    v-model="cama.especialidad"
                                                                    :required="camasPrestadas.length > 0">
                                                                    <option disabled selected :value="null">Seleccione</option>
                                                                    <option
                                                                        v-for="especialidad in especialidades"
                                                                        :key="especialidad.id"
                                                                        :value="especialidad.nombre">
                                                                        {{ especialidad.nombre }}
                                                                    </option>
                                                                </select>
                                                                <label :for="'especialidad_' + index">Especialidad</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row g-2 mb-2">
                                                        <div class="col-6">
                                                            <div class="form-floating">
                                                                <input
                                                                    class="form-control"
                                                                    type="number"
                                                                    :id="'cantidad_' + index"
                                                                    v-model.number="cama.cantidad"
                                                                    min="1"
                                                                    :required="camasPrestadas.length > 0">
                                                                <label :for="'cantidad_' + index">Cantidad</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-floating">
                                                                <select
                                                                    class="form-select"
                                                                    :id="'tipo_ingreso_' + index"
                                                                    v-model="cama.tipo_ingreso"
                                                                    :required="camasPrestadas.length > 0">
                                                                    <option disabled selected :value="null">Seleccione</option>
                                                                    <option value="DIRECTO">DIRECTO</option>
                                                                    <option value="TRASLADO">TRASLADO</option>
                                                                </select>
                                                                <label :for="'tipo_ingreso_' + index">Tipo</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Botón de guardado -->
                                <div class="row g-2 mb-3 text-center">
                                    <div class="col-md">
                                        <div class="form-group">
                                            <div class="d-grid gap-2">
                                                <button class="btn btn-success btn-lg" type="submit" :disabled="guardando">
                                                    <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                                                    <i v-else class="bi bi-save"></i> Guardar Registro
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import diaAnterior from '@/components/diaAnterior.vue';
    import servicios from '@/components/servicios.vue';
    import { useToast } from 'vue-toastification'
    import { fetchServicios, fetchEspecialidades } from '@/composables/useCatalogos';
    import { guardarCenso } from '@/services/censoService';
    import { calcularRangoFechasEditable } from '@/utils/fechasEditables';

    export default {
        name: 'formularioVaciado',

        components: {
            diaAnterior,
            servicios
        },
        mounted() {
            this.toast = useToast();
        },
        data() {
            return {
                rangoFechasEditable: calcularRangoFechasEditable(),
                censo: {
                    fecha: null,
                    servicio: null,
                    ingreso: 0,
                    ingreso_traslado: 0,
                    egreso: 0,
                    egreso_traslado: 0,
                    obito: 0,
                    aislamiento: 0,
                    bloqueada: 0,
                    total: 0,
                    libres: 0,
                    dotacion: 0
                },
                
                camasPrestadas: [],
                
                servicios: [],
                especialidades: [],
                
                camasLibres: 0,
                guardando: false
            }
        },

        created() {
            this.getServicios();
            this.getEspecialidades();
        },

        computed: {
            selectedServicio() {
                if (!this.censo.servicio) return null;
                return this.servicios.find(serv => serv.nombre === this.censo.servicio) || null;
            },

            getDate() {
                return new Date(this.censo.fecha).toISOString().split('T')[0];
            }
        },

        methods: {
            // ========== CAMAS PRESTADAS: CRUD ==========
            
            agregarCamaPrestada() {
                this.camasPrestadas.push({
                    especialidad: null,
                    cantidad: null,
                    tipo_ingreso: null
                });
            },

            eliminarCamaPrestada(index) {
                this.camasPrestadas.splice(index, 1);
            },

            // Validar que todas las camas prestadas estén completas
            validarCamasPrestadas() {
                for (let i = 0; i < this.camasPrestadas.length; i++) {
                    const cama = this.camasPrestadas[i];
                    if (!cama.especialidad || !cama.cantidad || !cama.tipo_ingreso) {
                        alert(`La cama prestada #${i + 1} tiene campos incompletos`);
                        return false;
                    }
                    if (cama.cantidad <= 0) {
                        alert(`La cantidad en la cama prestada #${i + 1} debe ser mayor a 0`);
                        return false;
                    }
                }
                return true;
            },

            // Filtrar camas prestadas válidas (que tengan datos completos)
            obtenerCamasPrestadasValidas() {
                return this.camasPrestadas.filter(cama => 
                    cama.especialidad && 
                    cama.cantidad > 0 && 
                    cama.tipo_ingreso
                );
            },

            // ========== GUARDAR DATOS ==========
            
            verificaGuarda() {
                if (this.camasPrestadas.length > 0) {
                    if (!this.validarCamasPrestadas()) {
                        return;
                    }
                }

                const data = {
                    censo: {
                        fecha: this.censo.fecha,
                        servicio: this.censo.servicio,
                        ingreso: this.censo.ingreso,
                        ingreso_traslado: this.censo.ingreso_traslado,
                        egreso: this.censo.egreso,
                        egreso_traslado: this.censo.egreso_traslado,
                        obito: this.censo.obito,
                        aislamiento: this.censo.aislamiento,
                        bloqueada: this.censo.bloqueada,
                        total: this.censo.total,
                        libre: this.camasLibres,
                        dotacion: this.censo.dotacion
                    },
                    camasPrestadas: this.obtenerCamasPrestadasValidas()
                };

                // Enviar datos al backend
                this.guardando = true;
                guardarCenso(data)
                .then(data => {
                    if (data.status === 'failed') {
                        this.toast.error(data.message);
                    } else {
                        this.toast.success(data.message);
                        this.limpiarFormulario();
                    }
                })
                .catch((error) => {
                    this.toast.error('Error en la conexión: ' + error);
                })
                .finally(() => { this.guardando = false; });
            },

            limpiarFormulario() {
                // Reiniciar datos del censo
                this.censo = {
                    fecha: null,
                    servicio: null,
                    ingreso: 0,
                    ingreso_traslado: 0,
                    egreso: 0,
                    egreso_traslado: 0,
                    obito: 0,
                    aislamiento: 0,
                    bloqueada: 0,
                    total: 0,
                    libres: 0,
                    dotacion: 0
                };
                
                // Limpiar array de camas prestadas
                this.camasPrestadas = [];
                
                // Reiniciar cálculo de camas libres
                this.camasLibres = 0;
            },

            // ========== CATÁLOGOS ==========
            
            getServicios() {
                fetchServicios()
                    .then(data => {
                        this.servicios = [];
                        if (data.status === 'success') {
                            this.servicios = data.data;
                        }
                    })
                    .catch((error) => {
                        console.error('Error al obtener servicios:', error);
                    });
            },

            getEspecialidades() {
                fetchEspecialidades()
                    .then(data => {
                        this.especialidades = [];
                        if (data.status === 'success') {
                            this.especialidades = data.data;
                        }
                    })
                    .catch((error) => {
                        console.error('Error al obtener especialidades:', error);
                    });
            },

            // ========== CÁLCULOS ==========
            
            calculoCamasLibres() {
                this.camasLibres = 0;
                if (!this.selectedServicio) return 0;
                
                const ocupadas = (this.censo.total || 0) + 
                                (this.censo.bloqueada || 0) + 
                                (this.censo.aislamiento || 0);
                
                this.camasLibres = this.selectedServicio.cant_camas - ocupadas;
                this.censo.libres = this.camasLibres;
                this.censo.dotacion = this.selectedServicio.cant_camas;
                
                return this.camasLibres;
            }
        }
    }
</script>

<style scoped>
/* Contenedor con scroll propio: evita que la lista de camas prestadas
   haga crecer el scroll de toda la página a medida que se agregan más. */
.camas-prestadas-lista {
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 0.25rem;
}

/* Estilos adicionales para mejorar la UI de camas prestadas */
.card.border-secondary {
    border-width: 2px;
    transition: all 0.3s ease;
}

.card.border-secondary:hover {
    box-shadow: 0 4px 8px rgba(31, 74, 44, 0.15);
    border-color: var(--color-primary) !important;
}

.btn-sm i {
    font-size: 0.875rem;
}

/* Animación suave al agregar/eliminar */
.card.mb-3 {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>