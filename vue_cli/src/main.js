// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表 
import './assets/css/global.css'
// 导入font小图标
import './assets/font/iconfont.css'
Vue.use(ElementUI)

// axios 配置
import axios from 'axios'
// import VueAxios from 'vue-axios'
// Vue.use(VueAxios,axios)  不知道为啥， 加这一行运行就报错
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//全局挂载
Vue.prototype.$http = axios


// 引入Message，全局挂载
// Vue.use(Message)
Vue.prototype.$message = Message

// 引用MessageBox 全局挂载，提示框
import { MessageBox } from 'element-ui';
Vue.prototype.$confirm = MessageBox.confirm

// 配置拦截器，为所有的请求添加Authorization头信息
axios.interceptors.request.use(config =>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})




Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
