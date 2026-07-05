import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/censo',
    name: 'formulario',
    component: () => import('../views/FormularioView.vue')
  },
  {
    path: '/buscar',
    name: 'buscar',
    component: () => import('../views/BuscarView.vue')
  },
  {
    path: '/reportes/mensual',
    name: 'ReporteMensual',
    component: () => import('@/components/reportes/reporteMensual.vue'),
    meta: {
      title: 'Reporte Mensual',
      requiresAuth: true
    }
  },
  {
    path: '/reportes/camas-prestadas',
    name: 'ReporteCamasPrestadas',
    component: () => import('@/components/reportes/reporteCamasPrestadas.vue'),
    meta: {
      title: 'Reporte de Camas Prestadas',
      requiresAuth: true
    }
  },
  {
    path: '/reportes/kpis',
    name: 'DashboardKpis',
    component: () => import('@/components/reportes/dashboardKpis.vue'),
    meta: {
      title: 'Dashboard de KPIs',
      requiresAuth: true
    }
  },
  {
    path: '/personal/gestion',
    name: 'GestionPersonal',
    component: () => import('@/components/gestionarPersonal.vue'),
    meta: {
      title: 'Gestión de Personal',
      requiresAuth: false
    }
  },
  {
    path: '/compensaciones/gestion',
    name: 'GestionCompensaciones',
    component: () => import('@/components/registroCompensaciones.vue'),
    meta: {
      title: 'Registro de Compensaciones',
      requiresAuth: false
    }
  },
  {
    path: '/compensaciones/resumen',
    name: 'ResumenCompensaciones',
    component: () => import('@/components/resumenCompensaciones.vue'),
    meta: {
      title: 'Resumen de Compensaciones',
      requiresAuth: false
    }
  },
  {
    path: '/compensaciones/descuento',
    name: 'CompensacionesDescuento',
    component: () => import('@/components/compensacionesDescuento.vue'),
    meta: {
      title: 'Descontar Horas de Compensación',
      requiresAuth: false
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
