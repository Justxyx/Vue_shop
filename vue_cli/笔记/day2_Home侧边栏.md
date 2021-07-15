VueJS绑定缩写：可省略v-on、v-bind
~~~html
<!-- 完整语法 -->
<a v-bind:href="url"></a>
<!-- 缩写 -->
<a :href="url"></a>

<!-- 完整语法 -->
<a v-on:click="doSomething"></a>
<!-- 缩写 -->
<a @click="doSomething"></a>

~~~


## 授权token
除了登录界面外，其他的所有界面都必须在请求头中使用 `Authorization` 字段提供 `token` 令牌。
~~~html
// 配置拦截器，为所有的请求添加Authorization头信息
axios.interceptors.request.use(config =>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
~~~

## 获取所有左侧菜单栏的数据
1. 定义一个生命周期函数
~~~java
  // 生命周期，现在暂时可以理解为一进入这个界面就开始执行这个函数
  created(){
    this.getMenuList()
  },
~~~
2. getMenuList 函数详解
~~~html
    async getMenuList(){
      const {data:res} =await this.$http.get('menus')
      console.log(res)
    }
~~~

3. 在data区定义menulist 空数组，并通过 this.menulist = res.data 绑定数据。

4. el-submenu v-for 一二级菜单分别循环。

***这里重点说一下 v-for 循环的几个细节***
1. 一级菜单循环后，点开一个，所有的都展开
   原因： 没有动态的绑定index值。

2. 出现 `Invalid prop: custom validator check failed for prop "index".`报错原因
   绑定index 为数字，要转为字符串类型。


## 左侧菜单的图标问题
1. 二级菜单的固定图标好说，一级菜单的动态图标如何选择 ？
略
2. 两个优化为题
如何只能同时展开一个餐单栏？
unique-opened 函数。

## 开启侧边栏的路由跳转模式  router
启用该模式会在激活导航时以 index 作为 path 进行路由跳转
不用为每一个侧边栏单独绑定跳转路由 大大的节省了开发时间
不过前后端沟通 接口的预留就显得很重要了

1. 为侧边栏 el-menu 绑定 router = 'true'属性
2. 二级菜单的index 属性改为 :index="ite.path+''" 以path为路径跳转