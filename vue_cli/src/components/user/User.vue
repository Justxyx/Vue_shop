<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="4">
        <el-col :span="8">
          <!-- 搜索输入框 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userlist" stripe border class="userTable">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="eduiteUser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUer(scope.row.id)"
            ></el-button>
            <!-- 权限分配按钮 -->
            <el-tooltip effect="dark" content="分配角色权限" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-share" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleSizeChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 弹出对话框增加用户 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="addUsersFormClose">
        <!-- 这是中间的表格区域 -->
        <el-form
          :model="addUsersForm"
          :rules="addUsersRules"
          ref="addUsersFormRef"
          label-width="100px"
        >
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addUsersForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUsersForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUsersForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUsersForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 弹出修改对话框修改用户 -->
      <el-dialog
        title="修改"
        :visible.sync="eduitUserFormDialog"
        width="30%"
        @close="eduitUserDialogClose"
      >
        <!-- 修改用户的表格 -->
        <el-form
          :model="eduiteUserForm"
          :rules="eduiteUserRules"
          ref="eduiteUserFormRef"
          label-width="100px"
        >
          <el-form-item label="姓名">
            <el-input v-model="eduiteUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="eduiteUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="eduiteUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="eduitUserFormDialog = false">取 消</el-button>
          <el-button type="primary" @click="putEduiteUser()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      eduitUserFormDialog: false,
      // 新增用户表单验证规则
      addUsersRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
        ],
      },
      // 新增用户的数据存储
      addUsersForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 编辑用户，根据用户id查询到的所有用户信息
      eduiteUserForm: {},
      // 修改用户的验证规则
      eduiteUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.erro('请求失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听每页显示多少条数据
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听当前的页码数
    handleCurrentChange(currentPage) {
      console.log(currentPage)
      this.queryInfo.pagenum = currentPage
      this.getUserList()
    },
    // 用户状态的变化监听
    async userChange(change) {
      const { data: res } = await this.$http.put(`users/${change.id}/state/${change.mg_state}`)
      console.log(res)
      if (res.meta.status != 200) {
        change.mg_state = !change.mg_state
        return this.$message.error('更新用户状态失败')
      }
      return this.$message.success('用户状态更新成功')
    },
    //监听用户添加栏关闭,重置
    addUsersFormClose() {
      this.$refs.addUsersFormRef.resetFields()
    },
    // 新增用户
    addUser() {
      this.$refs.addUsersFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return // 判定不合法
        const { data: res } = await this.$http.post('users', this.addUsersForm)
        console.log(res)
        if (res.meta.status != 201) this.$message.error('插入失败')
        this.$message.success('插入成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户
    async eduiteUser(id) {
      this.eduitUserFormDialog = true
      // 根据id查询到该用户的所有信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) return
      this.eduiteUserForm = res.data
    },
    // 修改用户关闭对话框，重置
    eduitUserDialogClose() {
      this.$refs.eduiteUserFormRef.resetFields()
    },
    // 修改用户2
    putEduiteUser() {
      this.$refs.eduiteUserFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.eduiteUserForm.id, {
          email: this.eduiteUserForm.email,
          mobile: this.eduiteUserForm.mobile,
        })
        if (res.meta.status != 200) return this.$message.error('更新失败')

        // 关闭对话框
        this.eduitUserFormDialog = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新成功')
      })
    },
    // 根据id删除用户
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
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.userTable {
  margin-top: 20px;
}
</style>