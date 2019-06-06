<template lang="html">
  <Page @loaded="getUserProducts()">
    <ActionBar>
      <barContent />
    </ActionBar>
    <GridLayout ~mainContent columns="*" rows="*">
      <ActivityIndicator busy="true" v-if="userProducts.length === 0" class="loader"/>
      <!--<Label class="message" :text="userProducts.length" col="0" row="0" v-if="userProducts.length > 0"/>-->
      <!--v-if="user && userProducts.length > 0" -->
      <!--<TextField v-model="user.email" hint="Enter text..." />-->

      <!--<ListView for="product in userProducts" class="list-group" @itemTap="onItemTap">
        <v-template>
          <StackLayout class="list-group-item">
            <Label :text="product.name" class="list-entry-title"/>
          </StackLayout>
        </v-template>
      </ListView >-->
      <StackLayout orientation="vertical" class="m-t-30"
                      row="0">
            <RadListView ref="listView" for="product in userProducts"
          @itemTap="onItemTap">
          <v-template>
              <GridLayout columns="80, *" rows="auto, auto, auto"
                  class="p-l-20">
                  <Label rowSpan="2"
                      col="0" class="h1 fa leanpub m-t-10" text.decode="&#xf212; "/>
                  <Label :text="product.name" row="0" col="1"
                      class="h2 p-r-20" />
                  <Label :text="product.tagline" row="1" col="1"
                      class="body p-r-20"/>
                  <StackLayout class="hr-light m-y-20" row="2" colSpan="2"></StackLayout>
              </GridLayout>
          </v-template>
      </RadListView>
      </StackLayout>

    </GridLayout>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import sideDrawer from '~/mixins/sideDrawer'
import barContent from '~/components/barContent'
export default {
  components: {
    barContent
  },
  mixins: [ sideDrawer ],
  data () {
    return {
      text: 'Members Only Content'
    }
  },
  mounted () {
    //this.getUserProducts()
  },
  computed: {
    movies () {
      return this.$store.state.userProducts.movies
    },
    user () { return (this.$store.state.auth || {}).user || null },
    userPlans () {
      return this.$store.state.authuser_plans
    },
    userProducts () {
      let userproducts = []
      this.userPlans.forEach (function(obj) {
        if( obj.UserPlan.mm_status === 1 || ((obj.UserPlan.mm_status === 2 || obj.UserPlan.mm_status === 9) && new Date(obj.UserPlan.end_date) > new Date())) {
          userproducts.push(obj.Product)
        }
      })
      return userproducts
    }
  },
  methods: {
    async getUserProducts() {
      console.log('getting user products 2...', this.user)
      if (this.user) {
        console.log('getting user products ')
        if (this.$store.state.authuser_plans.length === 0) {
          await this.$store.dispatch('getAuthUserPlans')
        }
      } else {
        this.$navigateTo(this.$routes.LoginPage)
      }
    },
    onItemTap(e) {
      console.log('product pressed: ', e)
      //this.$emit("select", e.item);
      if (e.item.id === 2) {
        this.$navigateTo(this.$routes.Product, { props: { product: e.item } });
      }
      if (e.item.id === 1) {
        console.log('collection pressed: ', e)
        this.$navigateTo(this.$routes.Collection, { props: { collectionid: 4 } })
      }
      //this.$showModal(SingleFreeLessonModal,{ fullscreen: true, props: { lesson: e.item }});
    }
  }
}
</script>

<style lang="css" scoped>
.loader {
  width:50;
}
</style>

<!--
mapState({
  movies: state => state.userProducts.movies,
  genres: state => state.userProducts.genres
})
-->
