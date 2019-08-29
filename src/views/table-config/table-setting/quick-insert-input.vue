<template>
  <el-card style="overflow: auto;margin-top:-10px">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="table-form">
      <el-row>
        <el-col :span="24">
          <div class="btn-box" style="text-align: right;">
            <el-button type="primary" class='blue' @click="quickInsertBatch">保存</el-button>
            <el-button type="primary" class='blue' @click="back()">取消</el-button>
            <!--<el-button type="primary" class='blue' @click="addRow()">加一行</el-button>-->
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <div class="btn-box" style="text-align: right;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 20, maxRows: 100}"
              placeholder="示例：" v-model="formInline.inputJsonModel" :disabled="true"></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="btn-box" style="text-align: right;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 20, maxRows: 100}"
              placeholder="请输入内容"
              v-model="formInline.inputJson"></el-input>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--// 表格控件-->
    <!--<table-configure-->
      <!--v-if="heightResize"-->
      <!--ref="tableConfig"-->
      <!--:data-table="dataTable"-->
      <!--:table-code="tableName"-->
      <!--@onRowClick="onRowClick"-->
      <!--@onHandleSelectionChange="onHandleSelectionChange"-->
      <!--@tableDataHandle="tableDataHandle"-->
    <!--&gt;-->
      <!--<template slot-scope="props" slot="propName">-->
        <!--<el-input v-model="props.obj.row.propName" maxLength="50" style="width: 200px" ></el-input>-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="fieldName">-->
        <!--<el-input v-model="props.obj.row.fieldName" maxLength="50" style="width: 200px" ></el-input>-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="sort">-->
        <!--<el-input v-model="props.obj.row.sort" maxLength="50" style="width: 200px"></el-input>-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="isFixed">-->
        <!--<el-select v-model="props.obj.row.isFixed" placeholder="请选择" filterable clearable >-->
          <!--<el-option-->
            <!--v-for="item in fixedOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="isView">-->
        <!--<el-select v-model="props.obj.row.isView" placeholder="请选择" filterable clearable >-->
          <!--<el-option-->
            <!--v-for="item in viewOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</template>-->
    <!--</table-configure>-->

    <!--<tips-dialog :parent-data="delDialog" @handleOkTip="removeRow"></tips-dialog>-->
  </el-card>
</template>
<script src="./js/quick-insert-input.js"></script>
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
