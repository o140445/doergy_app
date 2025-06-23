import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Task from '@/views/Task.vue'
import Index from '@/views/Index.vue'

import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/task',
    component: Task,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: Index,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
