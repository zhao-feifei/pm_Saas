<template>
  <!-- 弹层组件 -->
  <el-dialog :title="showTitles" :visible="showDialog" @close="btnCancel">
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item prop="name" label="部门名称">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          v-model="formData.introduce"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //部门名称的校验规则
    const checkNameRepeat = async (rule, value, callback) => {
        const { depts } = await getDepartments()
        const isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value)
        isRepeat
          ? callback(
              new Error(`同级部门下已经存在  ${value}  部门了，不能重复添加!`)
            )
          : callback()
      },
      //部门编码的校验规则
      checkCodeRepeat = async (rule, value, callback) => {
        const { depts } = await getDepartments()
        const isRepeat = depts.some(item => item.code == value && value)
        isRepeat
          ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
          : callback()
      }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空！', trigger: 'blur' },
          {
            min: 1,
            max: 50
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空！', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空！', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空！', trigger: 'blur' },
          {
            min: 1,
            max: 300
          }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitles() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    //确定按钮的方法
    btnOk() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            //编辑
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          // 校验通过，表示可以提交了
          // 调用新增接口 添加父部门的id
          this.$emit('addDepts')
          //修改showDialog的值
          this.$emit('update:showDialog', false)
          this.$message.success('添加成功！')
        }
      })
    },
    //取消按钮
    btnCancel() {
      //重置数据 因为resetFields只能重置表单上的数据  编辑中的id无法重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    //获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style></style>
