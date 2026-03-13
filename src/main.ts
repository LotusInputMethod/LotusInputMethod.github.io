import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/style.css';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  SiGithub,
  SiLinux,
  SiDebian,
  SiUbuntu,
  SiArchlinux,
  SiFedora,
  SiOpensuse,
  SiNixos,
} from 'oh-vue-icons/icons';

addIcons(
  SiGithub,
  SiLinux,
  SiDebian,
  SiUbuntu,
  SiArchlinux,
  SiFedora,
  SiOpensuse,
  SiNixos,
);

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.use(router);
app.mount('#app');
