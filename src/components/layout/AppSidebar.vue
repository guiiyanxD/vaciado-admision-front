<template>
    <div>
        <!-- Barra superior, solo visible por debajo de "lg" -->
        <header class="mobile-topbar d-lg-none">
            <button
                class="topbar-toggle"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebarOffcanvas"
                aria-controls="sidebarOffcanvas"
                aria-label="Abrir menú"
            >
                <i class="bi bi-list"></i>
            </button>
            <span class="topbar-brand">
                <i class="bi bi-hospital-fill"></i> Admisión
            </span>
        </header>

        <!-- Sidebar fijo, solo visible en "lg" y superior -->
        <nav class="app-sidebar d-none d-lg-block" aria-label="Navegación principal">
            <SidebarNav :items="items" />
        </nav>

        <!-- Offcanvas (drawer) para pantallas angostas -->
        <div
            class="offcanvas offcanvas-start app-sidebar-offcanvas d-lg-none"
            tabindex="-1"
            id="sidebarOffcanvas"
            aria-labelledby="sidebarOffcanvasLabel"
        >
            <button
                type="button"
                class="btn-close btn-close-white offcanvas-close"
                data-bs-dismiss="offcanvas"
                aria-label="Cerrar menú"
            ></button>
            <SidebarNav :items="items" @navigate="cerrarOffcanvas" />
        </div>
    </div>
</template>

<script>
import SidebarNav from './SidebarNav.vue';

const SECCIONES = [
    { label: 'Inicio', to: '/', icon: 'bi-house-door' },
    { label: 'Censo diario', to: '/censo', icon: 'bi-clipboard2-pulse' },
    { label: 'Buscar registros', to: '/buscar', icon: 'bi-search' },
    {
        label: 'Reportes',
        icon: 'bi-graph-up',
        children: [
            { label: 'Reporte mensual', to: '/reportes/mensual' },
            { label: 'Camas prestadas', to: '/reportes/camas-prestadas' },
            { label: 'Dashboard de KPIs', to: '/reportes/kpis' }
        ]
    },
    {
        label: 'Personal',
        icon: 'bi-people',
        children: [
            { label: 'Gestión de personal', to: '/personal/gestion' }
        ]
    },
    {
        label: 'Compensaciones',
        icon: 'bi-cash-coin',
        children: [
            { label: 'Registro', to: '/compensaciones/gestion' },
            { label: 'Resumen', to: '/compensaciones/resumen' },
            { label: 'Descontar horas', to: '/compensaciones/descuento' }
        ]
    }
];

export default {
    name: 'AppSidebar',

    components: { SidebarNav },

    data() {
        return {
            items: SECCIONES,
            offcanvasInst: null
        };
    },

    mounted() {
        const el = document.getElementById('sidebarOffcanvas');
        this.offcanvasInst = bootstrap.Offcanvas.getOrCreateInstance(el);
    },

    methods: {
        cerrarOffcanvas() {
            if (this.offcanvasInst) this.offcanvasInst.hide();
        }
    }
};
</script>

<style scoped>
.app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 260px;
    background-color: var(--color-primary-darker);
    z-index: 1020;
}

.app-sidebar-offcanvas {
    width: 260px;
    background-color: var(--color-primary-darker);
}

.offcanvas-close {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    z-index: 5;
}

.mobile-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: var(--color-primary-darker);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
    z-index: 1025;
}

.topbar-toggle {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    padding: 0.25rem;
}

.topbar-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-weight: 800;
    color: #fff;
    font-size: 1.05rem;
}
</style>
