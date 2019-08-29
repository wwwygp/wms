<template>
  <el-card style="height: calc(100vh);overflow: auto" class="inventory">
    <el-row class="inventory-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="委托业主:">
            <el-select v-model="formInline.ownerId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreOwnerList" :remote-method="searchFastenerOwner" @focus="initOwnerList" @clear="clearOwner" @change="changeOwner">

            <!--<el-select v-model="formInline.ownerId" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable>-->
            	<el-option
            		v-for="item in ownersArr.data"
            		:key="item.id"
            		:label="item.name"
            		:value="item.id">
            	</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
					<el-form-item label="储位编码:">
						<el-select v-model="formInline.spaceId" placeholder="请选择" v-loadmore="loadMoreSpaceList" @focus="initSpaceList" filterable clearable remote :remote-method="reloadSpaceData">
							<el-option
								v-for="item in spaceArr.data"
								:key="item.spaceId"
								:label="item.spaceCode"
								:value="item.spaceId">
							</el-option>
						</el-select>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品编码:">
            <el-input v-model="formInline.commodityCode" maxlength="50" class=''></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称:">
            <el-input v-model="formInline.commodityName" maxlength="20" class=''></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="容器编码:">
            <el-input v-model="formInline.containerLabelCode" maxlength="20" class=''></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存状态:">
            <el-select v-model="formInline.stockStatus" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in stockStatusList"
								:key="item.dictDtlValue"
								:label="item.dictDtlName"
								:value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="盘点状态:">
            <el-select v-model="formInline.inventoryStatus" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in checkStatusList"
								:key="item.dictDtlValue"
								:label="item.dictDtlName"
								:value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标准:">
            <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
            <el-select v-model="formInline.standardId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" :remote-method="searchFastenerStandard" @focus="initStandardList" @clear="clearStandard" @change="changeStandard">
              <el-option
                v-for="item in standardArr.data"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">-->
          <!--<el-form-item label="原箱标签:">-->
            <!--<el-input v-model="formInline.originalCaseCode" maxlength="9" class=''></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-col :span="6">
					<el-form-item label="品牌">
						<el-select v-model="formInline.brandId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreBrandList" @focus="initBrandList" :remote-method="searchBrandList"  @clear="clearBrand" @change="changeBrand">
							<el-option
								v-for="item in brandArr.data"
								:key="item.ID"
								:label="item.Brand_Name"
								:value="item.ID">
							</el-option>
						</el-select>
					</el-form-item>
        </el-col>
        <el-col :span="6">
					<el-form-item label="材质">
            <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
            <el-select v-model="formInline.textureId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreTextureList" :remote-method="searchFastenerTexture" @focus="initTextureList" @clear="clearTexture" @change="changeTexture">
              <el-option
                v-for="item in textureArr.data"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
					</el-form-item>
        </el-col>
        <el-col :span="6">
					<el-form-item label="材料">
            <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
            <el-select v-model="formInline.materialId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreMaterialList" :remote-method="searchFastenerMaterial" @focus="initMaterialList" @clear="clearMaterial" @change="changeMaterial">
              <el-option
                v-for="item in materialArr.data"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="强度">
            <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
            <el-select v-model="formInline.strengthId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreStrengthList" :remote-method="searchFastenerStrength" @focus="initStrengthList" @clear="clearStrength" @change="changeStrength">
              <el-option
                v-for="item in strengthArr.data"
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
            <el-form-item label="牙型">
              <el-select v-model="formInline.toothTypeId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in threadRotationList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
              <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
              <!--<el-select v-model="formInline.toothTypeId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreToothTypeList" :remote-method="searchFastenerToothType" @focus="initToothTypeList" @clear="clearToothType" @change="changeToothType">-->
                <!--<el-option-->
                  <!--v-for="item in toothTypeArr.data"-->
                  <!--:key="item.dictDtlValue"-->
                  <!--:label="item.dictDtlName"-->
                  <!--:value="item.dictDtlValue">-->
                <!--</el-option>-->
              <!--</el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格">
                <el-input v-model="formInline.specification" maxlength="50" class=''></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表色">
              <!-- <el-select v-model="formInline.standardId" filterable clearable placeholder="请选择" v-loadmore="loadMoreStandardList" @focus="initStandardList"> -->
              <el-select v-model="formInline.surfaceTreatmentId" remote filterable clearable placeholder="请选择" v-loadmore="loadMoreSurfaceTreatmentList" :remote-method="searchFastenerSurfaceTreatment" @focus="initSurfaceTreatmentList" @clear="clearSurfaceTreatment" @change="changeSurfaceTreatment">
                <el-option
                  v-for="item in surfaceTreatmentArr.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检报筛选">
              <el-select v-model="formInline.testReportChoose" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in testReportChooseList"
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
					<el-form-item label="检报编号">
            <el-input v-model="formInline.testReportNo" maxlength="50" class=''></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="18" style="padding-left: 30px;">
          <div class="btn-box">
            <el-button-group>
              <el-button  type="primary" class="blue" @click="reSearch">查询</el-button>
              <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
                <el-button
                  v-for="(v,index) in btnList"
                  v-db-click
                  :class="v.className"
                  :key="index" @click="callFn(v)"
                  :type="filteType(v.className)"
                  v-if="v.menuKey=='WMS_STOCK_EXCEL_EXPORT'">
                  {{v.name}}
                </el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
    </el-form>
   </el-row>
    <el-row class="inventory-table" style="margin-top: -20px;">
      <el-col :span="24">
        <table-configure
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="tableName"
          @onRowClick="onRowClick"
          @onHandleSelectionChange="onHandleSelectionChange"
          @tableDataHandle="tableDataHandle"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        <template slot-scope="props" slot="testReportNo">
          <a @click="downloadPDF(props.obj.row.testReportOssurl)"> {{ props.obj.row.testReportNo }}</a>
        </template>
        </table-configure>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <el-select v-model="brandTitleUrl" placeholder="请选择标签标题品牌" @focus="getDictionarys" filterable clearable >
          <el-option
            v-for="item in labelTitleBrand"
            :key="item.dictDtlValue"
            :label="item.dictDtlName"
            :value="item.dictDtlValue">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="21">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="extendFn(v)"
            :type="filteType(v.className)"
              v-if='v.menuKey == "WMS_STOCK_DTL_PRINT_OUT" || v.menuKey =="WMS_STOCK_DTL_PRINT_INNER"||v.menuKey == "WMS_STOCK_CHECK_LIST"'
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 是否生成检报提示 -->
    <tips-dialog :parent-data="isReport" @handleOkTip="routeERPReport"></tips-dialog>
    <!-- 打印弹窗 -->
    <hgp-dialog :visible.sync="showDialog" 
    width="50%" 
    custom-class="minWidth dialog-height" 
    :title="dialogTitle" 
    :before-close="closeDialog" 
    :close-on-click-modal="false">
      <!--显示打印信息表格-->
      <table-configure  
      v-if="showDialog"
      ref="dialogTable" 
      :data-table="dialogDataTable" 
      :table-code="dialogTableName"
      @tableDataHandle="handleDialogTableData">
        <template slot-scope="props" slot="printingNumber">
          <el-input v-model="props.obj.row.printingNumber"></el-input>
        </template>
      </table-configure>
      <!-- 打印功能 -->
      <span slot="footer" class="dialog-footer">
        <b>打印模板 </b>
        <el-select v-model="printTemplateId" placeholder="请选择打印模板" filterable clearable>
          <el-option
            v-for="item in printTemplate"
            :key="item.Id"
            :label="item.Description"
            :value="item.Id">
          </el-option>
        </el-select> 
        <el-button type="primary" @click="getPrintingReview" class="blue" v-db-click>打 印</el-button>
      </span>
    </hgp-dialog>
  </el-card>
</template>
<script src="./js/stock-inventory.js"></script>
<style lang="scss" scoped>
.v-modal {
  z-index: 2000 !important;
}
</style>
<style lang="scss">
.el-message.el-message--warning,
.el-message.el-message--success,
.el-message.el-message--error {
  z-index: 2005 !important;
}
.print-dialog {
  margin-top: 30vh !important;
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
