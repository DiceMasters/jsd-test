import Vue from 'vue'
import Vuex from 'vuex'

/**
 * Modules import
 */
import api from './modules/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchInput: '',
    packages: [],
    total: 0
  },
  mutations: {
    setSearchInput (state, payload) { state.searchInput = payload },
    setPackages (state, payload) { state.packages = payload },
    setTotal (state, payload) { state.total = payload }
  },
  actions: {
  },
  modules: {
    api
  }
})
