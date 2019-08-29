<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" :rules="rulesFormInline" id="top-form" data-value="WMS_COMMODITY_FORM" data-sys="WMS">
      <el-row>
        <el-col :span="6" class="input-width">
            <el-form-item label="委托业主" prop="companyName">
              <el-select v-model="formInline.companyName" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable>
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
           <el-form-item label="ABC分类">
             <el-select v-model="formInline.abcTypeName" placeholder="请选择" filterable clearable>
               <el-option
                 v-for="item in abcTypeNameList"
                 :key="item.dictDtlValue"
                 :label="item.dictDtlName"
                 :value="item.dictDtlValue">
               </el-option>
             </el-select>
           </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品类别">
              <el-select v-model="formInline.categoryTopID" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in commodityTypeList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="formInline.enabled" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌">
              <el-select v-model="formInline.brandID" placeholder="请选择" v-loadmore="loadMoreBrandsList" filterable clearable>
                <el-option
                  v-for="item in brandPageDate.data"
                  :key="item.ID"
                  :label="item.Brand_Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准">
              <el-select v-model="formInline.standardId" placeholder="请选择" v-loadmore="loadMoreStandardList" filterable clearable>
                <el-option
                  v-for="item in standardPageDate.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表色">
              <el-select v-model="formInline.surfaceTreatmentName" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in colorList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="强度">
              <el-select v-model="formInline.strengthId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in strengthList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="材质">
              <el-select v-model="formInline.textureId" placeholder="请选择" filterable clearable @clear="onClearTexture">
                <el-option
                  v-for="item in textureList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="材料">
              <el-select v-model="formInline.materialId" placeholder="请选择" @focus="getMaterialDic" filterable clearable>
                <el-option
                  v-for="item in materialList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牙型">
              <el-select v-model="formInline.toothTypeID" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in threadRotationList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="直径">
              <el-select v-model="formInline.nominalSize" placeholder="请选择" v-loadmore="loadMoreNominalSizeList"filterable clearable>
                <el-option
                  v-for="item in nominalSizePageDate.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input v-model="formInline.name" maxLength="100" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="formInline.commodityCode" maxLength="50" clearable></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="6">
              <el-form-item label="规格">
                <el-input v-model="formInline.specification" maxLength="50" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="长度" prop="length">
                <el-input v-model="formInline.length" maxLength="16" clearable></el-input>
              </el-form-item>
            </el-col>
      </el-row>
    </el-form>
    <div class="btn-box" style="text-align: right;">
      <el-button type="primary" class="blue" @click="searchList">查询</el-button>
      <el-button type="primary" class="blue" @click="resetCommodity">重置</el-button>
    </div>

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
        v-for="(v,index) in editBtn"
        :class="v.className"
        :key="index" @click="callFn(v)"
        :type="filteType(v.className)">
        {{v.name}}
      </el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="commodityTitle"
      append-to-body
      :close-on-click-modal="false"
      :before-close="resetForm"
    >
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')" ></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="委托业主编码" prop="companyCode">
              <el-input v-model="form.companyCode" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="委托业主名称" prop="companyName">
              <el-input v-model="form.companyName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="floor-amount-label">
            <el-form-item label="委托业主商品编码" prop="companyCommodityCode">
              <el-input v-model="form.companyCommodityCode" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
        <el-form-item label="商品编码" prop="commodityCode">
          <el-input v-model="form.commodityCode" disabled class="inputWidth"></el-input>
        </el-form-item>
      </el-col>
        <el-col :span="8" >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" disabled class="inputWidth"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="商品英文名称" prop="englishName">
            <el-input v-model="form.englishName" maxLength="50" class="inputWidth"></el-input>
          </el-form-item>
        </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="商品简称" prop="productName">
              <el-input v-model="form.productName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="状态" prop="enabledStatus">
              <el-input v-model="form.enabledStatus" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="商品类别" prop="categoryTopName">
              <el-input v-model="form.categoryTopName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="商品属性" prop="materialTypeName">
              <el-input v-model="form.materialTypeName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="商品识别码" prop="barCodeSignName">
              <el-input v-model="form.barCodeSignName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="标准" prop="standardName">
              <el-input v-model="form.standardName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="直径" prop="nominalSize">
              <el-input v-model="form.nominalSize" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="长度" prop="length">
              <el-input v-model="form.length" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="规格" prop="specification">
              <el-input v-model="form.specification" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="表色" prop="surfaceTreatmentName">
              <el-input v-model="form.surfaceTreatmentName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="材质" prop="textureName">
              <el-input v-model="form.textureName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="强度" prop="strengthName">
              <el-input v-model="form.strengthName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="牙型" prop="toothTypeNames">
              <el-input v-model="form.toothTypeNames" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="材料" prop="materialName">
              <el-input v-model="form.materialName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="包装单位" prop="smallPackageUnitName">
              <el-input v-model="form.smallPackageUnitName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="最小包装数量" prop="smallPackageQt">
              <el-input v-model="form.smallPackageQt" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="最小销售包装" prop="minBuyQty">
              <el-input v-model="form.minBuyQty" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="商品单位" prop="expirationDate">
              <el-input v-model="form.baseUnitName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="ABC分类" prop="abcTypeId">
              <el-select v-model="form.abcTypeId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in abcTypeNameList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="单位材积" prop="volume">
              <el-input v-model="form.volume" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="单位重量" prop="unitWeight">
              <el-input v-model="form.unitWeight" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="计量方式" prop="measureTypeId">
              <el-select v-model="form.measureTypeId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in measureList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="出货标记" prop="exportPermitId">
              <el-select v-model="form.exportPermitId" placeholder="请选择" filterable clearable class="inputWidth" >
                <el-option
                  v-for="item in exportPermitList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="是否规则商品" prop="regularCommidityStatus">
              <el-select v-model="form.regularCommidityStatus" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in regularCommidityList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="质检标识" prop="needCheckId">
              <el-select v-model="form.needCheckId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in needCheckList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="称重标识" prop="needWeightId">
              <el-select v-model="form.needWeightId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in needWeightList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="生产厂家" prop="brandCompanyName">
              <el-input v-model="form.brandCompanyName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="品牌" prop="brandName">
              <el-input v-model="form.brandName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="千支重(kg)" prop="thousandWeight">
              <el-input v-model="form.thousandWeight" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="销售价格" prop="basePrice">
              <el-input v-model="form.basePrice" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="出厂表色标识" prop="factoryTableSign">
              <el-select v-model="form.factoryTableSign" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in factoryTableSignList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="进货验收超量" prop="importBeyondPercent">
              <el-input v-model="form.importBeyondPercent" maxLength="10" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="退仓验收超量" prop="returnBeyondPercent">
              <el-input v-model="form.returnBeyondPercent" maxLength="10" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="拣货超量" prop="pickBeyondPercent">
              <el-input v-model="form.pickBeyondPercent" maxLength="10" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="分播超量" prop="dispatchBeyondPercent">
              <el-input v-model="form.dispatchBeyondPercent" maxLength="10" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="存储条件" prop="storageConditionId">
              <el-select v-model="form.storageConditionId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in storageConditionList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="虚拟商品标识" prop="virtualTypeId">
              <el-select v-model="form.virtualTypeId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in virtualTypeList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="年份" prop="year">
              <el-input v-model="form.year" maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="原商品编码" prop="code">
              <el-input v-model="form.code" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="是否ERP下传" prop="fromErpName">
              <el-input v-model="form.fromErpName" disabled class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="数量抽检标识" prop="amountCheckPercent">
              <el-input v-model="form.amountCheckPercent" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="重量抽检标识" prop="weightCheckPercent">
              <el-input v-model="form.weightCheckPercent" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" >
            <el-form-item label="多人验收标识" prop="multiCheckPermitId">
              <el-select v-model="form.multiCheckPermitId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in multiCheckPermitList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="扫描标识" prop="scanTypeId">
              <el-select v-model="form.scanTypeId" placeholder="请选择" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in scanTypeList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="保质期" prop="expirationDate">
              <el-input v-model="form.expirationDate" maxLength="10" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="16" >
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button  class="blue" type="primary" @click="resetForm" v-db-click>取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script src="./js/commodity.js">
</script>

<style lang="scss" scoped>
#top-form {
  [class*=el-col-] {
    margin-bottom: 8px;
  }
}
</style>

