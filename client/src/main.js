import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSwal from 'vue-swal'

Vue.use(VueSwal)
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
