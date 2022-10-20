<template>
  <div class="flex">
    <div class="relative w-full">
      <div
        class="hidden lg:flex items-center justify-between py-3 px-5 border-b border-gray-200"
      >
        <div class="flex flex-row">
          <vs-avatar
            v-if="
              !room.is_group &&
              messagedUser(room.participants).avatar !== 'noavatar'
            "
            primary
            size="42"
          >
            <img
              :src="`${
                smallAvatar + messagedUser(room.participants).avatar
              }.jpg`"
              alt="Avatar"
            />
            <template v-if="room.unread > 0" #badge>
              <span>{{ room.unread }}</span>
            </template>
          </vs-avatar>
          <vs-avatar v-else primary>
            <i
              v-if="
                !room.is_group &&
                messagedUser(room.participants).avatar === 'noavatar'
              "
              class="bx bx-user"
            ></i>
            <i v-else class="bx bx-network-chart"></i>
          </vs-avatar>
          <div
            class="flex flex-col ml-3"
            :class="!room.is_group ? '' : 'justify-center'"
          >
            <h4 class="truncate lg:w-36">
              {{
                !room.is_group && messagedUser(room.participants)
                  ? messagedUser(room.participants).name
                  : room.name
              }}
            </h4>
            <span v-if="!room.is_group" class="text-gray-400 text-xs">
              {{
                !room.is_group
                  ? '@' + messagedUser(room.participants).username
                  : ''
              }}
            </span>
          </div>
        </div>
      </div>
      <ul
        class="px-5 pt-1 pb-16 lg:pb-24 relative messagebox overflow-auto disable-scrollbars"
      >
        <client-only>
          <InfiniteLoading
            v-if="room"
            spinner="spiral"
            :identifier="room.id"
            direction="top"
            :distance="300"
            @infinite="infiniteHandler"
            ><span slot="no-results"></span><span slot="no-more"></span
          ></InfiniteLoading>
        </client-only>

        <li
          v-for="message in messages"
          :id="`message-${message.id}`"
          :key="message.id"
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
            :class="message.from === loggedInUser.id ? 'ml-auto' : 'mr-auto'"
          >
            <span
              v-if="message.text"
              class="rounded-2xl w-full max-w-sm px-5 py-2"
              :class="
                message.from === loggedInUser.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100'
              "
              >{{ message.text }}</span
            >
          </div>
          <span
            v-if="checkNext(message)"
            class="text-2xs text-gray-400 mt-1 mx-1"
            :class="{ 'ml-auto': message.from === loggedInUser.id }"
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
                {{ capitalize(loggedInUser.name) }}
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
      :room="room"
      :is-open="rightBar"
      :class="rightBar ? 'w-64' : 'w-20'"
    >
      <vs-avatar
        size="42"
        dark
        class="cursor-pointer"
        @click="rightBar = !rightBar"
      >
        <i v-if="!rightBar" class="bx bxs-left-arrow"></i>
        <i v-else class="bx bxs-right-arrow"></i>
      </vs-avatar>
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
      contacts: (state) => state.messages.contacts,
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
  },
  mounted() {
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
    }),
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
      if (this.selected && message.from == this.selected.user.id) {
        this.insertSocketMessage(message).then(() => {
          self.scrollToElement()
        })
      } else {
        this.messageFromAnother(message)
      }
    },
    async send() {
      const self = this
      const { textarea } = this.$refs
      var formData = new FormData()
      formData.append('contact_id', this.checkSender())
      if (this.message) {
        formData.append('text', this.message)
      }
      if (this.image) {
        formData.append('image', this.image)
      }
      this.sendMessage(formData).catch((id) => {
        self.removeMessage(id)
        self.$vs.notification({
          duration: 5000,
          progress: 'auto',
          flat: true,
          color: 'danger',
          icon: `<i class='bx bxs-error' ></i>`,
          position: 'top-right',
          title: 'An error occured!',
          text: 'An error occurred while sending your message. Please try again.',
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
      let file =
        e.clipboardData.items[e.clipboardData.items.length - 1].getAsFile()
      let text = e.clipboardData.getData('text')
      if (file) {
        this.image = file
        this.message = ''
        this.send()
      }
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
  },
}
</script>

<style scoped></style>
