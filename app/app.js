import Vue from "nativescript-vue";
import routes from '~/router'
import store from '~/store'
import sideDrawer from '~/components/sideDrawer'
import drawerContent from '~/components/drawerContent'
import RadListView from 'nativescript-ui-listview/vue';

Vue.config.silent = (TNS_ENV === 'production')
//Vue.config.silent = true;
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
Vue.registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);
Vue.registerElement('SwipeLayout', () => require('nativescript-swipe-layout').SwipeLayout);
Vue.registerElement(
  'Fab',
  () => require('nativescript-floatingactionbutton').Fab
);
Vue.use(RadListView)
Vue.prototype.$routes = routes

new Vue({
  store,
  render (h) {
    return h(
      sideDrawer,
      [
        h(drawerContent, { slot: 'drawerContent' }),
        h(routes.Home, { slot: 'mainContent' })
      ]
    )
  }
}).$start()
