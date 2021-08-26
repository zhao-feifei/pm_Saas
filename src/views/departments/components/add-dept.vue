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
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {}
    }
  }
}
</script>

<style></style>
