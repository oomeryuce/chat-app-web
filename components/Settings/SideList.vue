<template>
  <div
    class="flex flex-row lg:flex-col bg-white h-24 w-full lg:h-screen lg:border-l lg:border-r border-gray-200 border-b lg:border-b-0 space-y-4"
  >
    <div class="flex flex-col space-y-2 hidden lg:flex px-5 py-3 bg-gray-50">
      <div class="flex items-center space-x-2">
        <vs-avatar size="70" circle primary>
          <template #text>
            {{ capitalize(loggedInUser.name) }}
          </template>
        </vs-avatar>
        <div class="flex flex-col">
          <span class="text-lg font-semibold">{{ loggedInUser.name }}</span>
          <span class="text-xs">@{{ loggedInUser.username }}</span>
        </div>
      </div>
      <span class="text-sm">{{ loggedInUser.bio }}</span>
    </div>
    <div class="px-5 flex flex-row items-center hidden lg:flex">
      <h1 class="text-xl">Settings</h1>
    </div>
    <div
      ref="settings"
      class="relative flex flex-row lg:flex-col lg:divide-y lg:divide-gray-200 pl-3 lg:pl-0 mt-4 overflow-auto disable-scrollbars"
    >
      <div
        v-for="setting in settingsList"
        :key="setting.slug"
        class="flex lg:justify-between cursor-pointer p-2 rounded-lg hover:bg-purple-50 lg:rounded-none lg:pl-5 lg:pr-3 lg:py-4"
        :class="{ 'bg-gray-100': setting === selected }"
        @click="changeTab(setting)"
      >
        <div class="flex flex-row">
          <vs-avatar primary>
            <i class="bx" :class="'bx-' + setting.icon"></i>
          </vs-avatar>
          <div class="flex flex-col justify-center ml-3">
            <h4 class="truncate lg:w-36">
              {{ setting.name }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SideList',
  data() {
    return {
      selected: {},
      settingsList: [
        {
          name: 'Profile Settings',
          slug: 'profile',
          icon: 'user-plus',
        },
        {
          name: 'Change Password',
          slug: 'password',
          icon: 'key',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    changeTab(data) {
      this.selected = data
      this.$emit('setTab', data.slug)
    },
    capitalize(text) {
      return text.toUpperCase()
    },
  },
}
</script>

<style scoped></style>
