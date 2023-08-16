import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css'
import App from './App.vue'
import AddPwd from './components/AddPwd.vue';
import HomePage from './components/HomePage.vue';
import ModifyPwd from './components/ModifyPwd.vue';
import SearchPwd from './components/SearchPwd.vue';
import ViewRepo from './components/ViewRepo.vue';
import ImportRepo from './components/ImportRepo.vue';

const routes: any[] = [
  { path: '/', name: "homepage", component: HomePage },
  { path: '/add', name: "add", component: AddPwd },
  { path: '/modify', name: "modify", component: ModifyPwd },
  { path: '/search', name: "search", component: SearchPwd },
  { path: '/view', name: "view", component: ViewRepo },
  { path: '/import', name: "import", component: ImportRepo }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.mount('#app');
