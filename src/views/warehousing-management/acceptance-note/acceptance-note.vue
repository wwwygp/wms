<template>
  <el-card style="height: calc(100vh); overflow: auto;">
    <el-row id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="验收单号">
                <el-input v-model="formInline.acceptanceNoteCode" class=''></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货单号">
                <el-input v-model="formInline.receiveNoteCode" class=''></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预到货单号">
                <el-input v-model="formInline.arrivalNoticeCode" class=''></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预到货单类型">
              <el-select v-model="formInline.arrivalNoticeTypeId" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in arrivalNoticeType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.proprietorId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable >
                <el-option
                  v-for="item in ownersArr.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-select v-model="formInline.supplierId" placeholder="请选择" v-loadmore="supplierMore" filterable clearable >
                <el-option
                  v-for="item in supplierArr.data"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
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
              <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <div class="btn-box" style="text-align: right;">
            <!--// 目前只配置了红黄蓝绿。-->
            <el-button
              v-db-click
              v-for="(v,index) in btnList"
              :class="v.className"
              :key="index" @click="callFn(v)"
              :type="filteType(v.className)"
              v-if="v.btn_code == '1'"
            >
              {{v.name}}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row style='margin-top: -20px;'>
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
    <el-tabs v-model="activeName" type="card" id='acceptance-tab'>
      <el-tab-pane label="验收单明细" name="first">
        <acceptance-detail ref='acceptanceDetail' v-show="activeName == 'first'" @initTable="initTable" @changeValue="changeValue"></acceptance-detail>
      </el-tab-pane>
      <el-tab-pane label="验收板明细" name="second">
        <acceptance-pallet ref='acceptancePallet' v-show="activeName == 'second'" @initTable="initTable" @changeValue="changeValue"></acceptance-pallet>
      </el-tab-pane>
      <!-- <el-tab-pane label="验收加工组板" name="third">
        <acceptance-process-pallet ref='acceptanceProcessPallet' v-show="activeName == 'third'" @initTable="initTable" @changeValue="changeValue"></acceptance-process-pallet>
      </el-tab-pane> -->
    </el-tabs>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
            v-if="v.btn_code == '2'"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script src="./js/acceptance-note.js"></script>
<style lang="scss">
#top-form {
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

  .el-form--inline .el-form-item{
    margin-right: 0px;
  }
}
#acceptance-tab {
  .el-tabs__header{
    margin-bottom: 0px !important;
  }
}
</style>
<style scoped lang="scss">
#top-form {
  .el-input{
    width: 100%;
  }
}
</style>
