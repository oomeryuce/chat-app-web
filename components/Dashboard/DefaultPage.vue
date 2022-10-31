<template>
  <div class="grid grid-cols-12">
    <SideBar
      page="dashboard"
      class="col-span-3"
      @selectMessage="changeSelected"
    />
    <Placeholder v-if="selected === 'placeholder'" class="col-span-9" />
    <MessageBoard v-else-if="selected" :room="selected" class="col-span-9" />
  </div>
</template>

<script>
import SideBar from '~/components/SideBar'
import Placeholder from '@/components/Dashboard/Placeholder'
import MessageBoard from '@/components/Messages/MessageBoard'
export default {
  name: 'DefaultPage',
  components: { SideBar, Placeholder, MessageBoard },
  data() {
    return {
      selected: 'placeholder',
    }
  },
  methods: {
    changeSelected(select) {
      this.selected = select
    },
  },
}
</script>

<style scoped></style>
