import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/UserLogin.vue';
import SuggestionsPage from '../views/SuggestionsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/suggestions',
    name: 'SuggestionsPage',
    component: SuggestionsPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router
