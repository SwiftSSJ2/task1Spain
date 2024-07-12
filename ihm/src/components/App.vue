<template>
  <div id="app">
    <template v-if="showMenu">
      <Menu />
    </template>
    <router-view />
  </div>
</template>

<script>
import Menu from './menuVue.vue'

export default {
  components: {
    Menu,
  },
  data() {
    return {
      showMenu: true, // Par défaut, le menu est affiché
    };
  },
  watch: {
    $route(to) {
      // Si la route actuelle est "/login", masquer le menu
      this.showMenu = !(to.path === '/login' || to.path === '/register');
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #333;
}

.menu {
  background-color: #007BFF;
  color: #ffffff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  background-color: #0056b3;
  color: #ffffff;
  cursor: pointer;
}

button:hover {
  background-color: #007BFF;
}
</style>

