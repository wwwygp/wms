<template>
  <el-card style="height: calc(100vh);overflow: auto" id="container">
    <el-form :inline="true" :model="mainForm" ref="mainForm" class="demo-form-inline" id="form">
        <el-row>
          <el-col :span="8">
              <el-form-item label="容器类型">
                <el-select v-model="mainForm.containerTypeId" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in containerType"
                    :key="item.dictDtlId"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="16">
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
      <el-form :model="form" ref="form" :rules="rulesForm" inline-message>
        <el-row >
          <el-col :span="8">
              <el-form-item label="容器类型" prop="containerTypeId">
                <el-select v-model="form.containerTypeId" placeholder="请选择" filterable clearable :disabled="updateDisabled">
                  <el-option
                    v-for="item in containerDialogType"
                    :key="item.dictDtlId"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器前缀" prop="containerPrefix">
              <el-input v-model='form.containerPrefix' maxLength='3' :disabled="updateDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器描述">
              <el-input v-model='form.containerDesc' maxLength='50' class='inputWidth'></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="容器用途" prop="containerPurposeId">
              <el-select v-model="form.containerPurposeId" placeholder="请选择" filterable clearable :disabled="updateDisabled">
                <el-option
                  v-for="item in containerPurpose"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="长" prop='length'>
              <el-input v-model='form.length' maxLength='7' class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽" prop='width'>
              <el-input v-model='form.width' maxLength='7' class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="高" prop='height'>
              <el-input v-model='form.height' maxLength='7' class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器承载重量" prop='weightCapacity'>
              <el-input  v-model='form.weightCapacity' maxLength='7' class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器承载体积" prop='volumeCapacity'>
              <el-input v-model='form.volumeCapacity' maxLength='16' class='inputWidth'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="流水码长度" prop='serialNumberLength'>
              <el-input v-model="form.serialNumberLength" maxLength='2'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器总数">
              <el-input v-model="form.containerAmount" class='inputWidth' maxLength='7'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际容器标识" prop='entityId'>
              <el-select v-model="form.entityId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in entity"
                  :key="item.dictDtlId"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop='status'>
              <el-select v-model="form.status" placeholder="请选择" filterable clearable>
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
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="请输入" class='inputWidth' maxLength="50"></el-input>
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
  #container {
    .inputWidth {
      width: calc(100% - 100px) !important;
    }
  }
</style>
