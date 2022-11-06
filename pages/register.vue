<template>
  <Register />
</template>

<script>
import Register from '~/components/Auth/Register.vue'
export default {
  auth: 'guest',
  components: {
    Register,
  },
  layout: 'auth',
  head() {
    return {
      title: 'Register',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Register',
        },
      ],
    }
  },
}
</script>
