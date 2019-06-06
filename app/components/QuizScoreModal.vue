<template>
	<StackLayout class="p-20" backgroundColor="white">
		<Label class="quizlet-title text-center" text="Quiz" /> <!--quizlet.quizlet_id-->
		<Label class="quizlet-title text-center" :text="userScore" />
		<Button class="btn btn-outline" text="Close" @tap="$modal.close()" />
	</StackLayout>
</template>

<script>

export default {
  props: ['userScore'],
    data() {
      return {
      };
    },
		computed: {
		}
};
</script>

<style scoped>
.quizlet-title {
	font-size:18;
	font-weight:bold;
}
</style>
