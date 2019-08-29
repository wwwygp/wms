<template>
  <el-card style="height: calc(100vh);overflow-y: auto; overflow-x: hidden;">
    <el-form id="move-order-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="波次号">
            <el-select v-model="formInline.moveWaveId" placeholder="请选择" filterable clearable v-loadmore="waveCodeMore" remote :remote-method="searchWave" @focus="focusWaveCode" @clear="clearWaveCode" @change="changeWaveCode">
              <el-option
                v-for="item in waveArr.data"
                :key="item.moveWaveId"
                :label="item.moveWaveCode"
                :value="item.moveWaveId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="移库类型">
            <el-select v-model="formInline.moveTypeId" placeholder="请选择" v-loadmore="" filterable clearable>
              <el-option v-for="item in moveType" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="请选择" v-loadmore="" filterable clearable>
              <el-option v-for="item in status" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <div class="btn-box" style="text-align: center;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter='14' id="moveTable">
      <el-col :span="12" style="margin-top: -10px;">
        <table-configure ref="tableMoveOrder" :data-table="dataTableMoveOrder" :table-code="dataTableMoveOrder.tableName" @onRowClick="orderRowClick" @tableDataHandle="orderTableDataHandle" @handleSizeChange="orderHandleSizeChange" @handleCurrentChange="orderHandleCurrentChange">
          <template slot-scope="props" slot="deliveNoticeCode">
            <a @click="deliveDetail(props.obj.row)">{{props.obj.row.deliveNoticeCode}}</a>
          </template>
        </table-configure>
      </el-col>
      <el-col :span="4" style="margin-top: 30px;text-align: center;">
        <el-form>
          <el-row class="sing-way">
            <el-form-item label="成单方式">
              <el-select v-model="singleWay" @change="singleWayChange" placeholder="请选择" filterable clearable>
                <el-option v-for="item in singleWayArr" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="8" style="margin-top: -10px;">
        <table-configure ref="tableMoveStorage" :data-table="dataTableMoveStorage" :table-code="dataTableMoveStorage.tableName" @onRowClick="storageRowClick" @tableDataHandle="storageTableDataHandle" @handleSizeChange="storageHandleSizeChange" @handleCurrentChange="storageHandleCurrentChange">
          <template slot-scope="props" slot="deliveNoticeCode">
            <a @click="deliveDetail(props.obj.row)">{{props.obj.row.deliveNoticeCode}}</a>
          </template>
        </table-configure>
      </el-col>
    </el-row>
    <div style="margin-top: -10px;">
      <table-configure ref="tableMoveDetail" :data-table="dataTableMoveDetail" :table-code="dataTableMoveDetail.tableName" @onRowClick="detailRowClick" @onHandleSelectionChange="detailHandleSelectionChange" @tableDataHandle="detailTableDataHandle" @handleSizeChange="detailHandleSizeChange" @handleCurrentChange="detailHandleCurrentChange">
        <template slot-scope="props" slot="deliveNoticeCode">
          <a @click="deliveDetail(props.obj.row)">{{props.obj.row.deliveNoticeCode}}</a>
        </template>
      </table-configure>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-button v-db-click v-for="(v,index) in btnList" 
          :class="v.className" 
          :key="index" 
          @click="extendFn(v)" 
          :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script src="./js/move-order.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写todo，-->
<!--// scoped,一定要加。-->
<style lang="scss">
#moveTable {
  .el-pagination .el-select .el-input {
    width: 85px !important;
  }

  .el-pagination__total {
    left: 0px !important;
  }

  .el-pagination__jump {
    margin-left: 5px !important;
  }

  .el-pagination__editor.el-input {
    width: 45px !important;
  }

  .el-pagination__sizes {
    margin: 0;
  }
}
  .sing-way.el-row {
    .el-form-item label {
      width: 70px;
    }
    .el-form-item .el-select .el-input {
      width: 100px;
    }
  }
</style>
