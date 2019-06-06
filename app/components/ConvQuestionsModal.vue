<template>
	<ScrollView>
		<StackLayout class="p-20 convq" backgroundColor="white">
			<Label class="quizlet-title text-center" text="Conversation Questions" /> <!--quizlet.quizlet_id-->
			<HtmlView :html="data.content.data" />
			<Button class="btn btn-outline" text="Close" @tap="$modal.close()" />
		</StackLayout>
	</ScrollView>
</template>

<script>

export default {
  props: ['data'],
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
	margin-bottom:15;
}
.convq {
	font-size:20;
}
</style>
