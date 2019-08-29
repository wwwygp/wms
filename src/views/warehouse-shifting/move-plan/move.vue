<template>
  <el-tabs v-model="activeName" type="card" id='move-tab' :before-leave='beforeChange'>
    <el-tab-pane label="移库计划单" name="first">
      <move-plan v-if="activeName == 'first'" @changeTab="changeTab"></move-plan>
    </el-tab-pane>
    <el-tab-pane label="移库发起记录" name="second">
      <move-plan-log ref='moveStart' v-if="activeName == 'second'" @changeTab="changeTab"></move-plan-log>
    </el-tab-pane>
  </el-tabs>
</template>

<script src="./js/move.js"></script>
<style lang="scss">
#move-tab {
  .el-card__body{
    padding: 5px 20px 0px;
  }
}  
</style>
