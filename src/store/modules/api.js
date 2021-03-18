import axios from 'axios'

const state = {
  v1: 'https://data.jsdelivr.com/v1/',
  v2: 'https://api.npms.io/v2/',
  GET: {
    search: 'search',
    listPackageVersions: 'package/npm/:name'
  }
}

const getters = {
  search (state) { return state.v2 + state.GET.search },
  listPackageVersions: state => name => { return state.v1 + state.GET.listPackageVersions.replace(/:name/g, name) }
}

const actions = {
  searchPackages ({ getters, commit }, { text, from, size }) {
    return new Promise((resolve, reject) => {
      axios.get(getters.search, {
        params: {
          q: text,
          from: from || 0,
          size: size || 25
        }
      })
        .then(res => {
          commit('setPackages', res.data.results, { root: true })
          commit('setTotal', res.data.total, { root: true })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchVersions ({ getters }, name) {
    return new Promise((resolve, reject) => {
      axios.get(getters.listPackageVersions(name))
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
