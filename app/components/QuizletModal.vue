<template>
	<StackLayout class="p-20" backgroundColor="white">
		<Label class="quizlet-title text-center" text="Quiz" /> <!--quizlet.quizlet_id-->
		<WebView :src="quizletUrl" v-if="quizletUrl"/>
		<Button class="btn btn-outline" text="Close" @tap="$modal.close()" />
	</StackLayout>
</template>

<script>

export default {
  props: ['quizlet'],
    data() {
      return {
        progress: 0,
        isPlaying: false,
      };
    },
		computed: {
			quizletUrl () {
				let url = "<iframe src='https://quizlet.com/" + this.quizlet.quizlet_id + "/test/embed?i=mifpr&x=1jj1' height='600' width='100%' style='border:0'></iframe>"
				return url
			}
		}
};
</script>

<style scoped>
.quizlet-title {
	font-size:18;
	font-weight:bold;
}
</style>
