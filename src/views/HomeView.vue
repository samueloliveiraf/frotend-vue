<template>

  <Button @click="logout" class="btn-logout" type="submit" label="Sair da conta" icon="pi pi-sign-in"/>

  <div>
    <h1>Lista de Produtos</h1>
    <div v-if="loadingProducts">Carregando...</div>
    <div v-else-if="productsError">{{ productsError }}</div>
    <div v-else>
      <ul class="product-list">
        <li v-for="product in products" :key="product.id" class="product-card">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">Preço: R$ {{ product.price }}</p>
        </li>
      </ul>
    </div>
  </div>

  <Toast />
  <ConfirmDialog />
  <router-view></router-view>
</template>

<script>
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import axios from 'axios';

export default {
  name: 'HomeView',
  components: {
    Button,
    Toast,
    ConfirmDialog
  },
  data() {
    return {
      patients: [],
      products: [],
      loadingProducts: true,
      productsError: null,
      patientMetrics: null,
      selectedPatientId: null
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${process.env.VUE_APP_URL_BACKEND}/v1/api/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.products = response.data;
      } catch (error) {
        this.productsError = "Erro ao carregar os produtos.";
        console.error("Erro ao buscar produtos:", error);
      } finally {
        this.loadingProducts = false;
      }
    },
    async logout() {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        await axios.post(`${process.env.VUE_APP_URL_BACKEND}/accounts/api/token/logout/`, { refresh_token: refreshToken });
      } catch (error) {
        console.error("Erro ao fazer logout no servidor:", error);
      }
      localStorage.clear();
      this.$router.push('/');
    },
  }
};
</script>


<style>
body {
  padding: 2.0rem;
}

h1 {
  color: white;
}

.patients-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

.patients-list li {
  flex: 0 0 calc(33.333% - 10px);
  margin: 5px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px; 
  border-radius: 26px;
  background: white;
}

@media (max-width: 600px) {
  .patients-list li {
    flex: 0 0 100%;
  }
}

.btn-login {
  margin-top: 1.2rem;
}

.btn-logout {
  position: fixed; 
  top: 10px;
  right: 10px;
  z-index: 1000;
  border-radius: 26px;
}

.btn-action {
  margin-left: 4px;
  border-radius: 26px;
}

input {
  text-align: center;
  border-radius: 26px;
}

.centered-paragraph {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.product-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 250px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.product-name {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}

.product-description {
  font-size: 1em;
  color: #555;
  margin-bottom: 15px;
}

.product-price {
  font-size: 1.1em;
  font-weight: bold;
  color: #2a9d8f;
}
</style>