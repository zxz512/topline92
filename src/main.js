import Vue from 'vue'
import App from './App.vue'
import router from './router'
// eslint要求import系列代码都要在普通代码上边设置
// 引入elementui组件库
import ElementUI from 'element-ui'
// 引入css样式
import 'element-ui/lib/theme-chalk/index.css'
// 把组件库注册给Vue
// 之前组件注册：Vue.component(名称,组件) 每次只能注册一个
// 现在组件注册: Vue.use(组件模块) 一次性注册"全部"的组件，非常高效
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
