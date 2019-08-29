<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="top-form">
      <el-row :gutter="16" >
        <el-col :span="6">
          <el-form-item label="收货单号">
            <el-input v-model="formInline.receiveNoteCode" maxLength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预到货单类型">
            <el-select v-model="formInline.arrivalNoticeTypeId" filterable placeholder="请选择" clearable @focus="initNoticeType">
              <el-option
                v-for="item in selectNoticeType"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="委托业主">
            <!--<el-input v-model="formInline.ownerId"></el-input>-->
            <el-select v-model="formInline.ownerId" filterable placeholder="请选择" clearable  v-loadmore="ownersMore">
              <el-option
                v-for="item in ownersArr.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商">
            <el-select v-model="formInline.supplierId" filterable placeholder="请选择" clearable  v-loadmore="supplierMore">
              <el-option
                v-for="item in supplierArr.data"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div style="float: left">
          <el-radio v-model="radio" label="1">标签验收</el-radio>
          <el-radio v-model="radio" label="2">纸单验收</el-radio>
        </div>
        <div class="btn-box" style="text-align: left;float: left;margin-left: 10px">
          <!--// 目前只配置了红黄蓝绿。-->
          <div v-for="(v,index) in btnList" style="float: left;margin-left: 10px">
            <el-button
              v-db-click
              :class="v.className"
              :key="index" @click="callFn(v)"
              :type="filteType(v.className)"
            >
              {{v.name}}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="btn-box" style="text-align: right;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button type="primary" class="blue" v-db-click @click="searchList">
            查询
          </el-button>
          <el-button type="primary" class="blue" v-db-click @click="resetList">
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" style='margin-top: -10px;'>
      <el-col :span="16">
        <table-configure
          v-if="heightResizeLeft"
          ref="tableConfigLeft"
          :data-table="dataTableLeft"
          :table-code="tableNameLeft"
          @tableDataHandle="tableDataHandleLeft"
          @onRowClick="radioClick"
          @onHandleSelectionChange="onHandleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
          <template slot-scope="props" slot="checkTypeName">
            <el-select v-model="props.obj.row.checkTypeId" filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in standardTypeArr"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
            <!--<span>这是下拉框</span>-->
          </template>
          <template slot-scope="props" slot="checkValue">
            <el-input v-model="props.obj.row.checkValue"></el-input>
          </template>
          <!--@onHandleSelectionChange="onHandleSelectionChange"-->
          <!--<template slot-scope="props" slot="arrivalNoticeCode">-->
          <!--<a @click="noticeDetail(props.obj.row)" >{{props.obj.row.arrivalNoticeCode}}</a>-->
          <!--</template>-->

        </table-configure>
      </el-col>
      <el-col :span="8">
        <table-configure
          v-if="heightResizeRight"
          ref="tableConfigRight"
          :data-table="dataTableRight"
          :table-code="tableNameRight"
          @onHandleSelectionChange="onHandleSelectionChangeRight"
          @tableDataHandle="tableDataHandleRight"
        >
          <!--@onHandleSelectionChange="onHandleSelectionChange"-->
          <!--<template slot-scope="props" slot="arrivalNoticeCode">-->
          <!--<a @click="noticeDetail(props.obj.row)" >{{props.obj.row.arrivalNoticeCode}}</a>-->
          <!--</template>-->

        </table-configure>
      </el-col>
      <el-col :span="24">
        <table-configure
          v-if="heightResizeDetail"
          ref="tableConfigDetail"
          :data-table="dataTableDetail"
          :table-code="tableNameDetail"
          @tableDataHandle="tableDataHandleDetail"
          @handleSizeChange="handleSizeChangeDetail"
          @handleCurrentChange="handleCurrentChangeDetail"
        >
          <!--<template slot-scope="props" slot="arrivalNoticeCode">-->
          <!--<a @click="noticeDetail(props.obj.row)" >{{props.obj.row.arrivalNoticeCode}}</a>-->
          <!--</template>-->

        </table-configure>
      </el-col>
    </el-row>
  </el-card>
</template>

<script src="./js/check-print.js">

</script>

<style scoped>
  a:hover{
    cursor: pointer;
  }
</style>
