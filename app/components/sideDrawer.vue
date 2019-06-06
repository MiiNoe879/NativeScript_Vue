<template lang="html">
  <RadSideDrawer ref="drawer" drawerLocation="Left" :gesturesEnabled="gesturesEnabled">
    <StackLayout ~drawerContent backgroundColor="#fff">
      <slot name="drawerContent"></slot>
    </StackLayout>
    <Frame ~mainContent>
      <slot name="mainContent" ></slot>
    </Frame>
  </RadSideDrawer>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [sideDrawer],
  methods: {
  }
}
</script>

<style lang="css">
</style>
