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
              <el-select v-model="formInline.storageAreaCode" placeholder="请选择" v-loadmore="loadMoreStorageArea" filterable clearable @change="selectStorageCode">
                <el-option
                  v-for="item in storageAreaCode"
                  :key="item.storageAreaCode"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaCode">
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item label="通道全称" prop="channel">
            <el-row>
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.channel" placeholder="请选择" v-loadmore="loadMoreChannel" filterable clearable >
                <el-option
                  v-for="item in channel"
                  :key="item.channelName"
                  :label="item.channelName"
                  :value="item.channelName">
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
      :title="channelTitle"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      append-to-body
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')"></tips-dialog>
        <!-- 修改过数据，点击生成通道提示 -->
      <tips-dialog :parent-data="isCreateDialog" @handleOkTip="createChannelDialog('form')"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="库区编码" prop="warehouseAreaId">
              <el-select :disabled="channelTitle == '修改'" v-model="form.warehouseAreaId" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="selectFormWarehouseAreaCode">
                <el-option
                  v-for="item in warehouseAreaCode"
                  :key="item.warehouseAreaCode"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区名称" prop="warehouseAreaName">
              <el-input v-model="form.warehouseAreaName" class="inputWidth" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="储区编码" prop="storageAreaId">
              <el-select :disabled="channelTitle == '修改'" v-model="form.storageAreaId" placeholder="请选择" v-loadmore="loadMorestorageAreaArea" filterable clearable @change="selecFormStorage">
                <el-option
                  v-for="item in storageAreaCodeForm"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区名称" prop="storageAreaName">
              <el-input v-model="form.storageAreaName" class="inputWidth" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="储区类型" prop="typeId">
              <el-select v-if="channelTitle == '新增'" class="inputWidth" v-model="form.typeId" placeholder="请选择" clearable :disabled="updateDisabled" filterable>
                <el-option
                  v-for="item in storageAreaType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
              <el-input v-else v-model="form.storageAreaTypeName" :disabled="updateDisabled" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="通道编码" prop="channelCode">
              <el-input v-model="form.channelCode" class="inputWidth" :maxLength="codeSize" :disabled="addDisables"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通道全称" prop="channelName">
              <el-input v-model="form.channelName" class="inputWidth" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通道排序方式" prop="sortTypeId">
              <el-select v-model="form.sortTypeId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in channelSortType"
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
            <el-form-item label="通道格数" prop="columnAmount">
              <el-input v-model.number="form.columnAmount" class="inputWidth" maxLength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储格位数" prop="columnSpaceAmount">
              <el-input v-model="form.columnSpaceAmount" class="inputWidth" maxLength="1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通道层数" prop="rowAmount">
              <el-input v-model="form.rowAmount" class="inputWidth" maxLength="1"></el-input>
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
            <el-form-item label="供应商混载标识" prop="supplierMixtureId" >
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
            <el-form-item label="通道状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in channelStatus"
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
            <el-form-item label="最大存储板数" prop="palletMaximum">
              <el-input v-model="form.palletMaximum" class="inputWidth" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储箱数" prop="caseMaximum">
              <el-input v-model.number="form.caseMaximum" class="inputWidth" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储重量" prop="weightMaximum">
              <el-input v-model.number="form.weightMaximum" class="inputWidth" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最大存储体积" prop="volumeMaximum">
              <el-input v-model="form.volumeMaximum" class="inputWidth" maxLength="11"></el-input>
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
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="限制值" prop="limitValue">
              <el-input v-model="form.limitValue"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="允许拣货标识" prop="pickPermit">
              <el-select v-model="form.pickPermit" placeholder="请选择" clearable >
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
            <el-form-item label="是否A类通道" prop="atypeStorageChannel">
              <el-select v-model="form.atypeStorageChannel" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in atypeChannel"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总储位数" prop="totalSpace">
              <el-input v-model.number="form.totalSpace" class="inputWidth" maxLength="11" :disabled="addDisables"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8">
            <el-form-item label="已占储位数" prop="usageSpace">
              <el-input v-model="form.usageSpace" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col :span="8">
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
        </el-col>
      </el-row>-->
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetForm('form')" v-db-click>取 消</el-button>
        <el-button type="primary" class="blue" @click="createSpace('form')" v-db-click v-show="addDisables">生成储位</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>

  </el-card>
</template>
<script src="./js/channel.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>

</style>
