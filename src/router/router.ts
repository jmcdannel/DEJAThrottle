import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import SelectConnections from "@/connections/SelectConnections.component.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/throttle/:locoId?",
      name: "throttle",
      component: () => import("../views/ThrottleView.vue"),
    },
    {
      path: "/connect",
      name: "connect",
      component: SelectConnections,
    },
    {
      path: "/connect/dejajs",
      name: "dejajs",
      component: () => import("../connections/deja/DejaJs.vue"),
    },
    {
      path: "/connect/deja-cloud",
      name: "deja-cloud",
      component: () => import("../connections/deja/DejaCloud.vue"),
    },
  ],
})

export default router
