import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
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

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(router);
app.mount('#app');
