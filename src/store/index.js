import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)
Vue.config.devtools = true
const store = new Vuex.Store({
  // state: {
  //   counter: 0
  // },
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
