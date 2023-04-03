<template>
  <div
    class="flex flex-col bg-white w-full h-screen border-l border-r border-gray-200 border-b border-b-0"
  >
    <div class="mx-5 mt-5 mb-2 flex flex-row items-center flex">
      <h1 class="mb-1 mr-1">Messages</h1>
      <vs-button size="small" flat>{{ messagesBadge }}</vs-button>
    </div>

    <div>
      <vs-input
        v-model="search"
        color="#7d33ff"
        type="search"
        icon-after
        placeholder="Search"
        class="w-full px-5"
      >
        <template #icon>
          <i class="bx bx-search"></i>
        </template>
      </vs-input>
    </div>

    <div class="hidden lg:flex justify-between items-center p-4">
      <h3 class="flex">Contacts</h3>
      <vs-button size="small" success flat @click="newRoomDialog = true">
        <i class="bx bxs-user-plus text-base"></i>
        <span class="mx-2 text-xs">New</span>
      </vs-button>
    </div>

    <div
      ref="contacts"
      class="relative flex flex-col divide-y divide-gray-200 overflow-auto disable-scrollbars"
      :class="{ 'w-screen h-screen': loading }"
    >
      <div
        v-for="contact in filteredList"
        :key="contact.id"
        class="flex justify-between cursor-pointer rounded-lg hover:bg-purple-50 rounded-none p-4"
        :class="{ 'bg-gray-100': contact === selected }"
        @click="setRoom(contact)"
      >
        <div class="flex flex-row space-x-2">
          <vs-avatar
            v-if="
              !contact.is_group &&
              messagedUser(contact.participants).avatar !== 'noavatar'
            "
            primary
            size="50"
          >
            <img
              :src="`${
                smallAvatar + messagedUser(contact.participants).avatar
              }.jpg`"
              alt="Avatar"
            />
            <template v-if="contact.unread > 0" #badge>
              <span>{{ contact.unread }}</span>
            </template>
          </vs-avatar>
          <vs-avatar v-else primary size="50">
            <i
              v-if="
                !contact.is_group &&
                messagedUser(contact.participants).avatar === 'noavatar'
              "
              class="bx bx-user"
            ></i>
            <i v-else class="bx bx-network-chart"></i>
          </vs-avatar>
          <div
            v-show="contact === selected || !isMobile"
            class="flex flex-col justify-center"
          >
            <h4 class="truncate w-24">
              {{
                !contact.is_group && messagedUser(contact.participants)
                  ? messagedUser(contact.participants).name
                  : contact.name
              }}
            </h4>
            <span
              v-if="contact.last_message"
              class="text-xs text-gray-500 w-24 truncate"
            >
              {{ contact.last_message.text }}
            </span>
          </div>
        </div>
        <div class="flex flex-col justify-center items-end">
          <span
            v-if="
              contact !== selected &&
              contact.last_message.user_id !== loggedInUser.id &&
              !contact.last_message.read
            "
            class="flex h-2 w-2 relative"
          >
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"
            ></span>
          </span>
          <span v-if="!contact.is_group" class="text-gray-500 text-xs">
            {{
              !contact.is_group
                ? '@' + messagedUser(contact.participants).username
                : ''
            }}
          </span>
          <span class="flex text-2xs text-gray-500">{{
            $moment(contact.last_message.created_at).fromNow(true)
          }}</span>
        </div>
      </div>

      <client-only>
        <InfiniteScrollingHorizontal
          v-if="filteredList && !enough"
          direction="bottom"
          spinner="spiral"
          :distance="300"
          @infinite="infiniteHandler"
        >
        </InfiniteScrollingHorizontal>
      </client-only>
    </div>
    <vs-dialog v-model="newRoomDialog" not-close width="45%">
      <template #header>
        <h4 class="not-margin">New Room</h4>
      </template>

      <form class="con-form" @submit.prevent="userSearch">
        <div class="flex flex-col space-y-4">
          <vs-input
            v-model="userSearchKey"
            border
            block
            primary
            type="input"
            icon-after
            label-placeholder="Search User"
          >
            <template #icon>
              <i class="bx bx-search"></i>
            </template>
          </vs-input>
          <vs-button primary block>Search</vs-button>
          <div
            v-if="searchedUsers && searchedUsers.length > 0"
            class="grid grid-cols-3 gap-2"
          >
            <span class="col-span-2 text-sm">Search Results</span>
            <span class="col-span-1 text-xs text-right text-gray-400">
              * Click to add
            </span>
          </div>
          <div
            v-if="searchedUsers"
            class="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto"
          >
            <div
              v-for="user in searchedUsers"
              :key="user.id"
              class="p-2 rounded-xl relative"
              :class="
                isUserSelected(user)
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50 cursor-pointer'
              "
              @click.stop="
                !isUserSelected(user) ? addToSelectedUsers(user) : false
              "
            >
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                  <vs-avatar primary circle>
                    <template #text>
                      {{ capitalize(user.name) }}
                    </template>
                  </vs-avatar>
                  <div class="flex flex-col w-min">
                    <h4 class="truncate">
                      {{ user.name }}
                    </h4>
                    <span class="text-gray-400 text-xs">
                      {{ '@' + user.username }}
                    </span>
                  </div>
                </div>
                <span class="truncate text-xs text-gray-400">
                  {{
                    user.bio && user.bio !== '0'
                      ? `About: ${user.bio}`
                      : 'About: Not filled yet'
                  }}
                </span>
              </div>
              <div
                v-if="isUserSelected(user)"
                class="absolute top-2 right-2 text-green-600 text-2xl"
              >
                <i class="bx bxs-check-circle"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-4 mt-6">
          <div v-if="selectedUsers.length > 0" class="grid grid-cols-3 gap-2">
            <span class="col-span-2 text-sm">Creating Room With</span>
            <span class="col-span-1 text-xs text-right text-gray-400">
              * Click to remove
            </span>
          </div>
          <div v-if="groupNameShow" class="py-2">
            <vs-input
              v-model="groupName"
              border
              block
              :state="
                createRoomError && (groupName === '' || groupName.length < 3)
                  ? 'danger'
                  : ''
              "
              type="input"
              icon-after
              label-placeholder="Group Name"
            >
              <template #icon>
                <i class="bx bx-network-chart"></i>
              </template>
              <template #message-danger>
                Required
                <span v-if="groupName === '' || groupName.length < 3">
                  | Name must be at least 3 characters
                </span>
              </template>
            </vs-input>
          </div>
          <div
            v-if="selectedUsers.length > 0"
            class="grid grid-cols-3 gap-2 p-2 rounded-xl max-h-52 overflow-y-auto"
          >
            <div
              v-for="(user, index) in selectedUsers"
              :key="user.id"
              class="hover:bg-red-50 bg-gray-100 rounded-xl cursor-pointer p-2 relative"
              @click.stop="deleteFromSelectedUsers(index)"
            >
              <div class="flex flex-row">
                <vs-avatar primary circle>
                  <template #text>
                    {{ capitalize(user.name) }}
                  </template>
                </vs-avatar>
                <div class="flex flex-col ml-3">
                  <h4 class="truncate lg:w-36">
                    {{ user.name }}
                  </h4>
                  <span class="text-gray-400 text-xs">
                    {{ '@' + user.username }}
                  </span>
                </div>
              </div>
              <div
                v-if="isUserSelected(user)"
                class="absolute top-2 right-2 text-red-600 text-2xl"
              >
                <i class="bx bxs-x-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end">
          <vs-button
            success
            :disabled="selectedUsers.length === 0"
            @click="createRoom"
          >
            Create Room
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import InfiniteScrollingHorizontal from '../../helpers/horizontalScroll'

export default {
  name: 'RoomList',
  components: {
    InfiniteScrollingHorizontal,
  },
  data() {
    return {
      newRoomDialog: false,
      userSearchKey: '',
      search: '',
      selectedUsers: [],
      groupName: '',
      groupNameShow: false,
      createRoomError: false,
      smallAvatar: process.env.AVATAR_SMALL,
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    ...mapState({
      loading: (state) => state.messages.loading,
      query: (state) => state.messages.query,
      roomsPage: (state) => state.messages.roomsPage,
      selectedState: (state) => state.messages.selected,
      messagesBadge: (state) => state.messagesBadge,
      rooms: (state) => state.messages.rooms,
      enough: (state) => state.messages.roomsEnough,
      searchedUsers: (state) => state.searchedUsers,
    }),
    isMobile() {
      return window.innerWidth < 770
    },
    selected: {
      get() {
        return this.selectedState
      },
      set(value) {
        this.setSelected(value)
      },
    },
    page: {
      get() {
        return this.roomsPage
      },
      set(value) {
        this.setRoomsPage(value)
      },
    },
    filteredList() {
      return this.rooms.filter((contact) => {
        if (!contact.is_group) {
          return this.messagedUser(contact.participants)
            .username.toLowerCase()
            .includes(this.search.toLowerCase())
        }
        return contact.name
          ? contact.name.toLowerCase().includes(this.search.toLowerCase())
          : null
      })
    },
  },
  watch: {
    selected(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setMessages([])
      }
    },
    async newRoomDialog(newVal) {
      if (!newVal) {
        this.userSearchKey = ''
        this.groupNameShow = false
        this.groupName = ''
        this.selectedUsers = []
        await this.resetUserSearch()
      }
    },
    selectedUsers(newVal) {
      this.groupNameShow = newVal.length > 1
      if (newVal.length === 0) {
        this.groupName = ''
      }
    },
  },
  methods: {
    ...mapActions({
      getRooms: 'messages/getRooms',
      getMessages: 'messages/getMessages',
      setSelected: 'messages/setSelected',
      setMessages: 'messages/setMessages',
      setRoomsPage: 'messages/setRoomsPage',
      setRoomsEnough: 'messages/setRoomsEnough',
      searchUser: 'searchUser',
      resetUserSearch: 'resetUserSearch',
      createARoom: 'messages/createARoom',
      resetRooms: 'messages/resetRoomList',
    }),
    async userSearch(event) {
      event.preventDefault()
      await this.searchUser(this.userSearchKey)
    },
    messagedUser(arr) {
      let toUser = null
      arr.forEach((user) => {
        if (user.user_id !== this.loggedInUser.id) {
          toUser = user.user
        }
      })
      return toUser
    },
    capitalize(text) {
      return text.toUpperCase()
    },
    checkSender(message) {
      if (message.to === this.loggedInUser.id) {
        return message.from
      }
      return message.to
    },
    isUserSelected(user) {
      return this.selectedUsers.some((elem) => elem.id === user.id)
    },
    addToSelectedUsers(user) {
      if (!this.isUserSelected(user)) {
        this.selectedUsers.push(user)
      }
    },
    deleteFromSelectedUsers(index) {
      this.selectedUsers.splice(index, 1)
    },
    async setRoom(data) {
      this.selected = data
      await this.$emit('setMessage', data)
    },
    infiniteHandler($state) {
      const self = this
      if (!this.enough) {
        this.getRooms(this.page).then(function (res) {
          if (res.data.data.length < 10) {
            self.setRoomsEnough(true)
            $state.complete()
          } else {
            self.page += 1
            $state.loaded()
          }
        })
      }
    },
    async createRoom() {
      if (this.selectedUsers.length === 0) {
        this.createRoomError = true
        return false
      } else if (
        this.selectedUsers.length > 1 &&
        (this.groupName === '' || this.groupName.length < 3)
      ) {
        this.createRoomError = true
        return false
      }
      this.createRoomError = false
      let payload = {
        to: null,
        isGroup: false,
      }
      if (this.selectedUsers.length === 1) {
        payload.to = this.selectedUsers[0].id
      } else {
        payload.to = this.selectedUsers
        payload.isGroup = true
        payload.name = this.groupName
      }
      await this.createARoom(payload)
        .then(async (response) => {
          await this.resetRooms()
          await this.setRoom(response)
          this.newRoomDialog = false
          await this.infiniteHandler()
        })
        .catch((err) => {
          let errors = ''
          if (err.errorMessage && err.errorMessage.length > 0) {
            err.errorMessage.forEach((error, index) => {
              if (index !== 0 && index !== err.errorMessage.length) {
                errors += '<br>'
              }
              errors += error
            })
          }
          this.$vs.notification({
            flat: true,
            color: 'danger',
            icon: `<i class='bx bx-error' ></i>`,
            position: 'bottom-center',
            title: 'Unable to create room',
            text: errors,
          })
        })
    },
  },
}
</script>

<style scoped></style>
