<template>
    <div class="form-floating"  >
        <select 
            name="servicio" 
            id="servicio" 
            class="form-select" 
            :value="modelValue"
            @change="updateValue($event)"
        >
            <option disabled selected>Seleccione un servicio</option>
            <option v-if="showAllOption" value="todos">Seleccionar todos</option>
            <option 
                v-for="servicio in servicios" 
                :key="servicio.nombre" 
                :value="servicio.nombre"
            >
                {{ servicio.nombre }}
            </option>
        </select>
        <label for="servicio">Servicio:</label>
        <div v-if="showCantCamas">
            <div v-if="camasServicioSeleccionado === null">
                <small class="text-danger">Seleccione un servicio</small>
            </div>
            <div v-else>
                <small>Cantidad de Camas: {{ this.camasServicioSeleccionado }}</small>
            </div>
        </div>
    </div>
</template>

<script>
    import API_BASE_URL from '@/config/api.js'; 
    export default{
        name: 'serviciosHospital',
        description: 'Componente que maneja los servicios',
        data(){
            return{
                servicios: [],
                camasServicioSeleccionado: null,
            }
        },
        created(){
            this.fetchServicios();
        },
        props:{
            modelValue: String,
            showCantCamas: {
                type: Boolean,
                default: false
            },
            showAllOption: {
                type: Boolean,
                default:false
            },
        },
        emits: ['update:modelValue'],
        methods: {
            fetchServicios(){
                //fetch('/api/servicios')
                fetch(`${API_BASE_URL}/servicios`)
                .then(response => response.json())
                .then(data => {
                    this.servicios = data.data;
                    console.log('Servicios fetched:', data.data);
                })
                .catch(error => {
                    console.error('Error fetching servicios:', error);
                });
            },
           updateValue(event) {
               const newValue = event.target.value;
               this.$emit('update:modelValue', newValue);
               const selected = this.servicios.find(
                   servicio => servicio.nombre === newValue
               );
               this.camasServicioSeleccionado = selected ? selected.cant_camas : null;
           }
        }
    }
</script>