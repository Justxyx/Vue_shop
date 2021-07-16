<template>
  <el-container class="home-container">

    <!-- 顶部状态栏 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>

    <!-- 侧边栏与主体内容部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'" >
        <div class="toggle-butoon" @click="toggleCollapse">\\\</div>
        <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" unique-opened 
      :collapse="isCollapse" :collapse-transition="false" 
      router :default-active='activePath'>
      
        <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" >
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i :class="icon_list[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
         <el-menu-item :index="ite.path+''" v-for="ite in item.children" :key="ite.id" @click="activePath1(ite.path+'')">
          <i class="el-icon-location"></i>
          <span>{{ite.authName}}</span>
         </el-menu-item>
      </el-submenu>
    </el-menu>
        
        
      </el-aside>
      <el-main>
        <!-- router作为占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期，现在暂时可以理解为一进入这个界面就开始执行这个函数
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data(){
    return{
      // 左侧菜单栏数据
      menulist:[],
      // 左侧菜单栏图标
      icon_list:{
        '125':'el-icon-thumb',
        '103':'el-icon-cpu',
        '101':'el-icon-link',
        '102':'el-icon-open',
        '145':'el-icon-female',
      },
      //左侧菜单栏是否折叠
      isCollapse : false,
      // 被激活的链接地址
      activePath : ''  
    }

  },

  methods: {
    // 退出按钮，清除  
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获得所有菜单
    async getMenuList(){
      const {data:res} =await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    // 点击菜单折叠按钮，展开与折叠
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 存储当前index跳转路径,
    activePath1(path){
      window.sessionStorage.setItem("activePath",path)  // 存储
      this.activePath = path
    }
  },
}
</script>

<style scoped lang="less">
.home-container{
  height: 100%;
}
.el-header{
  background-color: rgb(36, 37, 39);
  display: flex;   /*弹性布局*/
  justify-content: space-between;   /* 分居两侧*/
  padding-left: 0;  /*logo向左对齐*/
  align-items: center; /* 退出按钮居中对齐*/
  /* 设置字体颜色 */
  color: aliceblue;
  font-size: 20px;
  >div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: rgb(22, 22, 22);
}
.el-main{
  background-color: rgb(243, 248, 248);
}
.toggle-butoon{
  background-color: rgb(14, 10, 10);
  font-size: 10px;
  line-height: 24px;
  color: bisque;
  text-align: center;
  letter-spacing: 0.2em;  // 调整文字间距
  cursor: pointer;   // 变成小手
}

</style>