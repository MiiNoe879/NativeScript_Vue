<template>
  <GridLayout width="100%" columns="auto, *">
    <Label class="fa burger" text.decode="&#xf0c9; " @tap="openDrawer()" col="0"/>
    <Label class="title" text="Deep English"  col="1"/>
  </GridLayout>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [ sideDrawer ],
}
</script>
<style scoped>
.burger {
  font-size:22;
}
.title {
  font-size:16;
}
</style>
