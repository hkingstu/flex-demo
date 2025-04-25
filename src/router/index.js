import { createRouter, createWebHistory } from 'vue-router'
import Discover from '@/views/Discover.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Discover
  },
  {
    path: '/discover',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router