import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/shared.css';
import { OhVueIcon, addIcons } from '@kalimahapps/vue-icons';
import {
  SiGithub,
  SiLinux,
  SiDebian,
  SiUbuntu,
  SiArchlinux,
  SiFedora,
  SiOpensuse,
  SiNixos,
  SiVoidlinux,
} from '@kalimahapps/vue-icons/si';
import { HiStar, HiUsers, HiTag } from '@kalimahapps/vue-icons/hi';

addIcons(
  SiGithub,
  SiLinux,
  SiDebian,
  SiUbuntu,
  SiArchlinux,
  SiFedora,
  SiOpensuse,
  SiNixos,
  SiVoidlinux,
  HiStar,
  HiUsers,
  HiTag,
);

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.use(router);
app.mount('#app');   
