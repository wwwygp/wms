<template>
  <el-tabs v-model="activeName" type="card" id='scheduling-tab' :before-leave='beforeChange'>
    <el-tab-pane label="自动调度" name="first">
      <scheduling-automatic ref='schedulingAutomatic' v-if="activeName == 'first'" @changeTab="changeTab"></scheduling-automatic>
    </el-tab-pane>
    <!--<el-tab-pane label="指定储位调度" name="second">
      <scheduling-appoint ref='schedulingAppoint' v-if="activeName == 'second'"></scheduling-appoint>
    </el-tab-pane>-->
    <el-tab-pane label="调度记录查询" name="third">
      <scheduling-log ref='schedulingLog' v-if="activeName == 'third'" @changeTab="changeTab"></scheduling-log>
    </el-tab-pane>
  </el-tabs>
</template>

<script src="./js/shelf-scheduling.js"></script>
<style lang="scss">
#scheduling-tab {
  .el-card__body{
    padding: 5px 20px 0px;
  }
}  
</style>
