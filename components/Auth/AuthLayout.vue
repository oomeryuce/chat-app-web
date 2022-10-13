<template>
  <div class="container m-auto">
    <div class="grid grid-cols-6 lg:grid-cols-5 gap-4 min-h-screen">
      <div class="p-10 lg:p-20 my-auto col-span-6 md:col-span-3 lg:col-span-2">
        <div class="flex items-center justify-start text-4xl font-semibold text-purple-500">
          <i class="bx bx-message-square-dots"></i>
          <span>Chat App</span>
        </div>
        <div class="flex justify-between items-center">
          <n-link :to="'/register'">
            <vs-button shadow border animation-type="scale">
              <b class="mx-5"> Sign Up </b>

              <template #animate>
                <i class="bx bxs-check-shield"></i>
              </template>
            </vs-button>
          </n-link>
          <!--
          <vs-switch v-model="isDark">
            <template #circle>
              <i v-if="!isDark" class="bx bxs-moon"></i>
              <i v-else class="bx bxs-sun"></i>
            </template>
          </vs-switch>
          -->
        </div>
        <form @submit.prevent="login">
          <vs-input
            v-model="username"
            :color="isDark ? '#6e00ff' : '#7850ff'"
            placeholder="Username"
            class="my-5"
            block
          >
            <template #icon>
              <i class="bx bx-at"></i>
            </template>
          </vs-input>
          <vs-input
            v-model="password"
            type="password"
            :color="isDark ? '#6e00ff' : '#7850ff'"
            placeholder="Password"
            block
            :visible-password="hasVisiblePassword"
            icon-after
            @click-icon="hasVisiblePassword = !hasVisiblePassword"
          >
            <template #icon>
              <i v-if="!hasVisiblePassword" class="bx bx-show-alt"></i>
              <i v-else class="bx bx-hide"></i>
            </template>
          </vs-input>
          <div
            class="
              flex
              justify-end
              items-center
              text-sm
              my-3
              text-gray-600
              dark:text-gray-400
            "
          >
            <n-link :to="'/forgot-password'">Forgot Password?</n-link>
          </div>
          <vs-button
            block
            type="submit"
            size="large"
            animation-type="vertical"
            :loading="loading"
            shadow border
            @keyup.enter="login"
          >
            <b>Sign In</b>
            <template #animate>
              <i class='bx bxs-door-open'></i>
            </template>
          </vs-button>
        </form>
        <div class="flex justify-center text-sm my-5">
          <span class="text-gray-600 dark:text-gray-400">New here?</span>
          <n-link class="ml-3 text-purple-500 font-bold" :to="'/register'">Create a New Account</n-link>
        </div>
        <!-- <div class="my-5 separator">or continue with</div>
        <div class="grid grid-cols-3 gap-2">
          <vs-button shadow size="xl" animation-type="scale">
            <i class="bx bxl-google"></i>
            <template #animate> Google </template>
          </vs-button>
          <vs-button shadow size="xl" animation-type="scale">
            <i class="bx bxl-apple"></i>
            <template #animate> Apple </template>
          </vs-button>
          <vs-button shadow size="xl" animation-type="scale">
            <i class="bx bxl-facebook"></i>
            <template #animate> Facebook </template>
          </vs-button>
        </div> -->
      </div>
      <div class="col-span-3 hidden md:flex">
        <lottie :options="lottieOptions" @animCreated="handleAnimation" />
      </div>
    </div>
  </div>
</template>

<script>
import lottie from 'vue-lottie/src/lottie.vue'
import * as animationData from '~/assets/lottie/login.json'
export default {
  name: "AuthLayout",
  components: { lottie },
  data: () => ({
    username: '',
    password: '',
    remember: false,
    loading: false,
    hasVisiblePassword: false,
    isDark: false,
    anim: null,
    lottieOptions: { animationData: animationData.default },
  }),
  watch: {
    async isDark(val) {
      if (val === true) {
        await localStorage.setItem('mode', 'light')
        await this.$vs.setTheme('light')
        this.$colorMode.preference = 'light'
      } else {
        await localStorage.setItem('mode', 'dark')
        await this.$vs.setTheme('dark')
        this.$colorMode.preference = 'dark'
      }
    },
  },
  mounted() {
    this.isDark = localStorage.getItem('mode') === 'light'
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim
    },
    async login() {
      this.loading = true
      const self = this
      const form = {
        username: this.username,
        password: this.password,
      }
      await this.$auth
        .loginWith('local', { data: form })
        .then(function () {
          self.loading = false
        })
        .catch((err) => {
          self.loading = false
          self.$vs.notification({
            duration: 5000,
            progress: 'auto',
            flat: true,
            color: 'danger',
            icon: `<i class='bx bx-error' ></i>`,
            position: 'top-center',
            title: "An error occured",
            text: err,
          })
        })
    },
  },
}
</script>

<style scoped>

</style>
