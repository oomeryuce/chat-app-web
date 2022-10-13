const getDefaultState = () => {
  return {
    device: {},
    emailLoading: false,
    passwordLoading: false,
    mode: 'dark',
    tab: 'home',
    notificationBadge: 0,
    messagesBadge: 0,
    registerLoading: false,
  }
}
export const state = () => getDefaultState()
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
}
export const mutations = {
  setDevice(state, payload) {
    state.device = payload
  },
  setEmailLoading(state, payload) {
    state.emailLoading = payload
  },
  setPasswordLoading(state, payload) {
    state.passwordLoading = payload
  },
  setTab(state, payload) {
    state.tab = payload
  },
  setRegisterLoading(state, payload) {
    state.registerLoading = payload
  },
  setMode(state, payload) {
    state.mode = payload
  },
  setBadges(state, payload) {
    state.notificationBadge = payload.notifications
    state.messagesBadge = payload.messages
  },
  setMessageBadge(state, payload) {
    state.messagesBadge = payload
  },
  setNotificationBadge(state, payload) {
    state.notificationBadge = payload
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}
export const actions = {
  async resetState({ commit }) {
    commit('resetState')
  },
  async setDevice({ commit }, payload) {
    commit('setDevice', payload)
  },
  async getSettings({ commit }) {
    const mode = localStorage.getItem('mode') || null
    if (mode) {
      await commit('setMode', mode)
    }
  },
  async getBadges({ commit, dispatch }) {
    try {
      const response = await this.$axios.get('/api/getBadgeCount')
      await commit('setBadges', response.data.data)
    } catch (error) {
      await dispatch('alert/error', error.response, {
        root: true,
      })
    }
  },
  async register({ dispatch, commit }, payload) {
    await commit('setRegisterLoading', true)
    try {
      const response = await this.$axios.post('/api/register', payload)
      await commit('setRegisterLoading', false)
      return response.data.accessToken
    } catch (error) {
      await dispatch('alert/error', error.response.data, {
        root: true,
      })
      await commit('setRegisterLoading', false)
      throw error.response.data
    }
  },
  async sendEmail({ dispatch, commit }, email) {
    await commit('setEmailLoading', true)
    try {
      const response = await this.$axios.post('/api/postResetPassMail', {
        email: email,
      })
      await commit('setEmailLoading', false)
      return response.data
    } catch (error) {
      await dispatch('alert/error', error.response, {
        root: true,
      })
      await commit('setEmailLoading', false)
      throw 'Unable to send email'
    }
  },
  async changePassword({ dispatch, commit }, payload) {
    await commit('setPasswordLoading', true)
    try {
      const response = await this.$axios.post(
        '/api/resetPassword',
        {
          password: payload.password,
        },
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      )
      await commit('setPasswordLoading', false)
      return response.data
    } catch (error) {
      await dispatch('alert/error', error.response, {
        root: true,
      })
      await commit('setPasswordLoading', false)
      throw 'Unable to change your password'
    }
  },
  async toggleRegisterLoading({ commit }, payload) {
    await commit('setRegisterLoading', payload)
  },
  async setTab({ commit }, payload) {
    await commit('setTab', payload)
  },
  async setMessageBadge({ state, commit }, payload) {
    await commit(
      'setMessageBadge', 10
      //payload === 0 ? 0 : state.messagesBadge + payload
    )
  },
  async setNotificationBadge({ commit }, payload) {
    await commit('setNotificationBadge', payload)
  },
}
