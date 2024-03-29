<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row>
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格区域 -->
            <el-table border="" :data="this.list">
              <el-table-column
                type="index"
                align="center"
                label="序号"
                width="120"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              >
              </el-table-column>
              <el-table-column align="center" prop="description" label="描述">
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height:60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="用户信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width:400px"
                  v-model="formData.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width:400px"
                  v-model="formData.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width:400px"
                  v-model="formData.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                  v-model="formData.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog
      title="编辑部门"
      :visible="showDialog"
      width="800px"
      @close="btnCancel"
    >
      <el-form
        ref="roleForm"
        label-width="90px"
        :model="roleForm"
        :rules="roles"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnCancel">取消</el-button>
          <el-button type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限的弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <el-tree
        ref="permTree"
        :props="defaultProps"
        :data="permData"
        :show-checkbox="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      ></el-tree>

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOk"
            >确定</el-button
          >
          <el-button type="primary" size="small" @click="btnPermCancel"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm
} from '@/api/seeting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formData: {
        //公司信息
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      //弹出层的表单验证规则
      roles: {
        name: [
          { required: true, message: '角色名称不能为空！', trigger: 'blur' }
        ]
      },
      showPermDialog: false,
      permData: [], //接收权限数据的树形结构
      defaultProps: {
        label: 'name'
      },
      roleId: null, //用来存储分配角色的 id
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    //获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    //页码点击事件
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    //删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('您确定要删除这个角色吗？')
        await deleteRole(id)
        //重新获取数据
        this.getRoleList()
        this.$message.success('删除角色成功!')
      } catch (error) {
        console.log(error)
      }
    },
    //编辑角色
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        //校验通过才会执行下面的代码
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功!')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      //记录下分配角色的id
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    //分配权限的确定点击事件
    async btnPermOk() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId
      })
      this.$message.success('分配权限成功!')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style></style>
