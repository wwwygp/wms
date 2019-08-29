<template>
  <el-card style="height: calc(100vh); overflow: auto;">
    <el-row id="top-form">
      <el-col :span="16">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="库区编码" prop="warehouseAreaCode">
          <el-row>
            <!-- v-loadmore: 滚动条滑动到底部加载更多，传入是一个方法 multiple-->
            <el-select v-model="formInline.warehouseAreaCode" placeholder="请选择" v-loadmore="loadMoreWarehouseArea" filterable clearable >
              <el-option
                v-for="item in warehouseAreaCode"
                :key="item.warehouseAreaId"
                :label="item.warehouseAreaCode"
                :value="item.warehouseAreaCode">
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
      v-if="tableShow"
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
      :title="wareHouseTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')">
      </tips-dialog>
        <el-form :model="form" ref="form" :rules="rulesForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="库区编码" prop="warehouseAreaCode">
                <el-input v-model="form.warehouseAreaCode" class='inputWidth' :disabled="updateDisabled" :maxLength="codeSize"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库区名称" prop="warehouseAreaName">
                <el-input v-model="form.warehouseAreaName" maxLength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          	<el-col :span="18">
          	  <el-form-item label="备注" prop="remark">
          	    <el-input v-model="form.remark" maxLength="50" class='inputWidth'></el-input>
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

  </el-card>
</template>
<script src="./js/warehouse-area.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>

</style>
