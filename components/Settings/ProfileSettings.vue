<template>
  <div class="grid grid-cols-1">
    <div class="flex items-center space-x-2 text-xl shadow py-4 px-4">
      <vs-avatar primary>
        <i class="bx bx-user-plus"></i>
      </vs-avatar>
      <div class="flex items-center text-2xl">
        <span class="font-light"> Profile Settings </span>
      </div>
    </div>
    <div class="grid grid-cols-6 lg:grid-cols-5 gap-4">
      <div class="p-10 lg:p-20 my-auto col-span-6 md:col-span-3 lg:col-span-2">
        <form class="space-y-5" @submit.prevent="userUpdate">
          <vs-input v-model="fullname" color="#7850ff" placeholder="Full Name">
            <template #icon>
              <i class="bx bxs-face"></i>
            </template>
          </vs-input>
          <vs-input v-model="username" color="#7850ff" placeholder="User Name">
            <template #icon>
              <i class="bx bx-at"></i>
            </template>
          </vs-input>
          <textarea
            v-model="bio"
            class="w-full vs-input vs-input-content rounded-xl"
            placeholder="Bio"
            rows="4"
          ></textarea>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import * as animationData from 'assets/lottie/register.json'
import lottie from 'vue-lottie'

export default {
  name: 'ProfileSettings',
  components: { lottie },
  data: () => ({
    fullname: '',
    username: '',
    bio: '',
    anim: null,
    lottieOptions: { animationData: animationData.default },
  }),
  computed: {
    ...mapGetters(['loggedInUser']),
    ...mapState({
      userLoading: (state) => state.user.userLoading,
    }),
  },
  mounted() {
    this.fullname = this.loggedInUser.name
    this.username = this.loggedInUser.username
    this.bio = this.loggedInUser.bio
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear',
      updateUser: 'user/updateUser',
    }),
    handleAnimation: function (anim) {
      this.anim = anim
    },
    async userUpdate() {
      const self = this
      const form = {
        username: this.username,
        bio: this.bio,
        name: this.fullname,
      }

      this.updateUser(form)
        .then(function () {
          self.$vs.notification({
            flat: true,
            color: 'success',
            icon: `<i class='bx bx-message-square-check' ></i>`,
            position: 'bottom-center',
            title: 'Update',
            text: 'User updated successfully.',
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
