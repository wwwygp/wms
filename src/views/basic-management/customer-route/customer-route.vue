<template>
  <el-card style=" overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row id="top-form">
        <el-col :span="8">
          <el-form-item label="线路名称">
            <el-select v-model="formInline.routeId" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in routeList"
                :key="item.routeId"
                :label="item.routeName"
                :value="item.routeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-select v-model="formInline.customerId" placeholder="请选择" v-loadmore="loadCustomerNames"
                       @focus="loadCustomerNames" filterable
                       clearable>
              <el-option
                v-for="item in customers"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button  type="primary" class="blue" @click="findBtn">查询</el-button>
          <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="10">
        <table-configure
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="dataTable.tableName"
          @onRowClick="radioClick"
          @tableDataHandle="tableDataHandle"
          @onHandleSelectionChange="onHandleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        </table-configure>
      </el-col>
      <el-col :span="14">
        <table-configure
          v-if="heightResize"
          ref="dataTableConfig"
          :data-table="dataTableDetail"
          :table-code="dataTableDetail.tableName"
          @onRowClick="onRowClick"
          @tableDataHandle="dataTableDetailDataHandle"
          @onHandleSelectionChange="onHandleDtlSelectionChange"
        >
        </table-configure>
      </el-col>
    </el-row>
    <div class="btn-box">
      <el-button
        v-db-click
        v-for="(v,index) in btnList"
        :class="v.className"
        :key="index" @click="callFn(v)"
        :type="filteType(v.className)">
        {{v.name}}
      </el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="tmpRouteTitle"
      append-to-body
      :close-on-click-modal="false"
      :before-close="resetForm"
    >
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')" ></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
          <el-row>
          <el-col :span="8" >
            <el-form-item label="线路名称" prop="routeId">
              <el-select v-model="form.routeId" placeholder="请选择" filterable clearable @click="getRouteList">
                <el-option
                  v-for="item in insRouteList"
                  :key="item.routeId"
                  :label="item.routeName"
                  :value="item.routeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="客户名称" prop="customerId">
            <el-select v-model="form.customerId" placeholder="请选择" v-loadmore="loadInCustomerNames"
                       @focus="loadInCustomerNames" filterable
                       clearable>
              <el-option
                v-for="item in inCustomers"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线路客户类型" prop="typeId">
            <el-select v-model="form.typeId" filterable placeholder="请选择" clearable  >
              <el-option
                v-for="item in selectCustomerRouteType"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" >
            <el-form-item label="路顺" prop="sort">
              <el-input v-model="form.sort" class="inputWidth" maxLength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="距离" prop="distance">
              <el-input v-model="form.distance" class="inputWidth" maxLength="9"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="类型值">
            <el-select v-model="form.typeValue" filterable placeholder="请选择" clearable  >
              <el-option
                v-for="item in selectCustomerRouteTypeValue"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" >
            <el-form-item label="费用" prop="expense">
              <el-input v-model="form.expense" class="inputWidth" maxLength="9"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="收费站" prop="tollbooths">
              <el-input v-model="form.tollbooths" maxLength="200" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="限速" prop="speedLimit">
              <el-input v-model="form.speedLimit" class="inputWidth" maxLength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="16" >
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"  maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button  class="blue" type="primary" @click="resetForm" v-db-click>取 消</el-button>
      </span>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
  </el-card>
</template>
<script src="./js/customer-route.js"></script>

