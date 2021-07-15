## 组件的创建

这个地方重复了很多次了, 我觉得可以略掉.
两个地方重点强调

1. home 组件中的路由占位符
2. User 组件作为 home 组件的 children 组件

## 激活当前菜单, default-active 高亮效果的保持

感觉这个有点绕来绕去的, 还专门去百度了一下.
其实，即使不加这个属性，也能正常显示选中的 item 变亮，但是之所以要加这个属性，是为了浏览器刷新后，仍然可以定位到之前选中的路由。

1. 将二级菜单绑定单击事件 @click="activePath1(ite.path+'')"
   目的是将 path 回传在 data 里, 以及保存在 window.sessionStorage 中.
2. 存储

```java
    window.sessionStorage.setItem("activePath",path)  // 存储
    this.activePath = path
```

3. 在生命周期函数中启用
   `this.activePath = window.sessionStorage.getItem('activePath')`

   这一步是关键.

## 用户数据渲染到页面

套路都差不多了其实

1. axios 请求，返回一个 data
2. 在 data 区域内申请几个空白区域，对应存放 data
3. this.xx = res.data.id
   \*\*\*vue 与 element 结合渲染 table 表格超级简单，可以看看官网。

## 作用域插槽

这个语法不太懂，只能先贴上来了

```html
<el-table-column label="状态" prop="mg_state">
  <template slot-scope="scope">
    //{{scope.row.mg_state}} 拿到当前这一行的所有数据
    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
    </el-switch>
  </template>
</el-table-column>
```

scope.row 拿到当前这一行的所有数据，牛批。

## 分页条

在分页条这里，突然觉得 vue + element 太香了。

1. 分页条 **handleSizeChange** 与 **handleCurrentChange** 实时向后传递当前页码，methods 接受到参数变化，与 data（）中的数据互相绑定。
2. 调用 getUserList()，重新渲染页面。

## 用户状态更新

1. @change="userChange(scope.row) 向后传递该行的所有信息
2. userChange 方法接收到信息后， 调用后端接口。

## 搜索框的查询与清空

慢慢的理解了 vue 框架设计的巧妙之处。

1. input 搜索框，用户输入内容 v-model 与 data 数据中的 query 双向绑定。
2. button 按钮，绑定单击事件搜索，重新调用 getUserList 函数
3. getUserList 函数，返回符合条件的 userlist，表格根据 userlist 重新渲染页面
4. 点击 x，清空输入框。clearable。 同时绑定点击事件，@clear="getUserList"。

## 添加用户的表单规则

`<el-form :model="addUsersForm" :rules="addUsersRules" ref="addUsersFormRef">`

1. 容易混淆的几个点
   v-bind:model="" 也就是：model 跟 v-model="" 有什么区别 ？

   - v-model="" 只对表单控件有用，实现双向绑定。
   - :model 相当于 v-bind:model 的缩写， 取值。

2. 过程：
   表单验证与重置这里就不再说了。 重点说一下:model="addUsersForm"这个绑定。很奇怪这个绑定的意义到底是什么，个人猜测是跟重置表单与最后的表单验证提交有关系。

3. 一点笔记，elementUI
   所有的组件的事件（event）都可以通过@事件，在组件头调用，类似@close="addUsersFormClose"。

对表单提交的一个小总结： 每个表单都有一个 ref 属性，通过该属性调用 validate 方法， `this.$refs.loginFromRef.validate` valid 回调函数，判断 valid 值，是否发起网络请求。
**_表单的调用方法好像都是通过 this.\$refs.loginFromRef 调用的_**

## 删除用户，并弹出提示框

1. 引入

```java
   // 引用MessageBox 全局挂载，提示框
    import { MessageBox } from 'element-ui';
    Vue.prototype.$confirm = MessageBox.confirm
```

2. 绑定 deleteUer 函数

```java
    async deleteUer(id) {
      const confirm=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err=>err)
      // console.log(confirm)
      // 根据弹框提示，点击确认会提示confirm字符串，点击取消会报错。使用.catch(err=>err)捕捉。
      if(confirm == 'cancel') return this.$message.info("您已取消删除")

      const {data:res} =await this.$http.delete('users/'+id)
      console.log(res)
      if (res.meta.status != 200) return this.$message.erro("删除失败")
      this.$message.success("删除成功")
      this.getUserList()
    },
```
