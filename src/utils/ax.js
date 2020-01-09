import Vue from 'vue'
// 引入axios
import axios from 'axios'

// 公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求拦截器
axios.interceptors.request.use(function (config) {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 把axios通过原型继承的方式配置给Vue，使得组件内部可以直接访问
// 后期在组件内部就可以通过 this.$http 的方式获得axios对象
// $http:就是自定义名称，可以为其他
Vue.prototype.$http = axios
