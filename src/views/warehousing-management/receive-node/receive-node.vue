<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="收货单号">
                <el-input v-model="formInline.receiveNoteCode" class='' maxLength='20'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预到货单类型">
              <el-select v-model="formInline.arrivalNoticeTypeId" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in arrivalNoticeType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源类型">
              <el-select v-model="formInline.purchaseOrderTypeId" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in purchaseOrderType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.ownerId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable >
                <el-option
                  v-for="item in ownersArr.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
              <el-select v-model="formInline.status" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in status"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="创建时间">
              <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div class="btn-box" style="text-align: right;">
              <!--// 目前只配置了红黄蓝绿。-->
              <el-button type="primary" class='blue' @click="searchList">查询</el-button>
              <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
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
      >
      </table-configure>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
            v-if="v.menuKey == 'WMS_RECEIVE_NODE_ADD' || v.menuKey == 'WMS_RECEIVE_NODE_DEL'"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style='margin-top: -10px;'>
      <table-configure
        v-if="heightResize"
        ref="detaiTableConfig"
        :data-table="detailDataTable"
        :table-code="tableDetailName"
        @onRowClick="onRowDetailClick"
        @onHandleSelectionChange="onHandleDetailSelectionChange"
        @tableDataHandle="detailTableDataHandle"
        @handleSizeChange="handleDetailSizeChange"
        @handleCurrentChange="handleDetailCurrentChange"
      >
      </table-configure>
    </el-row>
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
            v-if="v.menuKey == 'WMS_RECEIVE_NODE_COMFIRM' || v.menuKey == 'WMS_RECEIVE_NODE_CANCEL_ORDER' || v.menuKey == 'WMS_RECEIVE_NODE_CLOSE'"
          >
            {{v.name}}
          </el-button>
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
            v-if="v.menuKey == 'WMS_RECEIVE_NODE_PRINTER'"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <self-dialog
      :visible.sync="dialogCommodityVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="commodityTitle"
      :modal-append-to-body="false"
      :before-close="closeCommodityDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveCommodityDialog" @handleOkTip="cancel"></tips-dialog>
      <el-form :model="form" ref="form" id="dialog-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="预到货单号">
              <el-input v-model="form.arrivalNoticeCode" class='form-input' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预到货单类型">
              <el-select v-model="form.arrivalNoticeTypeId" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in arrivalNoticeType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="form.commodityName" class='form-input' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="委托业主">
              <el-select v-model="form.ownerId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable >
                <el-option
                  v-for="item in ownersArr.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-select v-model="form.brand" placeholder="请选择" v-loadmore="brandsMore" filterable clearable >
                <el-option
                  v-for="item in brandsArr.data"
                  :key="item.ID"
                  :label="item.Brand_Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="btn-box" style="text-align: right;margin-right: 28px;">
              <!--// 目前只配置了红黄蓝绿。-->
              <el-button type="primary" class='blue' @click="searchCommodityList(1)">查询</el-button>
              <el-button type="primary" class='blue' @click="resetCommodityList">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <table-configure
        v-if="heightResize"
        ref="dialogTableConfig"
        :data-table="dialogDataTable"
        :table-code="dialogTableName"
        @onRowClick="onRowDialogClick"
        @onHandleSelectionChange="onHandleDialogSelectionChange"
        @tableDataHandle="dialogTableDataHandle"
        @handleSizeChange="handleDialogSizeChange"
        @handleCurrentChange="handleDialogCurrentChange"
      >
        <template slot-scope="props" slot="largePackageNumber">
          <el-input v-model='props.obj.row.largePackageNumber' maxLength="9" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
        </template>
        <template slot-scope="props" slot="mediumPackageNumber">
          <el-input v-model='props.obj.row.mediumPackageNumber' maxLength="9" :disabled='props.obj.row.disabledMediumPackageNumber'> </el-input>
        </template>
        <template slot-scope="props" slot="smallPackageNumber">
          <el-input v-model='props.obj.row.smallPackageNumber' maxLength="9" :disabled='props.obj.row.disabledSmallPackageNumber'> </el-input>
        </template>
      </table-configure>
      <span slot="footer" class="dialog-footer">
        <!--<span>收货人</span>-->
        <!--<el-select v-model="receiverId" placeholder="请选择" v-loadmore="" filterable clearable >-->
          <!--<el-option-->
            <!--v-for="item in staffs"-->
            <!--:key="item.ID"-->
            <!--:label="item.Staff_Name"-->
            <!--:value="item.ID">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <el-button type="primary" @click="submitCommodityForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetCommodityForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
    <tips-dialog :parent-data="confirmDialog" @handleOkTip="confirmReceive('form')"></tips-dialog>
  </el-card>
</template>

<script src="./js/receive-node.js">

</script>
<style lang="scss">
#top-form {
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 150px !important;
  }
}
.v-modal {
  z-index: 2000 !important;
}
</style>
<style scoped lang="scss">
#top-form {
  .el-input{
    width: 100%;
  }
}
.form-input {
  width: 54%;
}
</style>
