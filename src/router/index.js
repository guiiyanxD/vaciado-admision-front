import { createRouter, createWebHistory } from 'vue-router'
import FormularioView from '../views/FormularioView.vue' 

const routes = [
  
  {
    path: '/',
    name: 'formulario',
    component: FormularioView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/buscar',
    name: 'buscar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/BuscarView.vue')
  },
  {
    path: '/reportes/mensual',
    name: 'ReporteMensual',
    component: () => import('@/components/reportes/reporteMensual.vue'),
    meta: {
      title: 'Reporte Mensual',
      requiresAuth: true // si usas autenticación
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
