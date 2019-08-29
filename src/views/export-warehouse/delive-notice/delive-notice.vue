<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="delive-notice-form">
      <el-row>
        <el-col :span="6">
            <el-form-item label="出货单号">
              <el-input v-model="formInline.deliveNoticeCode" maxLength="20"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="出货类型">
              <el-select v-model="formInline.deliveNoticeTypeId" placeholder="请选择" v-loadmore="" filterable clearable>
                <el-option
                  v-for="item in deliveNoticeTypeData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.ownerId" placeholder="请选择" v-loadmore="loadMoreOwner" filterable clearable>
                <el-option
                  v-for="item in owners.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="出货方式">
              <el-select v-model="formInline.deliveTypeId" placeholder="请选择" v-loadmore="" filterable clearable>
                <el-option
                  v-for="item in deliveTypeData.data"
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
            <el-form-item label="订单号">
              <el-input v-model="formInline.orderCode" maxLength="20"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="订单类型">
              <el-select v-model="formInline.orderTypeId" placeholder="请选择" v-loadmore="" filterable clearable>
                <el-option
                  v-for="item in orderTypeData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="预到货单号">
              <el-input v-model="formInline.arrivalNoticeCode" maxLength="20"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="客户">
              <el-select v-model="formInline.customerId" placeholder="请选择" @focus="getCustomerList(false)" v-loadmore="loadMoreCustomerList" filterable clearable>
                <el-option
                  v-for="item in customers"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerId">
                </el-option>
              </el-select>
<!--               <el-input v-model="formInline.customerName" maxLength="20"></el-input>
 -->            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
            <el-form-item label="线路">
              <el-input v-model="formInline.routeCode" maxLength="20"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="formInline.status" multiple placeholder="请选择" v-loadmore="" filterable clearable>
              <el-option
                v-for="item in statusData.data"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出货状态">
            <el-select v-model="formInline.deliveStatus" multiple placeholder="请选择" v-loadmore="" filterable clearable>
              <el-option
                v-for="item in deliveStatusData.data"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" id="date-width">
          <el-form-item label="创建时间">
            <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="btn-box" style="text-align: right;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--// 表格控件-->
    <table-configure
      v-if="heightResize"
      ref="tableConfig"
      :data-table="dataTable"
      :table-code="tableName"
      @onRowClick="onRowClick"
      @onHandleSelectionChange="onHandleSelectionChange"
      @tableDataHandle="tableDataHandle"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <template slot-scope="props" slot="deliveNoticeCode">
        <a @click="deliveDetail(props.obj.row)" >{{props.obj.row.deliveNoticeCode}}</a>
      </template>
    </table-configure>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
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
      </el-col>
    </el-row>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog> 
  </el-card>
</template>
<script src="./js/delive-notice.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss">
  #date-width{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 80px;
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
