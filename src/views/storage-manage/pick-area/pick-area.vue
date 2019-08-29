<template>
  <el-card style="height: calc(100vh);overflow: auto" class="automatic">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline automatic-form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="拣货库区:">
              <el-select v-model="formInline.warehouseAreaId" placeholder="请选择" filterable clearable @change="selectWarehouseAreaCode">
                <el-option
                  v-for="item in warehouseAreaData"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拣货储区">
              <el-select v-model="formInline.storageAreaId" placeholder="请选择" v-loadmore="loadMoreStorageList" filterable clearable @change="getAblePickChannelList">
                <el-option
                  v-for="item in storagePageData.data"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拣货通道">
              <el-select v-model="formInline.channelId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable >
                <el-option
                  v-for="item in channelPageData.data"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button  type="primary" class="blue" @click="searchList">查询</el-button>
            <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row :gutter="14" style="margin-top: -20px;">
      <el-col :span="10">
        <el-row id='automatic'>
          <table-configure
            ref="tableConfig"
            :data-table="dataTable"
            :table-code="dataTable.tableName"
            @tableDataHandle="tableDataHandle"
            @onHandleSelectionChange="onHandleSelectionChange"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          >
          </table-configure>
        </el-row>
        <el-row>
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
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row>
          <table-configure
            v-if="heightResize"
            ref="dataTableConfig"
            :data-table="dataTableDetail"
            :table-code="dataTableDetail.tableName"
            @onHandleSelectionChange="onHandleSelectionChangeDtl"
            @tableDataHandle="dataTableDetailDataHandle"
            @handleSizeChange="handleDetailSizeChange"
            @handleCurrentChange="handleDetailCurrentChange"
          >
          </table-configure>
        </el-row>
        <el-row>
          <div class="btn-box">
            <el-button
              v-db-click
              v-for="(v,index) in dtlBtnList"
              :class="v.className"
              :key="index" @click="callFn(v)"
              :type="filteType(v.className)">
              {{v.name}}
            </el-button>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <self-dialog
      :visible.sync="dialogVisible"
      width="60%"
      custom-class="minWidth tableConfigDialog"
      :title="pickStorageTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')">
      </tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="拣货库区:" prop="warehouseAreaId">
              <el-select v-model="form.warehouseAreaId" placeholder="请选择" filterable clearable @change="getAblePickStorageAreaListAdd" >
                <el-option
                  v-for="item in warehouseAreaData"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货储区" prop="storageAreaId">
              <el-select v-model="form.storageAreaId" placeholder="请选择" v-loadmore="loadMoreStorageList" filterable clearable @change="getAblePickChannelListAdd" >
                <el-option
                  v-for="item in storageAddPageData.data"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货通道">
              <el-select v-model="form.channelId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable class="inputWidth">
                <el-option
                  v-for="item in channelAddPageData.data"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
    <self-dialog
      :visible.sync="dialogVisibleDtl"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="pickStorageDtlTitle"
      :modal-append-to-body="false"
      :before-close="closeDialogDtlForm"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('dtlForm')"></tips-dialog>
      <el-form :model="dtlForm" ref="dtlForm" :rules="dtlRulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="拣货库区:" prop="storageAreaCode">
                <el-input v-model="dtlForm.warehouseAreaCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货储区" prop="storageAreaCode">
                <el-input v-model="dtlForm.storageAreaCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货通道">
                <el-input v-model="dtlForm.channelCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="保拣库区:" prop="warehouseAreaId">
              <el-select v-model="dtlForm.warehouseAreaId" placeholder="请选择" filterable clearable @change="getDtlAblePickStorageAreaListAdd" >
                <el-option
                  v-for="item in warehouseAreaData"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保拣储区" prop="storageAreaId">
              <el-select v-model="dtlForm.storageAreaId" placeholder="请选择" v-loadmore="loadMoreAddStorageDtlList" filterable clearable @change="getAblePickChannelListAddDtl" >
                <el-option
                  v-for="item in storagePageDtlData.data"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保拣通道">
              <el-select v-model="dtlForm.channelId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable class='inputWidth'>
                <el-option
                  v-for="item in channelPageDtlData.data"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优先级别:" prop="priority">
              <!--<el-input v-model="dtlForm.priority" style="width: 100px" maxLength="4"></el-input>-->
              <el-input v-model="dtlForm.priority" maxLength="4" placeholder="请输入1-1000的数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可作业标识" prop="operationPermitId">
              <el-select v-model="dtlForm.operationPermitId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable >
                <el-option
                  v-for="item in operationPermitData"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class='label-width'>
            <el-form-item label="拣货位上方货位标识" prop="pickAboveId">
              <el-select v-model="dtlForm.pickAboveId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable >
                <el-option
                  v-for="item in pickAboveData"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDtlForm('dtlForm')" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetDtlForm('dtlForm')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialogDtl" @handleOkTip="removeDtlRow"></tips-dialog>
    <self-dialog
      :visible.sync="dialogVisibleDtlUpdate"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="pickStorageDtlUpdateTitle"
      :modal-append-to-body="false"
      :before-close="closeDialogDtlUpdateForm"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('dtlUpdateForm')">
      </tips-dialog>
      <el-form :model="dtlUpdateForm" ref="dtlUpdateForm" :rules="dtlRulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="拣货库区:" >
              <el-input v-model="dtlUpdateForm.warehouseAreaCodeMain" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货储区" >
              <el-input v-model="dtlUpdateForm.storageAreaCodeMain" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拣货通道">
              <el-input v-model="dtlUpdateForm.channelCodeMain" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="保拣库区:" >
              <el-input v-model="dtlUpdateForm.warehouseAreaCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保拣储区">
              <el-input v-model="dtlUpdateForm.storageAreaCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保拣通道">
              <el-input v-model="dtlUpdateForm.channelCode" disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优先级别:">
              <el-input v-model="dtlUpdateForm.priority"  disabled class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可作业标识" prop="operationPermitId">
              <el-select v-model="dtlUpdateForm.operationPermitId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable>
                <el-option
                  v-for="item in operationPermitData"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class='label-width'>
            <el-form-item label="拣货位上方货位标识" prop="pickAboveId">
              <el-select v-model="dtlUpdateForm.pickAboveId" placeholder="请选择" v-loadmore="loadMoreChannelList" filterable clearable>
                <el-option
                  v-for="item in pickAboveData"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDtlUpdateForm('dtlUpdateForm')" class="blue" v-db-click>保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetDtlUpdateForm('dtlUpdateForm')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
  </el-card>
</template>
<script src="./js/pick-area.js"></script>
<style lang="scss">
  .label-width {
    .el-form-item label {
      width: 140px !important;
    }
    .is-required .el-select {
      width: calc(100% - 140px) !important;
    }
  }
  #automatic {
    .el-pagination .el-select .el-input {
      width: 85px;
    }
    .el-pagination__jump{
      margin-left: 5px;
    }
    .el-pagination .btn-next span, .el-pagination .btn-prev span {
      padding: 0px 5px;
    }
  }
</style>

