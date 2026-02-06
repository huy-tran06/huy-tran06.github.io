import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import LoginOTP from "../views/LoginOTP.vue"
import Dashboard from "../views/Dashboard.vue"
import { useAuthStore } from "../stores/auth"

const routes = [
    { path: "/", component: Login },
    { path: "/login-otp", component: LoginOTP},
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
        return "/"
    }

    if(to.path === "/" && authStore.user) {
        return "/dashboard"
    }
});

export default router