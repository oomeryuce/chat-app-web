const getDefaultState = () => {
  return {
    loading: false,
    sendLoading: false,
    messagesLoading: false,
    rooms: [],
    messages: [],
    page: 0,
    roomsPage: 1,
    roomsEnough: false,
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
  setRoomsPage(state, payload) {
    state.roomsPage = payload
  },
  setRoomsEnough(state, payload) {
    state.roomsEnough = payload
  },
  setEnough(state, payload) {
    state.enough = payload
  },
  setSocket(state, payload) {
    state.socket = payload
  },
  setRooms(state, payload) {
    state.rooms = [...state.rooms, ...payload]
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
    var index = state.rooms.findIndex(
      (room) => room.user.id === payload.user.id
    )
    if (index > -1) {
      state.rooms[index].unread += 1
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
      state.rooms.unshift(selected)
    }
  },
  setSelected(state, payload) {
    state.page = 0
    state.query = null
    state.selected = payload
    state.selected.unread = 0
    let index = state.rooms.findIndex((room) => room.id === payload.id)
    if (index > 0) {
      state.rooms.splice(index, 1)
      state.rooms.unshift(payload)
    }
  },
  setQuery(state, payload) {
    state.query = payload
  },
  selectQueryUser(state, payload) {
    /* let query = parseInt(state.query)
    var index = payload.findIndex((contact) => contact.user.id === query)
    if (index > -1) {
      state.selected = payload[index]
    }
    */
    state.selected = null
  },
  setMessagesLoading(state, payload) {
    state.messagesLoading = payload
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
  resetMessages(state) {
    state.messages = []
    state.enough = false
    state.page = 0
  },
  resetRooms(state) {
    state.rooms = []
  },
}
export const actions = {
  async resetState({ commit }) {
    commit('resetState')
  },
  async resetMessageBoard({ commit }) {
    commit('resetMessages')
  },
  async resetRoomList({ commit }) {
    commit('resetRooms')
  },
  async getRooms({ dispatch, commit }, page) {
    try {
      const response = await this.$axios.get('/api/messages?page=' + page)
      commit('setLoading', false)
      /* if (response.data.data.data.length < 10) {
        commit('setContactsEnough', true)
      } */
      if (page === 1) {
        commit('selectQueryUser', response.data.data.data)
      }
      commit('setRooms', response.data.data.data)
      return response.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      commit('setLoading', false)
      throw 'Unable to load rooms'
    }
  },
  async getMessages({ state, dispatch, commit }, id) {
    if (!state.enough) {
      commit('setPage', state.page + 1)
      try {
        const response = await this.$axios.get(
          '/api/messages/' + id + '?page=' + state.page
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
      id: unique,
      unique: unique,
      user_id: rootState.auth.user.id,
      room_id: payload.roomId,
      text: payload.text,
      image: null,
      read: false,
      updated_at: new Date(),
      created_at: new Date(),
    }
    commit('setSendingMessages', msg)
    try {
      const response = await this.$axios.post('/api/messages/send', payload)
      commit('insertMessage', { id: unique, message: response.data.data })
      return response.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      throw { error, unique }
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
  async createARoom({ dispatch }, payload) {
    try {
      const response = await this.$axios.post('/api/messages/create', payload)
      dispatch('getRooms', 0)
      return response.data.data
    } catch (error) {
      dispatch('alert/error', error.response, {
        root: true,
      })
      throw error.response
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
  async setRoomsPage({ commit }, payload) {
    commit('setRoomsPage', payload)
  },
  async setRoomsEnough({ commit }, payload) {
    commit('setRoomsEnough', payload)
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
