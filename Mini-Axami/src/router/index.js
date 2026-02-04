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

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (authStore.loading){
        const stop = authStore.$subscribe(() => {
            if (!authStore.loading) {
                stop()
                handleGuard()
            }
        })
    } else{
        handleGuard()
    }

    function handleGuard() {
        if (to.meta.requiresAuth && !authStore.user) {
            next("/")
        }
        else {
            next()
        }
    }

})

export default router