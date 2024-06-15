import { createRouter, createWebHistory } from 'vue-router'
import MapboxGlobal from '../components/MapboxGlobe.vue'
import ThreeJSScene from '../components/ThreeJSScene.vue'

const routes = [
  {path:'/', component: ThreeJSScene },
  { path: '/Mapa', component: MapboxGlobal},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
