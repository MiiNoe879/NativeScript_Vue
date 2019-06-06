<template lang="html">
  <Page>
    <ActionBar>
      <barContent />
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*" class="main-body">
      <ActivityIndicator busy="true" v-if="freelessons.length === 0" class="loader"/>
      <RadListView for="lesson in freelessons" class="list-group" @itemTap="onItemTap">
        <v-template>
          <StackLayout class="list-group-item">
            <GridLayout columns="100, *" rows="auto" verticalAlignment="top">
              <Image
                  :src="lesson.better_featured_image.media_details.sizes.thumbnail.source_url" row="0" col="0" borderRadius="15" width="80" height="80" class="list-entry-image"/>
              <Label :text="lesson.title.rendered" class="list-entry-title" row="0" col="1" textWrap="true"/>
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
import sideDrawer from '~/mixins/sideDrawer';
import barContent from '~/components/barContent';
import SingleFreeLessonModal from "~/components/SingleFreeLessonModal";
import axios from "axios";
export default {
  components: {
    barContent,
    SingleFreeLessonModal
  },
  mixins: [ sideDrawer ],
  data () {
    return {
      text: 'Hello Home Page!',
      pokemon: [],
      freelessons:[]
    }
  },
  mounted() {
    axios({ method: "GET", "url": "https://deepenglish.com/wp-json/wp/v2/posts?per_page=10" }).then(result => {
      this.freelessons = result.data;
    }, error => {
      console.error(error);
    });
  },
  methods: {
    onItemTap(e) {
      console.log('item pressed: ', e)
      //this.$emit("select", e.item);
      //this.$navigateTo(CarDetails, { props: { car: e.item } });
      this.$showModal(SingleFreeLessonModal,{ fullscreen: true, props: { lesson: e.item }});
    },
    formatDescription(content) {
      var string = content.replace(/(<([^>]+)>)/ig,"")
      var length = 100;
      var trimmedString = string.length > length ? string.substring(0, length - 3) + "..." : string.substring(0, length);
      return trimmedString
    }
  }
}
</script>
<!-- HTTP EXAMPLE https://vuejsdevelopers.com/2018/07/02/vue-js-native-script-vue-http-web-service/ -->
<style lang="css">
.list-entry-title {
  font-weight: bold;
  font-size: 19;
  color: #333;
  padding-bottom:0;
  margin-bottom:0;
}
.list-entry-image {
  margin-top:0;
  margin-right:10;
  vertical-align: top;
}
.list-entry-desc {
  background-color: transparent;
  border-color: transparent;
  margin-top:0;
  padding-top:0;
}
.main-body {
  padding-top:15;;
}
</style>
