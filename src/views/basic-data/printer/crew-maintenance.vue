<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row id="top-form">
      <el-col :span="16">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="12">
            <el-form-item label="打印机组名称">
              <el-input v-model="formInline.printerGroupName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印机组编码">
              <el-input v-model="formInline.printerGroupCode" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div class="btn-box" style="text-align: right">
          <!--// 目前只配置了红黄蓝。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            v-if='v.menuKey == "WMS_PRINTER_GROUP_LIST_INIT" || v.menuKey == "WMS_PRINTER_GROUP_LIST_SEARCH"'
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
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
          <!--// 目前只配置了红黄蓝。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            v-if='v.menuKey == "WMS_PRINTER_GROUP_LIST_ADD" || v.menuKey == "WMS_PRINTER_GROUP_LIST_UPDATE" || v.menuKey == "WMS_PRINTER_GROUP_LIST_DEL"'
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!--<el-pagination-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="currentPage"-->
    <!--:page-sizes="[10, 20, 30, 40]"-->
    <!--:page-size="lim"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="400">-->
    <!--</el-pagination>-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="printerTitle"
      append-to-body
    >
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="打印机组编码" prop="printerGroupCode">
              <el-input v-model="form.printerGroupCode" maxLength="20" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打印机组名称" prop="printerGroupName">
              <el-input v-model="form.printerGroupName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!--<el-form-item label="打印机组" prop="printerGroupId">-->
              <!--&lt;!&ndash; load-more:滚动条滑动到底部加载更多   on-change：选择数据后的返回值 remote-method：模糊搜索 clearable:只适用于单选  组件宽度根据赋元素宽度分布&ndash;&gt;-->
              <!--<select-scroll :parent-data="form.printerGroupId" :options= "options" :paramsOption="paramsOption"  @loadMore= "loadMore" @on-change="selectChange" @remote-method= "remoteMethod"></select-scroll>-->
            <!--</el-form-item>-->
            <el-form-item label="备注">
              <el-input v-model="form.remark" class="inputWidth" maxLength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="16">-->
            <!--<el-form-item label="备注">-->
              <!--<el-input v-model="form.remark" class="inputWidth" maxLength="50"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  class="blue" @click="resetForm('form')" type="primary" v-db-click>取 消</el-button>
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
      </span>
    </el-dialog>
    <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center :close-on-click-modal="false">-->
    <!--<div class="del-dialog-cnt">确定要删除？</div>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="removeRow" class="blue" v-db-click>确 定</el-button>-->
    <!--<el-button type="primary" @click="delVisible = false" class="blue">取 消</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">

    </tips-dialog>
  </el-card>
</template>
<script src="./js/crewMaintenance.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>

</style>
