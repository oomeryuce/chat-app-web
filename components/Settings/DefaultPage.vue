<template>
  <div class="grid grid-cols-12">
    <SideBar
      page="settings"
      class="col-span-3"
      @changeSettingsTab="changeTab"
    />
    <div class="col-span-9 h-screen">
      <SettingsPlaceholder v-if="tab === ''" />
      <ProfileSettings v-if="tab === 'profile'" />
      <PasswordChange v-if="tab === 'password'" />
    </div>
  </div>
</template>

<script>
import SideBar from '~/components/SideBar'
import SettingsPlaceholder from '~/components/Settings/SettingsPlaceholder'
import ProfileSettings from '~/components/Settings/ProfileSettings'
import PasswordChange from '@/components/Settings/PasswordChange'

export default {
  name: 'DefaultPage',
  components: { SideBar, SettingsPlaceholder, ProfileSettings, PasswordChange },
  data() {
    return {
      tab: '',
    }
  },
  methods: {
    changeTab(data) {
      this.tab = data
    },
  },
}
</script>

<style scoped></style>
