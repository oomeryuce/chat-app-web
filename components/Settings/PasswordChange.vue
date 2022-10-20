<template>
  <div class="grid grid-cols-1">
    <div class="flex items-center space-x-2 text-xl shadow py-4 px-4">
      <vs-avatar primary>
        <i class="bx bx-key"></i>
      </vs-avatar>
      <div class="flex items-center text-2xl">
        <span class="font-light"> Change Password </span>
      </div>
    </div>
    <div class="grid grid-cols-6 lg:grid-cols-5 gap-4">
      <div class="p-10 lg:p-20 my-auto col-span-6 md:col-span-3 lg:col-span-2">
        <form class="space-y-5" @submit.prevent="userUpdate">
          <vs-input
            v-model="oldPassword"
            type="password"
            color="#7850ff"
            placeholder="Old Password"
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
          <vs-input
            v-model="password"
            type="password"
            color="#7850ff"
            placeholder="New Password"
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
          <vs-input
            v-model="passwordConfirm"
            type="password"
            color="#7850ff"
            placeholder="New Password Confirm"
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
          <vs-button
            block
            size="large"
            animation-type="vertical"
            type="submit"
            :loading="userLoading"
            shadow
            border
            @keyup.enter="userUpdate"
          >
            <b>Update</b>
            <template #animate>
              <i class="bx bxs-game"></i>
            </template>
          </vs-button>
        </form>
      </div>
      <div class="col-span-3 hidden md:flex">
        <lottie :options="lottieOptions" @animCreated="handleAnimation" />
      </div>
    </div>
  </div>
</template>

<script>
import lottie from 'vue-lottie'
import * as animationData from 'assets/lottie/register.json'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PasswordChange',
  components: { lottie },
  data: () => ({
    oldPassword: '',
    password: '',
    passwordConfirm: '',
    hasVisiblePassword: false,
    anim: null,
    lottieOptions: { animationData: animationData.default },
  }),
  computed: {
    ...mapState({
      userLoading: (state) => state.user.userLoading,
    }),
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear',
      updatePassword: 'user/updatePassword',
    }),
    handleAnimation: function (anim) {
      this.anim = anim
    },
    async userUpdate() {
      const self = this
      const form = {
        old_password: this.oldPassword,
        password: this.password,
        password_confirmation: this.passwordConfirm,
      }

      this.updatePassword(form)
        .then(function () {
          self.$vs.notification({
            flat: true,
            color: 'success',
            icon: `<i class='bx bx-message-square-check' ></i>`,
            position: 'bottom-center',
            title: 'Update',
            text: 'Password updated successfully. Please login again!',
          })
        })
        .catch(function (err) {
          let errors = ''
          if (err.errorMessage && err.errorMessage.length > 0) {
            err.errorMessage.forEach((error, index) => {
              if (index !== 0 && index !== err.errorMessage.length) {
                errors += '<br>'
              }
              errors += error
            })
          }
          self.$vs.notification({
            flat: true,
            color: 'danger',
            icon: `<i class='bx bx-error' ></i>`,
            position: 'bottom-center',
            title: 'Unable to update',
            text: errors,
          })
        })
    },
  },
}
</script>

<style scoped></style>
