<template>
  <el-card class="automatic-log">
    <el-row class="automatic-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="调度单号">
            <el-input v-model="formInline.noteCode" class='' maxLength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调度状态">
            <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in scheduleStatus"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调度人">
            <el-select v-model="formInline.userId" placeholder="请选择" filterable clearable >
              <el-option 
                v-for="item in staffs" 
                :key="item.ID" 
                :label="item.Full_Name" 
                :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="调度时间">
              <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-button  type="primary" class="blue" @click="searchList">查询</el-button>
          <el-button type="primary" class="blue"  @click="resetForm('formInline')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    </el-row>
    <el-row  style="margin-top: -20px;">
        <table-configure
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="dataTable.tableName"
          @tableDataHandle="tableDataHandle"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        </table-configure>
    </el-row>
  </el-card>
</template>
<script src="./js/scheduling-log.js"></script>

<style lang="scss">
.automatic-log {
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 80px !important;
  }
  .el-date-editor.el-input--suffix{
    .el-input__inner {
      padding-right: 0px;
      padding-left: 15px;
    }
    .el-input__prefix{
      left: 0px;
    }
    .el-input__icon{
      width: 15px;
    }
  }
  .el-card__body{
    padding-top: 5px;
    padding-right: 20px;
    padding-bottom: 0px;
    padding-left: 20px;
  }
}
</style>