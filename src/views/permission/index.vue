<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border>
        <el-table-column align="center" label="名称"></el-table-column>
        <el-table-column align="center" label="标识"></el-table-column>
        <el-table-column align="center" label="描述"></el-table-column>
        <el-table-column align="center" label="操作">
          <template>
            <el-button type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
