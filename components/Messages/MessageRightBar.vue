<template>
  <div
    class="flex flex-col space-y-4 border-l border-gray-200 py-4"
    :class="isOpen ? 'px-4 items-left' : 'items-center px-2'"
  >
    <slot></slot>
    <vs-tooltip left>
      <div class="flex flex-row">
        <vs-avatar
          v-if="!room.is_group && messagedUser.avatar !== 'noavatar'"
          primary
          size="42"
        >
          <img :src="`${smallAvatar + messagedUser.avatar}.jpg`" alt="Avatar" />
          <template v-if="room.unread > 0" #badge>
            <span>{{ room.unread }}</span>
          </template>
        </vs-avatar>
        <vs-avatar v-else primary>
          <i
            v-if="!room.is_group && messagedUser.avatar === 'noavatar'"
            class="bx bx-user"
          ></i>
          <i v-else class="bx bx-network-chart"></i>
        </vs-avatar>
        <div
          v-if="isOpen"
          class="flex flex-col ml-3"
          :class="!room.is_group ? '' : 'justify-center'"
        >
          <h4 class="truncate lg:w-36">
            {{ !room.is_group && messagedUser ? messagedUser.name : room.name }}
          </h4>
          <span v-if="!room.is_group" class="text-gray-400 text-xs">
            {{ !room.is_group ? '@' + messagedUser.username : '' }}
          </span>
        </div>
      </div>
      <template #tooltip>
        {{ room.is_group ? room.name : messagedUser.name }}
      </template>
    </vs-tooltip>
    <span
      v-if="isOpen && room.is_group"
      class="text-sm text-gray-400 font-light"
    >
      Participants
    </span>
    <div v-if="room.is_group" class="grid grid-cols-1 gap-2">
      <vs-tooltip
        v-for="usr in room.participants"
        :key="usr.id"
        :bottom="isOpen"
        :left="!isOpen"
      >
        <div class="flex items-center space-x-2">
          <vs-avatar circle success>
            <template #text>
              {{ capitalize(usr.user.name) }}
            </template>
          </vs-avatar>
          <div v-show="isOpen" class="flex flex-col">
            <span class="truncate">{{ usr.user.name }}</span>
            <span class="text-xs">@{{ usr.user.username }}</span>
          </div>
        </div>
        <template #tooltip>
          {{ isOpen ? `About: ${usr.user.bio}` : usr.user.username }}
        </template>
      </vs-tooltip>
    </div>
    <div v-else class="grid grid-cols-1 gap-2">
      <span v-show="isOpen" class="text-sm text-gray-400 font-light">
        About
      </span>
      <span v-show="isOpen">{{ messagedUser.bio }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MessageRightBar',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    room: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      smallAvatar: '',
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    messagedUser() {
      let toUser = null
      this.room.participants.forEach((user) => {
        if (user.user_id !== this.loggedInUser.id) {
          toUser = user.user
        }
      })
      return toUser
    },
  },
  methods: {
    capitalize(text) {
      return text.toUpperCase()
    },
  },
}
</script>

<style scoped></style>
