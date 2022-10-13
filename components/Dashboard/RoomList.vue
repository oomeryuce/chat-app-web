<template>
  <div
    class="
      flex flex-row
      lg:flex-col
      bg-white
      h-24
      w-full
      lg:h-screen lg:border-l lg:border-r
      border-gray-200 border-b
      lg:border-b-0
    "
  >
    <div class="mx-5 mt-5 mb-2 flex flex-row items-center hidden lg:flex">
      <h1 class="mb-1 mr-1">Messages</h1>
      <vs-button size="small" flat>{{ messagesBadge }}</vs-button>
    </div>

    <div class="hidden lg:block">
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

    <div
      class="
        hidden
        lg:flex
        justify-between
        items-center
        lg:mx-5 lg:mt-5
        px-3
        lg:px-0
      "
    >
      <h3 class="flex">Contacts</h3>
      <vs-button size="small" success flat disabled>
        <i class="bx bxs-user-plus text-base"></i>
        <span class="mx-2 text-xs">New</span>
      </vs-button>
    </div>

    <div
      ref="contacts"
      class="
        relative
        flex flex-row
        lg:flex-col lg:divide-y lg:divide-gray-200
        pl-3
        lg:pl-0
        mt-4
        overflow-auto
        disable-scrollbars
      "
      :class="{ 'w-screen lg:h-screen': loading }"
    >
      <div
        v-for="contact in filteredList"
        :key="contact.id"
        class="
          flex
          lg:justify-between
          cursor-pointer
          p-2
          rounded-lg
          hover:bg-purple-50
          lg:rounded-none lg:pl-5 lg:pr-3 lg:py-4
        "
        :class="{ 'bg-gray-100': contact === selected }"
        @click="selected = contact"
      >
        <div class="flex flex-row">
          <vs-avatar v-if="!contact.is_group && messagedUser(contact.participants).avatar !== 'noavatar'" primary size="42">
            <img
              :src="`${smallAvatar + messagedUser(contact.participants).avatar}.jpg`"
              alt="Avatar"
            />
            <template v-if="contact.unread > 0" #badge>
              <span>{{ contact.unread }}</span>
            </template>
          </vs-avatar>
          <vs-avatar primary v-else>
            <i v-if="!contact.is_group && messagedUser(contact.participants).avatar === 'noavatar'" class='bx bx-user'></i>
            <i v-else class='bx bx-network-chart'></i>
          </vs-avatar>
          <div
            v-show="contact === selected || !isMobile"
            class="flex flex-col ml-3"
            :class="!contact.is_group ? '' : 'justify-center'"
          >
            <h4 class="truncate lg:w-36">
              {{ !contact.is_group && messagedUser(contact.participants) ? messagedUser(contact.participants).name : contact.name }}
            </h4>
            <span v-if="!contact.is_group" class="text-gray-400 text-xs">
              {{ !contact.is_group ? '@' + messagedUser(contact.participants).username : '' }}
            </span>
          </div>
        </div>
        <span
          class="
            hidden
            lg:flex
            text-xs text-right text-gray-500
          "
        >{{ $moment(contact.created_at).fromNow(true) }}</span
        >
      </div>

      <client-only>
        <InfiniteScrollingHorizontal
          direction="bottom"
          v-if="filteredList && !enough"
          spinner="spiral"
          :distance="300"
          @infinite="infiniteHandler"
        ><span slot="no-results"></span><span slot="no-more"></span
        ></InfiniteScrollingHorizontal>
      </client-only>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import InfiniteScrollingHorizontal from '../../helpers/horizontalScroll'

export default {
  name: "RoomList",
  components: {
    InfiniteScrollingHorizontal,
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    ...mapState({
      loading: (state) => state.messages.loading,
      query: (state) => state.messages.query,
      contactsPage: (state) => state.messages.contactsPage,
      selectedState: (state) => state.messages.selected,
      messagesBadge: (state) => state.messagesBadge,
      contacts: (state) => state.messages.contacts,
      enough: (state) => state.messages.contactsEnough,
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
        return this.contactsPage
      },
      set(value) {
        this.setContactsPage(value)
      },
    },
    filteredList() {
      return this.contacts.filter((contact) => {
        if (!contact.is_group) {
          return this.messagedUser(contact.participants).username.toLowerCase().includes(this.search.toLowerCase())
        }
        return contact.name ? contact.name.toLowerCase().includes(this.search.toLowerCase()) : null
      })
    },
  },
  data() {
    return {
      search: '',
      smallAvatar: process.env.AVATAR_SMALL,
    }
  },
  mounted() {
    const queryUser = parseInt(this.$route.query.room)
    /*
    if (this.selected && queryUser != this.selected.user.id) {
      const self = this
      let index = this.contacts.findIndex(
        (contact) => contact.user.id === queryUser
      )
      if (index > -1) {
        this.selected = this.contacts[index]
      } else {
        this.getUser(queryUser).then((user) => {
          self.selected = {
            id: +new Date(),
            from: self.loggedInUser.id,
            to: queryUser,
            unread: 0,
            created_at: new Date(),
            updated_at: new Date(),
            user: user,
          }
        })
      }
    } */
  },
  watch: {
    selected(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setMessages([])
      }
      /* if (newVal.user.id !== parseInt(this.$route.query.room)) {
        this.$router.replace(
          `${this.$route.path}?room=${this.selected.user.id}`
        )
      } */
    },
  },
  methods: {
    ...mapActions({
      getContacts: 'messages/getContacts',
      getMessages: 'messages/getMessages',
      setSelected: 'messages/setSelected',
      setMessages: 'messages/setMessages',
      setContactsPage: 'messages/setContactsPage',
      setContactsEnough: 'messages/setContactsEnough',
      getUser: 'messages/getUser',
    }),
    messagedUser(arr) {
      let toUser = null
      arr.forEach(user => {
        if (user.id !== this.loggedInUser.id) {
          toUser = user.user;
        }
      })
      return toUser;
    },
    checkSender(message) {
      if (message.to === this.loggedInUser.id) {
        return message.from
      }
      return message.to
    },
    infiniteHandler($state) {
      const self = this
      if (!this.enough) {
        this.getContacts(this.page).then(function (res) {
          console.log('test')
          if (!self.selected && !self.query) {
            self.selected = self.contacts[0]
          }
          if (!self.selected && self.query && self.page === 1) {
            self
              .getUser(self.query)
              .then((user) => {
                self.selected = {
                  id: +new Date(),
                  from: self.loggedInUser.id,
                  to: parseInt(self.query),
                  unread: 0,
                  created_at: new Date(),
                  updated_at: new Date(),
                  user: user,
                }
              })
              .catch((err) => {
                console.error(err)
                self.$vs.notification({
                  duration: 5000,
                  progress: 'auto',
                  flat: true,
                  color: 'danger',
                  icon: `<i class='bx bxs-error' ></i>`,
                  position: 'top-right',
                  title: 'An error occured!',
                  text: 'An error occurred while load the messages. Please try again.',
                })
              })
          }
          if (res.data.data.length < 10) {
            self.setContactsEnough(true)
            $state.complete()
          } else {
            self.page += 1
            $state.loaded()
          }
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
