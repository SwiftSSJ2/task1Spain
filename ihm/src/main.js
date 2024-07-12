import { createApp } from 'vue'
import App from './components/App.vue'
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Router from './routes/index'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App);
app.use(PrimeVue)
app.use(Router)
app.use(ElementPlus)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.mount('#app')