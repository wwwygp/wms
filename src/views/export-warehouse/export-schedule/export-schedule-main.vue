<template>
  <el-card style="height: calc(100vh); overflow: auto;" id='export-schedule' >
    <el-tabs v-model="activeName" type="card" :before-leave='beforeChange'>
      <el-tab-pane label="普通调度" name="first">
        <export-scheduling ref='scheduling' v-if="activeName == 'first'" @changeTab="changeTab"></export-scheduling>
      </el-tab-pane>
      <el-tab-pane label="调度记录信息" name="second">
        <schedul-log ref='schedulingLog' v-if="activeName == 'second'" @changeTab="changeTab"></schedul-log>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script src="./js/export-schedule-main.js"></script>
<style lang="scss">
#export-schedule {
  .el-card__body{
    padding: 0px;
  }
}  
</style>
