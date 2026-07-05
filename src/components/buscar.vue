<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="accent-header">Buscar registros</h1>
                <p class="text-muted">Consultá el censo histórico por fecha, rango o servicio.</p>
            </div>
        </div>
        <div class="row">
            
            <div class="col-md-3">

                <div class="card">
                    <div class="card-header">
                        <h3 class="text-center">Datos a buscar</h3>
                    </div>
                    <div class="card-body">
                        <form v-on:submit.prevent="buscarRegistros">
                            <div class="row g-2 mb-3">
                                <div class="col-md">
                                    <div class="form-floating"> 
                                        <input 
                                            class="form-control" 
                                            type="date" 
                                            id="fechaInicio" 
                                            name="fechaInicio" 
                                            v-model="this.fechaInicio" 
                                            autofocus  
                                            required
                                        >
                                        <label for="fecha">Fecha Inicio:</label>
                                    </div>
                                </div>
                            </div>
                            <div v-if="rangoFechas"> 
                                <div class="row g-2 mb-3">
                                    <div class="col-md">
                                        <div class="form-floating"> 
                                            <input 
                                                class="form-control" 
                                                type="date" 
                                                id="fechaFin" 
                                                name="fechaFin" 
                                                v-model="this.fechaFin"  
                                                required
                                            >
                                            <label for="fecha">Fecha Fin:</label>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md">
                                    <div class="form-floating"> 
                                        <servicios v-model="this.servicioBuscar" :show-all-option="true" />  
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="rangoFechas"
                                        name="RangoFechas"
                                        v-model="this.rangoFechas"
                                    />
                                    <label for="rangoFechas">Rango de fechas</label>
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md">
                                    <div class="form-floating"> 
                                    <div class="d-grid gap-3">
                                            <button class="btn btn-success" type="submit">Buscar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div v-if="this.error" class="alert alert-danger">
                    {{ this.error }}
                </div>

                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2 text-muted">Buscando registros...</p>
                </div>

                <div v-else-if="!haBuscado" class="text-center text-muted py-5">
                    <i class="bi bi-clipboard-data fs-1 d-block mb-2"></i>
                    Completá los filtros y presioná Buscar.
                </div>

                <div v-else-if="resultados.length === 0" class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No hay datos para los filtros seleccionados.
                </div>

                <div v-else class="table-responsive resultados-scroll">
                    <table class="table table-striped table-hover table-bordered mb-0">
                        <thead>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="2" class="text-center" style="font-weight: bold;">Ingresos</td>
                                <td colspan="3" class="text-center" style="font-weight: bold;">Egresos</td>
                                <td colspan="4"></td>
                            </tr>
                            <tr>
                                <td>Fecha</td>
                                <td>Servicio</td>
                                <td>Directos</td>
                                <td>Traslados</td>
                                <td>Directos</td>
                                <td>Traslados</td>
                                <td>Obitos</td>
                                <td>Aislamiento</td>
                                <td>Bloqueada</td>
                                <td>Total</td>
                                <td>Acciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="fila in resultados" :key="fila.servicio + fila.fecha">
                                <td>{{ fila.fecha }}</td>
                                <td>{{ fila.servicio }}</td>
                                <td>{{ fila.ingreso }}</td>
                                <td>{{ fila.ingreso_traslado }}</td>
                                <td>{{ fila.egreso }}</td>
                                <td>{{ fila.egreso_traslado }}</td>
                                <td>{{ fila.obito }}</td>
                                <td>{{ fila.aislamiento }}</td>
                                <td>{{ fila.bloqueada }}</td>
                                <td>{{ fila.total }}</td>
                                <td>
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        type="button"
                                        disabled
                                        title="Editar registro (próximamente)"
                                    >
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    thead td {
        font-weight: bold;
        padding: 8px;
    }
    td {
        text-align: center;
    }
    .resultados-scroll {
        max-height: 65vh;
        overflow-y: auto;
    }
    /* Solo la fila de encabezados de columna queda fija; la fila agrupadora
       (Ingresos/Egresos) se desplaza con el resto para evitar solapamientos
       entre dos filas sticky. */
    .resultados-scroll thead tr:last-child td {
        position: sticky;
        top: 0;
        background-color: var(--color-surface);
        z-index: 2;
    }
</style>
<script>
    import servicios from '@/components/servicios.vue';
    import { buscarCenso } from '@/services/censoService';

    export default{
        name: 'buscarCenso',
        description: 'Componente para buscar registros por fecha y servicio',
        data(){
            return{
                fechaInicio: null,
                fechaFin: null,
                servicioBuscar: "",
                resultados: [],
                loading: false,
                error: null,
                haBuscado: false,
                rangoFechas: false,
            }
        },
        methods: {
            /**
             * Realiza la busqueda de registros segun los parametros seleccionados
             */
            buscarRegistros(){
                this.resultados = [];
                if( (this.fechaInicio && this.servicioBuscar)){
                    var data = {
                        fechaInicio: this.fechaInicio,
                        fechaFin: !this.rangoFechas ? null : this.fechaFin,
                        servicioBuscar: this.servicioBuscar,
                        rangoFechas: this.rangoFechas ?? false
                    };
                    this.loading = true;
                    this.error = null;
                    buscarCenso(data)
                    .then(data => {
                        this.resultados = data.data || [];
                        this.haBuscado = true;
                    })
                    .catch(() => {
                        this.error = 'Error de conexión con el servidor';
                    })
                    .finally(() => { this.loading = false; })
                } else {
                    this.error = 'Por favor, seleccione una fecha y un servicio';
                }
            }
        },
        components:{
            servicios,
        }
    }
</script>