<template>
  <GridLayout width="100%" columns="auto, *">
    <Label class="fa arrow-left m-t-5" text.decode="&#xf060; " @tap="lastPage()" col="0"/>
    <Label class="title" text="Deep English"  col="1"/>
  </GridLayout>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [ sideDrawer ],
  methods: {
    lastPage() {
      this.$navigateBack()
    }
  }
}
</script>
<style scoped>
.burger {
  font-size:20;
}
.title {
  font-size:16;
}
</style>
