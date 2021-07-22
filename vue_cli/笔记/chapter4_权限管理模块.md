## 备忘

### elmentUi 中，所有的属性 attributes，都是可以在引用的括号里直接加的
比如
```html
<el-tree
          :data="rolesRightsList"
          :props="treeProps"
          :default-checked-keys="secondKeys"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="treeRef"
```

### 所有的方法
都是通过`ref="treeRef"`ref来引用调用的。
`this.$refs.treeRef.getCheckedKeys()`

### 所有的event事件
都是通过 @ 来直接调用的


## 增加子模块详解

1. Home 页面是绑定了`router = 'true'`属性，通过子目录的 index 属性实现了跳转功能。
2. 创建 Rights，权限管理模块。
3. 在 router 路由 main.js 中注册路由跳转，注册为 home 组件的子路由.

## 给渲染一级权限的表格加下边框

## 删除用户权限

```html
const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`) role.children = res.data
````

把这两行代码粘上来。 第一行是看混合参数用\$发送
**_第二行的问题重点说一下。_**
本来删除完会重新 getRolesList（）请求一次的 ，但是会导致页面刷新下拉表格收起。所以前端在回传参数的时候直接回传 role 整个信息， 待删除完成后调用`role.children = res.data`更新局部信息，因为双向绑定，页面不会刷新。

## p87 dialog 树形框的生成

比较巧妙吧，跟列表生成有点类似。
`<el-tree :data="rolesRightsList" :props="treeProps"></el-tree>`

1.  data 绑定数据源， 这个跟列表有点不同的是，列表绑定的是一个 list 类型的数据源，而树形结构的展开框，绑定的是 tree 类型的数据源。
2.  :props="treeProps

```html
rolesRightsList:[], treeProps:{ label:'authName', children:'children' } ~~~
```

3. 树形框的优化问题
   node-key="id" 绑定 id
   default-expand-all 默认全部展开

## 给树形结构复选框加勾

这个有点复杂，具体可以回看。
