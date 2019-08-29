<template>
  <el-card class="move-log" style="overflow: auto;height: 100%;">
    <el-row>
      <el-form :inline="true" :model="formInline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="移库单号">
            <el-input v-model="formInline.movePlanCode" class='' maxLength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in moveStatus"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发起人">
            <el-select v-model="formInline.createrId" placeholder="请选择" filterable clearable >
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
            <el-form-item label="发起时间">
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
        <template slot-scope="props" slot="remark">
          <a @click="readDtl(props.obj.row)">{{ props.obj.row.remark }}</a>
        </template>
      </table-configure>
    </el-row>
    <self-dialog
      :visible.sync="dialogCommodityVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :before-close="closeCommodityDialog"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <table-configure
        v-if="dialogCommodityVisible"
        ref="tableConfigDialog"
        :data-table="dataTableDialog"
        :table-code="tableNameDialog"
        @tableDataHandle="tableDataHandleDialog"
        @handleSizeChange="handleSizeChangeDialog"
        @handleCurrentChange="handleCurrentChangeDialog"
      >
      </table-configure>
    </self-dialog>
  </el-card>
</template>
<script src="./js/inbound-process-log.js"></script>
<style lang="scss">
.move-log {
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
}
.v-modal {
  z-index: 2000 !important;
}
</style>