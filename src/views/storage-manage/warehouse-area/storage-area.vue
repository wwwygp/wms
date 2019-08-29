<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row id="top-form">
      <el-col :span="16">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="库区编码" prop="warehouseAreaCode">
            <el-row>
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.warehouseAreaCode" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="selectWarehouseAreaCode">
                <el-option
                  v-for="item in warehouseAreaCode"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaCode">
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item label="储区编码" prop="storageAreaCode">
            <el-row>
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.storageAreaCode" placeholder="请选择" v-loadmore="loadMoreStorageArea" filterable clearable >
                <el-option
                  v-for="item in storageAreaCode"
                  :key="item.storageAreaCode"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaCode">
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div class="btn-box" style="text-align: right">
          <!--// 目前只配置了红黄蓝。-->
          <el-button type="primary" class='blue' @click="searchList">查询</el-button>
          <el-button type="primary" class='blue' @click="resetList">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <!--// 表格控件-->
    <!--heightResize 这个是为了让组件适用用户的操作-->
    <!--onRowClick 行点击事件-->
    <!--onHandleSelectionChange多选框事件-->
    <!--tableDataHandle数据处理事件-->
    <!--handleSizeChange分页size事件-->
    <!--handleCurrentChange分页页码选择事件-->
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
    <el-col :span="8">
      <div class="btn-box" style="text-align: left;">
        <!--// 目前只配置了红黄蓝。-->
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
    <self-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="storageAreaTitle"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')"></tips-dialog>
      <!-- 修改过数据，点击生成通道提示 -->
      <tips-dialog :parent-data="isCreateDialog" @handleOkTip="createChannelDialog('form')"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="库区编码" prop="warehouseAreaId">
              <el-select :disabled="storageAreaTitle == '修改'" v-model="form.warehouseAreaId" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="selectFormWarehouseAreaCode" >
                <el-option
                  v-for="item in warehouseAreaCode"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区名称" prop="warehouseAreaName">
              <el-input v-model="form.warehouseAreaName" class="inputWidth" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="储区编码" prop="storageAreaCode">
              <el-input v-model="form.storageAreaCode" class="inputWidth" :disabled="updateDisabled" :maxLength="codeSize"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区名称" prop="storageAreaName">
              <el-input v-model="form.storageAreaName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区类型" prop="typeId">
              <el-select v-model="form.typeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in storageAreaType"
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
            <el-form-item label="储区用途" prop="purposeId">
              <el-select v-model="form.purposeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in storageAreaPurpose"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区品质" prop="qualityId">
              <el-select v-model="form.qualityId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in storageAreaQuality"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区属性" prop="attributeId">
              <el-select v-model="form.attributeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in storageAreaAttribute"
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
            <el-form-item label="混载标识" prop="commodityMixtureId">
              <el-select v-model="form.commodityMixtureId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in commodityMixture"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="label-width">
            <el-form-item label="供应商混载标识" prop="supplierMixtureId">
              <el-select v-model="form.supplierMixtureId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in supplierMixture"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性类型" prop="attributeTypeId">
              <el-select v-model="form.attributeTypeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in attributeType"
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
            <el-form-item label="作业类型" prop="operationTypeId">
              <el-select v-model="form.operationTypeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in operationType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储托盘数" prop="palletMaximum">
              <el-input v-model="form.palletMaximum" class="inputWidth" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储箱数" prop="caseMaximum">
              <el-input v-model="form.caseMaximum" class="inputWidth" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="通道数量" prop="channelAmount">
              <el-input v-model="form.channelAmount" maxLength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否拣货区" prop="whetherPickArea">
              <el-select v-model="form.whetherPickArea" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in whetherPickArea"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否A类储区" prop="atypeStorageArea">
              <el-select v-model="form.atypeStorageArea" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in atypeStorage"
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
            <el-form-item label="允许拣货标识" prop="pickPermit">
              <el-select v-model="form.pickPermit" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in pickPermit"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层" prop="floor">
              <el-input v-model="form.floor" class="inputWidth" maxLength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="板出比率" prop="palletPercentage">
              <el-input v-model="form.palletPercentage" maxLength="3"></el-input>
            </el-form-item>
            <span class="percent">%</span>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="板入比率" prop="palletIntoPercentage">
              <el-input v-model="form.palletIntoPercentage"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="入库类型限制" prop="limitTypeId">
              <el-select v-model="form.limitTypeId" placeholder="请选择" clearable >
                <el-option
                  v-for="item in limitType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="限制值" prop="limitValue">
              <el-input v-model="form.limitValue" :maxLength="3" ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="容器试算标识" prop="volumeEstimateId">
              <el-select v-model="form.volumeEstimateId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in volumeEstimate"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" maxLength="256" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetForm('form')" v-db-click>取 消</el-button>
        <el-button type="primary" class="blue" @click="createChannel('form')" v-db-click v-show="addDisables">生成通道</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>

  </el-card>
</template>
<script src="./js/storage.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>

</style>
