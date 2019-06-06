<template>
  <StackLayout class="resource-item">
    <Label :text="data.name" textWrap="true" @tap="openQuizlet" />
  </StackLayout>
</template>

<script>
import QuizletModal from "~/components/QuizletModal";
export default {
  components: {
    QuizletModal
  },
  data() {
    return {

    }
  },
  props: ['data'],
  computed: {

  },
  methods: {
    openQuizlet () {
      this.$showModal(QuizletModal,{ fullscreen: true, props: { quizlet: this.data }});
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
