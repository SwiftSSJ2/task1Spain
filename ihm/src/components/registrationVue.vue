<template>
    <div class="register-container">
      <el-form :model="registerForm" ref="registerForm" :rules="registerRules" label-width="120px">
        <el-form-item label="Username" prop="login">
          <el-input v-model="registerForm.login" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerUser()">Register</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import md5 from 'md5';
  import rdvServices from '../services/rdvServices';
  
  export default {
    data() {
      return {
        registerForm: {
          login: '',
          password: '',
          confirmPassword: '',
        },
        registerRules: {
          login: [{ required: true, message: "Please enter your username", trigger: "blur" }],
          password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
          confirmPassword: [
            { required: true, message: "Please confirm your password", trigger: "blur" },
            { validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error("Passwords do not match"));
              } else {
                callback();
              }
            }, trigger: 'blur' }
          ]
        },
      };
    },
    created() {
      this.rdvServices = new rdvServices();
    },
    methods: {
      async registerUser() {
        this.$refs.registerForm.validate(async (valid) => {
          if (valid) {
            try {
              // Hash the password before sending it to the server
              const hashedPassword = md5(this.registerForm.password);
              const registerData = {
                login: this.registerForm.login,
                password: hashedPassword,
              };
              await this.rdvServices.register(registerData);
              this.$message.success("Registration successful!");
              this.$router.push('/login');
            } catch (error) {
              this.$message.error("Registration failed");
            }
          } else {
            this.$message.error("Please correct the errors in the form");
            return false;
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: 100px auto;
  }
  </style>
  