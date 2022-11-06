<template>
  <div class="h-screen flex flex-col space-y-4 justify-center items-center">
    <lottie
      :options="lottieOptions"
      class="p-20"
      @animCreated="handleAnimation"
    />
  </div>
</template>

<script>
import * as animationData from '~/assets/lottie/login.json'
import lottie from 'vue-lottie'

export default {
  name: 'SettingsPlaceholder',
  components: { lottie },
  data() {
    return {
      anim: null,
      lottieOptions: { animationData: animationData.default },
    }
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim
    },
  },
}
</script>

<style scoped></style>
