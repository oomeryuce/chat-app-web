<template>
  <div class="grid grid-cols-12 max-h-screen">
    <Nuxt class="col-span-12" />
  </div>
</template>

<script>
import SideBar from '@/components/SideBar'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Default',
  comments: { SideBar },
  data: () => ({
    active: 'home',
    expand: false,
  }),
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  async mounted() {
    await this.$vs.setColor('primary', '#7850ff')
    await this.$store.dispatch(`getSettings`)
    const mode = localStorage.getItem('mode')
    if (mode && mode === 'dark') {
      await this.$vs.setTheme('dark')
    } else {
      await this.$vs.setTheme('light')
    }
    // await this.getBadges()
  },
  methods: {
    ...mapActions({
      getBadges: 'getBadges',
    }),
  },
}
</script>
