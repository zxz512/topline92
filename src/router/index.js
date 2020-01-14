import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Article from '@/views/article'
import Articleadd from '@/views/articleadd'
import Articleedit from '@/views/articleedit'
import Account from '@/views/account'
import Date from '@/views/date'
import Photo from '@/views/photo'
import Material from '@/views/material'
import Fans from '@/views/fans'
// 导入加载进度条nprogress相关模块
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: Login
},

{ path: '/home',
  name: 'home',
  component: Home,
  redirect: '/welcome', // 路由重定向
  children: [
  // 欢迎页面子路由配置
    { path: '/welcome', name: 'welcome', component: Welcome },
    { path: '/article', name: 'article', component: Article },
    { path: '/articleadd', name: 'articleadd', component: Articleadd },
    // 修改文章，路由地址要传递参数，体现出被修改文章id，名称为aid
    { path: '/articleedit/:aid', name: 'articleedit', component: Articleedit },
    // 账户管理
    { path: '/account', name: 'account', component: Account },
    // 素材管理
    { path: '/material', name: 'material', component: Material },
    { path: '/photo', name: 'photo', component: Photo },
    { path: '/date', name: 'date', component: Date },
    // 粉丝统计
    { path: '/fans', name: 'fans', component: Fans }
  ]
},
{
  path: '/articleadd',
  name: 'articleadd',
  component: Articleadd
}

]

const router = new VueRouter({
  routes
})
// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // inc()  set(0.5)  显示进度条
  // 获得用户登录状态信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登录状态：userinfo是大字符串， 非登录状态，userinfo是null
  if (!userinfo && to.path !== '/login') {
    // 强制登录
    return next('/login')
  }

  // 放行
  next()
})
// 配置"全局后置路由"守卫
// 路由执行完毕，组件显示好了，该路由会执行"收尾"工作
router.afterEach((to, from) => {
  // 进度条完成
  NProgress.done()
})
export default router
