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
                      @close="deleteRoleRights(scope.row, item2.id)"
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
            <el-button
              size="mini"
              type="info"
              icon="el-icon-star-off"
              @click="rolesDialogIsShow(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限弹出来的dialog对话框 -->
      <el-dialog title="权限分配" :visible.sync="dialogVisible" width="50%" @close="closeDialo">
        <!-- 树形结构框 -->
        <el-tree
          :data="rolesRightsList"
          :props="treeProps"
          :default-checked-keys="secondKeys"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" close>取 消</el-button>
          <el-button type="primary" @click="roleRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 点击分配权限弹出dailog框。
      dialogVisible: false,
      rolesRightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      secondKeys: [],
      // 所有选中权限的
      idStr:'',
      // 当前角色id
      id:''
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
    async deleteRoleRights(role, id) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => (erro) => erro)
      // console.log(confirm)

      if (confirm == 'erro') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      this.$message.success('已成功删除')
      role.children = res.data
    },

    // 获得所有的校色权限供树形框展开
    async rolesDialogIsShow(roles) {
      this.id = roles.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) return this.$message.error('请求失败')
      this.rolesRightsList = res.data
      // 递归获得三级节点的id
      this.getSecondKyes(roles, this.secondKeys)
      this.dialogVisible = true
    },
    // 通过递归，获得所有三级权限
    getSecondKyes(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((element) => {
        this.getSecondKyes(element, arr)
      })
    },
    // 关闭权限设置diolog，清空secondKeys数组权限
    closeDialo() {
      this.secondKeys = []
    },
    // 点击确定，确认分配该角色的权限
    async roleRights(){
      // 引用ref调用控件的自带方法

      const key = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      this.idStr = key.join(',')
      const id1 =  parseInt(this.id)
      const {data:res} = await this.$http.post('roles/'+ id1 +'/rights',{
        rids:this.idStr
      })
      console.log(res)
    }
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