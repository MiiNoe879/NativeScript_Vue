<template lang="html">
  <ScrollView>
    <StackLayout width="100%" height="100%">
      <Label class="drawer-header" :text="`Welcome ${user.first}`" v-if="user"/>
      <Label class="drawer-header" text="Deep English" v-if="!user"/>

      <Label
        v-for="(page, i) in pages"
        @tap="goToPage(page)"
        class="drawer-item"
        :text="page.name"
        :key="i"
      />
      <Button class="drawer-login-button" @tap="login()" v-if="!user">Sign In</Button>
      <Button class="drawer-login-button" @tap="logout()" v-if="user">Log Out</Button>
      <Button class="drawer-close-button" @tap="closeDrawer()" verticalAlignment="bottom">Close</Button> <!--text.decode="&#xf00d;"-->

    </StackLayout>
  </ScrollView>
</template>

<script>
import localStorage from 'nativescript-localstorage'
import * as ApplicationSettings from "application-settings"
import sideDrawer from '~/mixins/sideDrawer'
var utilsModule = require("tns-core-modules/utils/utils");

export default {
  mixins: [sideDrawer],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      pages: [
        { name: 'FREE LESSONS', component: this.$routes.Home, location:'internal' },
        { name: 'MEMBERS', component: this.$routes.My , location:'internal'},
        { name: '7-DAY COURSE', component: this.$routes.PageTwo, location:'external', url:'https://deepenglish.com' },
        { name: 'FAVOURITES', component: this.$routes.PageTwo, location:'internal' }
      ]
    }
  },
  mounted() {
    let authuser = ApplicationSettings.getString('authuser')
    console.log('before mount user data: ', authuser)
    let token = ApplicationSettings.getString('token')
    if (authuser && token) {
      let payload = JSON.parse(ApplicationSettings.getString('authuser'))
      console.log('mount payload', payload)
      this.$store.dispatch("setStoredUser", payload)
    }

    console.log('token', token)
    //let hunger = localStorage.getItem('hunger');
    //this.$store.dispatch("setHunger", hunger);
    //this.$store.dispatch("feed", hunger);
    //localStorage.setItem('username', 'Manish');
    //let username = localStorage.getItem('username');
    //this.$store.dispatch("setusername", username);

  },
  computed: {
    /*cathappiness() {
      return this.$store.getters.cathappiness;
    },
    username() {
      return this.$store.getters.username;
    },*/
    user () { return (this.$store.state.auth || {}).user || null },
  },
  methods: {
    goToPage (page) {
      if (page.location === 'internal') {
        this.$navigateTo(page.component)
      } else {
        utilsModule.openUrl(page.url)
      }
      // use the manual navigation method

      // and we probably want to close the drawer when changing pages
      this.closeDrawer()
    },
    login () {
      this.$navigateTo(this.$routes.LoginPage)
      this.closeDrawer()
    },
    logout() {
      this.$store.dispatch("resetUser")
      this.$navigateTo(this.$routes.Home)
      this.closeDrawer()
    },
    feedCat() {
      this.$store.dispatch("feed")
      console.log('test')
      localStorage.setItem('hunger', 28)
    }
  }
}
</script>

<style lang="css" scoped>
.drawer-item {
  margin:20px 0;
}
</style>
