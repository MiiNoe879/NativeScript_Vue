<template>
  <StackLayout class="resource-item" @loaded="fetchData()">
    <Label :text="data.name" textWrap="true" @tap="openVocabModal" />
  </StackLayout>
</template>

<script>
import VocabModal from "~/components/VocabModal";
export default {
  data() {
    return {
      wordslist:null,
      datastate: 'none'
    }
  },
  props: ['data', 'lessonset_id'],
  computed: {
    words () {
      // console.log('getting vocab computed', this.lessonset_id)
      // let lessonsetId = this.lessonset_id
      // console.log(this.$store.state.lessonwords[this.lessonset_id])
      // let lessonwords = this.$store.state.lessonwords
      return this.wordslist
    }
  },
  methods: {
    openVocabModal () {
      this.$showModal(VocabModal,{ fullscreen: true, props: { words: this.words }});
    },
    async fetchData () {
      let payload = {lessonsetId:this.lessonset_id,wordIds: this.data.words}
      if (!this.$store.state.lessonwords.hasOwnProperty(this.lessonset_id)) {
        await this.$store.dispatch('getVocabWords', payload)
      }
      this.wordslist = this.$store.state.lessonwords[this.lessonset_id]
    },
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
