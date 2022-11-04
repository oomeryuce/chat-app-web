<template>
  <div class="flex" :class="rightBar ? '' : 'no-sidebar'">
    <div id="content" class="relative w-full bg-gray-50">
      <ul
        class="px-5 pt-1 pb-16 lg:pb-24 max-h-screen relative messagebox overflow-auto disable-scrollbars"
      >
        <client-only>
          <InfiniteLoading
            v-if="room"
            spinner="spiral"
            :identifier="room.id"
            direction="top"
            :distance="300"
            @infinite="infiniteHandler"
          >
            <div slot="no-results">
              <span class="text-xs text-purple-600">
                No more messages found :(
              </span>
            </div>
          </InfiniteLoading>
        </client-only>

        <li
          v-for="(message, index) in messages"
          :id="`message-${message.id}`"
          :key="index"
          class="flex flex-col my-1"
          :disabled="message.unique"
        >
          <div v-if="checkDate(message)" class="text-2xs my-3 strike">
            <span class="text-gray-400">{{
              $moment(message.created_at).format('ll')
            }}</span>
          </div>
          <div
            class="flex text-sm"
            :class="message.user_id === loggedInUser.id ? 'ml-auto' : 'mr-auto'"
          >
            <div
              class="flex flex-col space-y-1 rounded-2xl w-full max-w-sm px-3 py-2"
              :class="
                message.user_id === loggedInUser.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100'
              "
            >
              <span
                v-if="room.is_group && message.user_id !== loggedInUser.id"
                class="text-blue-400 font-semibold"
              >
                {{ message.user.name }}
              </span>
              <span v-if="message.text">
                {{ message.text }}
              </span>
            </div>
          </div>
          <span
            v-if="checkNext(message)"
            class="text-2xs text-gray-400 mt-1 mx-1"
            :class="{ 'ml-auto': message.user_id === loggedInUser.id }"
            >{{ $moment(message.created_at).format('hh:mm A') }}</span
          >
        </li>
      </ul>
      <div
        class="absolute bottom-0 left-0 lg:p-5 w-full bg-gradient-to-t from-white"
      >
        <div
          class="flex justify-between items-center py-2 px-3 text-gray-400 border border-white text-sm bg-gray-50 lg:rounded-2xl lg:shadow-2xl"
        >
          <div class="flex flex-row w-full items-center">
            <vs-avatar size="28" primary>
              <template #text>
                {{ loggedInUser ? capitalize(loggedInUser.name) : '' }}
              </template>
            </vs-avatar>
            <textarea
              ref="textarea"
              v-model="message"
              class="w-full h-full ml-3 px-3 py-2 text-base lg:text-sm text-gray-700 rounded-lg focus:outline-none resize-none"
              rows="1"
              placeholder="Type something..."
              :disabled="sendLoading"
              @focus="resize"
              @keyup="resize"
              @keydown.enter.exact.prevent="send"
              @paste.prevent="onPaste"
            ></textarea>
          </div>

          <div class="flex flex-row space-x-2">
            <vs-button
              icon
              floating
              :loading="sendLoading"
              :disabled="!message"
              @click="send"
              ><i class="bx bxs-paper-plane"></i
            ></vs-button>
          </div>
        </div>
      </div>
    </div>
    <MessageRightBar
      v-if="room"
      id="sidebar"
      :room="room"
      :is-open="rightBar"
      :class="rightBar ? 'expanded' : ''"
    >
      <vs-button
        flat
        size="large"
        class="w-min"
        :class="rightBar ? '-ml-1' : ''"
        @click="rightBar = !rightBar"
      >
        <i v-if="!rightBar" class="bx bxs-left-arrow"></i>
        <i v-else class="bx bxs-right-arrow"></i>
      </vs-button>
    </MessageRightBar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import MessageRightBar from '@/components/Messages/MessageRightBar'

export default {
  name: 'MessageBoard',
  components: {
    InfiniteLoading,
    MessageRightBar,
  },
  props: {
    room: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      message: '',
      image: null,
      index: null,
      showedImage: [],
      rightBar: false,
      smallAvatar: process.env.AVATAR_SMALL,
      smallMessageImage: process.env.MESSAGES_SMALL,
      largeMessageImage: process.env.MESSAGES_LARGE,
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    ...mapState({
      selected: (state) => state.messages.selected,
      messagesState: (state) => state.messages.messages,
      loading: (state) => state.messages.messagesLoading,
      sendLoading: (state) => state.messages.sendLoading,
      socket: (state) => state.messages.socket,
    }),
    messages: {
      get() {
        return this.messagesState
      },
      set(value) {
        this.setMessages(value)
      },
    },
  },
  watch: {
    selected(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.textarea.focus()
      }
    },
    async room(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$echo.leave(`room.${oldVal.id}`)
        await this.resetMessageBoard()
      }
      await this.mountSocket(newVal)
    },
  },
  async mounted() {
    await this.mountSocket(this.room)
    /*
    if (!this.socket) {
      this.setSocket(true)
      this.$echo
        .private(`messages.${this.loggedInUser.id}`)
        .listen('NewMessage', (e) => {
          this.hanleIncoming(e.message)
        })
    }
    */
  },
  methods: {
    ...mapActions({
      getMessages: 'messages/getMessages',
      setMessages: 'messages/setMessages',
      sendMessage: 'messages/sendMessage',
      removeMessage: 'messages/removeMessage',
      insertSocketMessage: 'messages/insertSocketMessage',
      messageFromAnother: 'messages/messageFromAnother',
      toggleLoading: 'messages/toggleMessagesLoading',
      setSocket: 'messages/setSocket',
      resetMessageBoard: 'messages/resetMessageBoard',
    }),
    mountSocket(room) {
      this.$echo.private(`room-events-${room.id}`).listen('RoomEvents', (e) => {
        if (e.message.user.id !== this.loggedInUser.id) {
          this.hanleIncoming(e.message)
        }
      })
    },
    messagedUser(arr) {
      let toUser = null
      arr.forEach((user) => {
        if (user.id !== this.loggedInUser.id) {
          toUser = user.user
        }
      })
      return toUser
    },
    infiniteHandler($state) {
      this.getMessages(this.room.id).then((data) => {
        if (data.length > 9) {
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    async hanleIncoming(message) {
      const self = this
      if (this.selected && message.room_id === this.room.id) {
        this.insertSocketMessage(message).then(() => {
          self.scrollToElement()
        })
      } else {
        await this.messageFromAnother(message)
      }
    },
    async send() {
      const self = this
      const { textarea } = this.$refs
      let formData = {
        roomId: this.room.id,
        text: this.message,
      }
      /*
      if (this.image) {
        formData.append('image', this.image)
      } */
      this.sendMessage(formData).catch((error) => {
        self.removeMessage(error.unique)
        let errors = ''
        const err = error.error
        if (err.errorMessage && err.errorMessage.length > 0) {
          err.errorMessage.forEach((error, index) => {
            if (index !== 0 && index !== err.errorMessage.length) {
              errors += '<br>'
            }
            errors += error
          })
        }
        self.$vs.notification({
          duration: 5000,
          progress: 'auto',
          flat: true,
          color: 'danger',
          icon: `<i class='bx bxs-error' ></i>`,
          position: 'top-right',
          title: 'Error!',
          text: errors,
        })
      })
      setTimeout(() => {
        self.image = null
        self.message = ''
        textarea.style.height = '35px'
        self.scrollToElement()
        setTimeout(() => {
          self.$refs.textarea.focus()
        }, 500)
      }, 100)
    },
    scrollToElement() {
      const last = this.messages[this.messages.length - 1].id
      const el = document.getElementById(`message-${last}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    checkNext(message) {
      const index = this.messages.findIndex((item) => item === message)
      if (
        index > -1 &&
        this.messages[index] !== this.messages[this.messages.length - 1]
      ) {
        if (this.messages[index + 1].from !== this.messages[index].from) {
          return true
        } else if (
          index > 0 &&
          !this.$moment(this.messages[index - 1].created_at).isSame(
            this.messages[index].created_at,
            'day'
          )
        ) {
          return true
        } else if (
          !this.$moment(this.messages[index + 1].created_at).isSame(
            this.messages[index].created_at,
            'day'
          )
        ) {
          return true
        }
      } else {
        return true
      }
      return false
    },
    onPaste(e) {
      /*
      let file =
        e.clipboardData.items[e.clipboardData.items.length - 1].getAsFile() */
      let text = e.clipboardData.getData('text')
      /* if (file) {
        this.image = file
        this.message = ''
        this.send()
      } */
      if (text) {
        this.message = text
      }
    },
    checkDate(message) {
      const index = this.messages.findIndex((item) => item === message)
      if (index > -1) {
        if (
          index > 0 &&
          !this.$moment(this.messages[index - 1].created_at).isSame(
            this.messages[index].created_at,
            'day'
          )
        ) {
          return true
        }
      }
      return false
    },
    resize() {
      const { textarea } = this.$refs
      if (this.message) {
        if (textarea.scrollHeight < 40) {
          textarea.style.height = '35px'
        } else if (textarea.scrollHeight > 40 && textarea.scrollHeight < 80) {
          textarea.style.height = textarea.scrollHeight + 'px'
        }
      } else {
        textarea.style.height = '35px'
      }
    },
    capitalize(text) {
      return text.toUpperCase()
    },
    expandContract() {
      const el = document.getElementById('expand-contract')
      el.classList.toggle('expanded')
      el.classList.toggle('collapsed')
    },
  },
}
</script>

<style scoped>
#sidebar {
  transition: all 0.5s;
  width: 299px;
}

#content {
  transition: all 0.5s;
  width: calc(100% - 299px);
}

.no-sidebar #sidebar {
  margin-right: -219px;
  width: 80px;
}

.no-sidebar #content {
  width: calc(100% - 80px);
}
</style>
