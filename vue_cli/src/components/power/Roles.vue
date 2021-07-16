<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索按钮区域 -->
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-table :data="rolesList" style="width: 100%">
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <pre> {{scope.row}} </pre> -->
            <el-row v-for="items in scope.row.children" :key="items.id">
              <!-- 渲染一级权限  -->
              <el-col :span="5" class="bdtop">
                <el-button type="primary" class="vcenter">{{ items.authName }}</el-button
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19" class="bdtop">
                <el-row v-for="item1 in items.children" :key="item1.id">
                  <el-col :span="8"
                    ><el-button type="success" class="vcenter">{{
                      item1.authName
                    }}</el-button></el-col
                  >
                  <el-col :span="5" class="bdtop">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      type="tage.type"
                      class="vcenter"
                      :closable="true"
                      @close="deleteRoleRights(scope.row,item2.id)"
                    >
                      {{ item2.authName }}

                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="200"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 操作区，要用到插槽  -->
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="success" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="info" icon="el-icon-star-off">分配权限</el-button>
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
      rolesList: [],
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) return this.$message.error('查询所有角色失败')
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 点击xx删除tag标签
    async deleteRoleRights(role,id) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => (erro) => erro)
      // console.log(confirm)

      if (confirm == 'erro') return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      this.$message.success('已成功删除')
      role.children = res.data
    },
  },
}
</script>




<style lang="less" scoped>
.el-row {
  margin-top: 20px;
}
.el-card {
  margin-top: 20px;
}

.bdtop {
  border-bottom: 1px solid rgb(66, 64, 64);
}
// 纵向上的居中对齐
.vcenter {
  display: flex;
  align-items: center;
}
</style> 