import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App-Options.vue'

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

axios.defaults.baseURL = 'https://api.wishing.space/'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

const store = new Vuex.Store({
  state: {
    messages: []
  },
  mutations: {
    addMessage (state, newMsg) {
      state.messages.push(newMsg)
    },
    clearMessages (state) {
      state.messages = []
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
