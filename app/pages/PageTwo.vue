<template lang="html">
  <Page @loaded="fetchData()">
    <ActionBar>
      <barContent />
    </ActionBar>
    <GridLayout ~mainContent columns="*" rows="auto, *">
      <Label class="h2 text-center" text="Bookmarks" textWrap="true" row="0" col="0" colSpan="2" backgroundColor="RGBA(79,138,182,0.70)" color="#FFFFFF" verticalAlignment="center" padding="15"/>
      <ActivityIndicator busy="true" v-if="bookmarks.length === 0" class="loader" verticalAlignment="center"/>
      <RadListView for="bookmark in bookmarks" class="list-group" @itemTap="onItemTap" row="1">
        <v-template>
          <StackLayout class="list-group-item">
            <GridLayout columns="*" rows="auto" verticalAlignment="top">
              <Label :text="bookmark.data.title" class="list-entry-title" row="0" textWrap="true"/>
              <!--<TextView editable="false" row="1" col="1" class="list-entry-desc">
                  <FormattedString>
                      <Span :text="formatDescription(lesson.excerpt.rendered)" />
                  </FormattedString>
              </TextView>-->
              <!--<HtmlView :html="lesson.excerpt.rendered" row="1" col="1" class="list-entry-desc"></HtmlView>-->
            </GridLayout>
          </StackLayout>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import barContent from '~/components/barContent'
import axios from "axios";
import SingleFreeLessonModal from "~/components/SingleFreeLessonModal";
export default {
  components: {
    barContent
  },
  mixins: [ sideDrawer ],
  data () {
    return {
      text: 'Favorites',
      bookmarks:[]
    }
  },
  computed: {
    user () { return (this.$store.state.auth || {}).user || null },
    /*bookmarks () {
      return this.$store.state.bookmarks
    }*/
  },
  methods: {
    async fetchData () {
      if (this.user) {
          console.log('fetching bookmarks...')
          var bm = await this.$store.dispatch('getBookmarks')
          console.log('bookmarks data:  ', bm)
          this.bookmarks = bm
      } else {
        this.$navigateTo(this.$routes.LoginPage)
      }
    },
    async onItemTap (e) {
      console.log('bookmark select...', e.item.data)
      if (e.item.data.type === 'blog') {
        let lesson;
        let url = 'https://deepenglish.com/wp-json/wp/v2/posts/' + e.item.data.id
        axios({ method: "GET", "url": url }).then(result => {
          console.log('lesson: ', result);
          this.$showModal(SingleFreeLessonModal,{ fullscreen: true, props: { lesson: result.data }});
        }, error => {
          console.error(error);
        });
      }
      if (e.item.data.type === 'lessonset') {
        if (!this.$store.state.lessonsets.hasOwnProperty(e.item.data.id)) {
          await this.$store.dispatch('getLessonSet', e.item.data.id)
        }
        this.$navigateTo(this.$routes.LessonSet, { props: { id: e.item.data.id, collectionid: e.item.data.collectionid } })
      }
    }
  }
}
</script>

<style lang="css">
</style>
