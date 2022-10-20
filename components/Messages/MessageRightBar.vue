<template>
  <div
    class="flex flex-col space-y-4 shadow py-4"
    :class="isOpen ? 'px-4 items-left' : 'items-center px-2'"
  >
    <slot></slot>
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
          :src="`${smallAvatar + messagedUser(room.participants).avatar}.jpg`"
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
        v-if="isOpen"
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
            !room.is_group ? '@' + messagedUser(room.participants).username : ''
          }}
        </span>
      </div>
    </div>
    {{ room.name }}
  </div>
</template>

<script>
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
  methods: {
    messagedUser(arr) {
      let toUser = null
      arr.forEach((user) => {
        if (user.id !== this.loggedInUser.id) {
          toUser = user.user
        }
      })
      return toUser
    },
  },
}
</script>

<style scoped></style>
