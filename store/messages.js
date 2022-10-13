const getDefaultState = () => {
  return {
    loading: false,
    sendLoading: false,
    messagesLoading: false,
    contacts: [],
    messages: [],
    page: 0,
    contactsPage: 1,
    contactsEnough: false,
    enough: false,
    selected: null,
    query: null,
    socket: false,
  }
}
export const state = () => getDefaultState()
export const getters = {}
export const mutations = {
  setLoading(state, payload) {
    state.loading = payload
  },
  setSendLoading(state, payload) {
    state.sendLoading = payload
  },
  setPage(state, payload) {
    state.page = payload
  },
  setContactsPage(state, payload) {
    state.contactsPage = payload
  },
  setContactsEnough(state, payload) {
    state.contactsEnough = payload
  },
  setEnough(state, payload) {
    state.enough = payload
  },
  setSocket(state, payload) {
    state.socket = payload
  },
  setContacts(state, payload) {
    state.contacts = [...state.contacts, ...payload]
  },
  removeMessage(state, id) {
    const index = state.messages.findIndex(
      (message) => message.unique && message.unique === id
    )
    if (index > -1) {
      state.messages.splice(index, 1)
    }
  },
  setMessages(state, payload) {
    // state.messages = [...payload.reverse(), ...state.messages]
    state.messages.unshift(...payload.reverse())
    if (payload.length < 10) {
      state.enough = true
    }
  },
  insertMessage(state, payload) {
    const index = state.messages.findIndex(
      (message) => message.unique && message.unique === payload.id
    )
    if (index > -1) {
      state.messages[index].unique = null
      Object.assign(state.messages[index], payload.message)
    }
  },
  insertSocketMessage(state, payload) {
    const index = state.messages.findIndex(
      (message) => message.id === payload.id
    )
    if (index < 0) {
      state.messages.push(payload)
    }
  },
  setSendingMessages(state, payload) {
    state.messages.push(payload)
    state.selected.created_at = payload.created_at
  },
  setMessagesVal(state, payload) {
    state.messages = payload
  },
  messageFromAnother(state, payload) {
    var index = state.contacts.findIndex(
      (contact) => contact.user.id === payload.user.id
    )
    if (index > -1) {
      state.contacts[index].unread += 1
    } else {
      const selected = {
        id: +new Date(),
        from: payload.from,
        to: payload.to,
        unread: 1,
        created_at: payload.created_at,
        updated_at: payload.updated_at,
        user: payload.user,
      }
      state.contacts.unshift(selected)
    }
  },
  setSelected(state, payload) {
    state.page = 0
    if (state.selected && payload.user.id !== state.selected.user.id) {
      state.enough = false
    }
    state.query = null
    state.selected = payload
    state.selected.unread = 0
    var index = state.contacts.findIndex(
      (contact) => contact.user.id === payload.user.id
    )
    if (index === -1) {
      state.contacts.unshift(payload)
    }
  },
  setQuery(state, payload) {
    state.query = payload
  },
  selectQueryUser(state, payload) {
    console.log(payload)
    /* let query = parseInt(state.query)
    var index = payload.findIndex((contact) => contact.user.id === query)
    if (index > -1) {
      state.selected = payload[index]
    }
    */
    state.selected = null;
  },
  setMessagesLoading(state, payload) {
    state.messagesLoading = payload
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}
export const actions = {
  async resetState({ commit }) {
    commit('resetState')
  },
  async getContacts({ dispatch, commit }, page) {
    try {
      const response = await this.$axios.get('/api/messages?page=' + page)
      commit('setLoading', false)
      /* if (response.data.data.data.length < 10) {
        commit('setContactsEnough', true)
      } */
      if (page === 1) {
        commit('selectQueryUser', response.data.data.data)
      }
      commit('setContacts', response.data.data.data)
      return response.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      commit('setLoading', false)
      throw 'Unable to load contacts'
    }
  },
  async getMessages({ state, dispatch, commit }, id) {
    if (!state.enough) {
      commit('setPage', state.page + 1)
      try {
        const response = await this.$axios.get(
          '/api/conversation/' + id + '?page=' + state.page
        )
        commit('setMessages', response.data.data.data)
        commit('setMessagesLoading', false)
        return response.data.data.data
      } catch (error) {
        dispatch('alert/error', error.response, {
          root: true,
        })
        commit('setMessagesLoading', false)
        throw 'Unable to load messages'
      }
    } else {
      return []
    }
  },
  async sendMessage({ dispatch, commit, rootState }, payload) {
    const unique = +new Date()
    const msg = {
      from: rootState.auth.user.id,
      unique: unique,
      id: unique,
      image: payload.get('image'),
      read: true,
      room_id: unique,
      text: payload.get('text'),
      to: parseInt(payload.get('contact_id')),
      user: rootState.auth.user,
      updated_at: new Date(),
      created_at: new Date(),
    }
    commit('setSendingMessages', msg)
    try {
      const response = await this.$axios.post('/api/conversation/send', payload)
      commit('insertMessage', { id: unique, message: response.data.data })
      return response.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      throw unique
    }
  },
  async getUser({ dispatch }, id) {
    try {
      const response = await this.$axios.get('/api/info', {
        params: { selected_user_id: id },
      })
      return response.data.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      throw 'Unable to get user'
    }
  },
  async setSelected({ commit }, payload) {
    commit('setSelected', payload)
  },
  async setMessages({ commit }, payload) {
    commit('setMessagesVal', payload)
  },
  async setPage({ commit }, payload) {
    commit('setPage', payload)
  },
  async setContactsPage({ commit }, payload) {
    commit('setContactsPage', payload)
  },
  async setContactsEnough({ commit }, payload) {
    commit('setContactsEnough', payload)
  },
  async setQuery({ commit }, payload) {
    commit('setQuery', payload)
  },
  async insertMessage({ commit }, payload) {
    commit('insertMessage', payload)
  },
  async insertSocketMessage({ commit }, payload) {
    commit('insertSocketMessage', payload)
  },
  async toggleLoading({ commit }, payload) {
    commit('setLoading', payload)
  },
  async toggleMessagesLoading({ commit }, payload) {
    commit('setMessagesLoading', payload)
  },
  async messageFromAnother({ commit }, payload) {
    commit('messageFromAnother', payload)
  },
  async removeMessage({ commit }, id) {
    commit('removeMessage', id)
  },
  async setSocket({ commit }, payload) {
    commit('setSocket', payload)
  },
}
