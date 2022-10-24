<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MainPage from './components/MainPage.vue';
import AddPwd from './components/AddPwd.vue';
import ExportRepo from './components/ExportRepo.vue';
import ModifyPwd from './components/ModifyPwd.vue';
import SearchPwd from './components/SearchPwd.vue';
import ViewRepo from './components/ViewRepo.vue';

import { ref } from 'vue';

const routes: any = {
  '/': MainPage,
  '/add': AddPwd,
  '/export': ExportRepo,
  '/modify': ModifyPwd,
  '/search': SearchPwd,
  '/view': ViewRepo
}

let currentRoute = ref('/');

function changeRoute(newRoute: string): void {
  currentRoute.value = newRoute;
}

</script>

<template>
  <component :is="routes[currentRoute]" @changeRoute="changeRoute"></component>
</template>

<style scoped> 
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
