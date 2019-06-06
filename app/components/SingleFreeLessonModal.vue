<template>
		<GridLayout backgroundColor="white" rows="auto,auto,auto,auto,*" columns="auto,*" @loaded="fetchData()">
			<GridLayout row="0" col="0" colSpan="2" rows="*, auto" columns="*, auto" :backgroundImage="lesson.better_featured_image.media_details.sizes.medium.source_url" height="160">
				<Label class="fa heart heartbutton" text.decode="&#xf004; " @tap="onTap" row="0" col="0" verticalAlignment="top" :class="{ bookmarked: isBookmarked }"/>
				<Label class="fa times closebutton" text.decode="&#xf00d;" @tap="$modal.close()" row="0" col="1" verticalAlignment="top"/>
				<Label class="h2 text-center" :text="`${lesson.title.rendered}`" textWrap="true" row="1" col="0" colSpan="2" backgroundColor="RGBA(79,138,182,0.70)" color="#FFFFFF" verticalAlignment="center" />
			</GridLayout>
			<!--<Image
					:src="lesson.better_featured_image.media_details.sizes.medium.source_url" borderRadius="15" width="100%" class="free-lesson-image" row="1"  col="0" colSpan="2"/>-->
			<Label class="h2 audiotitle" text="Slow" textWrap="true" row="1" col="0" verticalAlignment="center" marginLeft="10"/>
			<freeLessonAudio :audio="lesson.CFS.url_slow" row="1" col="1"/>
			<Label class="h2 audiotitle" text="Normal" textWrap="true" row="2" col="0" verticalAlignment="center" marginLeft="10"/>
			<freeLessonAudio :audio="lesson.CFS.url_debate" row="2" col="1"/>
			<Label class="h2 audiotitle" text="Fast" textWrap="true" row="3" col="0" verticalAlignment="center" marginLeft="10"/>
			<freeLessonAudio :audio="lesson.CFS.url_fast" row="3" col="1"/>
			<transcriptBoxFreeLesson :data="lesson.content.rendered" row="4" col="0" colSpan="2"/>
			<!--<Button class="btn btn-outline" text="Close" @tap="$modal.close()" row="5" col="0" colSpan="2" />-->
		</GridLayout>
</template>

<script>
import freeLessonAudio from "~/components/freeLessonAudio";
import transcriptBoxFreeLesson from "~/components/transcriptBoxFreeLesson";
export default {
	components: {
		freeLessonAudio,
		transcriptBoxFreeLesson
	},
  props: ['lesson'],
  data() {
    return {
      progress: 0,
      isPlaying: false,
			//isBookmarked: false
    };
  },
	computed: {
		isBookmarked () {
			let bookmarks = this.$store.state.bookmarks
			console.log('Bookmarks', bookmarks)
			let match = bookmarks.filter(e => {
				console.log('bookmark and lesson id', e.data.id, this.lesson.id)
				return e.data.id === this.lesson.id
			})
			console.log('match length: ', match.length)
			if (match.length > 0) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		async fetchData () {
			var bm = await this.$store.dispatch('getBookmarks')
		},
		async onTap () {
			console.log('Bookmark Value: ', this.isBookmarked)
			if (this.isBookmarked === true) {
				console.log('unbookmarking...')
				//this.isBookmarked = false
				let payload = {
						id: this.lesson.id,
						type: 'blog',
						title: this.lesson.title.rendered
				}
				await this.$store.dispatch('removeBookmark', payload)
			} else {
				console.log('bookmarking...')
				//this.isBookmarked = true
				let payload = {
				    id: this.lesson.id,
				    type: 'blog',
				    title: this.lesson.title.rendered
				}
				await this.$store.dispatch('addBookmark', payload)
			}
		}
	}
};
</script>

<style scoped>
.audiotitle {
	font-weight:600;
	font-size:16;
}
.free-lesson-image {
	margin-bottom:15;
	margin-top:15;
	height:60;
}
h2 {
	font-size:15;
	font-weight:600;
}
.bookmarked {
	color:#F1C40F;
}
</style>
