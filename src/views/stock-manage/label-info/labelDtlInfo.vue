<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品编码">
              <el-input v-model="formInline.commodityCode" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库单号">
            <el-input v-model="formInline.deliveNoticeId" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="波次号">
            <el-input v-model="formInline.waveCode" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="btn-box">
            <!--// 目前只配置了红黄蓝绿。-->
            <el-button type="primary" class='blue' @click="searchTabelList">查询</el-button>
            <el-button type="primary" class='blue' @click="reseltForm">重置</el-button>
            <el-button type="primary" class='blue' @click="backLabel">返回</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row style='margin-top: -10px;'>
        <table-configure
          v-if="heightResize"
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="tableName"
          @onRowClick="onRowClick"
          @onHandleSelectionChange="onHandleSelectionChange"
          @tableDataHandle="tableDataHandle"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        </table-configure>
      </el-row>
    </el-form>
  </el-card>
</template>

<script src="./js/labelDtlInfo.js">
</script>

<style lang="scss">
</style>
