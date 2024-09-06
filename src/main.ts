import '@/assets/main.scss'
import pinia from '@/stores/index'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
