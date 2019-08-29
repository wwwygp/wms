<template>
  <el-tabs v-model="activeName" type="card" id='process-tab' :before-leave='beforeChange'>
    <el-tab-pane label="入库加工计划单" name="first">
      <inbound-process-plan v-if="activeName == 'first'" @changeTab="changeTab"></inbound-process-plan>
    </el-tab-pane>
    <!-- <el-tab-pane label="入库加工计划单记录" name="second">
      <inbound-process-plan-log ref='inboundProcessPlanLog' v-if="activeName == 'second'" @changeTab="changeTab"></inbound-process-plan-log>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script src="./js/index.js"></script>
<style lang="scss">
#process-tab {
  .el-card__body{
    padding: 5px 20px 0px;
  }
}  
</style>
