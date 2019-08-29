<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row id="process-plan-form">
      <el-form :inline="true" :model="formInline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="加工计划单">
                <el-input v-model="formInline.processPlanCode" maxLength='20'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.ownerId" filterable clearable placeholder="请选择" v-loadmore="loadMoreOwnerList">
                <el-option
                  v-for="item in ownerArr.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="formInline.status" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in status"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getCreateStartTime" @getEndTime="getCreateEndTime"></DatePick>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="btn-box" style="text-align: right;">
              <el-button type="primary" class='blue' @click="searchList">查询</el-button>
              <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style='margin-top: -20px;'>
      <table-configure
        ref="tableConfig"
        :data-table="dataTable"
        :table-code="tableName"
        @onHandleSelectionChange="onHandleSelectionChange"
        @tableDataHandle="tableDataHandle"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
          <template slot-scope="props" slot="processPlanCode">
          <a @click="handleRoute(props.obj.row)"> {{ props.obj.row.processPlanCode }}</a>
        </template>
      </table-configure>
    </el-row>
    <!-- <el-row :gutter="16">
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="extendFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row> -->
  </el-card>
</template>

<script src="./js/inbound-process-plan.js"></script>
<style lang="scss">
#process-plan-form {
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
</style>
<style scoped lang="scss">
#top-form {
  .el-input{
    width: 100%;
  }
}
.form-input {
  width: 54%;
}
</style>
