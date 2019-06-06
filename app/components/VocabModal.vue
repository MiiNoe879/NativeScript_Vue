<template>
	<ScrollView >
		<StackLayout class="p-20" orientation="vertical">
			<Label class="vocab-title text-center" text="Vocabulary" /> <!--quizlet.quizlet_id-->
			<StackLayout orientation="vertical" class="m-t-30">
						<RadListView ref="listView" for="word in words" class="wordlist">
							<v-template>
									<GridLayout columns="100, *" rows="auto, auto"
											class="p-l-20">
											<Label :text="word.phrase" row="0" col="0"
													class="wordphrase p-r-20" textWrap="true"/>
											<Label :text="word.definition" row="0" col="1"
													class="worddef p-r-20" textWrap="true"/>
											<StackLayout class="hr-light m-y-20" row="1" colSpan="2"></StackLayout>
									</GridLayout>
							</v-template>
					</RadListView>
			</StackLayout>
			<Button class="btn btn-outline m-t-10" text="Close" @tap="$modal.close()" />
		</StackLayout>
		<!--<AbsoluteLayout ref="fabItemPosition" marginTop="87%" marginLeft="80%">
				<Button class="btn btn-outline" text="Close" @tap="$modal.close()" />
			</AbsoluteLayout>-->
	</ScrollView>
</template>

<script>

export default {
  props: ['words'],
    data() {
      return {
      };
    },
		computed: {
			mywords () {
				return this.words
			}
		}
};
</script>

<style scoped>
.wordphrase, .worddef {
	font-size:17;
}
.vocab-title {
	font-size:18;
	font-weight:bold;
}
</style>
