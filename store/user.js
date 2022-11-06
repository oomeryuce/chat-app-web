const getDefaultState = () => {
  return {
    userLoading: false,
  }
}
export const state = () => getDefaultState()
export const getters = {}
export const mutations = {
  setUserLoading(state, payload) {
    state.userLoading = payload
  },
}
export const actions = {
  async updateUser({ commit, dispatch }, payload) {
    await commit('setUserLoading', true)
    await this.$axios
      .put('/api/users/me', payload)
      .then(async () => {
        await this.$auth.fetchUser()
        await commit('setUserLoading', false)
      })
      .catch(async (err) => {
        await dispatch('alert/error', err.response, {
          root: true,
        })
        await commit('setUserLoading', false)
        throw err.response.data
      })
  },
  async updatePassword({ commit, dispatch }, payload) {
    await commit('setUserLoading', true)
    await this.$axios
      .post('/api/users/me/password', payload)
      .then(async () => {
        await this.$auth.logout()
        await commit('setUserLoading', false)
      })
      .catch(async (err) => {
        await dispatch('alert/error', err.response, {
          root: true,
        })
        await commit('setUserLoading', false)
        throw err.response.data
      })
  },
}

/*
const getDefaultState = () => {
  return {}
}
export const state = () => getDefaultState()
export const getters = {}
export const mutations = {}
export const actions = {}
 */
