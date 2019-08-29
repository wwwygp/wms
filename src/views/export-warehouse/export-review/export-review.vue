<template>
  <el-card style="height: calc(100vh);">
    <el-row class="review" id="page-export-review">
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="下架单号" prop="pickNoteCode">
              <el-input v-model="formInline.pickNoteCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="btn-box">
              <el-button
                v-db-click
                v-for="(v,index) in btnList"
                v-if='v.menuKey == "WMS_REVIEW_PICKNOTE_DTL_TABEL_SHOW"'
                class="blue"
                :key="index" @click="callFn(v)"
                :type="filteType(v.className)"
              >
                {{v.name}}
              </el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div class="box-card-text box-card-item">
                {{formInline.tipMessage}}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="margin-top: -20px;">
      <table-configure
        v-if="heightResize"
        ref="tableConfig"
        :data-table="dataTable"
        :table-code="dataTable.tableName"
        @onRowClick="onRowClick"
        @tableDataHandle="tableDataHandle"
        @onHandleSelectionChange="onHandleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
        <template slot-scope="props" slot="printingNumber">
          <el-input v-model='props.obj.row.printingNumber' maxLength="9"/>
        </template>
      </table-configure>
    </el-row>
    <el-row style='text-align: right;margin-bottom: 0px;'>
      共 <span>{{ dataTable.data.length }}</span> 条
    </el-row>
    <el-row v-if="btnList.length != 0">
      <el-col :span="3">
        <el-select v-model="brandTitleUrl" placeholder="请选择标签标题品牌" @focus="getDictionarys" filterable clearable >
          <el-option
            v-for="item in labelTitleBrand"
            :key="item.dictDtlValue"
            :label="item.dictDtlName"
            :value="item.dictDtlValue">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="21">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            v-if='v.menuKey == "WMS_REVIEW_PICKNOTE_OUT_PRINT" || v.menuKey =="WMS_REVIEW_PICKNOTE_INNER_PRINT"'
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 标签打印弹窗 -->
    <hgp-dialog
      :visible.sync="dialogVisible"
      width="400px"
      custom-class="print-dialog"
      :title="title"
      :modal-append-to-body="false"
      :before-close="closeCommodityDialog"
      :close-on-click-modal="false">
      <!-- 是否保存数据 -->
      <el-form :model="dialogForm" ref="form" id="dialog-form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="打印模板">
              <el-select v-model="dialogForm.printTemplate" placeholder="请选择打印模板" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in printTemplate"
                  :key="item.Id"
                  :label="item.Description"
                  :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getPrintingReview" class="blue" v-db-click>确 定</el-button>
        <el-button  type="primary" class="blue" @click="cancel">取 消</el-button>
      </span>
    </hgp-dialog>
  </el-card>
</template>

<script src="./js/export-review.js"></script>

<style lang="scss">
  .box-card-text {
    font-size: 14px;
  }

  .box-card-item {
    padding: 10px 0;
  }

  .box-card {
    width: 300px;
  }
  .print-dialog {
    margin-top: 30vh !important;
    .el-dialog__footer {
      text-align: center;
    }
  }
</style>
