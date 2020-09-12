import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios';


const axiosConfig = {
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : process.env.VUE_APP_API_URL,
  timeout: 10000,
};

Vue.prototype.$axios = axios.create(axiosConfig)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
