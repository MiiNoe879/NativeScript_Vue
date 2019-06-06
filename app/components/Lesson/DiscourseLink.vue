<template>
  <StackLayout class="resource-item">
    <Label :text="data.name" textWrap="true" @tap="openDiscourseLink"/>
  </StackLayout>
</template>

<script>
var utilsModule = require("tns-core-modules/utils/utils");
export default {
  data() {
    return {

    }
  },
  props: ['data'],
  computed: {

  },
  methods: {
    openDiscourseLink () {
      utilsModule.openUrl(this.data.link)
    }
  }
}
</script>
<style scoped>
.resource-item {
  font-size:16;
  font-weight:600;
  padding:8 0;
}
</style>
