<template>
  <el-card style=" overflow: auto">
    <el-row id="top-form">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="库区编码" prop="warehouseAreaCode">
            <!--warehouseAreaId-->
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.warehouseAreaCode" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="selectWarehouseAreaCode">
                <el-option
                  v-for="item in warehouseAreaCode"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaCode">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="储区编码" prop="storageCodeId">
            <el-row>
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.storageCodeId" placeholder="请选择" v-loadmore="loadMoreStorageArea" filterable clearable @change="selectStorageCode">
                <el-option
                  v-for="item in storageAreaCode"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item label="通道全称" prop="channel">
            <el-row>
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
              <el-select v-model="formInline.channel" placeholder="请选择" v-loadmore="loadMoreChannel"  filterable clearable @change="selectChannel">
                <el-option
                  v-for="item in channelData"
                  :key="item.channelId"
                  :label="item.channelName"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="24">
              <el-form-item label="储位编码" prop="spaceCode">
                <el-row>
                  <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
                  <el-input v-model="formInline.spaceCode" maxLength="20"></el-input>
                </el-row>
              </el-form-item>
              <el-form-item label="储格列" prop="storageColumnCode">
                <el-row>
                  <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
                  <el-input v-model="formInline.storageColumnCode" maxLength="20"></el-input>
                </el-row>
              </el-form-item>
              <el-form-item label="储格位" prop="columnSpaceCode">
                <el-row>
                  <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
                  <el-input v-model="formInline.columnSpaceCode" maxLength="20"></el-input>
                </el-row>
              </el-form-item>
              <el-form-item label="储格层" prop="storageRowCode">
                <el-row>
                  <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
                  <el-input v-model="formInline.storageRowCode" maxLength="20"></el-input>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-col>
      <el-col :span="24">
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
      :center-dom="centerSlot"
    >

      <!--<div v-for="item in centerSlot">-->
        <!--<a href="javascript;" slot="remark">我是最外层的slot</a>-->
      <!--</div>-->
      <!-- <template> -->
        
      <!-- </template> -->
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
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <tips-dialog :parent-data="saveDialog" @handleOkTip="saveSpaceData" @handleNoTip="handleNoTip">
      </tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="库区编码" prop="warehouseAreaId">
              <el-select v-model="form.warehouseAreaId" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="changeWareHouse" :disabled="storageAreaTitle == '修改'">
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
            <el-form-item label="库区名称" prop="warehouseAreaName" >
              <el-input v-model="form.warehouseAreaName" class="inputWidth" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="储区编码" prop="storageAreaCode">
              <el-select v-model="form.storageAreaCode" placeholder="请选择" v-loadmore="loadMoreStorageArea" filterable clearable @change="selectStorageAreaCode" :disabled="storageAreaTitle == '修改'">
                <el-option
                  v-for="item in storageAreaCode"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储区名称" prop="storageAreaName">
              <el-input class="inputWidth" v-model="form.storageAreaName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="混载标识" prop="commodityMixtureId">
              <el-select v-model="form.commodityMixtureId" placeholder="请选择" clearable >
                <el-option
                  v-for="item in commodityMixture"
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
            <el-form-item label="通道编码" prop="channel">
              <el-select v-model="form.channel" placeholder="请选择" v-loadmore="loadMoreChannel"  filterable clearable @change="selectChannelCode" :disabled="storageAreaTitle == '修改'">
                <!--getAllChannel-->
                <el-option
                  v-for="item in channelData"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通道全称" prop="channelName">
              <el-input class="inputWidth" v-model="form.channelName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="label-width">
            <el-form-item label="供应商混载标识" prop="supplierMixtureId">
              <el-select v-model="form.supplierMixtureId" placeholder="请选择" clearable >
                <el-option
                  v-for="item in supplierMixture"
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
            <el-form-item label="储格列" prop="storageColumnCode">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input class="inputWidth" v-model="form.storageColumnCode" :disabled="storageAreaTitle == '修改'" :maxLength="columnMaxLength" @blur="handleCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储格位" prop="columnSpaceCode">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input class="inputWidth" v-model="form.columnSpaceCode" :disabled="storageAreaTitle == '修改'" :maxLength="positionMaxLength" @blur="handleCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储格层" prop="storageRowCode">
              <el-input class="inputWidth" v-model="form.storageRowCode" :disabled="storageAreaTitle == '修改'" :maxLength="layerMaxLength" @blur="handleCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="储位编码" prop="spaceCode">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input v-model="form.spaceCode" class="inputWidth" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储板数" prop="palletMaximum">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input v-model="form.palletMaximum" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储箱数" prop="caseMaximum">
              <el-input v-model="form.caseMaximum" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储重量" prop="weightMaximum">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input v-model="form.weightMaximum" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大存储体积" prop="volumeMaximum">
              <!--<el-select v-model="form.attributeTypeId" placeholder="请选择" clearable >-->
              <!--<el-option-->
              <!--v-for="item in attributeType"-->
              <!--:key="item.dictDtlValue"-->
              <!--:label="item.dictDtlName"-->
              <!--:value="item.dictDtlValue">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-input v-model="form.volumeMaximum" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器试算标识" prop="volumeEstimateId">
              <el-select v-model="form.volumeEstimateId" placeholder="请选择" clearable >
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
          <el-col :span="8">
            <el-form-item label="限制值" prop="limitValue">
              <el-input v-model="form.limitValue" maxLength="11"></el-input>
            </el-form-item>
          </el-col>
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

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否A类储位" prop="atypeStorageSpace">
              <!--atypeStorageChannel-->
              <el-select class="inputWidth" v-model="form.atypeStorageSpace" placeholder="请选择" clearable >
                <el-option
                  v-for="item in atypeStorage"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="储位状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" clearable >
                <el-option
                  v-for="item in statusType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点状态" prop="physicalInventoryStatus">
              <el-select v-model="form.physicalInventoryStatus" placeholder="请选择" clearable :disabled="storageAreaTitle == '修改'">
                <el-option
                  v-for="item in physicalInventoryStatusType"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" class="inputWidth" maxLength="256"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetForm('form')" v-db-click>取 消</el-button>
        <!--<el-button type="primary" class="blue" @click="createChannel('form')" v-db-click v-show="isShow">生成通道</el-button>-->
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
    <tips-dialog :parent-data="useStatusDialog" @handleOkTip="useStatusSure">
    </tips-dialog>
    <tips-dialog :parent-data="disabledStatusDialog" @handleOkTip="disabledStatusSure">
    </tips-dialog>
    <el-dialog
      :visible.sync="printDialogVisible"
      width="400px"
      title="打印"
      :close-on-click-modal="false"
    >
      <!--<p>打印库区编码为<span>{{formInline.warehouseAreaCode}}</span>下的储区编码为<span>{{formInline.storageAreaCode}}</span>下的通道全称为 <span>{{formInline.channel}}</span>下的储位编码为 <span>{{formInline.spaceCode}}</span>的储位标签</p>-->
      <!--<el-alert-->
        <!--title=""-->
        <!--type="warning"-->
        <!--:description="文字说明文字说明文字说明文字说明文字说明文字说明"-->
        <!--show-icon>-->
      <!--</el-alert>-->
      <p>
        <span v-show="formInline.warehouseAreaCode != ''">{{formInline.warehouseAreaCode}}></span>
        <span v-show="formInline.storageAreaCode != ''">{{formInline.storageAreaCode}}></span><!--因为表格绑定的storageAreaCode是id值，js用到所以先用-->
        <span v-show="formInline.channelName != ''">{{formInline.channelName}}></span>
        <span v-show="formInline.spaceCode != ''">{{formInline.spaceCode}}></span>
        <span>储位标签打印</span>
      </p>
      <el-select v-model="parintData" placeholder="请选择" v-loadmore="loadMoreChannel"  filterable clearable @change="getSpacePrintType">
        <el-option
          v-for="item in printTypeData"
          :key="item.template_id"
          :label="item.template_name"
          :value="item.template_id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printOk" class="blue" :disabled="printShow">打 印</el-button>
        <el-button @click="canelPrint" type="primary" class="blue">取 消</el-button>
      </span>
    </el-dialog>


  </el-card>
</template>
<script src="./js/space.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>

</style>
