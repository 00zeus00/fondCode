import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from './lang' // internationalization
import './assets/css/global.css'
import '@/styles/index.scss' // global css

// 引入iconfonts
import '@/assets/home-icon/iconfont.css'
import '@/assets/home-icon/iconfont.js'
import '@/assets/home2-icon/iconfont.css'
import '@/assets/home2-icon/iconfont.js'
// 引入echarts
// import echarts from 'echarts'
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts
// 引入特殊字体
// import '@/assets/font/font.css'
// 引入cookie
// import Cookies from 'js-cookie'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 多语言版本
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

Vue.prototype.msgSuccess = function(msg) {
  this.$message({
    message: msg,
    type: 'success',
    duration: 2000,
    center: true
  })
}
Vue.prototype.msgError = function(msg) {
  this.$message({
    message: msg,
    type: 'error',
    duration: 2000,
    center: true
  })
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
