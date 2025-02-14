import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createBootstrap } from 'bootstrap-vue-next';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { VueRecaptchaPlugin } from 'vue-recaptcha/head'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia);
app.use(createBootstrap());
app.use(router);
app.use(VueRecaptchaPlugin, {
  v2SiteKey: '6Lcq1tYqAAAAALg3A9mxD0XjHwcFQgGjN0B1Xlh3',
})
app.mount('#app')
