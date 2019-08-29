<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="delive-notice-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="表格名称">
            <el-input v-model="formInline.tableName" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="表格编码">
            <el-input v-model="formInline.tableCode" maxLength="20" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" class="col-width">
          <el-form-item label="备注">
            <el-input v-model="formInline.remark" maxLength="50"  :disabled="disable" style="width: 400px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="字段名称">
            <el-input v-model="searchForm.fieldName" maxLength="20" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字段编码">
            <el-input v-model="searchForm.propName" maxLength="20" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="btn-box" style="text-align: right;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            <el-button v-db-click type="primary" class="blue" @click="back()">返回</el-button>
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
          <el-button type="primary" class='blue' @click="quickInsert">快速录入</el-button>
          <el-button type="primary" class='red' @click="delField">删除</el-button>
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
            <el-form-item label="字段名称:" prop="fieldName">
              <el-input v-model="form.fieldName" class='inputWidth'  :maxLength="50"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="KEY:" prop="propName">
              <el-input v-model="form.propName" class='inputWidth'  :maxLength="50"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否固定:" prop="isFixed">
              <el-select  v-model="form.isFixed" placeholder="请选择">
                <el-option
                  v-for="item in isFixedData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否显示:" prop="isView">
              <el-select  v-model="form.isView" placeholder="请选择">
                <el-option
                  v-for="item in isViewData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="是否查询字段:" prop="isSearch">
              <el-select  v-model="form.isSearch" placeholder="请选择" @change="isSearchChange">
                <el-option
                  v-for="item in isSearchData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="表单类型:" prop="formTypeId">
              <el-select  v-model="form.formTypeId" placeholder="请选择" :disabled="form.isSearch==0" class="inputWidth">
                <el-option
                  v-for="item in formTypeData.data"
                  :key="item.formTypeId"
                  :label="item.formTypeName"
                  :value="item.formTypeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="10">
            <el-form-item label="是否默认显示查询字段:" prop="isViewSearch">
              <el-select  v-model="form.isViewSearch" placeholder="请选择" :disabled="form.isSearch==0" class="inputWidth">
                <el-option
                  v-for="item in isViewSearchData.data"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="表单默认值:" prop="placeholder">
              <el-input v-model="form.placeholder" class='inputWidth'  :maxLength="50" :disabled="form.isSearch==0"></el-input>
              <!--<el-input v-model="form.dicName" maxLength="20"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="排序:" prop="sort">
              <el-input v-model="form.sort" class='inputWidth'  :maxLength="20"></el-input>
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
      :visible.sync="quickInsertVisible"
      width="70%"
      custom-class="minWidth tableConfigDialog"
      :title="quickInsertTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="url查询" name="first">
            <base-warehouse-area v-if="activeName == 'first'" ref="resetForm" :tabId="tabId" @back="back" @handleComfirm="handleComfirm"></base-warehouse-area>
          </el-tab-pane>
          <el-tab-pane label="手动批量录入" name="second">
            <base-storage-area v-if="activeName == 'second'" ref="resetForm" :tabId="tabId" @handleComfirm="handleComfirm"></base-storage-area>
          </el-tab-pane>
        </el-tabs>
      <!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
      <!--// scoped,一定要加。-->


      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="submitForm('form')" class="blue" v-db-click>保 存</el-button>-->
        <!--<el-button  type="primary" class="blue" @click="resetForm('quickInsertForm')">取 消</el-button>-->
      <!--</span>-->
    </self-dialog>

    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow" ></tips-dialog>
  </el-card>
</template>
<script src="./js/table-setting-detail.js">


</script>
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
