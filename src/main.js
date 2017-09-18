// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage';
axios.defaults.baseURL = 'http://127.0.0.1:8000/controle/';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(Vuetify);
Vue.use(VueLocalStorage);
Vue.localStorage.set('token', null);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
