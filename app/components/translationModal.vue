<template>
	<ScrollView>
		<StackLayout class="p-20 convq" backgroundColor="white" @loaded="fetchData()">
			<Label class="translation-title text-center" :text="`Translation in ${lang.language}`" /> <!--quizlet.quizlet_id-->
			<GridLayout row="2" col="0" colSpan="2" backgroundColor="#d5d5d5" margin="5" padding="8"
					borderRadius="10">
					<Label verticalAlignment="center" horizontalAlignment="center"
							textAlignment="center" color="#333" fontSize="20" fontWeight="bold"
							textWrap="true" :text="sentence"></Label>
			</GridLayout>
			<GridLayout row="2" col="0" colSpan="2" backgroundColor="#d5d5d5" margin="5" padding="5"
					borderRadius="10">
					<Label verticalAlignment="center" horizontalAlignment="center"
							textAlignment="center" color="#333" fontSize="20" fontWeight="bold"
							textWrap="true" :text="translation"></Label>
			</GridLayout>
			<Button class="btn btn-outline" text="Close" @tap="$modal.close()" />
		</StackLayout>
	</ScrollView>
</template>

<script>

export default {
  props: ['sentence', 'lang'],
    data() {
      return {
      };
    },
		computed: {
			translation () {
				if (this.$store.state.translation) {
		      return this.$store.state.translation
				} else {
					return 'Loading...'
				}
	    },
		},
		methods: {
			async fetchData () {
				let payload = {'sentence': this.sentence, 'lang': this.lang.code}
	      await this.$store.dispatch('getTranslation', payload)
			}
		}
};
</script>

<style scoped>
.translation-title {
	font-size:20;
	font-weight:bold;
	margin-bottom:15;
}
.convq {
	font-size:20;
}
</style>
