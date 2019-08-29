<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row id="process-plan-detail-form">
      <el-form :inline="true" :model="formInline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-input v-model="formInline.ownerName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工计划单号">
              <el-input v-model="formInline.processPlanCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-input v-model="formInline.statusName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工计划日期">
              <el-input v-model="formInline.processPlanDate" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="remark-width">
            <el-form-item label="备注" style="width: 100%;">
              <el-input v-model="formInline.remark" disabled></el-input>
            </el-form-item> 
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style='margin-top: -20px;'>
      <table-configure
        ref="tableConfig"
        :data-table="dataTable"
        :table-code="tableName"
        @onHandleSelectionChange="handleSelectionChange"
        @tableDataHandle="handleTableData"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
        <template slot-scope="props" slot="planProcessPackageSpec">
          <span>{{ props.obj.row.planProcessPackageSpec }}</span>
          <!-- <img src="../../../images/icon-packing-size.png" class="packing" @click="showPackingSize(props.obj.row)"> -->
        </template>
      </table-configure>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!-- v-if="formInline.status == 0" -->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="extendFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
          <el-button
            v-db-click
            class="blue"
            @click="handleBack"
            :type="filteType('blue')"
          >
            返回
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 明细新增 -->
    <self-dialog
      :visible.sync="showDeatilDialog"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="addTitle"
      :modal-append-to-body="false"
      :before-close="closeCommodityDialog"
      :close-on-click-modal="false"
    >
      <!--是否保存数据-->
      <tips-dialog :parent-data="isSaveDetailDialog" @handleOkTip="cancel"></tips-dialog>
      <el-form :inline="true" :model="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="form.commodityName"></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="储位编码">
              <el-select v-model="form.spaceId" placeholder="请选择" filterable clearable v-loadmore="spaceMore" remote :remote-method="searchSpace" @focus="focusSpace" @clear="clearSpace" @change="changeSpace">
              <el-option
                v-for="item in spaceArr.data"
                :key="item.spaceId"
                :label="item.spaceCode"
                :value="item.spaceId">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标准">
              <el-select v-model="form.standardId" placeholder="请选择" v-loadmore="loadMoreStandardList" filterable clearable >
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
              <el-input v-model="form.specification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="表色">
              <el-select v-model="form.surfaceTreatmentId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreSurfaceTreatmentList" :remote-method="searchFastenerSurfaceTreatment" @focus="initSurfaceTreatmentList" @clear="clearSurfaceTreatment" @change="changeSurfaceTreatment">
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
          <el-col :span="12">
            <el-form-item label="品牌">
              <el-select v-model="form.brandId" placeholder="请选择" v-loadmore="loadMoreBrandsList" filterable clearable >
                <el-option
                  v-for="item in brandPageDate.data"
                  :key="item.ID"
                  :label="item.Brand_Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="btn-box" style="text-align: right;">
              <el-button type="primary" class='blue' @click="searchCommodityList">查询</el-button>
              <el-button type="primary" class='blue' @click="resetCommodityList">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <table-configure
        v-if="showDeatilDialog"
        ref="tableConfigDialog"
        :data-table="dataTableDialog"
        :table-code="tableNameDialog"
        @onHandleSelectionChange="handleSelectionChangeDialog"
        @tableDataHandle="handleTableDataDialog"
        @handleSizeChange="handleSizeChangeDialog"
        @handleCurrentChange="handleCurrentChangeDialog">
      </table-configure>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="movePlanDtlSaveCommodity" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetCommodityForm">取 消</el-button>
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
      <tips-dialog :parent-data="isSaveDetailDialog" @handleOkTip="cancel"></tips-dialog>
      <el-form :inline="true" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="大包装">
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
          <el-col :span="12">
            <el-form-item label="包装数量">
              <el-input v-model="form.commodityName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小包装">
              <el-select v-model="form.standardId" placeholder="请选择" v-loadmore="loadMoreStandardList" filterable clearable >
                <el-option
                  v-for="item in standardPageDate.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装数量">
              <el-input v-model="form.specification"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="movePlanDtlSaveCommodity" class="blue" v-db-click>确 认</el-button>
        <el-button  type="primary" class="blue" @click="resetCommodityForm">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
    <!--是否主档保存数据-->
<!--     <tips-dialog :parent-data="isSaveMainTable" @handleOkTip="backMovePlan"></tips-dialog>
 -->  </el-card>
</template>

<script src="./js/difference-plan-detail-commodity.js"></script>
<style lang="scss">
  #process-plan-detail-form {
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 80px !important;
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
    .remark-width {
      .el-form-item__content {
        width: calc(100% - 100px);
      }
    }
  }
  .v-modal {
    z-index: 2000 !important;
  }
  .custom-dialog .el-dialog__footer {
    text-align: center;
  }
</style>
<style lang="scss" scoped>
  .packing{
    width: 20%;
  }
</style>
