import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/manajemen-rps',
      name: 'manajemen-rps',
      component: () => import('../views/ManajemenRPSView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/manajemen-mata-kuliah',
      name: 'manajemen-mata-kuliah',
      component: () => import('../views/ManajemenMataKuliahView.vue'),
      meta: { requiresAuth: true, roles: ['dosen'] }
    },
    {
      path: '/manajemen-soal',
      name: 'manajemen-soal',
      component: () => import('../views/ManajemenSoalView.vue'),
      meta: { requiresAuth: true, roles: ['dosen'] }
    },
    {
      path: '/portofolio',
      name: 'portofolio',
      component: () => import('../views/PortofolioView.vue'),
      meta: { requiresAuth: true, roles: ['dosen'] }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  userStore.initializeAuth()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.roles && userStore.user) {
    const userRole = userStore.user.role
    const roles = to.meta.roles as string[]
    if (roles.includes(userRole)) {
      next()
    } else {
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router
