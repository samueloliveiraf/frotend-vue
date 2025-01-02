import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';          
import 'primeicons/primeicons.css';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_URL_BACKEND}/accounts/api/token/refresh/`, {
            refresh: refreshToken
          });

          localStorage.setItem('access_token', response.data.access);

          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Falha ao atualizar o token:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.push({ name: 'Login' });
        }
      }
    }

    return Promise.reject(error);
  }
);

const app = createApp(App);

app.use(PrimeVue, {
  locale: {
      accept: 'Sim',
      reject: 'Não'
  }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);

app.mount('#app');
