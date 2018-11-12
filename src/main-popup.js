import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App-Popup.vue'

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

axios.defaults.baseURL = 'https://api.wishing.space/'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

const store = new Vuex.Store({
  state: {
    messages: [],
    myList: [],
    currentListType: null,
    currentListValue: '',
    followList: [],
    pageid: null
  },
  mutations: {
    addMessage (state, newMsg) {
      state.messages.push(newMsg)
    },
    clearMessages (state) {
      state.messages = []
    },
    addMyList(state, newList) {
      state.myList = newList
    },
    addFollowList(state, newList) {
      state.followList = newList
    },
    setPageId(state, pageid) {
      state.pageid = pageid
    },
    setCurrentListType(state, listType) {
      state.currentListType = listType
    },
    setCurrentListValue(state, listValue) {
      state.currentListValue = listValue
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
