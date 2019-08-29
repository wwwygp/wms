<template>
  <el-card style="height: calc(100vh);overflow: auto" id="supplier">
    <el-form :inline="true" :model="mainForm" ref="mainForm" class="demo-form-inline" id="form">
        <el-row>
          <el-col :span="6">
              <el-form-item label="委托业主">
                <el-select v-model="mainForm.ownerId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable >
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
            <el-form-item label="供应商">
              <el-select v-model="mainForm.supplierId" placeholder="请选择" v-loadmore="supplierMore" filterable clearable >
                <el-option
                  v-for="item in supplierArr.data"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="储位编码">
              <el-select v-model="mainForm.spaceId" placeholder="请选择" v-loadmore="spaceMore" filterable remote clearable :remote-method="searchSpace" @focus="focusSpace" @clear="clearSpace" @change="changeSpace">
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
            <div class="btn-box" style="text-align: right">
              <el-button type="primary" class='blue' @click="searchList">查询</el-button>
              <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            </div>
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
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
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
    </el-row>
    <self-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="title"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row >
          <el-col :span="8">
              <el-form-item label="委托业主" prop="ownerId">
                <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.ownerName'></el-input>
                <el-select v-model="form.ownerId" placeholder="请选择" v-loadmore="ownersMoreDialog" filterable clearable class='inputWidth' :disabled="updateDisabled" v-else-if="!updateDisabled">
                  <el-option
                    v-for="item in ownersDialogArr.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="supplierId">
              <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.supplierName'></el-input>
              <el-select v-model="form.supplierId" placeholder="请选择" v-loadmore="supplierDialogMore" filterable clearable  class='inputWidth' :disabled="updateDisabled" v-else-if="!updateDisabled">
                <el-option
                  v-for="item in supplierDialogArr.data"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区编码" prop="warehouseAreaId">
              <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.warehouseAreaCode'></el-input>
              <el-select v-model="form.warehouseAreaId" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable @change="selectWarehouseAreaCode" class='inputWidth' :disabled="updateDisabled" v-else-if="!updateDisabled">
                <el-option
                  v-for="item in warehouseAreaCodeData.data"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="储区编码" prop="storageAreaId">
              <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.storageAreaCode'></el-input>
                <el-select v-model="form.storageAreaId" placeholder="请选择" v-loadmore="loadMoreStorageArea" filterable clearable @change="selectStorageCode" class='inputWidth' :disabled="updateDisabled" v-else-if="!updateDisabled">
                  <el-option
                    v-for="item in storageAreaCodeData.data"
                    :key="item.storageAreaId"
                    :label="item.storageAreaCode"
                    :value="item.storageAreaId">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通道编码" prop="channelId">
              <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.channelCode'></el-input>
              <el-select v-model="form.channelId" placeholder="请选择" v-loadmore="loadMoreChannel"  filterable clearable @change="selectChannel" class='inputWidth' :disabled="updateDisabled" v-else-if="!updateDisabled">
                <el-option
                  v-for="item in channelData.data"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- <el-form-item label="储位编码">
              <el-input v-model="form.spaceCode" class='inputWidth' :disabled="updateDisabled"></el-input>
            </el-form-item> -->
            <el-form-item label="储位编码" prop="spaceId">
              <el-input v-if="updateDisabled" :disabled="updateDisabled" class='inputWidth' v-model='form.spaceCode'></el-input>
              <el-select v-model="form.spaceId" placeholder="请选择" v-loadmore="loadMoreDialogSpace" clearable class='inputWidth' filterable remote :remote-method="searchDialogSpace" @focus="focusDialogSpace" @clear="clearDialogSpace" @change="changeDialogSpace" :disabled="updateDisabled" v-else-if="!updateDisabled">
                <el-option
                  v-for="item in spaceDialogArr.data"
                  :key="item.spaceId"
                  :label="item.spaceCode"
                  :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="预上数量">
              <el-input v-model="form.predictUpAmount" class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预下数量">
              <el-input v-model="form.predictDownAmount" class='inputWidth'></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" class='inputWidth'>
                <el-option
                  v-for="item in status"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" style="width: 500px;" maxLength="256"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="8">
            <el-form-item label="已使用体积">
              <el-input v-model="form.usedVolume" class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="blue" @click="submitForm('form')" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
    
  </el-card>
</template>
<script src="./js/index.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>
  
</style>
<style lang="scss">
  #date-width{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 110px;
    }
  }
  #supplier {
    .inputWidth {
      width: 200px !important;
    }
    .el-form-item__error {
      margin-right: 40px;
    }
  }
</style>