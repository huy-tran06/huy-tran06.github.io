import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router"
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const auth = useAuthStore()
auth.init()

app.mount('#app')
