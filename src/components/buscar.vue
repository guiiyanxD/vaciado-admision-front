<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center">
                    <h1>Buscar</h1>  
                </div>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
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
                            <div class="row g-2 mb-3">
                                <div class="col-md">
                                    <div class="form-floating"> 
                                        <servicios v-model="this.servicioBuscar" :show-all-option="true" />  
                                    </div>
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
            <div class="col-md-10">
                <div v-if="this.error">
                    <div class="card">
                        <div class="card-header bg-danger text-white">
                            <p>Error en los parametros de busqueda</p>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-success table-striped table-hover table-bordered">
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
                        <tbody v-if="this.resultados != []">
                            <tr v-for="fila in resultados" :key="fila.servicio" >
                                <td>{{ fila.fecha }}</td>
                                <td>{{ fila.servicio }}</td>
                                <td>{{ fila.ingreso }}</td>
                                <td>{{ fila.ing_traslado }}</td>
                                <td>{{ fila.egreso }}</td>
                                <td>{{ fila.egreso_traslado }}</td>
                                <td>{{ fila.obito }}</td>
                                <td>{{ fila.aislamiento }}</td>
                                <td>{{ fila.bloqueada }}</td>
                                <td>{{ fila.total }}</td>
                                <td><button class="btn btn-light">Editar</button></td>
                            </tr>   
                        </tbody>
                    </table>
                    </div>
                
                <div v-if="this.resultados == null">
                        <h5>No hay Datos para mostrar</h5>
                    </div>
                <div v-if="this.loading == true" class="text-center">
                    <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
        <br>
    </div>
</template>
<style>
    thead td {
        font-weight: bold;
        padding: 8px;
    }
    td{
        text-align: center;
    }
</style>
<script>
    import servicios from '@/components/servicios.vue';
    import API_BASE_URL from './config/api'; 
    
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
                error: false,
            }
        },
        props: {
            'servicios': {
                type: Array,
                default: () => []
            }
        },
        created(){
            
        },
        methods: {
            /**
             * Comprueba que la fechaInicio sea menor a la fechaFin
             * @returns true si la fechaInicio es menor a la fichaFin
             */
            verificarFechas(){
                console.log(this.fechaInicio <= this.fechaFin);
                return this.fechaInicio <= this.fechaFin;
            },
            buscarRegistros(){
                this.resultados = [];
                if( this.verificarFechas() && (this.fechaInicio && this.fechaFin)){
                //if( this.error){
                    console.log(this.error + " ERROR <-");
                    var data = {
                        fechaInicio: this.fechaInicio,
                        fechaFin: this.fechaFin ?? null,
                        servicioBuscar: this.servicioBuscar
                    };
                    //console.log("data", data);
                    this.loading = true;
                    this.error = null;
                    fetch(`${API_BASE_URL}/buscar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("data:",  data);
                        this.resultados = data.data || null;
                        this.loading = false;
                    })
                } else {
                    this.error = 'Por favor, seleccione una fecha y un servicio';
                    
                    //console.log(this.error);
                }
            }
        },
        components:{
            servicios,

        }
    }
</script>