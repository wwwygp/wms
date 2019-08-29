<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row :gutter="16" id="top-form">
      <el-col :span="16">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="码头名称" prop="wharfIds">
          <el-row>
            <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
            <el-select v-model="formInline.wharfIds" placeholder="请选择" v-loadmore="loadMoreWharf" filterable clearable>
              <el-option
                v-for="item in wharf"
                :key="item.wharfId"
                :label="item.wharfName"
                :value="item.wharfId">
              </el-option>
            </el-select>
          </el-row>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">

        <div class="btn-box" style="text-align: right">
          <el-button type="primary" class='blue' @click="searchList">查询</el-button>
          <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          <!--// 目前只配置了红黄蓝。-->
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
          <!-- <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-input v-model="form.warehouseId"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="打印机组" prop="printerGroupId">
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法-->
              <el-select v-model="form.printerGroupId" placeholder="请选择" v-loadmore="loadMorePrinterGroup" filterable clearable disabled>
                <el-option
                  v-for="item in printerGroup"
                  :key="item.printerGroupId"
                  :label="item.printerGroupName"
                  :value="item.printerGroupId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="码头编码" prop="wharfCode">
              <el-input v-model="form.wharfCode" :disabled="updateDisabled" maxLength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="码头名称" prop="wharfName">
              <el-input v-model="form.wharfName" maxLength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="码头类型" prop="wharfType">
              <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法-->
              <el-select v-model="form.wharfType" placeholder="请选择" v-loadmore="loadMoreWharfType" filterable clearable>
                <el-option
                  v-for="item in wharfType"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有调节板" prop="hasLiftingBoard">
              <el-select v-model="form.hasLiftingBoard" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in liftingBoard"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in wharfStatus"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" class="inputWidth" maxLength="50"></el-input>
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
<script src="./js/WharfDataMaintenance.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped></style>
