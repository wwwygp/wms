<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form id="delive-order-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="波次号">
            <el-select v-model="formInline.waveCode" placeholder="请选择" filterable clearable v-loadmore="loadMoreOrder" remote :remote-method="searchOrder" @focus="focusOrder" @clear="clearOrder" @change="changeOrder">
              <el-option v-for="item in orders.data" :key="item.waveCode" :label="item.waveCode" :value="item.waveCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出货类型">
            <el-select v-model="formInline.deliveNoticeTypeId" placeholder="请选择" v-loadmore="" filterable clearable>
              <el-option v-for="item in deliveNoticeTypeData.data" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="btn-box" style="text-align: center;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter='14'>
      <el-col :span="8" style="margin-top: -10px;" id="waveTable">
        <table-configure v-if="heightResize" ref="tableWaveOrder" :data-table="dataTableWaveOrder" :table-code="dataTableWaveOrder.tableName" @onRowClick="orderRowClick" @onHandleSelectionChange="orderHandleSelectionChange" @tableDataHandle="orderTableDataHandle" @handleSizeChange="orderHandleSizeChange" @handleCurrentChange="orderHandleCurrentChange">
          <template slot-scope="props" slot="deliveNoticeCode">
            <a @click="deliveDetail(props.obj.row)" >{{props.obj.row.deliveNoticeCode}}</a>
          </template>
        </table-configure>
      </el-col>
      <el-col :span="6" style="margin-top: 30px;text-align: center;">
        <el-form>
          <el-row>
            <el-form-item label="作业类型">
              <el-select v-model="operationTypeId" @change="operationTypeIdChange" placeholder="请选择" filterable clearable>
                <el-option v-for="item in operationTypeList" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row style="margin-top: 30px;">
            <el-radio v-model="customerAreaType" label="0" @change="customerAreaTypeChange">按区域</el-radio>
            <el-radio v-model="customerAreaType" label="1" @change="customerAreaTypeChange">按客户</el-radio>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="10" v-show="customerAreaType == '0'" style="margin-top: -10px;">
        <table-configure v-if="heightResize" ref="tableWaveArea" :data-table="dataTableWaveArea" :table-code="dataTableWaveArea.tableName" @onRowClick="areaRowClick" @onHandleSelectionChange="areaHandleSelectionChange" @tableDataHandle="areaTableDataHandle" @handleSizeChange="areaHandleSizeChange" @handleCurrentChange="areaHandleCurrentChange">
          <template slot-scope="props" slot="deliveNoticeCode">
            <a @click="deliveDetail(props.obj.row)" >{{props.obj.row.deliveNoticeCode}}</a>
          </template>
        </table-configure>
      </el-col>
      <el-col :span="10" v-show="customerAreaType != '0'" style="margin-top: -10px;">
        <table-configure v-if="heightResize" ref="tableWaveCustomer" :data-table="dataTableWaveCustomer" :table-code="dataTableWaveCustomer.tableName" @onRowClick="customerRowClick" @onHandleSelectionChange="customerHandleSelectionChange" @tableDataHandle="customerTableDataHandle" @handleSizeChange="customerHandleSizeChange" @handleCurrentChange="customerHandleCurrentChange">
          <template slot-scope="props" slot="deliveNoticeCode">
            <a @click="deliveDetail(props.obj.row)" >{{props.obj.row.deliveNoticeCode}}</a>
          </template>
        </table-configure>
      </el-col>
    </el-row>
    <div style="margin-top: -10px;">
      <table-configure v-if="heightResize" ref="tableWaveDetail" :data-table="dataTableWaveDetail" :table-code="dataTableWaveDetail.tableName" @onRowClick="detailRowClick" @onHandleSelectionChange="detailHandleSelectionChange" @tableDataHandle="detailTableDataHandle" @handleSizeChange="detailHandleSizeChange" @handleCurrentChange="detailHandleCurrentChange">
        <template slot-scope="props" slot="deliveNoticeCode">
          <a @click="deliveDetail(props.obj.row)" >{{props.obj.row.deliveNoticeCode}}</a>
        </template>
      </table-configure>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-button v-db-click v-for="(v,index) in printerBtn" :class="v.className" :key="index" @click="callFn(v)" :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script src="./js/delive-order.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写todo，-->
<!--// scoped,一定要加。-->
<<style lang="scss">
  #waveTable {
  .el-pagination .el-select .el-input {
  width: 85px !important;
  }
  .el-pagination__total {
  left: 0px !important;
  }
  .el-pagination__jump {
  margin-left: 5px !important;
  }
  .el-pagination__editor.el-input{
  width: 45px !important;
  }
  .el-pagination__sizes{
  margin: 0;
  }
  }
  </style>
  <style lang="scss" scoped>
  #delive-order-form {
    .el-row {
      margin-bottom: 0px !important;
    }
  }

  </style>
