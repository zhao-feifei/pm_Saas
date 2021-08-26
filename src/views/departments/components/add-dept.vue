<template>
  <!-- 弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <el-form :model="formData" :rules="rules" label-width="120px">
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
        />
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
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
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
      }
    }
  }
}
</script>

<style></style>
