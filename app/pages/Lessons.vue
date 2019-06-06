<template lang="html">
  <Page>
    <ActionBar>
      <barContentLesson />
    </ActionBar>
    <GridLayout ~mainContent rows="*">
      <TabView :selectedIndex="selectedIndex" @selectedIndexChange="indexChange" androidTabsPosition="bottom" selectedTabTextColor="white" tabTextColor="white"
       tabBackgroundColor="#4f8ab6"
       tabTextFontSize="16"
       androidSelectedTabHighlightColor="#F1C40F">
        <TabViewItem title="Lesson">
              <StackLayout>
                <Label class="lesson-title" :text="lesson.title" textWrap="true" />
                <StackLayout horizontalAlignment="center" v-for="row in lesson.content.rows">
                  <StackLayout horizontalAlignment="center" v-for="col in row.columns">
                    <!--<Label :text="col.component.name" textWrap="true" />-->
                    <TextView :text="removeHTMLTags(col.component.content)" v-if="col.component.name === 'Html'" class="lessontext" editable="false"/>
                      <newVideoPlayer :video="col.component" v-if="col.component.name === 'VimeoEmbed'"/>
                      <audioPlayer :audio="col.component" v-if="col.component.name === 'AudioPlayer'"/>
                      <downloadButton :data="col.component" v-if="col.component.name === 'DownloadButton'"/>
                      <transcriptBox :data="col.component" v-if="col.component.name === 'TranscriptBox'"/>
                  </StackLayout>
                </StackLayout>
              </StackLayout>
        </TabViewItem>
        <TabViewItem title="Resources">
          <StackLayout horizontalAlignment="center">
            <Label class="product-title" text="Lesson Resources" textWrap="true" />
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
        <TabViewItem title="Quiz" v-if="lesson.QuizId">
          <DeQuiz :quizId="lesson.QuizId" />
        </TabViewItem>
      </TabView>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import barContentLesson from '~/components/barContentLesson'
import audioPlayer from '~/components/audioPlayer'
import newVideoPlayer from '~/components/newVideoPlayer'
import downloadButton from '~/components/downloadButton'
import transcriptBox from '~/components/transcriptBox'
import DeQuiz from '~/components/DeQuiz'
import DownloadLink from '~/components/Lesson/DownloadLink.vue'
import LessonVocabulary from '~/components/Lesson/LessonVocabulary.vue'
import LessonQuizlet from '~/components/Lesson/LessonQuizlet.vue'
import ConvQuestions from '~/components/Lesson/ConvQuestions.vue'
import DiscourseLink from '~/components/Lesson/DiscourseLink.vue'
export default {
  components: {
    barContentLesson,
    audioPlayer,
    downloadButton,
    transcriptBox,
    DeQuiz,
    LessonVocabulary,
    LessonQuizlet,
    DownloadLink,
    ConvQuestions,
    DiscourseLink,
    newVideoPlayer
  },
  props: ['currentlesson','lessons', 'lessonset'],
  mixins: [ sideDrawer ],
  data () {
    return {
      text: 'Hello Page Two!',
      selectedIndex: 0
    }
  },
  computed: {
    lesson () {
      return this.currentlesson
    },
    lsresources () {
      if (this.lessonset) {
        return this.lessonset.resources.resources
      } else {
        return []
      }
    },
  },
  methods: {
    indexChange: function(args) {
      let newIndex = args.value
      console.log('Current tab index: ' + newIndex)
    },
    removeHTMLTags (content) {
      var result = content.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
      result = content.replace(/<p[^>]*>([^<]+)<\/p>/g, '$1');
      return result
    }
  }
}
</script>

<style lang="css" scoped>
.lessontext {
  font-size:18;
  padding:15 20 20 20;
  background-color: transparent;
  border-color: transparent;
}
.lesson-title {
  text-align:center;
  font-size:19;
  padding:15 15 0 15;
  font-weight:bold;
}
</style>
