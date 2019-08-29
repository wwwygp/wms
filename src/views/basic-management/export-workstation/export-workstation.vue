<template>
  <el-card style=" overflow: auto">
  	<el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-row :gutter="24" id="top-form">
      <el-col :span="6">
          <el-form-item label="工作站" prop="wharfId">
          <el-row>
            <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
            <el-select v-model="formInline.wharfId" placeholder="请选择" v-loadmore="loadMoreWharf" filterable clearable>
              <el-option
                v-for="item in wharf"
                :key="item.wharfId"
                :label="item.wharfName"
                :value="item.wharfId">
              </el-option>
            </el-select>
          </el-row>
          </el-form-item>
      </el-col>
      <el-col :span="7">
          <el-form-item label="下架类型">
            <el-select v-model="formInline.takeDownTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in takeDownTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      <el-col :span="6">
        <div class="btn-box" >
          <el-button type="primary" class='blue' @click="searchList">查询</el-button>
          <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          <!--// 目前只配置了红黄蓝。-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
    	<el-col :span="6" >
        <el-form-item label="库区编码">
          <el-select v-model="formInline.warehouseAreaId" placeholder="请选择" clearable @clear="onClearWarehouseList" @change="onSelectWarehouseCounts">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseAreaId"
              :label="item.warehouseAreaCode"
              :value="item.warehouseAreaId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" >
            <el-form-item label="储区编码">
              <el-select v-model="formInline.storageAreaId" placeholder="请选择"  @focus="getStorageListByPage" filterable clearable @clear="onClearStorage" @change="onSelectStorageCounts">
                <el-option
                  v-for="item in storageAreaList"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
      </el-col>
      <el-col :span="6" >
            <el-form-item label="通道编码">
              <el-select v-model="formInline.channelId" placeholder="请选择" @focus="getChannelListByPage" filterable clearable @clear="onClearChannel" @change="onSelectChannelCounts">
                <el-option
                  v-for="item in channelCodeList"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
      </el-col>
       <el-col :span="6" >
            <el-form-item label="暂存区编码">
              <el-input v-model="formInline.tmpStorageCode" ></el-input>
            </el-form-item>
       </el-col>
    </el-row>
    </el-form>
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
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝绿。-->
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
      :title="wharfTitle"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')"></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row :gutter="16">
        	 <!--<el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-input v-model="form.warehouseId" class="inputWidth" maxLength="50"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
          <el-form-item label="工作站" prop="wharfId">
          <el-row>
            <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
            <el-select v-model="form.wharfId" placeholder="请选择" v-loadmore="loadMoreWharf" filterable clearable>
              <el-option
                v-for="item in wharf"
                :key="item.wharfId"
                :label="item.wharfName"
                :value="item.wharfId">
              </el-option>
            </el-select>
          </el-row>
          </el-form-item>
          </el-col>
         <el-col :span="8">
          <el-form-item label="下架类型" prop="takeDownTypeId">
            <el-select v-model="form.takeDownTypeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in takeDownTypeWay"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
            <el-form-item label="库区编码" prop="warehouseAreaId">
              <el-select v-model="form.warehouseAreaId" placeholder="请选择" clearable @clear="onClearInsWarehouseList" @change="onSelectInsWarehouseCounts">
                <el-option
                  v-for="item in insWarehouseList"
                  :key="item.warehouseAreaId"
                  :label="item.warehouseAreaCode"
                  :value="item.warehouseAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8" >
            <el-form-item label="储区编码" prop="storageAreaId">
              <el-select v-model="form.storageAreaId" placeholder="请选择"  @focus="getInsStorageListByPage" filterable clearable @clear="onClearInsStorage" @change="onSelectInsStorageCounts">
                <el-option
                  v-for="item in insStorageAreaList"
                  :key="item.storageAreaId"
                  :label="item.storageAreaCode"
                  :value="item.storageAreaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="通道编码" prop="channelId">
              <el-select v-model="form.channelId" placeholder="请选择" @focus="getInsChannelListByPage" filterable clearable @clear="onClearInsChannel" @change="onSelectInsChannelCounts">
                <el-option
                  v-for="item in insChannelCodeList"
                  :key="item.channelId"
                  :label="item.channelCode"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
        		<el-form-item label="暂存区编码" prop="tmpStorageCode">
              <el-input v-model="form.tmpStorageCode" class="inputWidth" :disabled = true></el-input>
           </el-form-item>
       </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"  maxLength="50" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="blue" @click="submitForm('form')" v-db-click>保 存</el-button>
        <el-button type="primary" class="blue" @click="resetForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
    
  </el-card>
</template>
<script src="./js/export-workstation.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
