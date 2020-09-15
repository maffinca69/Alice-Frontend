import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

Vue.component('DatePicker', DatePicker);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
