const getDefaultState = () => {
  return {
    type: null,
    message: null,
  }
}
export const state = () => getDefaultState()
export const mutations = {
  success(state, message) {
    state.type = 'success'
    state.message = message
  },
  error(state, message) {
    state.type = 'danger'
    state.message = message
  },
  clear(state) {
    state.type = null
    state.message = null
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export const actions = {
  async resetState({ commit }) {
    commit('resetState')
  },
  success({ commit }, message) {
    commit('success', message)
  },
  error({ commit }, message) {
    commit('error', message)
  },
  clear({ commit }) {
    commit('clear')
  },
}
