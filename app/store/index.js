import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import sideDrawer from './modules/sideDrawer'
import userProducts from './modules/userProducts'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  state: state(),
  getters,
  mutations,
  actions,
  modules: {
    sideDrawer,
    userProducts
  },
  strict: debug
})

Vue.prototype.$store = store

export default store
