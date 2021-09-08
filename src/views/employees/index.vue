<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条数据记录</span>
        </template>
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData()"
            >导出</el-button
          >
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
          <el-table-column label="头像" align="center">
            <!-- 插槽 -->
            <template v-slot="{ row }">
              <img
                :src="row.staffPhoto"
                @click="showQrCode(row.staffPhoto)"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              />
            </template>
          </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)"
                >角色</el-button
              >
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
    <AddEmployee :showDialog.sync="showDialog"></AddEmployee>
    <!-- 二维码的弹层 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @close="imgUrl = ''"
      width="300px"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色弹层组件 -->
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
    <!-- <AssignRole
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    ></AssignRole> -->
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //引入员工枚举对象
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role'
// import {formatDate} from ''
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
      showDialog: false,
      showCodeDialog: false, //控制二维码的弹层显示与隐藏
      showRoleDialog: false, //显示分配角色弹层
      userId: null //
    }
  },
  components: {
    AddEmployee,
    AssignRole
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
    },
    // 导出excel数据
    exportData() {
      //  做操作
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows)

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    // formatDate(numb, format) {
    //   const time = new Date((numb - 1) * 24 * 3600000 + 1)
    //   time.setYear(time.getFullYear() - 70)
    //   const year = time.getFullYear() + ''
    //   const month = time.getMonth() + 1 + ''
    //   const date = time.getDate() - 1 + ''
    //   if (format && format.length === 1) {
    //     return year + format + month + format + date
    //   }
    //   return (
    //     year +
    //     (month < 10 ? '0' + month : month) +
    //     (date < 10 ? '0' + date : date)
    //   )
    // }
    //点击头像显示二维码的函数
    showQrCode(url) {
      // url存在的情况下 才弹出层
      // console.log('我是if条件外面的url：', url)
      if (url) {
        // console.log('1111')
        // console.log('我是if条件里面的url：', url)
        this.showCodeDialog = true // 数据更新了 但是弹层不会立刻出现  页面的渲染是异步的！！！！
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    //角色 的点击函数
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id) //调用子组件的方法
      this.showRoleDialog = true
    }
  }
}
</script>

<style></style>
