import { createRouter, createWebHistory } from 'vue-router'
import Discover from '@/views/Discover.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Discover
  },
  // 确保没有其他路由覆盖根路径
  { 
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router