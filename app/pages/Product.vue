<template lang="html">
  <Page>
    <ActionBar>
      <barContent />
    </ActionBar>
    <GridLayout ~mainContent rows="*">
      <GridLayout rows="80, *, 80">
        <ActivityIndicator busy="true" v-if="!product" class="loader"/>
        <StackLayout row="0" horizontalAlignment="center"><!--this is the row at the top-->
          <Label class="product-title" :text="product.name"/>
        </StackLayout>
        <!-- FFF Layout -->
        <GridLayout row="1" > <!--v-if="product.id === 2"-->
          <GridLayout rows="150, 40, *">
            <GridLayout row="0">
              <ListView for="collection in product.Collections" class="list-group" @itemTap="onCollectionTap">
                <v-template>
                  <StackLayout class="list-group-item"  v-if="collection.ProductCollection.productHomeVisibility === true">
                    <Label :text="collection.name" class="list-entry-title"/>
                  </StackLayout>
                </v-template>
              </ListView >
            </GridLayout>
            <StackLayout row="1" horizontalAlignment="center"><!--this is the row at the top-->
              <Label text="Resources" style="font-size:22;"/>
            </StackLayout>
            <GridLayout row="2">
              <ListView for="item in product.layout.sections[1].content.items" class="list-group" @itemTap="onResourceTap">
                <v-template>
                  <StackLayout class="list-group-item">
                    <Label :text="item.label" class="list-entry-title"/>
                  </StackLayout>
                </v-template>
              </ListView >
            </GridLayout>
            <!--<StackLayout row="1">
              <Label text="Collections"/>
            </StackLayout>-->
          </GridLayout>
        </GridLayout>
        <!--<StackLayout row="2" orientation="vertical" horizontalAlignment="center" >
          <Label  textWrap="true"  text="Some text for footer"></Label>
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
  props: ['product'],
  data () {
    return {
      text: 'Members Only Content'
    }
  },
  mounted () {
    //this.getUserProducts()
  },
  computed: {
    user () { return (this.$store.state.auth || {}).user || null },
  },
  methods: {
    onCollectionTap(e) {
      console.log('collection pressed: ', e)
      this.$navigateTo(this.$routes.Collection, { props: { collectionid: e.item.id } })
    },
    onResourceTap(e) {
      if (e.item.key === 1001) {
        this.$navigateTo(this.$routes.Collection, { props: { collectionid: 3 } })
      } else if (e.item.key === 1002) {
        utilsModule.openUrl(e.item.link)
      } else if (e.item.key === 1003) {
        utilsModule.openUrl("https://members.deepenglish.com/connect")
      }

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
.product-subtitle {
  text-align:center;
  font-size:20;
  padding:20;
  color:#000;
}
.bottomborder {
  border-bottom:1px solid #d5d5d6;
}
</style>

<!--
mapState({
  movies: state => state.userProducts.movies,
  genres: state => state.userProducts.genres
})
-->
