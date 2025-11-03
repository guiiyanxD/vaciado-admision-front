import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import API_BASE_URL from './config/api'

createApp(App).use(router).use(router).use(API_BASE_URL).mount('#app')
