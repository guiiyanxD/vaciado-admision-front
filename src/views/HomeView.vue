<template>
    <div class="home-view">
        <div class="home-header">
            <h1 class="accent-header">Panel de Admisión</h1>
            <p class="text-muted mb-0">{{ fechaHoy }}</p>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-1">
            <div class="col" v-for="modulo in modulos" :key="modulo.to">
                <router-link :to="modulo.to" class="module-card card h-100 text-decoration-none">
                    <div class="card-body">
                        <div class="module-icon">
                            <i :class="['bi', modulo.icon]"></i>
                        </div>
                        <h5 class="card-title mb-1">{{ modulo.titulo }}</h5>
                        <p class="card-text text-muted small mb-0">{{ modulo.descripcion }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
const MODULOS = [
    {
        titulo: 'Censo diario',
        descripcion: 'Registrar ingresos, egresos y movimientos del día por servicio.',
        to: '/censo',
        icon: 'bi-clipboard2-pulse'
    },
    {
        titulo: 'Buscar registros',
        descripcion: 'Consultar el censo histórico por fecha, rango o servicio.',
        to: '/buscar',
        icon: 'bi-search'
    },
    {
        titulo: 'Dashboard de KPIs',
        descripcion: 'Ocupación, flujo de pacientes y aislamiento por servicio.',
        to: '/reportes/kpis',
        icon: 'bi-speedometer2'
    },
    {
        titulo: 'Reporte mensual',
        descripcion: 'Ver y exportar a PDF el resumen mensual de movimientos.',
        to: '/reportes/mensual',
        icon: 'bi-graph-up'
    },
    {
        titulo: 'Camas prestadas',
        descripcion: 'Reporte de camas prestadas por fecha, especialidad y tipo de ingreso.',
        to: '/reportes/camas-prestadas',
        icon: 'bi-arrow-left-right'
    },
    {
        titulo: 'Gestión de personal',
        descripcion: 'Administrar el listado de funcionarios activos e inactivos.',
        to: '/personal/gestion',
        icon: 'bi-people'
    },
    {
        titulo: 'Registro de compensaciones',
        descripcion: 'Cargar horas programadas, pagadas y permisos por mes.',
        to: '/compensaciones/gestion',
        icon: 'bi-cash-coin'
    },
    {
        titulo: 'Resumen de compensaciones',
        descripcion: 'Ver el saldo de horas acumulado por funcionario y gestión.',
        to: '/compensaciones/resumen',
        icon: 'bi-bar-chart'
    }
];

export default {
    name: 'HomeView',

    data() {
        return {
            modulos: MODULOS
        };
    },

    computed: {
        fechaHoy() {
            const hoy = new Date();
            const texto = hoy.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            return texto.charAt(0).toUpperCase() + texto.slice(1);
        }
    }
};
</script>

<style scoped>
.home-header {
    margin-bottom: 0.5rem;
}

.module-card {
    color: var(--color-text);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.module-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(31, 74, 44, 0.12);
    color: var(--color-text);
}

.module-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background-color: var(--color-primary-tint);
    color: var(--color-primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 0.85rem;
}
</style>
