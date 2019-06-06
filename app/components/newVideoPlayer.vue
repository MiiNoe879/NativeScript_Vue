<template>
  <StackLayout horizontalAlignment="center" @loaded="fetchData()">
    <!--<Label class="media-title" :text="JSON.stringify(video)" textWrap="true" />-->
    <ActivityIndicator busy="true" class="loader" v-if="!videofile"/>
    <VideoPlayer ref="player" :src="videofile.url" autoplay="true" height="300" v-if="videofile"/>
  </StackLayout>
</template>

<script>
const { isIOS } = require('tns-core-modules/platform');
const { TNSPlayer } = require('../nativescript-audio');
export default {
  data() {
    return {
      videoUrl: null
    }
  },
  props: ['video'],
  created () {
    //this.fetchData()
  },
  mounted() {

  },

  computed: {
    videofile () {
      let videos = this.$store.state.videos
      var result = videos.filter(obj => {
        return obj.id === this.video.vimeo_id
      })
      return result[0]
    },
  },
  methods: {
    async fetchData () {
      let vimeo_id = this.video.vimeo_id
      let videos = this.$store.state.videos
      var result = videos.filter(obj => {
        return obj.id === this.video.vimeo_id
      })
      if (result.length === 0) {
        await this.$store.dispatch('getVimeoUrl', vimeo_id)
      }
    }
  }
}
</script>
<style scoped>
.media-title {
  text-align:center;
  font-size:20;
  padding:20;
}
</style>
