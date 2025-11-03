<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center">
                    <h1>Registro diario por servicio</h1>  
                </div>
            </div>
        </div>
        
    <hr>

        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Calendario</h5>
                    </div>
                    <div class="card-body">
                        <form v-on:submit.prevent="verificaGuarda">
                            <div class="col-lg-12 g-2 mb-3">
                                <div class="row">
                                    <div class="col-lg-7 g-2 mb-3">
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <dia-anterior :fecha-actual="this.censo.fecha" :servicio="this.censo.servicio"/>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="date" id="fecha" name="fecha" v-model="censo.fecha" autofocus  required>
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
                                                    <input class="form-control" type="number" id="obito" name="obito" v-model="censo.obito" required >
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
                                                    <input class="form-control" type="number" id="libres" name="libres" :value="this.camasLibres" disabled >
                                                    <label for="libres">Camas libres:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <input class="form-control" type="number" id="total" name="total" min="0" max="40" required v-model="censo.total" @change="calculoCamasLibres()">
                                                    <label for="obito">Total 24 Hrs.:</label>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="col-lg-5 g-2 mb-3">
                                        <div class="row g-2 mb-5">
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <h3>Camas Prestadas</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <small>Camas Prestadas 1</small>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="especialidad1"
                                                        v-model="censo.especialidad1"
                                                        id="especialidad1">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nombre">
                                                            {{ especialidad.nombre }}
                                                        </option>
                                                    </select>
                                                    <label for="especialidad1">Especialidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="number" id="cantidad1" name="cantidad1" v-model="censo.cantidad1" autofocus  >
                                                    <label for="cantidad">Cantidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="tipo_ingreso1" 
                                                        v-model="censo.tipo_ingreso1"
                                                        id="tipo_ingreso1">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option value="DIRECTO">DIRECTO</option>
                                                        <option value="TRASLADO">TRASLADO</option>
                                                    </select>
                                                    <label for="tipo_ingreso1">Tipo de Ingreso:</label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row g-2 mb-3">
                                            <small>Camas Prestadas 2</small>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="especialidad2" 
                                                        v-model="censo.especialidad2"
                                                        id="especialidad2">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nombre">
                                                            {{ especialidad.nombre }}
                                                        </option>
                                                    </select>
                                                    <label for="especialidad2">Especialidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="number" id="cantidad2" name="cantidad2" v-model="censo.cantidad2" autofocus  >
                                                    <label for="cantidad">Cantidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="tipo_ingreso2" 
                                                        v-model="censo.tipo_ingreso2"
                                                        id="tipo_ingreso2">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option value="DIRECTO">DIRECTO</option>
                                                        <option value="TRASLADO">TRASLADO</option>
                                                    </select>
                                                    <label for="tipo_ingreso2">Tipo de Ingreso:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <small>Camas Prestadas 3</small>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="especialidad3" 
                                                        v-model="censo.especialidad3"
                                                        id="especialidad3">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nombre">
                                                            {{ especialidad.nombre }}
                                                        </option>
                                                    </select>
                                                    <label for="especialidad3">Especialidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="number" id="cantidad3" name="cantidad3" v-model="censo.cantidad3" autofocus  >
                                                    <label for="cantidad">Cantidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="tipo_ingreso3" 
                                                        v-model="censo.tipo_ingreso3"
                                                        id="tipo_ingreso3">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option value="DIRECTO">DIRECTO</option>
                                                        <option value="TRASLADO">TRASLADO</option>
                                                    </select>
                                                    <label for="tipo_ingreso3">Tipo de Ingreso:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <small>Camas Prestadas 4</small>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="especialidad4" 
                                                        v-model="censo.especialidad4"
                                                        id="especialidad4">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nombre">
                                                            {{ especialidad.nombre }}
                                                        </option>
                                                    </select>
                                                    <label for="especialidad4">Especialidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="number" id="cantidad4" name="cantidad4" v-model="censo.cantidad4" autofocus  >
                                                    <label for="cantidad">Cantidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="tipo_ingreso4" 
                                                        v-model="censo.tipo_ingreso4"
                                                        id="tipo_ingreso4">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option value="DIRECTO">DIRECTO</option>
                                                        <option value="TRASLADO">TRASLADO</option>
                                                    </select>
                                                    <label for="tipo_ingreso4">Tipo de Ingreso:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2 mb-3">
                                            <small>Camas Prestadas 5</small>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="especialidad5" 
                                                        v-model="censo.especialidad5"
                                                        id="especialidad5">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option v-for="especialidad in especialidades" :key="especialidad.id" :value="especialidad.nombre">
                                                            {{ especialidad.nombre }}
                                                        </option>
                                                    </select>
                                                    <label for="especialidad5">Especialidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <input class="form-control" type="number" id="cantidad5" name="cantidad5" v-model="censo.cantidad5" autofocus  >
                                                    <label for="cantidad5">Cantidad:</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating"> 
                                                    <select 
                                                        class="form-select"
                                                        name="tipo_ingreso5" 
                                                        v-model="censo.tipo_ingreso5"
                                                        id="tipo_ingreso5">
                                                        <option disabled selected value="null">Seleccione</option>
                                                        <option value="DIRECTO">DIRECTO</option>
                                                        <option value="TRASLADO">TRASLADO</option>
                                                    </select>
                                                    <label for="tipo_ingreso5">Tipo de Ingreso:</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-2 mb-3 text-center">
                                    <div class="row g-2 mb-3 text-center">
                                        <div class="col-md">
                                            <div class="form-group">
                                                <div class="d-grid gap-2">
                                                    <button class="btn btn-success" type="submit">Guardar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                                                    
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import diaAnterior from '@/components/diaAnterior.vue';
    import servicios from '@/components/servicios.vue';
    import API_BASE_URL from './config/api'; 
    export default{
        data(){
            return{
                censo:{},
                servicios:[],
                especialidades:[],
                servicioSeleccionado: null,
                camasLibres: 0,
            }
        },
        created(){
            this.getServicios();
            this.getEspecialidades();
        },
        computed:{
            selectedServicio() {
            if (!this.censo.servicio) return null;
            return this.servicios.find(serv => serv.nombre === this.censo.servicio) || 0;
            },
            getDate(){
                return new Date( this.censo.fecha).toISOString().split('T')[0];
            }
            
        },
        name: 'formularioVaciado',
        methods:{
        
            verificaGuarda(){
                var data = {
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
                    libre: this.censo.libres,
                    dotacion: this.censo.dotacion,
                    //especialidades y cantidades
                    especialidad1: this.censo.especialidad1,
                    especialidad2: this.censo.especialidad2,
                    especialidad3: this.censo.especialidad3,
                    especialidad4: this.censo.especialidad4,
                    especialidad5: this.censo.especialidad5,
                    cantidad1: this.censo.cantidad1,
                    cantidad2: this.censo.cantidad2,
                    cantidad3: this.censo.cantidad3,
                    cantidad4: this.censo.cantidad4,
                    cantidad5: this.censo.cantidad5,
                    tipo_ingreso1: this.censo.tipo_ingreso1,    
                    tipo_ingreso2: this.censo.tipo_ingreso2,
                    tipo_ingreso3: this.censo.tipo_ingreso3,
                    tipo_ingreso4: this.censo.tipo_ingreso4,
                    tipo_ingreso5: this.censo.tipo_ingreso5
                };
                //fetch('/api/verificarYGuardar', {
                fetch( `${API_BASE_URL}/verificarYGuardar`, {
                    method: 'POST',
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if(data.status === 'failed'){
                        alert('Estos datos ya existen: '+ data.message);
                    }
                    //console.log('Mensaje:', data);
                })
                .catch((error) => {
                    alert('Errores: '+ error);
                });
                this.censo = {};                                                                                                                
                this.camasLibres = 0;
            },
            getServicios(){
                fetch(`${API_BASE_URL}/servicios`)
                .then(response => response.json())
                .then(data => {
                    this.servicios = [];
                    if(data.status === 'success')
                    {
                        this.servicios = data.data;
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            },
            getEspecialidades(){
                fetch(`${API_BASE_URL}/especialidades`)
                .then(response => response.json())
                .then(data => {
                    this.especialidades = [];
                    if(data.status === 'success')
                    {
                        this.especialidades = data.data;
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            },
            calculoCamasLibres() {
                //console.log('Censo:', this.censo);
                this.camasLibres = 0;
                if(!this.selectedServicio) return 0;
                const ocupadas = (this.censo.total || 0) + (this.censo.bloqueada || 0) + (this.censo.aislamiento || 0);
                this.camasLibres = this.selectedServicio.cant_camas - ocupadas;
                this.censo.libres = this.camasLibres;
                this.censo.dotacion = this.selectedServicio.cant_camas;
                return this.camasLibres;
            },
            updateCamaInfo() {
                //console.log('Servicio seleccionado:', this.censo);

                //console.log(this.getDate);
                //var result = diaAnterior.methods.getDiaAnterior(this.getDate);
                //console.log('result ='+ result);
            },            
        },
        components: {
            diaAnterior,
            servicios
        }
    }
</script>