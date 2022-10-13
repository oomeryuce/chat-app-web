<template>
  <div class="grid grid-cols-12 max-h-screen">
    <Nuxt class="col-span-12" />
  </div>
</template>

<script>
export default {
  name: "default",
  async mounted() {
    await this.$vs.setColor('primary', '#7850ff')
    await this.$store.dispatch(`getSettings`)
    const mode = localStorage.getItem('mode')
    if (mode && mode === 'dark') {
      await this.$vs.setTheme('dark')
    } else {
      await this.$vs.setTheme('light')
    }
  },
}
</script>
