<template>
  <el-card style=" overflow: auto">
    <el-row id="top-form">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" id="route-mainte">
          <el-col :span="6">
            <el-form-item label="线路名称">
              <el-select v-model="formInline.routeCode" @focus="initDictionarylinename" placeholder="请选择" filterable clearable>
                <el-option v-for="item in mainteName" :key="item.routeId" :label="item.routeName" :value="item.routeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配送方式">
              <el-select v-model="formInline.deliveryTypeId" placeholder="请选择" clearable>
                <el-option v-for="item in deliveryWay" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输方式">
              <!--<el-select v-model="query.transportvalue" placeholder="请选择" filterable clearable>-->
              <!--<el-option-->
              <!--v-for="item in maintetransport"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="formInline.transportTypeId" placeholder="请选择" value-key="dictDtlName" filterable clearable>
                <el-option v-for="item in transportWay" :label="item.dictDtlName" :value="item.dictDtlValue" :key="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <!--<el-select v-model="query.statevalue" placeholder="请选择" filterable clearable>-->
              <!--<el-option-->
              <!--v-for="item in maintestate"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="formInline.status" placeholder="请选择" filterable clearable>
                <el-option v-for="item in dictDtlstatus" :label="item.dictDtlName" :value="item.dictDtlValue" :key="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="routeBtn">
        <div class="btn-box" style="text-align: right">
          <!--// 目前只配置了红黄蓝。-->
          <el-button v-db-click v-for="(v,index) in btnList" v-if="v.menuKey == 'WMS_ROUTE_SEARCH' || v.menuKey == 'WMS_ROUTE_INIT'" :class="v.className" :key="index" @click="callFn(v)" :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: -5px;">
      <table-configure v-if="heightResize" ref="tableConfig" :data-table="dataTable" :table-code="tableName" @onRowClick="onRowClick" @onHandleSelectionChange="onHandleSelectionChange" @tableDataHandle="tableDataHandle" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </table-configure>
    </el-row>
    <el-row>
      <el-col :span="24" class="routeBtn">
        <div class="btn-box" style="text-align: left">
          <!--// 目前只配置了红黄蓝。-->
          <el-button v-db-click v-for="(v,index) in btnList" v-if="v.menuKey == 'WMS_ROUTE_ADD' || v.menuKey == 'WMS_ROUTE_UPDATE' || v.menuKey == 'WMS_ROUTE_DEL'" :class="v.className" :key="index" @click="callFn(v)" :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="50%" custom-class="minWidth tableConfigDialog" :title="mainteTitle" append-to-body :close-on-click-modal="false" :before-close="handleClose">
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="resetForm"></tips-dialog>
      <el-form :model="addForm" ref="addForm" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="线路编码" prop="routeCode">
              <el-input v-model="addForm.routeCode" maxLength="20" :disabled="updateDisabled" @change="dataChange = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线路名称" prop="routeName">
              <el-input v-model="addForm.routeName" maxLength="20" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线路全称" prop="routeNames">
              <el-input v-model="addForm.routeNames" maxLength="20" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配送方式" prop="deliveryTypeId">
              <el-select v-model="addForm.deliveryTypeId" placeholder="请选择" filterable clearable>
                <el-option v-for="item in deliveryWay" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运送方式" prop="transportTypeId">
              <el-select v-model="addForm.transportTypeId" placeholder="请选择" filterable clearable>
                <el-option v-for="item in transportWay" :label="item.dictDtlName" :value="item.dictDtlValue" :key="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="addForm.status" placeholder="请选择" filterable clearable>
                <el-option v-for="item in dictDtlstatus" :label="item.dictDtlName" :value="item.dictDtlValue" :key="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input v-model="addForm.remark" class="inputWidth" maxLength="256"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('addForm')" class="blue" v-db-click>保 存</el-button>
        <el-button  class="blue" type="primary" @click="handleClose" v-db-click>取 消</el-button>
      </span>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow" @handleNoTip="cancelExit"></tips-dialog>
  </el-card>
</template>
<script src="./js/routemainte.js"></script>
<style scoped>
</style>
