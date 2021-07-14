## 表单绑定

~~~html
1. 表单头 ：model 绑定data（）中的loginForm
<el-form ref="form" class="login_form" :model="loginForm">
   

    data(){
        return{
            // 这是登录表单的数据绑定对象，默认为空
            loginForm:{
                username:'',
                password:''
            }
        }
    }

2. v-model 绑定 username 双向绑定
   <el-input v-model="loginForm.username"></el-input>
~~~
username 初始为空，与输入框双向绑定。 也就是说，无论输入框输入什么，data（）中username都对应的接受什么。

## 表单的前端校验
校验用户输入的用户名，或者密码是否合法。
主要分为三步来执行。
1. 在el-form 中绑定 `:rules='loginFormRules'`
2. 在script的data中，添加rules。
   ~~~java
            loginFormRules:{
                // 验证用户名是否合法
             username:[

             ],
                //  验证密码是否合法
             password:[

             ]
            }   
3. 在el-form-item中，指定校验 `prop="name"`

## 表单重置
1. 表单绑定ref引用
   `ref="loginFromRef"`
2. 为重置表单绑定单机事件，绑定 `resetLoginForm` 函数
3. 获取表单的实例对象，调用 resetField 函数重置表单
    ~~~html
        methods:{
        // 点击重置按钮，重置登录表单
        resetLoginForm(){
            // console.log(this);  $refs: {loginFromRef: VueComponent}
            // 调用表单绑定的ref引用，并调用重置方法
            this.$refs.loginFromRef.resetFields()
        }
    }
    ~~~

## 表单的预验证 validate
1. 为登录按钮绑定单击事件
2. 单击事件函数绑定表单的ref引用，调用validate函数，并在控制台打印回调函数。
3. ***一个小问题*** 预验证与表单前端校验的关系。
   表单前端校验只是校验提醒，不管合不合法都可以点击登录按钮。
   预验证是根据前端的校验结果返回一个布尔值。

## 用户登录，表单提交
1. main.js 增加依赖
   ~~~html
   import axios from 'axios'
    // import VueAxios from 'vue-axios'
    // Vue.use(VueAxios,axios)  不知道为啥， 加这一行运行就报错
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = axios
   ~~~

2. 请求函数
~~~html
        login(){
            this.$refs.loginFromRef.validate(
                async valid => {
                    // console.log(valid);
                    // 如果某个函数调用的结果打印后返回的是promise，
                    // 就马上用saync和await进行优化，async放到方法名称的前面，await放到方法里面
                    if (!valid) return;  // 前端判定是否合法
                    // const result =await this.$http.post("login",this.loginForm);  reslt 打印的值太多， 只取data即可
                    const {data:res} =await this.$http.post("login",this.loginForm);
                    console.log(res)  
                    
                }
            );
~~~

## 消息提示
全局挂载模式：
1. Vue.prototype.$http = axios
2. Vue.prototype.$message = Message

意思为在方法中直接调用$xx 就可以直接使用。
~~~
this.$message.error("登录失败");
this.$message.success("登录成功");
~~~

## 登录成功后的页面跳转以及token
  // 页面token存储
  window.sessionStorage.setItem("token","res.data.token");
  // 页面跳转
  this.$router.push("/home")

~~~html
Vue.use(Router)

// 创建router
const router = new Router({
  routes: [
    {path:'/',redirect:'login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home}
  ]
})


// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 函数，表示放行
  // next() 放行，  next('login') 强制跳转

  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem("token")
  if(!token) return next('/login')
  next()
})



// 暴露接口
export default router

~~~

## 退出
~~~java
清空token
window.sessionStorage.clear();
强制跳转
this.$router.push('/login');
~~~