<template>
  <el-card style="height: calc(100vh);overflow: auto">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" id="search-form">
        <el-row>
        <el-col :span="6">
          <el-form-item label="下架类型">
            <el-select v-model="formInline.takeDownTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in takeDownTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="储区类型">
            <el-select v-model="formInline.storageAreaTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in storageAreaTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业类型">
            <el-select v-model="formInline.operationTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in operationTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="成单范围">
            <el-select v-model="formInline.combineRangeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in combineRangeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="6">
          <el-form-item label="成单规则">
            <el-select v-model="formInline.combineRuleId" placeholder="请选择" clearable>
              <el-option
                v-for="item in combineRuleWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务类型">
            <el-select v-model="formInline.taskTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in taskTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">

          <div class="btn-box" style="text-align: center">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            <!--// 目前只配置了红黄蓝。-->
          </div>
        </el-col>
        </el-row>
      </el-form>

    <table-configure
      v-if="heightResize"
      ref="tableConfig"
      :data-table="dataTable"
      :table-code="dataTable.tableName"
      @onRowClick="onRowClick"
      @tableDataHandle="tableDataHandle"
      @onHandleSelectionChange="onHandleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
    </table-configure>
    <div class="btn-box" style="text-align: left;">
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
      :title="mainteTitle"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <tips-dialog :parent-data="isSaveShipmentsDialog" @handleOkTip="confirmCancel"></tips-dialog>
      <el-form :model="addForm" ref="addForm" :rules="rulesForm">
        <el-row :gutter="24">
          <!--<el-col :span="6">-->
            <!--<el-form-item label="仓库" prop="routeCode" >-->
              <!--<el-input v-model="addForm.warehouseId" maxLength="20"  :disabled="updateDisabled" @change="dataChange = true"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="下架类型"  prop="takeDownTypeId">
              <el-select v-model="addForm.takeDownTypeId" placeholder="请选择" :disabled="updateDisabled"  clearable>
                <el-option
                  v-for="item in takeDownTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区类型" prop="storageAreaTypeId">
              <el-select v-model="addForm.storageAreaTypeId" placeholder="请选择" :disabled="updateDisabled" clearable>
                <el-option
                  v-for="item in storageAreaTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业类型"  prop="operationTypeId">
              <el-select v-model="addForm.operationTypeId" placeholder="请选择" :disabled="updateDisabled" clearable>
                <el-option
                  v-for="item in operationTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="成单范围" prop="combineRangeId">
              <el-select v-model="addForm.combineRangeId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in combineRangeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务类型" prop="taskTypeId">
              <el-select v-model="addForm.taskTypeId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in taskTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成单规则" prop="combineRuleId">
              <el-select v-model="addForm.combineRuleId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in combineRuleWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="规则值" prop="ruleValue">
              <el-input v-model="addForm.ruleValue" maxLength="5" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input v-model="addForm.remark" maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('addForm')" class="blue" v-db-click>保 存</el-button>
        <el-button class="blue" type="primary" @click="resetForm" v-db-click>取 消</el-button>
      </span>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow" @handleNoTip="cancelExit">
    </tips-dialog>
  </el-card>
</template>

<script src="./js/shipment-configuration.js"></script>

<style>

</style>
