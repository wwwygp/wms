<template>
  <el-card style="height: calc(100vh);overflow: auto;margin-top:-10px">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="table-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="表格名称">
            <el-input v-model="formInline.tableName" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="表格编码">
            <el-input v-model="formInline.tableCode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="btn-box" style="text-align: right;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--// 表格控件-->
    <table-configure
      v-if="heightResize"
      ref="tableConfig"
      :data-table="dataTable"
      :table-code="tableName"
      @onRowClick="onRowClick"
      @onHandleSelectionChange="onHandleSelectionChange"
      @tableDataHandle="tableDataHandle"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <template slot-scope="props" slot="tableCode">
        <a @click="tableDetail(props.obj.row)" >{{props.obj.row.tableCode}}</a>
      </template>
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
      :title="dicTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')">
      </tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="表格名称:" prop="tableName">
              <el-input v-model="form.tableName" class='inputWidth'  :maxLength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="表格编码:" prop="tableCode">
              <el-input v-model="form.tableCode" class='inputWidth'  :maxLength="50"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注:" prop="remark">
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

    <self-dialog
      :visible.sync="viewSqls"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="sqlTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- sql查看窗口 -->
      <tips-dialog :parent-data="viewSqls" @handleOkTip="cancel('sqlForm')">
      </tips-dialog>
      <el-form :model="sqlForm">
        <el-row>
          <el-col :span="24">
            <el-input id="sql" v-model="sqlForm.sql"  class='inputWidth'  type="textarea" :autosize="{ minRows: 20, maxRows: 30}" ></el-input>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" data-clipboard-target="#sql" class="blue btn" v-db-click >复 制</el-button>
      </span>
    </self-dialog>

    <!--<tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>-->
  </el-card>
</template>
<script src="./js/table-setting.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss">
  #date-width{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 80px;
    }
    .el-date-editor.el-input--suffix{
      .el-input__inner {
        padding-right: 0px;
        padding-left: 15px;
      }
      .el-input__prefix{
        left: 0px;
      }
      .el-input__icon{
        width: 15px;
      }
    }
  }
</style>
