<template>
    <div v-if="fechaActual !== null && servicio !== null">
        <h5 style="color: salmon;">Día Anterior</h5>
        <p style="font-weight: bold;">
            {{ servicio }}, {{ getDiaAnterior(fechaActual) }}: 
            <br>
            <span style="font-weight: bold; color:royalblue" v-if="totalAyer === -1">Cargando...</span>
            <span style="font-weight: bold; color:royalblue" v-else-if="totalAyer === -2">No hay datos</span>
            <span style="font-weight: bold; color:royalblue" v-else>{{ totalAyer }}</span>
        </p>
    </div>
    <div v-else>
        <h5 style="color: salmon;">Día Anterior</h5>
        <br> 
        <small>Coloque la fecha actual</small>
    </div>
</template>
<script>
import API_BASE_URL from './config/api'; 
    export default{
        name: 'diaAnterior',
        description: 'Componente que calcula el día anterior a la fecha actual',
        data(){
            return{
                totalAyer: -1, // -1: loading, -2: no data, -3: error, -4: missing props
                fechaAyer: null,
            }
        },
        props: {
            'fechaActual': {
                type: String,
                default: null
            },
            'servicio': {
                type: String,
                default: null
            }
        },
        created(){
            
        },
        watch: {
            // Watch for changes in fechaActual or servicio props
            fechaActual: 'getDataAyer',
            servicio: 'getDataAyer',
        },
        methods: {
            getDiaAnterior(fechaActualP){
                const fecha = new Date(fechaActualP);   
                fecha.setDate(fecha.getDate() - 1);
                return fecha.toISOString().split('T')[0];
            },
            getDataAyer(){
                if (this.fechaActual !== null && this.servicio !== null) {
                    const fechaAyer = this.getDiaAnterior(this.fechaActual);
                    const data = {
                        fecha: fechaAyer,
                        servicio: this.servicio
                    };
                    
                    // Set totalAyer to 0 to show a "loading" message
                    this.totalAyer = -1; 
                    
                    fetch(`${API_BASE_URL}/totalAyer2`, { // Corrected URL: /api/totalAyer
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        //console.log('Response data:', data); // Debugging log 
                        if (data.status === 'success') {
                            this.totalAyer = data.data; // Corrected: use data.total
                        } else {
                            this.totalAyer = -2; // No data found
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        this.totalAyer = -3; // Fetch error
                    });
                } else {
                    this.totalAyer = -4; // Missing props
                }
            }
        }
    }
</script>