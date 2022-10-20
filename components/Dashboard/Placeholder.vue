<template>
  <div
    class="h-screen w-full flex flex-col space-y-4 justify-center items-center"
  >
    <div class="flex flex-col py-5 items-center">
      <div class="flex items-center text-6xl text-purple-600">
        <i class="bx bx-message-square-dots"></i>
        <span class="font-semibold">Chat App</span>
      </div>
      <span class="text-gray-600">Let's Chat!</span>
    </div>
    <lottie :options="lottieOptions" @animCreated="handleAnimation" />
  </div>
</template>

<script>
import * as animationData from '~/assets/lottie/message.json'
import lottie from 'vue-lottie'

export default {
  name: 'Placeholder',
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
