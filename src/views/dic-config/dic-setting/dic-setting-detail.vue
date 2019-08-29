<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="delive-notice-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="字典名称">
            <el-input v-model="formInline.defName" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字典编码">
            <el-input v-model="formInline.dicCode" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据类型名称">
            <el-input v-model="formInline.dataTypeName" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="父字典值名称">
            <el-input v-model="formInline.parentDicName" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="父字典值编码">
            <el-input v-model="formInline.parentDicCode" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-input v-model="formInline.statusName" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人">
            <el-input v-model="formInline.creater" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-input v-model="formInline.createTime" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="修改人">
            <el-input v-model="formInline.editor" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="col-width">
          <el-form-item label="修改时间">
            <el-input v-model="formInline.editTime" maxLength="50" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统编码">
            <el-input v-model="formInline.sysCode" maxLength="50" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" class="col-width">
          <el-form-item label="备注">
            <!--<el-input v-model="formInline.remark" maxLength="50" :disabled="disable"></el-input>-->
            <el-input v-model="formInline.remark" maxLength="50"  :disabled="disable" style="width: 400px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="btn-box" style="text-align: right;">
            <!--// 目前只配置了红黄蓝绿。-->
            <el-button v-db-click type="primary" class="blue" @click="back()">返回</el-button>
            <!--<el-button-->
            <!--v-db-click-->
            <!--:class="v.className"-->
            <!--:key="index" @click="callFn(v)"-->
            <!--:type="filteType(v.className)"-->
            <!--&gt;-->
            <!--{{v.name}}-->
            <!--</el-button>-->

          </div>
        </el-col>
      </el-row>
      <!--<el-row :gutter="16">-->
        <!--<el-col :span="24">-->
          <!--<div class="btn-box" style="text-align: right;">-->
            <!--&lt;!&ndash;// 目前只配置了红黄蓝绿。&ndash;&gt;-->
            <!--<el-button v-db-click type="primary" class="blue" @click="back()">返回</el-button>-->
            <!--&lt;!&ndash;<el-button&ndash;&gt;-->
            <!--&lt;!&ndash;v-db-click&ndash;&gt;-->
            <!--&lt;!&ndash;:class="v.className"&ndash;&gt;-->
            <!--&lt;!&ndash;:key="index" @click="callFn(v)"&ndash;&gt;-->
            <!--&lt;!&ndash;:type="filteType(v.className)"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;{{v.name}}&ndash;&gt;-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->

          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
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
            <el-form-item label="字典名称:" prop="dictDtlName">
              <el-input v-model="form.dictDtlName" class='inputWidth'  :maxLength="50"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="字典值:" prop="dictDtlValue">
              <el-input v-model="form.dictDtlValue" class='inputWidth'  :maxLength="50" :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="状态:" prop="status">
              <el-select  v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in statusData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="排序:" prop="sort">
              <el-input v-model="form.sort" class='inputWidth'  :maxLength="20"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父字典:">
              <el-select v-model="form.parentId" placeholder="请选择" v-loadmore="loadMoreParentList" @focus="initParentList" filterable clearable remote :remote-method="reloadParentData" class="inputWidth">
                <el-option
                  v-for="item in parentArr.data"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlId">
                </el-option>
              </el-select>
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

    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>
  </el-card>
</template>
<script src="./js/dic-setting-detail.js"></script>
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
