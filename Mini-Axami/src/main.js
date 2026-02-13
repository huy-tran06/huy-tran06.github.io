import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router"
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const auth = useAuthStore()
await auth.init()

app.use(router)

app.mount('#app')
