<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-row :gutter="16" id="top-form">
        <el-col :span="6">
          <el-form-item label="委托业主名称">
            <el-select v-model="searchForm.ownerId" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable>
              <el-option
                v-for="item in ownersPageDate.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户名称">
            <el-select v-model="searchForm.customerId" placeholder="请选择" @focus="getCustomerList(false)" filterable clearable>
              <el-option
                v-for="item in customers"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户类型">
            <el-select v-model="searchForm.customerType" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in customerTypes"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in customerStatuses"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-button type="primary" class="blue" @click="searchList">查询</el-button>
          <el-button type="primary" class="blue" @click="resetSearchForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

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
      :visible.sync="editDialog.dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="editDialog.title"
      :close-on-click-modal="false"
      :before-close="resetForm"
    >
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编码" prop="customerCode">
              <el-input v-model="form.customerCode" class="inputWidth" maxLength="50" :disabled="isEdit"@change="customerChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="委托业主名称" prop="ownerId">
              <el-select v-model="form.ownerId" placeholder="请选择" v-loadmore="loadMoreAddOwnerList"
                         filterable clearable :disabled="isEdit" @clear="onClearOwner" @change="ownerChange">
                <el-option
                  v-for="item in ownersAddPageDate.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="label-width">
            <el-form-item label="委托业主客户编码" prop="ownerCustomerCode" >
              <el-input v-model="form.ownerCustomerCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户简称">
              <el-input v-model="form.customerShortName" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="form.customerType" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in customerTypes"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户标识" prop="customerMarkId">
              <el-select v-model="form.customerMarkId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in customerMarks"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出货方式" prop="exportTypeId">
              <el-select v-model="form.exportTypeId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in exportTypes"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8"  class="label-width-select">
            <el-form-item label="是否物流箱发货" prop="hasCirculationBox">
              <el-select v-model="form.hasCirculationBox" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in hasCirculationBoxs"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户地址">
              <el-input v-model="form.address" class="inputWidth" maxLength="100" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户邮编">
              <el-input v-model="form.postCode" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送货地址">
              <el-input v-model="form.sendAddress" class="inputWidth" maxLength="100" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话">
              <el-input v-model="form.telephone" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传真">
              <el-input v-model="form.fax" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人">
              <el-input v-model="form.concatPerson" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="收货时间段">
              <el-time-select
                placeholder="起始时间"
                v-model="form.receiveTimeStart"
                :picker-options="{start: '00:00',step: '00:10',end: '24:00'}">
              </el-time-select>
              <span>~</span>
              <el-time-select
                placeholder="结束时间"
                v-model="form.receiveTimeEnd"
                :picker-options="{start: '00:00',step: '00:10',end: '24:00',minTime: form.receiveTimeStart}">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否ERP下发" prop="fromErp">
              <el-select v-model="form.fromErp" placeholder="请选择" filterable clearable :disabled="isEdit">
                <el-option
                  v-for="item in fromErps"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" filterable clearable :disabled="isEdit">
                <el-option
                  v-for="item in customerStatuses"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级类型" prop="priorityTypeId">
              <el-select v-model="form.priorityTypeId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in priorityTypes"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户省份">
              <el-input v-model="form.customerProvince" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户城市">
              <el-input v-model="form.customerCity" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户区县">
              <el-input v-model="form.customerCounty" class="inputWidth" maxLength="50" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="外贸标识" prop="foreignTradeType">
              <el-select v-model="form.foreignTradeType" placeholder="请选择" filterable clearable  class="inputWidth">
                <el-option
                  v-for="item in foreignTradeTypes"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="父客户编码">
              <el-select v-model="form.parentCustomerId" placeholder="请选择" @focus="getCustomerList(false)" class="inputWidth" filterable clearable>
                <el-option
                  v-for="item in customers"
                  :key="item.customerId"
                  :label="item.customerCode"
                  :value="item.customerId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" class="inputWidth" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn-box" style="text-align: right">
        <el-button type="primary" class="blue" @click="saveCustomerBtn('form')">保存</el-button>
        <el-button  class="blue" type="primary" @click="resetForm" v-db-click>取 消</el-button>
      </div>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
  </el-card>
</template>

<script src="./js/customer.js">
</script>

<style lang="scss" scoped>

</style>
