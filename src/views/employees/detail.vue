<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item label="用户名">
                <el-input placeholder="" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  placeholder=""
                  style="width:300px"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary">更新</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情"></el-tab-pane>
          <el-tab-pane label="岗位信息"></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
