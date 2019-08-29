<template>
  <!--   -->
  <el-card style="overflow: auto" id="detail-top-form">
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button v-db-click v-for="(v,index) in btnList" :class="v.className" :key="index" @click="callFn(v)" :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: -15px">
      <table-configure v-if="heightResize" ref="tableConfig" :data-table="dataTable" :table-code="tableName" @onRowClick="onRowClick" @onHandleSelectionChange="onHandleSelectionChange" @tableDataHandle="tableDataHandle" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        <template slot-scope="props" slot="testReportNo">
          <!--<a :href="props.obj.row.ossUrl" :download="props.obj.row.ossUrl" @click="downloadPDF(props.obj.row.ossUrl)"> {{ props.obj.row.testReportNo }}</a>-->
          <a @click="downloadPDF(props.obj.row.ossUrl)"> {{ props.obj.row.testReportNo }}</a>
        </template>
      </table-configure>
      <el-row style="text-align: right;">共{{this.dataTable.data.length}}条</el-row>
    </el-row>
    <!-- 按商品验收弹窗 -->
    <self-dialog :visible.sync="dialogVisible" width="50%" custom-class="minWidth dialog-height tableConfigDialog" :title="title" :before-close="closeCommodityDialog" :close-on-click-modal="false">
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancelDialog('form')"></tips-dialog>
      <el-form :model="form" ref="form" id="dialog-form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="收货单号">
              <el-input v-model="form.receiveNoteCode" class='inputWidth' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预到货单号">
              <el-input v-model="form.arrivalNoticeCode" class='inputWidth' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预到货类型">
              <el-select v-model="form.arrivalNoticeTypeId" class='inputWidth' placeholder="请选择" filterable clearable>
                <el-option v-for="item in arrivalNoticeType" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input v-model="form.commodityName" class='inputWidth' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="form.ownerId" placeholder="请选择" class='inputWidth' v-loadmore="ownersMore" filterable clearable>
                <el-option v-for="item in ownersArr.data" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品类型">
              <el-select v-model="form.commodityTypeId" placeholder="请选择" class='inputWidth' filterable clearable>
                <el-option v-for="item in commodityType" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="btn-box" style="text-align: right;">
              <el-button v-db-click class="blue" type="primary" @click="searchList(1)">查询</el-button>
              <el-button v-db-click class="blue" type="primary" @click="resetForm">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <table-configure v-if="heightResize" ref="dialogTableConfig" :data-table="dialogDataTable" :table-code="dialogTableName" @onRowClick="onRowDialogClick" @onHandleSelectionChange="onHandleDialogSelectionChange" @tableDataHandle="dialogTableDataHandle" @handleSizeChange="handleDialogSizeChange" @handleCurrentChange="handleDialogCurrentChange">
        <template slot-scope="props" slot="largePackageNumber">
          <el-input v-model='props.obj.row.largePackageNumber' maxLength="9" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
        </template>
        <template slot-scope="props" slot="mediumPackageNumber">
          <el-input v-model='props.obj.row.mediumPackageNumber' maxLength="9" :disabled='props.obj.row.disabledMediumPackageNumber'> </el-input>
        </template>
        <template slot-scope="props" slot="smallPackageNumber">
          <el-input v-model='props.obj.row.smallPackageNumber' maxLength="9" :disabled='props.obj.row.disabledSmallPackageNumber'> </el-input>
        </template>
        <template slot-scope="props" slot="commodityQualityId">
          <el-select v-model="props.obj.row.commodityQualityId" placeholder="请选择" filterable clearable>
            <el-option v-for="item in commodityQuality" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
            </el-option>
          </el-select>
        </template>
      </table-configure>
      <span slot="footer" class="dialog-footer">
        <span>验收码头</span>
      <el-select v-model="wharfId" placeholder="请选择" filterable clearable v-loadmore='wharfMore'>
        <el-option v-for="item in wharfArr.data" :key="item.wharfId" :label="item.wharfName" :value="item.wharfId">
        </el-option>
      </el-select>
      <!-- <span>验收人</span>
      <el-select v-model="accepterId" placeholder="请选择" filterable clearable>
        <el-option v-for="item in staffs" :key="item.ID" :label="item.Staff_Name" :value="item.ID">
        </el-option>
      </el-select> -->
      <el-button type="primary" @click="saveCheckCommodity()" class="blue" v-db-click>保 存</el-button>
      <el-button type="primary" class="blue" @click="resetCommodityForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <!-- 新增品项 -->
    <self-dialog :visible.sync="commodityDialogVisible" width="50%" custom-class="minWidth tableConfigDialog" :modal-append-to-body="false" :before-close="closeAddCommodityDialog" :close-on-click-modal="false">
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveCommodityDialog" @handleOkTip="cancelAddCommodity('commodityForm')"></tips-dialog>
      <el-form :model="commodityForm" ref="commodityForm" :rules="commodityFormRule">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品编码" prop="commodityId">
              <el-select v-model="commodityForm.commodityId" placeholder="请选择" v-loadmore="commodityMore" filterable remote clearable :remote-method="searchCommodity" @focus="focusCommodity" @clear="clearCommodity" @change="selectCommodity">
                <!-- <el-select v-model="commodityForm.commodityId" placeholder="请选择" v-loadmore="commodityMore" filterable clearable @change="selectCommodity"> -->
                <el-option v-for="item in commodityArr.data" :key="item.commodityId" :label="item.commodityCode" :value="item.commodityId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品条码" prop="commodityId">
              <el-select v-model="commodityForm.commodityId" placeholder="请选择" v-loadmore="commodityMore" filterable clearable @change="selectCommodity">
                <el-option v-for="item in commodityArr.data" :key="item.commodityId" :label="item.commodityBarCode" :value="item.commodityId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称" prop="commodityId">
              <el-select v-model="commodityForm.commodityId" placeholder="请选择" v-loadmore="commodityMore" filterable clearable @change="selectCommodity">
                <el-option v-for="item in commodityArr.data" :key="item.commodityId" :label="item.name" :value="item.commodityId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标准">
              <el-input v-model="commodityForm.standardName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">
              <el-input v-model="commodityForm.specification" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-input v-model="commodityForm.brandName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <!-- <el-form-item label="包装数量">
              <el-input v-model="commodityForm.packageCommodityAmount" disabled class="inputWidth"></el-input>
            </el-form-item> -->
            <el-form-item label="包装数量" prop="packageCommodityAmount">
              <el-select v-model="commodityForm.packageCommodityAmount" placeholder="请选择" class='inputWidth' filterable clearable>
                <el-option v-for="item in packageCommodityAmount" :key="item.packageAmount" :label="item.packageAmount" :value="item.packageAmount">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="包装数量">
              <el-select v-model="commodityForm.commodityTypeId" placeholder="请选择" class='inputWidth' filterable clearable >
                <el-option
                  v-for="item in commodityDialogType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="commodityTypeId">
              <el-select v-model="commodityForm.commodityTypeId" placeholder="请选择" class='inputWidth' filterable clearable>
                <el-option v-for="item in commodityDialogType" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收数量" prop="nowAcceptAmount">
              <el-input v-model="commodityForm.nowAcceptAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品质" prop="commodityQualityId">
              <el-select v-model="commodityForm.commodityQualityId" placeholder="请选择" filterable clearable>
                <el-option v-for="item in commodityQuality" :key="item.dictDtlValue" :label="item.dictDtlName" :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="验收人" prop="accepterId">
              <el-select v-model="commodityForm.accepterId" class="inputWidth" placeholder="请选择" filterable clearable>
                <el-option v-for="item in staffs" :key="item.ID" :label="item.Staff_Name" :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCommodityList('form')" class="blue" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetAddCommodity('form')" v-db-click>取 消</el-button>
      </span>
    </self-dialog>
    <!-- 删除 -->
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
    <!-- 是否生成检报提示 -->
    <tips-dialog :parent-data="isReport" @handleOkTip="routeERPReport"></tips-dialog>
  </el-card>
</template>
<script src="./js/acceptance-detail.js"></script>
<style lang="scss">
#detail-top-form{
  .el-card__body {
    padding: 5px 20px 0px;
  }
}
.v-modal {
  z-index: 2000 !important;
}
</style>
