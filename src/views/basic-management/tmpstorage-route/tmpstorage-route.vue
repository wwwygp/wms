<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row id="top-form">
        <el-col :span="6">
          <el-form-item label="线路名称">
            <el-select v-model="formInline.routeId" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in routeList"
                :key="item.routeId"
                :label="item.routeName"
                :value="item.routeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in statusList"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-button  type="primary" class="blue" @click="findBtn">查询</el-button>
          <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="储区编码">
            <el-select v-model="formInline.storageAreaId" placeholder="请选择" @focus="getStorageListByPage" filterable clearable @clear="onClearStorage" @change="onSelectStorageCounts">
              <el-option
                v-for="item in storageAreaList"
                :key="item.storageAreaId"
                :label="item.storageAreaCode"
                :value="item.storageAreaId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="储位编码">
            <el-select v-model="formInline.spaceId" placeholder="请选择" v-loadmore="loadMoreSpeaceListByChannel"
                       @focus="getSpeaceListByChannel" filterable clearable>
              <el-option
                v-for="item in spaceChannelPageDate.data"
                :key="item.spaceId"
                :label="item.spaceCode"
                :value="item.spaceId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="14">
      <el-col :span="10">
        <table-configure
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="dataTable.tableName"
          @onRowClick="onRowClick"
          @tableDataHandle="tableDataHandle"
          @onHandleSelectionChange="onHandleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        </table-configure>
      </el-col>
      <el-col :span="14">
        <table-configure
          v-if="heightResize"
          ref="dataTableConfig"
          :data-table="dataTableDetail"
          :table-code="dataTableDetail.tableName"
          @onRowClick="onRowClick"
          @tableDataHandle="dataTableDetailDataHandle"
          @onHandleSelectionChange="onHandleDtlSelectionChange"
        >
        </table-configure>
      </el-col>
    </el-row>
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

    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="tmpRouteTitle"
      append-to-body
      :close-on-click-modal="false"
      :before-close="resetForm"
    >
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')" ></tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
          <el-row>
          <el-col :span="8" >
            <el-form-item label="线路名称" prop="routeId">
              <el-select v-model="form.routeId" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in insRouteList"
                  :key="item.routeId"
                  :label="item.routeName"
                  :value="item.routeId">
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
        </el-row>
        <el-row>
          <el-col :span="8" >
            <el-form-item label="通道编码" prop="channelId">
              <el-select v-model="form.channelId" placeholder="请选择" @focus="getInsChannelListByPage" filterable clearable @clear="onClearInsChannel" @change="onSelectInsChannelCounts"  class="inputWidth">
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
            <el-form-item label="储位编码" prop="spaceId">
              <el-select v-model="form.spaceId" placeholder="请选择" v-loadmore="loadMoreInsSpeaceListByChannel"
                         @focus="getInsSpeaceListByChannel" filterable clearable  class="inputWidth">
                <el-option
                  v-for="item in insSpaceChannelPageDate.data"
                  :key="item.spaceId"
                  :label="item.spaceCode"
                  :value="item.spaceId">
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
        <el-row>
          <el-col :span="8" >
            <el-form-item label="暂存区名称" prop="tmpStorageName">
              <el-input v-model="form.tmpStorageName"  maxLength="20" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in statusList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="占用材积" prop="usageVolume">
              <el-input v-model="form.usageVolume" class="inputWidth" :disabled = true></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" >
            <el-form-item label="占用重量" prop="usageWeight">
              <el-input v-model="form.usageWeight" class="inputWidth":disabled = true></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="占用箱数" prop="usageCaseAmount">
              <el-input v-model="form.usageCaseAmount" class="inputWidth" :disabled = true></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"  maxLength="50" class="inputWidth"></el-input>
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
<script src="./js/tmpstorage-route.js"></script>

