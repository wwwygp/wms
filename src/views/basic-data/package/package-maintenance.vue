<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-col :span="5">
          <el-form-item label="商品编码">
            <el-input v-model="formInline.commodityCode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="formInline.createTimes"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编辑时间">
            <el-date-picker
              v-model="formInline.editTimes"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">-->
          <!--<el-form-item label="创建时间">-->
            <!--<DatePick ref="dateComponents1" :pickRange="true" @getStartTime="getCreateStartTime" @getEndTime="getCreateEndTime"></DatePick>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<el-form-item label="编辑时间">-->
            <!--<DatePick ref="dateComponents2" :pickRange="true" @getStartTime="getEditStartTime" @getEndTime="getEditEndTime"></DatePick>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="3">
          <el-button type="primary" class="blue" @click="searchPackage">查询</el-button>
          <el-button type="primary" class="blue" @click="resetPackage">重置</el-button>
        </el-col>
      </el-form>
    </el-row>
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
    <div class="btn-box">
      <!--<el-button type="primary" class="blue" @click="addPackage">新增</el-button>-->
      <!--// 目前只配置了红黄蓝绿。-->
      <el-button
        v-db-click
        v-for="(v,index) in btnList"
        :class="v.className"
        :key="index" @click="callFn(v)"
        :type="filteType(v.className)"
      >
        {{v.name}}
      </el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="packageTitle"
      append-to-body
      :close-on-click-modal="false"
      :before-close="checkBeforeExit"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="exitSave" @handleNoTip="cancelExit"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品编码" prop="commodityCode">
              <el-input class='inputWidth' v-model="form.commodityCode" maxLength="50" :disabled="dialogEditDisabled" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装数量" prop="packageAmount">
              <el-select  class='inputWidth' v-model="form.packageAmount" placeholder="请选择" clearable
                         :disabled="dialogEditDisabled" @change="autoSelectPackageUnit">
                <el-option
                  v-for="item in packageAmounts"
                  :key="item.packageType"
                  :label="item.packageAmount"
                  :value="item.packageAmount">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装单位" prop="packageUnitId">
              <el-select class='inputWidth' v-model="form.packageUnitId" placeholder="请选择" clearable disabled @change="dataChange = true">
                <el-option
                  v-for="item in packageUnits"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="包装规格" prop="packageSpec">
              <el-input class='inputWidth' v-model="form.packageSpec" maxLength="7" disabled @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量" prop="packageWeight">
              <el-input :placeholder="tips" class='inputWidth' v-model="form.packageWeight" maxLength="7" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上输送线标识" prop="conveyorPermitId">
              <el-select class='inputWidth' v-model="form.conveyorPermitId" placeholder="请选择" clearable @change="dataChange = true">
                <el-option
                  v-for="item in conveyorPermitList"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="长" prop="packageLength">
              <el-input  :placeholder="tips" class='inputWidth' v-model="form.packageLength" maxLength="7" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽" prop="packageWidth">
              <el-input  :placeholder="tips" v-model="form.packageWidth" maxLength="7" class="inputWidth" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高" prop="packageHeight">
              <el-input :placeholder="tips" v-model="form.packageHeight" maxLength="7" class="inputWidth" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8" class="case-floor-amount-label">
            <el-form-item label="标准栈板量（层箱数）" prop="standardCaseFloorAmount">
              <el-input :placeholder="tips" class='inputWidth' v-model="form.standardCaseFloorAmount" maxLength="10" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="floor-amount-label">
            <el-form-item label="标准栈板量（层数)" prop="standardFloorAmount">
              <el-input :placeholder="tips" class='inputWidth' v-model="form.standardFloorAmount" maxLength="10" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标准堆叠量" prop="standardPalletAmount">
              <el-input class='inputWidth' v-model="form.standardPalletAmount" maxLength="10":disabled="updateDisabled" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="floor-amount-label">
            <el-form-item label="是否ERP下发" prop="fromErp">
              <el-select v-model="form.fromErp" placeholder="请选择" clearable
                         disabled @change="dataChange = true">
                <el-option
                  v-for="item in fromErps"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" class="widthAll">
              <el-input  :placeholder="tips" v-model="form.remark" maxLength="50" class="inputWidth" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button  class="blue" type="primary" @click="checkBeforeExit" v-db-click>取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script src="./js/packageMaintenance.js">
</script>

<style lang="scss" scoped>

</style>
