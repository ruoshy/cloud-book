// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios';
import VueClipboard from 'vue-clipboard2'

axios.defaults.baseURL = 'http://localhost:7300';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(VueClipboard);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});

import Router from 'vue-router'

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
};
