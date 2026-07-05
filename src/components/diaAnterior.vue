<template>
    <div v-if="fechaActual !== null && servicio !== null" class="dia-anterior-bar">
        <div class="dia-anterior-info">
            <span class="dia-anterior-icono"><i class="bi bi-clock-history"></i></span>
            <div class="dia-anterior-texto">
                <span class="dia-anterior-eyebrow">Día anterior</span>
                <span class="dia-anterior-detalle">{{ servicio }} · {{ getDiaAnterior(fechaActual) }}</span>
            </div>
        </div>

        <div class="dia-anterior-hero">
            <span v-if="totalAyer === -1" class="spinner-border spinner-border-sm text-primary"></span>
            <span v-else-if="totalAyer === -2" class="dia-anterior-sin-datos">
                <i class="bi bi-calendar-x me-1"></i>Sin datos
            </span>
            <template v-else>
                <span class="dia-anterior-numero">{{ totalAyer }}</span>
                <span class="dia-anterior-label">Total 24 hs</span>
            </template>
        </div>
    </div>

    <div v-else class="dia-anterior-bar dia-anterior-bar--vacio">
        <i class="bi bi-calendar-plus me-2"></i>
        <small>Completá fecha y servicio para ver el día anterior</small>
    </div>
</template>
<script>
import { getTotalAyer } from '@/services/censoService';
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

                    getTotalAyer(data)
                    .then(data => {
                        if (data.status === 'success' && data.data !== null) {
                            this.totalAyer = data.data;
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

<style scoped>
.dia-anterior-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    min-height: 4rem;
    background-color: var(--color-primary-tint);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--radius-md);
    padding: 0.6rem 1rem;
}

.dia-anterior-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
}

.dia-anterior-icono {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--color-surface);
    color: var(--color-primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
}

.dia-anterior-texto {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    min-width: 0;
}

.dia-anterior-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
}

.dia-anterior-detalle {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dia-anterior-hero {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    line-height: 1.2;
    flex-shrink: 0;
    min-height: 2.75rem;
}

.dia-anterior-numero {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--color-primary-dark);
}

.dia-anterior-label {
    font-size: 0.7rem;
    color: var(--color-text-muted);
}

.dia-anterior-sin-datos {
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.dia-anterior-bar--vacio {
    justify-content: flex-start;
    background-color: transparent;
    border-left-color: transparent;
    border: 1px dashed var(--color-border);
    color: var(--color-text-muted);
}
</style>
