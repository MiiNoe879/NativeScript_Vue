<template>
  <StackLayout horizontalAlignment="center" @loaded="fetchData()">
    <Button class="btn btn-primary debluebg" :text="data.label" @tap="downloadMedia" v-if="media"/>
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
  created () {
    //this.fetchData()
  },
  computed: {
    media () {
      let media = this.$store.state.media
      var result = media.filter(obj => {
        return obj.id === this.data.asset_id
      })
      return result[0]
    },
  },
  methods: {
    async fetchData () {
      let media_id = this.data.asset_id
      let media = this.$store.state.media
      var result = media.filter(obj => {
        return obj.id === this.data.asset_id
      })
      if (result.length === 0) {
        await this.$store.dispatch('getMedia', media_id)
      }
    },
    downloadMedia () {
      console.log('downloading')
      utilsModule.openUrl(this.media.url)
    }
  }
}
</script>
