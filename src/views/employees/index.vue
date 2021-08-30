<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条数据记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border v-loading="loading" :data="list">
          <el-table-column
            label="序号"
            sortable=""
            type="index"
            align="center"
          />
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
            align="center"
          />
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
            align="center"
          />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
            align="center"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
            align="center"
          />
          <el-table-column
            label="入职时间"
            sortable
            prop="timeOfEntry"
            align="center"
          >
            <template slot-scope="obj">
              <!-- 时间格式化 -->
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
            align="center"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" /> </template
          ></el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <AddEmployee :showDialog="showDialog"></AddEmployee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //引入员工枚举对象
import AddEmployee from './components/add-employee'
export default {
  data() {
    return {
      list: [], //接收数组
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, //显示遮罩层
      showDialog: false
    }
  },
  components: {
    AddEmployee
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    //页码切换事件
    changePage(newpage) {
      this.page.page = newpage
      this.getEmployeeList()
      console.log('1111')
    },
    //格式化聘用形式
    // formatEmployment(row, column, cellValue, index) {
    //   return cellValue === 1 ? '正式' : '非正式'
    // }
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    //删除员工的方法
    async delEmployee(id) {
      try {
        await this.$confirm('确定要删除此员工吗？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功!')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
