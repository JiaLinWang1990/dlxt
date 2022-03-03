// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.css'
import 'echarts'
import 'echarts-gl'
import $ from '@/util/js/jquery.min.js'
Vue.config.productionTip = false
import less from 'less'
Vue.use(less)
Vue.use(VueRouter)
Vue.use(ElementUI);
window.router = router
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
