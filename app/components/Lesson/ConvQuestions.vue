<template>
  <StackLayout class="resource-item" @loaded="fetchData()">
    <Label :text="data.name" textWrap="true" @tap="openConvModal"/>
  </StackLayout>
</template>

<script>
import ConvQuestionsModal from "~/components/ConvQuestionsModal";
export default {
  data() {
    return {

    }
  },
  props: ['data'],
  computed: {
    convquestions () {
      let contents = this.$store.state.relatedcontent
      var result = contents.filter(obj => {
        return obj.id === this.data.content_id
      })
      return result[0]
    }
  },
  methods: {
    openConvModal () {
      this.$showModal(ConvQuestionsModal,{ fullscreen: true, props: { data: this.convquestions }});
    },
    async fetchData () {
      console.log('conv questions id: ', this.data.content_id)
      let content_id = this.data.content_id
      /*let relatedcontent = this.$store.state.relatedcontent
      console.log('relatedcontent', )
      var result = relatedcontent.filter(obj => {
        return obj.id === this.data.content_id
      })*/
      //if (result.length === 0) {
        await this.$store.dispatch('getRelatedContent', content_id)
      //} else {
        // TBD: Check if the requested media exists in the array.
      //}
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
