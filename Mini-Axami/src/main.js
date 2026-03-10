import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router"
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            ...faAliases
        },
        sets: {
            mdi,
            fa
        }
    }
})

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
await auth.init()

app.use(router)
app.use(vuetify)

app.mount('#app')
