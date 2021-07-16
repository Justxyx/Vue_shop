## 增加子模块详解

1. Home 页面是绑定了`router = 'true'`属性，通过子目录的 index 属性实现了跳转功能。
2. 创建 Rights，权限管理模块。
3. 在 router 路由 main.js 中注册路由跳转，注册为 home 组件的子路由.

## 给渲染一级权限的表格加下边框

## 删除用户权限

```html
const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`) role.children = res.data
```

把这两行代码粘上来。 第一行是看混合参数用\$发送
**_第二行的问题重点说一下。_**
本来删除完会重新 getRolesList（）请求一次的 ，但是会导致页面刷新下拉表格收起。所以前端在回传参数的时候直接回传 role 整个信息， 待删除完成后调用`role.children = res.data`更新局部信息，因为双向绑定，页面不会刷新。
