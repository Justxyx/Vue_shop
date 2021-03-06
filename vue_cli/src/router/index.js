import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'

Vue.use(Router)

// 创建router
const router = new Router({
  routes: [
    { path: '/', redirect: 'login' },
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      redirect:'/welcome', 
      children: [
          {path:'/welcome',component:Welcome},
          {path:'/users',component:User}
            
            ] 
  },
  ],
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 函数，表示放行
  // next() 放行，  next('login') 强制跳转

  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

// 暴露接口
export default router
