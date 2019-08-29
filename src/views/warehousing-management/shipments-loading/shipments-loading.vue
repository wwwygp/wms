<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="配送单号">
              <el-input v-model="formInline.deliveNoticeCode" class='' maxLength='20'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出货单号">
              <el-input v-model="formInline.distributionNoticeCode" class='' maxLength='20'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.ownerId" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable >
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
            <el-form-item label="状态">
              <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in statusList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="创建时间">
              <DatePick ref="dateComponents" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btn-box" style="text-align: left;">
              <!--// 目前只配置了红黄蓝绿。-->
              <el-button type="primary" class='blue' @click="searchList">查询</el-button>
              <el-button type="primary" class='blue' @click="reseltForm('formInline')">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row style='margin-top: -10px;'>
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
            @cellClick='cellClick'
          >
          <template slot-scope="props" slot="logisticsCode">
            <a @click='addLogistics'> {{props.obj.row.logisticsCode}} </a>
          </template>
          </table-configure>
        </el-row>
        <el-row style='margin-top: -10px;'>
          <table-configure
            v-if="heightResize"
            ref="tableConfig"
            :data-table="detailDataTable"
            :table-code="detailTableName"
            @onRowClick="onDetailRowClick"
            @onHandleSelectionChange="onDetailHandleSelectionChange"
            @tableDataHandle="detailTableDataHandle"
          >
          <template slot-scope="props" slot="testReportNo">
            <a @click="downloadPDF(props.obj.row.ossUrl)"> {{ props.obj.row.testReportNo }}</a>
          </template>
          </table-configure>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="text-align: right;">
          <span>共&nbsp{{detailDataTable.data.length}}&nbsp条</span>
        </div>
      </el-col>
    </el-row>
    <self-dialog
      :visible.sync="dialogShipmentsVisible"
      width="60%"
      custom-class="minWidth tableConfigDialog"
      :title="shipmentsTitle"
      :modal-append-to-body="false"
      :before-close="closeShipmentsDialog"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="发货装车" name="first">
          <el-form :model="form" ref="form" id="dialog-form">
            <el-row>
              <el-col :span="6">
                <el-form-item label="线路">
                  <el-select v-model="form.routeId" class='inputWidth' placeholder="请选择" filterable clearable >
                    <el-option
                      v-for="item in routeList"
                      :key="item.routeId"
                      :label="item.routeName"
                      :value="item.routeId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出货单号">
                  <el-input v-model="form.deliveNoticeCode" class='inputWidth' maxLength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户">
                  <el-select v-model="form.customerId" class='inputWidth' placeholder="请选择" filterable clearable >
                    <el-option
                      v-for="item in customerIdList"
                      :key="item.customerId"
                      :label="item.customerName"
                      :value="item.customerId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div class="btn-box" style="text-align: center">
                  <!--// 目前只配置了红黄蓝绿。-->
                  <el-button type="primary" class='blue' @click="getShipmentsList">查询</el-button>
                  <el-button type="primary" class='blue' @click="resetShipmentsList">重置</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="车牌号">
                  <el-input v-model="form.carCode" class='inputWidth' maxLength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="司机">
                  <el-select v-model="form.driverId" class='inputWidth' placeholder="请选择" filterable clearable :disabled="updateDisabled">
                    <el-option
                      v-for="item in driverIdList"
                      :key="item.ID"
                      :label="item.Staff_Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div class="btn-box" style="text-align: center">
                  <!--// 目前只配置了红黄蓝绿。-->
                  <el-button type="primary" class='blue' @click="saveShipmentsBtn">保存</el-button>
                  <el-button type="primary" class='blue' @click="closeShipmentsDialog">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <table-configure
            v-if="heightResize"
            ref="dialogTableConfig"
            :data-table="dialogDataTable"
            :table-code="dialogTableName"
            @onRowClick="onShipmentsRowClick"
            @onHandleSelectionChange="onHandleDialogSelectionChange"
            @tableDataHandle="dialogTableDataHandle"
          >
          </table-configure>
        </el-tab-pane>
        <el-tab-pane label="物流信息" name="second" v-if='shipmentsTitle == "按订单发货-物流"'>
          <el-form :model="logisticsEditForm" ref="logisticsEditForm" id='logisticsEditForm' :rules="rulesLogisticsForm">
            <el-row>
              <el-col :span="12">
                <el-form-item label="承运商" prop='carrierId'>
                  <el-select v-model="logisticsEditForm.carrierId" placeholder="请选择" v-loadmore="loadMoreCarrierList" filterable clearable class='inputWidth'>
                    <el-option
                      v-for="item in carrierPageDate.data"
                      :key="item.id"
                      :label="item.logisticsCompanyName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配送方式" prop='deliveryTypeId'>
                  <el-select v-model="logisticsEditForm.deliveryTypeId" placeholder="请选择" filterable clearable class='inputWidth'>
                    <el-option
                      v-for="item in deliveryType"
                      :key="item.dictDtlValue"
                      :label="item.dictDtlName"
                      :value="item.dictDtlValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流单号" prop='logisticsCode'>
                  <el-input v-model="logisticsEditForm.logisticsCode" class='inputWidth' maxLength='20'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发货时间">
                  <el-date-picker
                    v-model="logisticsEditForm.distributionTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :default-value="defaultDate"
                    default-time="12:00:00">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流费用" prop="logisticsCost">
                  <el-input v-model.number="logisticsEditForm.logisticsCost" class='inputWidth' maxLength='11'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="logisticsEditForm.logisticsRemark" class='inputWidth' maxLength='50'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--:http-request='upload'-->
            <el-row style="text-align: center;" >
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :http-request='upload'
                drag
                :show-file-list="false"
                with-credentials
                :before-upload="beforeUpload"
                >
                <img v-if="ossUrl" :src="ossUrl" class="avatar">
                <div v-else>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
              </el-upload>
            </el-row>
            <!-- <el-row>
              <el-form-item label="备注">
                <el-input v-model="logisticsEditForm.logisticsRemark" class='inputWidth' maxLength='50'></el-input>
              </el-form-item>
            </el-row> -->
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveShipmentsDialog" @handleOkTip="cancel"></tips-dialog>
    </self-dialog>
    <self-dialog
      :visible.sync="dialogLogisticsVisible"
      width="60%"
      custom-class="minWidth tableConfigDialog"
      :modal-append-to-body="false"
      :before-close="closeLogisticsDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="logisticsForm" ref="logisticsForm" id='logisticsForm'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运商">
              <el-input v-model="logisticsForm.carrierName" class='inputWidth' disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送方式">
              <el-input v-model="logisticsForm.deliveryTypeName" class='inputWidth' disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号">
              <el-input v-model="logisticsForm.logisticsCode" class='inputWidth' disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货时间">
              <el-input v-model="logisticsForm.distributionTime" class='inputWidth' disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流费用">
              <el-input v-model="logisticsForm.logisticsCost" class='inputWidth' disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;" v-if="logisticsForm.ossUrl">
          <img style="width: 50%" :src='logisticsForm.ossUrl'/>
        </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input v-model="logisticsForm.remark" class='inputWidth' disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="btn-box" style="text-align: right;">
              <!--// 目前只配置了红黄蓝绿。-->
              <el-button type="primary" class='blue' @click="closeLogisticsDialog">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </self-dialog>
  </el-card>
</template>

<script src="./js/shipments-loading.js">
</script>

<style lang="scss">
#top-form {
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 170px !important;
  }
}
#logisticsForm,#logisticsEditForm{
  .el-upload{
    width: 90%;
  }
  .el-upload-dragger{
    width: 100%;
    height: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: calc(100% - 100px) !important;
  }
}
</style>
<style scoped lang="scss">
#top-form {
  .el-input{
    width: 100%;
  }
}
#dialog-form{
  .form-input {
    width: 59%;
  }
}
</style>
