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
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/date',
  name: 'date',
  component: Date
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
    { path: '/account', name: 'account', component: Account }
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
export default router
