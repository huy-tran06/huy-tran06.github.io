import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Signup from "../views/Signup.vue"
import Dashboard from "../views/Dashboard.vue"
import { useAuthStore } from "../stores/auth"

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true} }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (authStore.loading) {
        await authStore.init()
    }

    if(to.meta.requiresAuth && !authStore.user){
        return "/login"
    }

    if((to.path === "/" || to.path === "/login" || to.path === "/signup") && authStore.user) {
        return "/dashboard"
    }
});

export default router
