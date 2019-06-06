<template lang="html">
  <Page @loaded="getCollectionData()">
    <ActionBar>
      <barContent />
    </ActionBar>
    <GridLayout ~mainContent rows="*">
      <GridLayout rows="75, *">

        <StackLayout row="0" horizontalAlignment="center"><!--this is the row at the top-->
          <Label class="product-title" :text="collection.name" textWrap="true" />
        </StackLayout>
        <!-- FFF Layout -->
        <GridLayout row="1">
          <ActivityIndicator busy="true" class="loader" v-if="!collectionLoaded"/>
          <ListView for="lessonset in lessonsets" class="list-group" @itemTap="onLessonSetTap" v-if="lessonsets.length > 0 && collectionLoaded">
            <v-template>
              <StackLayout class="list-group-item">
                <Label :text="lessonset.name" class="list-entry-title" textWrap="true"/>
              </StackLayout>
            </v-template>
          </ListView >
        </GridLayout>
        <!--<StackLayout row="2" orientation="vertical" horizontalAlignment="center" >
          <Label textWrap="true"  text="Some text for footer"></Label>
        </StackLayout>-->
      </GridLayout>
      <!--v-if="user && userProducts.length > 0" -->
      <!--<TextField v-model="user.email" hint="Enter text..." />-->


      <!--<ListView for="movie in movies" class="list-group">
        <v-template>
          <StackLayout class="list-group-item">
            <Label :text="movie.name" class="list-entry-title"/>
          </StackLayout>
        </v-template>
      </ListView>-->

    </GridLayout>
  </Page>
</template>

<script>
var utilsModule = require("tns-core-modules/utils/utils");
import { mapState } from 'vuex'
import sideDrawer from '~/mixins/sideDrawer'
import barContent from '~/components/barContent'
export default {
  components: {
    barContent
  },
  mixins: [ sideDrawer ],
  props: ['collectionid'],
  data () {
    return {
      text: 'Members Only Content',
      collectionLoaded: false
    }
  },
  mounted () {
    //this.getCollectionData()
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
    collection () {
      // let products = this.$store.state.products
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
    userProducts () {
      return this.$store.state.authuser_products
    },
    isTrialPeriod () {
      if (this.collectionaccess.trial_period) {
        let trial_period = this.collectionaccess.trial_period
        let join_date = this.relevantPlan.start_date;
        let today = new Date()
        let trial_period_upto = addDays(join_date, trial_period)
        return trial_period_upto > today
      } else {
        return false
      }
    },
    trialEndDate () {
      if (this.collectionaccess.trial_period) {
        let trial_period = this.collectionaccess.trial_period + 1
        let join_date = this.relevantPlan.start_date;
        let today = new Date()
        let trial_period_upto = addDays(join_date, trial_period)
        let result = format(trial_period_upto, 'dd MMMM yyyy')
        return result
      } else {
        return 0
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

    lessonsets () {
      return this.$store.state.lessonsets
    },
    lessonSetsTracking () {
      let tracking = this.$store.state.lessonsetsTracking
      return tracking
    },
    triallessonsets () {
      let t_lessonsets = this.$store.state.lessonsets
      // pop the most recent
      t_lessonsets=t_lessonsets.slice(1)

      // Hard coded for Core VIDEO. Actually we should get trial_what from plan access.
      let trial_what = [86, 87] // ["latest",86,87]
      var result = t_lessonsets.filter(obj => {
        return obj.id === 86 || obj.id === 87
      })
      return result
    },
    trialpromolessonsets () {
      let t_lessonsets = this.$store.state.lessonsets
      // pop the most recent
      t_lessonsets=t_lessonsets.slice(1)

      // Hard coded for Core VIDEO. Actually we should get trial_what from plan access.
      let trial_what = [86, 87] // ["latest",86,87] 87 is shadowing and 86 is Get the Most Out of the Fast Fluency Formula
      var result = t_lessonsets.filter(obj => {
        return obj.id !== 86 || obj.id !== 87
      })
      return result
    },
    lessonsetsdrip () {
      let all_lessonsets = this.$store.state.lessonsets
      let driplessonsets = []
      if (this.collectionaccess.lessonSets.what === 'drip') {
        this.collectionaccess.lessonSets.content.forEach(lessonset => {
          var result = all_lessonsets.filter(obj => {
            return obj.id === lessonset.id
          })
          result[0].checkaccess = this.checkaccess(lessonset.days)
          driplessonsets.push(result[0])
        })
      }
      return driplessonsets
    }
  },
  methods: {
    onLessonSetTap(e) {
      console.log('lessonset pressed: ', e)
      this.$navigateTo(this.$routes.LessonSet, { props: { id: e.item.id, collectionid: this.collection.id } })
    },
    async getCollectionData() {
      console.log('getting collection data...')
      if (this.user) {
        if (this.$store.state.authuser_plans.length === 0) {
          console.log('fetching user plans...')
          await this.$store.dispatch('getAuthUserPlans')
        }
      } else {
        this.$navigateTo(this.$routes.LoginPage)
      }
      console.log('getting collection data for for plans', this.$store.state.authuser_plans)
      var collectionId = this.collectionid
      console.log('Collection Id is: ', collectionId)
      // Get the collection access information for the user's plan
      let bid = parseInt(collectionId)
      let accessarray = []
      this.$store.state.authuser_plans.forEach(plan => {
        console.log('adding to array')
        accessarray.push(plan.access)
      })
      accessarray = accessarray.filter(Boolean)

      let access = [].concat(...accessarray.map(item => item.collections))
                  .filter(Boolean)
                  .find(({id}) => id === bid) //.content;
      if (access) {
        console.log('collection access result: ', access)
        // Load all lesson sets for Core Video, SF
        if (parseInt(collectionId) === 2 || parseInt(collectionId) === 3 || parseInt(collectionId) === 1 || parseInt(collectionId) === 4) {
          await this.$store.dispatch('getLessonSets', collectionId)
        }
      } else {
        console.log('No collection access')
      }
      this.collectionLoaded = true
    }
  }
}
</script>

<style lang="css" scoped>
.loader {
  width:50;
}
.product-title {
  text-align:center;
  font-size:25;
  padding:20;
}
</style>

<!--
mapState({
  movies: state => state.userProducts.movies,
  genres: state => state.userProducts.genres
})
-->
