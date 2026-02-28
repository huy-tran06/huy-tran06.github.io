<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

import DashboardCustomer from "./DashboardCustomer.vue";
import DashboardWorker from "./DashboardWorker.vue";
import DashboardAdmin from "./DashboardAdmin.vue";

const authStore = useAuthStore()
const router = useRouter()

const roleComponent = computed(() => {
    if(!authStore.role){
        return null
    }
    switch(authStore.role) {
        case "customer": return DashboardCustomer
        case "worker": return DashboardWorker
        case "admin": return DashboardAdmin
        default: return null
    }
})

const handleLogout = async () => {
    await authStore.logout()
    router.push("/login")
}
</script>

<template>
    <component :is="roleComponent"/>
    <v-container>
        <v-btn
            @click="handleLogout"
            color="secondary"
            variant="outlined"
        >
            Logout
        </v-btn>
    </v-container>
</template>

