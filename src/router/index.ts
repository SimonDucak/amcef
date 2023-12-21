// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { RouteName } from '@/enum/RouteName';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.LIST,
    component: () => import('@/views/List.vue'),
  },
  {
    path: '/task/:id',
    name: RouteName.TASK,
    component: () => import('@/views/Task.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
