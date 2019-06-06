<template lang="html">
  <Page @loaded="getLessonData()">
    <ActionBar>
      <barContent />
    </ActionBar>

    <GridLayout ~mainContent rows="*">

      <GridLayout rows="90, 200, *">
        <StackLayout row="0" horizontalAlignment="center"><!--this is the row at the top-->
          <Label class="product-title" :text="lessonset.name" textWrap="true" />
        </StackLayout>
        <GridLayout rows="*, auto" columns="*, auto" :backgroundImage="getThumbUrl(lessonset.image)" row="1" class="lsImage" width="100%">
          <Label class="fa heart heartbutton" text.decode="&#xf004; " @tap="onBookmarkTap" row="0" col="0" verticalAlignment="top" :class="{ bookmarked: isBookmarked }"/>
          <Button text="Mark as completed" v-if="!lessonsettracking || (lessonsettracking && (lessonsettracking.status===0 || lessonsettracking.status===2))" @tap="markComplete()" row="1" col="1" class="btn btn-complete" verticalAlignment="bottom"/>
          <Button @tap="alreadyComplete()" text="Completed" v-if="lessonsettracking && lessonsettracking.status===1" row="1" col="1" class="btn btn-completed" verticalAlignment="bottom"/>
        </GridLayout>
        <!--<StackLayout row="1" horizontalAlignment="center">
          <Image :src="getThumbUrl(lessonset.image)"/>
        </StackLayout>-->
        <TabView :selectedIndex="selectedIndex" @selectedIndexChange="indexChange" androidTabsPosition="bottom" row="2" selectedTabTextColor="white" tabTextColor="white"
         tabBackgroundColor="#4f8ab6"
         tabTextFontSize="16"
         androidSelectedTabHighlightColor="#F1C40F">
          <TabViewItem title="Lesson Set">
            <GridLayout >
              <ActivityIndicator busy="true" class="loader" v-if="lessons.length === 0"/>
              <ListView for="lesson in lessons" class="list-group" @itemTap="onLessonTap" v-if="lessons.length > 0">
                <v-template>
                  <StackLayout class="list-group-item">
                    <Label :text="lesson.title" class="list-entry-title" textWrap="true"/>
                  </StackLayout>
                </v-template>
              </ListView >
            </GridLayout>
          </TabViewItem>
          <TabViewItem title="Resources">
            <StackLayout horizontalAlignment="center">
              <ListView for="item in lsresources" class="list-group" >
                <v-template>
                  <StackLayout class="list-group-item">
                    <component
                      v-bind:is="item.component"
                      :data="item"
                      :lessonset_id="lessonset.id"
                    ></component>
                  </StackLayout>
                </v-template>
              </ListView>
            </StackLayout>
          </TabViewItem>
        </TabView>

      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { getImageUrl } from '~/utils'
import sideDrawer from '~/mixins/sideDrawer'
import barContent from '~/components/barContent'
import DownloadLink from '~/components/Lesson/DownloadLink.vue'
import LessonVocabulary from '~/components/Lesson/LessonVocabulary.vue'
import LessonQuizlet from '~/components/Lesson/LessonQuizlet.vue'
import ConvQuestions from '~/components/Lesson/ConvQuestions.vue'
import DiscourseLink from '~/components/Lesson/DiscourseLink.vue'
export default {
  components: {
    barContent,
    LessonVocabulary,
    LessonQuizlet,
    DownloadLink,
    ConvQuestions,
    DiscourseLink
  },
  mixins: [ sideDrawer ],
  props: ['id', 'collectionid'],
  data () {
    return {
      text: 'Hello Page Two!',
      lessons: [],
      selectedIndex: 0
    }
  },
  computed: {
    user () { return (this.$store.state.auth || {}).user || null },
    collectionId () {
      return this.collectionid
    },
    collectionaccess () {
      // Get the collection access information for the user's plan
      let bid = parseInt(this.collectionId)
      let accessarray = []
      this.$store.state.authuser_plans.forEach(plan => {
        accessarray.push(plan.access)
      })
      accessarray = accessarray.filter(Boolean)

      let access = [].concat(...accessarray.map(item => item.collections))
                  .filter(Boolean)
                  .find(({id}) => id === bid) //.content;
      return access
    },
    userProducts () {
      return this.$store.state.authuser_products
    },
    collection () {
      let products = this.userProducts
      if (products) {
        var matches = [];
        var needle = parseInt(this.collectionId); // what to look for

        products.forEach(function(e) {
            matches = matches.concat(e.Collections.filter(function(c) {
                return (c.id === needle);
            }));
        });
        // console.log(matches[0] || "Not found");
        return matches[0]
      } else {
        return null
      }
    },
    userPlans () {
      return this.$store.state.authuser_plans
    },
    relevantProductId () {
      let productId = 1
      if (parseInt(this.collectionId) === 1 || parseInt(this.collectionId) === 2 || parseInt(this.collectionId) === 3 || parseInt(this.collectionId) === 5) {
        productId = 2
      }
      this.userPlans.forEach(plan => {
        if (plan.name === 'pJM5nD' && parseInt(this.collectionId) === 2) {
          productId = 3
        }
      })
      return productId
    },
    relevantPlan () {
      let myplan = null
      this.userPlans.forEach(plan => {
        if (plan.ProductId === this.relevantProductId) {
          myplan = plan.UserPlan
        }
      })
      return myplan
    },
    userPlanStatus () {
      if (this.relevantPlan.status === true) {
        return true
      } else {
        return false
      }
    },
    product () {
      let products = this.userProducts
      let productId = this.collection.ProductCollection.ProductId
      var result = products.filter(obj => {
        return obj.id === productId
      })
      return result[0]
    },
    lessonset () {
      let lessonsetId = this.id
      let lessons = this.$store.state.lessonsets
      //console.log(lessons)
      let result = lessons.filter(obj => {
        return obj.id === parseInt(lessonsetId)
      })
      return result[0] //this.$store.state.lessonsets[lessonsetId]
    },
    lsresources () {
      if (this.lessonset) {
        return this.lessonset.resources.resources
      } else {
        return []
      }
    },
    lessonsettracking () {
      // let lessonsetId = parseInt(this.id)
      let lessonsetId = this.id
      // let tracker = this.$store.state.lessonsetsTracking[lessonsetId]

      var tracker = this.$store.state.lessonsetsTracking.filter(obj => {
        return obj.id === lessonsetId
      })

      //console.log ('tracker: ', tracker)
      if (tracker.length > 0) {
        return tracker[0].data
      } else {
        return {status: 0}
      }
      // return this.$store.state.lessonsetsTracking[lessonsetId]
    },
    isBookmarked () {
      let bookmarks = this.$store.state.bookmarks
      let match = bookmarks.filter(e => {
        console.log('bookmark and lesson set id', e.data.id, this.id)
        return e.data.id === this.lessonset.id
      })
      console.log('match length: ', match.length)
      if (match.length > 0) {
        return true
      } else {
        return false
      }
    }
    /*lessons () {
      let lessonsetId = this.id
      return this.$store.state.lessons[lessonsetId]
    }*/
  },
  methods: {
    onLessonTap(e) {
      //console.log('lesson pressed: ', e)
      this.$navigateTo(this.$routes.Lessons, { props: { currentlesson: e.item, lessons: this.lessons, lessonset:this.lessonset  } })
    },
    onResourceTap(e) {
      if (e.item.component === 'DownloadLink') {
        console.log('Download Link: ', e.item)
      } else {
        console.log('Other Link: ', e.item)
      }
      //this.$navigateTo(this.$routes.Lessons, { props: { currentlesson: e.item, lessons: this.lessons } })
    },
    async getLessonData() {
      console.log('getting lesson data....')
      if (this.user) {
        if (this.$store.state.authuser_plans.length === 0) {
          console.log('fetching user plans...')
          await this.$store.dispatch('getAuthUserPlans')
        }
      } else {
        this.$navigateTo(this.$routes.LoginPage)
      }
      var collectionId = this.collectionid
      // Get the collection access information for the user's plan
      let bid = parseInt(collectionId)
      let accessarray = []
      this.$store.state.authuser_plans.forEach(plan => {
        accessarray.push(plan.access)
      })
      accessarray = accessarray.filter(Boolean)

      let access = [].concat(...accessarray.map(item => item.collections))
                  .filter(Boolean)
                  .find(({id}) => id === bid) //.content;
      if (access) {
        var id = this.id
        // get main data for the lesson set id
        if (!this.$store.state.lessonsets.hasOwnProperty(id)) {
          await this.$store.dispatch('getLessonSet', id)
        }
        // Get lessons in the lesson set with id
        if (!this.$store.state.lessons.hasOwnProperty(id)) {
          await this.$store.dispatch('getLessonsinSet', id)
        }
      }
      this.lessons = this.$store.state.lessons[id]
      //console.log('lesson set', id)
      //console.log('lesson count: ', this.$store.state.lessons[id])
      //console.log('this lessons: ', this.lessons)
      var trackingresult = this.$store.state.lessonsetsTracking.filter(obj => {
        return (obj.id === id.toString())
      })
      console.log('tracking result: ', trackingresult)
      if (trackingresult.length > 0) {
      } else {
        let trackingpayload = {'section': 'LessonSet', 'sectionId': id}
        console.log('getting this...')
        await this.$store.dispatch('getTracking', trackingpayload)
      }
      var bm = await this.$store.dispatch('getBookmarks')
    },
    getThumbUrl (url) {
      console.log('image url: ', url)
      return getImageUrl(url, { w: 420, h: 210, fit:'clamp' })
    },
    indexChange: function(args) {
      let newIndex = args.value
      console.log('Current tab index: ' + newIndex)
    },
    async markComplete () {
      let payload = {
        section: 'LessonSet',
        sectionId: this.id,
        productId: this.product.id,
        data: {status:1}
      }
      let tracked = await this.$store.dispatch('sendTracking', payload)
      console.log('lessonset tracked')
    },
    async alreadyComplete () {
      let payload = {
        section: 'LessonSet',
        sectionId: this.id,
        productId: this.product.id,
      }
      let untracktrack = await this.$store.dispatch('removeTracking', payload)
      //alert('You have already marked this as completed!')
    },
    async onBookmarkTap () {
      console.log('heart tapped')
      if (this.isBookmarked === true) {
        console.log('unbookmarking...')
        //this.isBookmarked = false
        let payload = {
            id: this.lessonset.id,
            type: 'lessonset',
            title: this.lessonset.name,
            collectionid:this.collection.id
        }
        await this.$store.dispatch('removeBookmark', payload)
      } else {
        console.log('bookmarking...')
        //this.isBookmarked = true
        let payload = {
            id: this.lessonset.id,
            type: 'lessonset',
            title: this.lessonset.name,
            collectionid:this.collection.id
        }
        await this.$store.dispatch('addBookmark', payload)
      }
    }

  }
}
</script>

<style lang="css" scoped>
.product-title {
  text-align:center;
  font-size:20;
  padding:20;
}
.btn-complete {
  background-color: #3ab567;
  horizontal-align: right;
  vertical-align: bottom;
  color:#fff;
}
.btn-completed {
  background-color: #fff;
  color:#333;
  horizontal-align: right;
  vertical-align: bottom;
}
.lsImage {
  background-repeat: no-repeat;
  background-position: center;
      background-size: cover;
}
.list-entry-title {
  font-size:16;
}
.loader {
  width:50;
}
.bookmarked {
	color:#F1C40F;
}
</style>
