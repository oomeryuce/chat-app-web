<template>
  <div class="flex flex-col max-h-screen">
    <div class="flex items-center justify-between text-2xl space-x-1 bg-purple-600 px-2 py-4">
      <vs-avatar circle v-if="loggedInUser.avatar === 'noavatar'">
      <template #text>
        {{ loggedInUser.name }}
      </template>
      </vs-avatar>
      <vs-avatar circle v-else>
        <img :src="loggedInUser.avatar" alt="">
      </vs-avatar>
      <div class="flex items-center text-3xl text-white">
        <i class="bx bx-message-square-dots"></i>
        <span class="font-semibold">Chat App</span>
      </div>
      <vs-button-group>
        <vs-button color="tumblr" relief icon>
          <i class='bx bx-cog' ></i>
        </vs-button>
        <vs-button danger relief icon @click="$auth.logout()">
          <i class='bx bx-power-off'></i>
        </vs-button>
      </vs-button-group>
    </div>
    <RoomList />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import RoomList from "~/components/Dashboard/RoomList";
export default {
  name: "SideBar",
  components: { RoomList },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  data() {
    return {
      selected: "index",
    }
  }
}
</script>

<style scoped>

</style>
