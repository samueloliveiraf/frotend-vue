<template>
  <div>
    <div class="form-container">
      <form @submit.prevent="login">
        <img alt="Logo Site" src="../assets/dev.jpg" height="95" style="border-radius: 15px;">
        <div class="padd-input">
          <InputText class="input-login" id="username" type="text" v-model="username" placeholder="Digite seu usuário"/>
        </div>
        <div class="field-container password-container padd-input">
          <InputText class="input-login" id="password" :type="passwordFieldType" v-model="password" placeholder="Digite sua senha"/>
          <Button icon="pi pi-eye" @click="togglePasswordVisibility" class="p-button-text password-toggle" />
        </div>
        <div>
          <Button class="btn-login" type="submit" label="Entrar na conta" icon="pi pi-sign-in" :loading="loading"/>
        </div>
        <div>
          <Button class="btn-login" label="Recuperar Senha" icon="pi pi-sign-in" @click="openPasswordRecoveryModal" />
        </div>
        <Toast />
      </form>
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <Dialog 
      header="Recuperação de Senha" 
      v-model:visible="isModalVisible" 
      :closable="true" 
      class="password-recovery-dialog" 
      :style="dialogStyles">
      <div class="dialog-content">
        <InputText v-model="email" placeholder="Digite seu e-mail" class="input-email" />
        <div class="p-pt-3">
          <Button label="Enviar Link de Redefinição" @click="recoverPassword" class="btn-recovery" :loading="loading" />
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      email: '', 
      errorMessage: '',
      loading: false,
      passwordFieldType: 'password',
      isModalVisible: false,
      modalMessage: '',
      modalSuccess: false
    };
  },
  methods: {
    async login() {
      this.loading = true;

      try {
        const response = await axios.post(`${process.env.VUE_APP_URL_BACKEND}/accounts/api/token/`, {
          username: this.username,
          password: this.password
        });

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        this.$router.push('/home');
        this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Login bem-sucedido!' });
      } catch (error) {
        console.error(error);
        const message = error.response?.data?.detail || 'Erro ao realizar login.';
        this.$toast.add({ severity: 'error', summary: 'Erro', detail: message });
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    openPasswordRecoveryModal() {
      this.isModalVisible = true;
    },
    async recoverPassword() {
      this.loading = true;
      if (!this.email) {
        this.$toast.add({ severity: 'error', summary: 'Não há email', detail: 'Por favor, insira seu e-mail.'});
        return;
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_URL_BACKEND}/accounts/api/password-reset/`, { email: this.email });

        const message = response.data.detail;
        this.modalSuccess = true;
        this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: message });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
        const message = error.response?.data?.detail || 'Falha ao enviar e-mail. Por favor, tente novamente.';
        this.modalSuccess = false;
        this.$toast.add({ severity: 'error', summary: 'Erro', detail: message });
      }
    },
  },
  components: {
    Button,
    Toast,
    InputText,
    Dialog
  }
}
</script>

<style>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff63;
  border-radius: 26px;
  height: 570px;
  max-width: 420px;
  width: 80%;
  margin: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.input-login {
  background: #ffffff63;
  color: white;
  border-radius: 12px;
  text-align: center;
}

.password-container {
  display: flex;
  align-items: center;
}

.password-toggle {
  margin-left: -40px; /* Ajuste conforme necessário */
}

.padd-input {
  padding-top: 0.8rem;
  padding-bottom: 0.9rem;
}

.btn-login {
  border-radius: 26px;
}

.password-recovery-dialog {
  border-radius: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.39) !important;
}

.dialog-content {
  padding: 20px;
}

.input-email {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}

.input-email:focus {
  border-color: #007BFF;
}

.btn-recovery {
  width: 100%;
  padding: 12px;
  background-color: #007BFF;
  color: white;
  border-radius: 18px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-recovery:hover {
  background-color: #0056b3;
}

.modal-message {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.p-text-success {
  color: green;
}

.p-text-error {
  color: red;
}

</style>
