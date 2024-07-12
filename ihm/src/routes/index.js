import { createRouter, createWebHistory } from 'vue-router'; // Utilisation de la nouvelle méthode avec Vue 3

import AjouterRdv from '../components/addRdv.vue';
import DataTable from '../components/datatableVue.vue';
import LoginPage from '../components/loginVue.vue'
import RegistrationVue from '@/components/registrationVue.vue';
// pour aller sur des routes il faut utiliser le path
const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegistrationVue },
  { path: '/', component: DataTable, meta: { requiresAuth: true } },
  { path: '/ajouter', alias: '/modifier', name: 'AjouterRdv', component: AjouterRdv, meta: { requiresAuth: true } },
  // { path: '/modifier/:id', name: 'ModifierRdv', component: AjouterRdv, meta: { requiresAuth: true } },
  { path: '/listeRdv', component: DataTable, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authInfo = JSON.parse(localStorage.getItem('auth')) || {};

    if (!authInfo.username || (authInfo.expirationTime && new Date().getTime() > authInfo.expirationTime)) {
      localStorage.setItem('redirectRoute', to.fullPath);
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
