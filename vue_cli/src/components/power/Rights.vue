<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="日期" width="180"> </el-table-column>
        <el-table-column prop="path" label="路径" width="180"> </el-table-column>
        <el-table-column prop="level" label="权限等级" width="180">
          <template slot-scope="scope">
            <!-- {{scope.row.level}} -->
             <el-button type="primary" v-if="scope.row.level==0">一级</el-button>
             <el-button type="success" v-if="scope.row.level==1">二级</el-button>
             <el-button type="info" v-if="scope.row.level==2">三级</el-button>
          </template>
           </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      this.rightsList = res.data
      // console.log(res)
      if (res.meta.status != 200) return this.$message.console.error("请求失败");
    },
  },
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 20px;
}
</style>