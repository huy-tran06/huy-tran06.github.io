import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router"
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
await auth.init()

app.use(router)
app.use(vuetify)

app.mount('#app')
