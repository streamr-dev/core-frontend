import * as types from './types'

export const state = {
  search: null,
  url: null,
  token: ''
}

export const mutations = {
  [types.SETTINGS_SET_URL] (state, payload) {
    state.url = payload
  },
  [types.SETTINGS_SET_SEARCH] (state, payload) {
    state.search = payload
  },
  [types.SETTINGS_SET_TOKEN] (state, payload) {
    state.token = payload
  }
}

export const getters = {
  [types.SETTINGS_URL]: state => state.url,
  [types.SETTINGS_SEARCH]: state => state.search,
  [types.SETTINGS_TOKEN]: state => state.token
}

export default {
  state,
  mutations,
  getters
}
