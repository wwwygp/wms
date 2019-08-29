<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row id="top-form">
        <el-col :span="6" >
          <el-form-item label="委托业主名称">
            <el-select v-model="formInline.companyName" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable>
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
          <el-form-item label="储位编码">
            <el-select v-model="formInline.spaceCode" placeholder="请选择" filterable clearable v-loadmore="spaceMore" remote :remote-method="searchSpace" @focus="focusSpace" @clear="clearSpace" @change="changeSpace">
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
          <el-form-item label="商品编码" >
            <el-input v-model="formInline.commodityCode"  maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: left">
          <el-button type="primary" class="blue" @click="searchList">查询</el-button>
          <el-button type="primary" class="blue" @click="resetCommodityStorage">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

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
        v-for="(v,index) in btnList"
        :class="v.className"
        :key="index" @click="callFn(v)"
        :type="filteType(v.className)">
        {{v.name}}
      </el-button>
    </div>

    <el-dialog title="导入文件" :visible.sync="excelImportShow">
      <el-upload class="upload-demo" :limit="1" :file-list="fileList" :before-upload="beforeUpload" action="https://internal-dev.51hgp.com/erp_development">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" style="position: fixed;margin-top: -25px;margin-left: 100px;" class="el-upload__tip">只能上传excel文件</div>
        <!--<a href="#" rel="external nofollow" download="模板">-->
        <el-button size="small" style="position: fixed;
    margin-left: 160px;" type="success" @click="exportCommodityStorage(false)">下载模板</el-button>
        <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue" type="primary" @click.native="excelImportShow = false">取消</el-button>
        <el-button class="blue" type="primary" @click.native="submitUpload()" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

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
      <el-row>
        <el-col :span="8" >
          <el-form-item label="委托业主" prop="ownerName">
            <el-select v-model="form.ownerName" placeholder="请选择" v-loadmore="loadMoreOwnerList"
              :disabled="updateDisabled" class="inputWidth" filterable clearable>
              <el-option
                v-for="item in ownersPageDate.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="商品编码" prop="commodityCode">
            <el-input v-model="form.commodityCode"  maxLength="50" :disabled="updateDisabled" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="包装数量" prop="packageCommodityAmount">
            <el-select v-model="form.packageCommodityAmount" placeholder="请选择" clearable>
              <el-option
                v-for="item in packageAmounts"
                :key="item.packageId"
                :label="item.packageAmount"
                :value="item.packageAmount">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" >
          <el-form-item label="库区编码" prop="warehouseAreaId">
            <el-select v-model="form.warehouseAreaId" placeholder="请选择" clearable @clear="onClearWarehouseList" @change="onSelectWarehouseCounts">
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseAreaId"
                :label="item.warehouseAreaCode"
                :value="item.warehouseAreaId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="A类最大存储量" prop="atypeMaxAmount" class="floor-amount-label">
            <el-input v-model="form.atypeMaxAmount" class="inputWidth" maxLength="9" @change="aMaxAmountCheckout"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="非A类最大存储量" prop="notAMaxAmount" class="floor-amount-label">
            <el-input v-model="form.notAMaxAmount" class="inputWidth" maxLength="9" @change="bMaxAmountCheckout"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" >
          <el-form-item label="储区编码" prop="storageAreaCode">
            <el-select v-model="form.storageAreaCode" placeholder="请选择" @focus="getStorageListByPage" filterable clearable @clear="onClearStorage" @change="onSelectStorageCounts">
              <el-option
                v-for="item in storageAreaList"
                :key="item.storageAreaId"
                :label="item.storageAreaCode"
                :value="item.storageAreaId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="A类补货警示量" prop="atypeAlarmAmount" class="floor-amount-label">
            <el-input v-model="form.atypeAlarmAmount" class="inputWidth" maxLength="9"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="非A类补货警示量" prop="notAAlarmAmount" class="floor-amount-label">
            <el-input v-model="form.notAAlarmAmount" class="inputWidth" maxLength="9"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" >
          <el-form-item label="通道编码" prop="channelId">
            <el-select v-model="form.channelId" class="inputWidth" placeholder="请选择" @focus="getChannelListByPage" filterable clearable @clear="onClearChannel" @change="onSelectChannelCounts">
              <el-option
                v-for="item in channelCodeList"
                :key="item.channelId"
                :label="item.channelCode"
                :value="item.channelId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="A类循环补货触发量" prop="atypeCyclicAlarmAmount" class="floor-amount-label">
            <el-input v-model="form.atypeCyclicAlarmAmount" class="inputWidth" maxLength="9" @change="aMaxAmountCheckout"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="非A类循环补货触发量" prop="notACyclicAlarmAmount" class="case-floor-amount-label">
            <el-input v-model="form.notACyclicAlarmAmount" class="inputWidth" maxLength="9" @change="bMaxAmountCheckout"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" >
          <el-form-item label="储位编码" prop="spaceId">
            <el-select v-model="form.spaceId" 
            filterable 
            clearable 
            class="inputWidth" 
            placeholder="请选择" 
            v-loadmore="loadMoreSpeaceListByChannel"
            @focus="getSpeaceListByChannel" 
            @clear="onClearSpace" 
            @change="onSelectSpaceCounts">
              <el-option
                v-for="item in spaceChannelPageDate.data"
                :key="item.spaceId"
                :label="item.spaceCode"
                :value="item.spaceId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="A类最大可用储位数" prop="atypeMaxSpaceAmount" class="floor-amount-label">
            <el-input v-model="form.atypeMaxSpaceAmount" class="inputWidth" maxLength="9"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="非A类最大可用储位数" prop="notAMaxSpaceAmount" class="case-floor-amount-label">
            <el-input v-model="form.notAMaxSpaceAmount" class="inputWidth" maxLength="9"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" >
          <el-form-item label="品项数" prop="commodityTypeAmount">
            <el-input v-model="form.commodityTypeAmount" disabled class="inputWidth"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="拣货位类型" prop="pickCommodityTypeId">
            <!--<el-input v-model="form.pickCommodityTypeName" disabled class="inputWidth"></el-input>-->
            <el-select v-model="form.pickCommodityTypeId" placeholder="请选择" :disabled="updateDisabled" filterable clearable class="inputWidth" disabled>
              <el-option
                v-for="item in pickCommodityTypeList"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" class="inputWidth" maxLength="256"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
      <el-button  class="blue" type="primary" @click="resetForm" v-db-click>取 消</el-button>
    </span>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
  </el-card>
</template>


<script src="./js/commodityStorage.js">
</script>

<style scoped>

</style>
