import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

import App from './App-Popup.vue'

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

axios.defaults.baseURL = 'https://api.wishing.space/'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

const store = new Vuex.Store({
  state: {
    messages: [],
    myList: [],
    myFollowList: [],
    followList: [],
    currentListType: null,
    currentListValue: '',
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
      newList.forEach(listInfo => {
        if (!listInfo.star) { listInfo.star = 0; }
      })
      state.myList = newList
    },
    addFollowList(state, newList) {
      newList.forEach(listInfo => {
        if (!listInfo.star) { listInfo.star = 0; }
      })
      state.followList = newList.filter(listinfo => {
        return listinfo.prenom
      })
      state.myFollowList = newList.filter(listinfo => {
        return !listinfo.prenom && listinfo.star === 1
      })
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
