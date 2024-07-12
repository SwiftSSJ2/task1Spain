<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    style="background-color: rgb(0, 117, 137); justify-content: center;"
  >
    <el-menu-item index="1" style="font-size: large;" @click="navigate('listeRdv')">Appointment list</el-menu-item>
    <el-menu-item index="2" style="font-size: large;" @click="navigate('ajouter')">Add appointment</el-menu-item>
    <el-menu-item index="3" style="font-size: large; margin-left: auto;">
      <el-button type="primary" @click="logout">Log Out</el-button>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  methods: {
    navigate(route) {
      this.$router.push(`/${route}`);
    },
    logout() {
      // Clear authentication details from local storage
      localStorage.removeItem('auth');
      // Redirect to the login page
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.el-menu-demo {
  display: flex;
  width: 100%;
  align-items: center;
}
</style>
