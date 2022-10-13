<template>
  <div class="grid grid-cols-12">
    <SideBar class="col-span-3" />
    <slot class="col-span-9"></slot>
  </div>
</template>

<script>
import SideBar from "~/components/SideBar";
export default {
  name: "DefaultPage",
  components: { SideBar },
}
</script>

<style scoped>

</style>
