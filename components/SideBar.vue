<template>
  <div class="flex flex-col h-screen">
    <div
      class="flex items-center justify-between text-2xl bg-purple-600 py-4 px-4"
    >
      <vs-button v-if="page === 'settings'" icon color="tumblr" to="/">
        <i class="bx bxs-left-arrow"></i>
      </vs-button>
      <vs-avatar
        v-if="page !== 'settings' && loggedInUser.avatar === 'noavatar'"
        circle
      >
        <template #text>
          {{ capitalize(loggedInUser.name) }}
        </template>
      </vs-avatar>
      <vs-avatar
        v-else-if="page !== 'settings' && loggedInUser.avatar !== 'noavatar'"
        circle
      >
        <img :src="loggedInUser.avatar" alt="" />
      </vs-avatar>
      <n-link to="/" class="flex items-center text-3xl text-white">
        <i class="bx bx-message-square-dots"></i>
        <span class="font-semibold">Chat App</span>
      </n-link>
      <vs-button-group>
        <vs-button href="/settings" color="tumblr" relief icon>
          <i class="bx bx-cog"></i>
        </vs-button>
        <vs-button danger relief icon @click="logOut">
          <i class="bx bx-power-off"></i>
        </vs-button>
      </vs-button-group>
    </div>
    <RoomList v-if="page === 'dashboard'" @setMessage="messageTab" />
    <SettingsList v-else-if="page === 'settings'" @setTab="settingTab" />
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import RoomList from '~/components/Dashboard/RoomList'
import SettingsList from '~/components/Settings/SideList'
export default {
  name: 'SideBar',
  components: { RoomList, SettingsList },
  props: {
    page: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    ...mapActions({
      resetMessages: 'messages/resetState',
      resetState: 'resetState',
    }),
    settingTab(data) {
      this.$emit('changeSettingsTab', data)
    },
    messageTab(data) {
      this.$emit('selectMessage', data)
    },
    capitalize(text) {
      return text.toUpperCase()
    },
    async logOut() {
      await this.resetMessages()
      await this.resetState()
      await this.$auth.logout()
    },
  },
}
</script>

<style scoped></style>
