<template>
  <div class="login-container">
    <el-form :model="loginForm" ref="loginForm" :rules="loginRules" label-width="80px">
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkUser()">Login</el-button>
        <el-button type="primary" @click="goToRegister()">Registration</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import rdvServices from '../services/rdvServices';
import { checkAuthentication } from '../../auth'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, message: "Veuillez entrer votre nom d'utilisateur", trigger: "blur" }],
        password: [{ required: true, message: "Veuillez entrer votre mot de passe", trigger: "blur" }],
      },
    };
  },
  created() {
    this.rdvServices = new rdvServices();
  },
  methods: {
    async checkUser() {
      try {
        const user = await checkAuthentication(this.loginForm.username, this.loginForm.password);
        if (user) {
          const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000; // 1 heure en millisecondes

          localStorage.setItem('auth', JSON.stringify({
            username: user.login,
            id: user.id,
            expirationTime: expirationTime,
          }));
          const redirectRoute = localStorage.getItem('redirectRoute');
          this.$router.push(redirectRoute || '/');
        } else {
          this.$message.error("Vous n'avez pas l'autorisation !");
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Nom d\'utilisateur ou mot de passe incorrect.') {
          this.$message.error('Nom d\'utilisateur ou mot de passe incorrect.');
          console.log(error)
        }
      }
    },
    goToRegister() {
      this.$router.push('/register');
    }
  },
};
</script>
  
<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
}
</style>
