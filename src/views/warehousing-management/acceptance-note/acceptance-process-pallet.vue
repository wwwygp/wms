<template>
  <el-card style="overflow: auto" id="process-process-pallet-form">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="商品名称">
                <el-input v-model="formInline.commodityName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品条码">
                <el-input v-model="formInline.commodityBarcode" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="板号">
                <el-input v-model="formInline.palletCode" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="btn-box" style="text-align: right;">
              <!--// 目前只配置了红黄蓝绿。-->
              <el-button v-db-click class="blue" type="primary"  @click="searchList">查询</el-button>
              <el-button v-db-click class="blue" type="primary" @click="resetForm">重置</el-button>
              <el-button
                v-db-click
                v-for="(v,index) in btnList"
                :class="v.className"
                :key="index" @click="extendFn(v)"
                :type="filteType(v.className)">
                {{v.name}}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="margin-top: -20px">
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
    <!-- 加工组板 -->
    <self-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="title"
      :before-close="closeDialog"
      :close-on-click-modal="false">
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancelDialog('form')"></tips-dialog>
      <el-form :model="form" ref="form" id="process-dialog-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="委托业主">
              <el-select v-model="form.ownerId" placeholder="请选择" class='inputWidth' v-loadmore="ownersMore" filterable clearable >
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
            <el-form-item label="商品编码">
                <el-input v-model="form.commodityCode" class="inputWidth" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称">
                <el-input v-model="form.commodityName" class="inputWidth" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
                <el-row>
          <el-col :span="8">
            <el-form-item label="标准">
              <el-select v-model="form.standardId" class='inputWidth' placeholder="请选择" v-loadmore="loadMoreStandardList" filterable clearable >
                <el-option
                  v-for="item in standardPageDate.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">
              <el-input class='inputWidth' v-model="form.specification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="表色">
              <el-select class='inputWidth' v-model="form.surfaceTreatmentId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreSurfaceTreatmentList" :remote-method="searchFastenerSurfaceTreatment" @focus="initSurfaceTreatmentList" @clear="clearSurfaceTreatment" @change="changeSurfaceTreatment">
                <el-option
                  v-for="item in surfaceTreatmentArr.data"
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
            <el-form-item label="商品类别">
                <el-select class='inputWidth' v-model="form.commodityTypeId" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in commodityType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-select class='inputWidth' v-model="form.brandId" placeholder="请选择" v-loadmore="brandsMore" filterable clearable >
                <el-option
                  v-for="item in brandsArr.data"
                  :key="item.ID"
                  :label="item.Brand_Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="btn-box" style="text-align: right;">
              <el-button v-db-click class="blue" type="primary"  @click="searchCommodityList">查询</el-button>
              <el-button v-db-click class="blue" type="primary" @click="resetDialogForm">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <table-configure
        v-if="dialogVisible"
        ref="dialogTableConfig"
        :data-table="dialogDataTable"
        :table-code="dialogTableName"
        @onHandleSelectionChange="onHandleDialogSelectionChange"
        @tableDataHandle="dialogTableDataHandle"
        @handleSizeChange="handleDialogSizeChange"
        @handleCurrentChange="handleDialogCurrentChange">
        <template slot-scope="props" slot="processPackageSpec">
          <span>{{ props.obj.row.processPackageSpec }}</span>
          <img src="../../../images/icon-packing-size.png" class="packing" @click="showPackingSize(props.obj.row)">
        </template>
        <template slot-scope="props" slot="largePackageNumber">
          <el-input v-model='props.obj.row.largePackageNumber' maxLength="9" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
        </template>
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
      <el-row style="text-align: right;">共{{this.dialogDataTable.data.length}}条</el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkPrint" class="blue" v-db-click>新取托盘号</el-button>
        <span>托盘号</span>
        <el-select v-model="containerLabelId" placeholder="请选择" filterable remote clearable v-loadmore='containerLabeMore' :remote-method="searchPalletLabe" @focus="focusPalletLabe" @clear="clearPalletLabe" @change="changePalletLabe">
          <el-option
            v-for="item in containerLabeArr.data"
            :key="item.labelId"
            :label="item.labelNumber"
            :value="item.labelId">
          </el-option>
        </el-select>
        <span>暂存区储位</span>
        <el-select v-model="spaceId" placeholder="请选择" filterable clearable v-loadmore='spaceMore'>
          <el-option
            v-for="item in spaceArr.data"
            :key="item.spaceId"
            :label="item.spaceCode"
            :value="item.spaceId">
          </el-option>
        </el-select>
        <el-button type="primary" @click="saveCheckCommodity()" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetCommodityForm('form')">取 消</el-button>
      </span>
    </self-dialog> 
    <!-- 包装规格 -->
    <self-dialog
      :visible.sync="showPackingSizeDialog"
      width="50%"
      custom-class="custom-dialog"
      :title="packingSizeTitle"
      :modal-append-to-body="false"
      :before-close="closePackingSizeDialog"
      :close-on-click-modal="false"
    >
      <!--是否保存数据-->
      <tips-dialog :parent-data="isSavePackingSizeDialog" @handleOkTip="cancelPackingSize"></tips-dialog>
      <el-form :inline="true" :model="packingForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="大包装">
              <el-select v-model="packingForm.largePackageUnitId" placeholder="请选择大包装" v-loadmore="ownersMore" filterable clearable >
                <el-option
                  v-for="item in ownersArr.data" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装数量">
              <el-input v-model="packingForm.largePackageCount" placeholder="请输入包装数量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小包装">
              <el-select v-model="packingForm.smallPackageUnitId" placeholder="请选择小包装" v-loadmore="ownersMore" filterable clearable >
                <el-option
                  v-for="item in ownersArr.data" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装数量">
              <el-input v-model="packingForm.smallPackageCount" placeholder="请输入包装数量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmPackingSize" class="blue" v-db-click>确 认</el-button>
        <el-button  type="primary" class="blue" @click="cancelPackingSize">取 消</el-button>
      </span>
    </self-dialog>
    <!-- 删除 -->
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
  </el-card>
</template>

<script src="./js/acceptance-process-pallet.js"></script>

<style lang="scss">
#top-form {
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 170px !important;
  }
}
.v-modal {
  z-index: 2000 !important;
}
#process-process-pallet-form {
  .el-card__body{
    padding-top: 5px;
    padding-right: 20px;
    padding-bottom: 0px;
    padding-left: 20px;
  }
}
.custom-dialog .el-dialog__footer {
  text-align: center;
} 
</style>
<style lang="scss" scoped>
#process-dialog-form{
  .form-input {
    width: 59%;
  }
}
.packing{
  width: 20%;
}
</style>