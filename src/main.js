import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Component from '@/components'
import '@/icons' // icon
import '@/permission'
// import i18n from '@/lang'
import * as filters from '@/filters'
import * as directives from '@/directives'
import CheckPermission from '@/mixin/checkPermission'
Vue.use(Component) // 注册自己的插件
Vue.use(ElementUI, { locale })
// Vue.use(ElementUI, {
//   i18n: (key, value) => i18n.t(key, value)
// })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) //注册自定义过滤器
})
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
//全局混入检查对象
Vue.mixin(CheckPermission) //所有的组件都拥有这个方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  render: h => h(App)
})
