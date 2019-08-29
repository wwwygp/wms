<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="notice-form">
      <el-row :gutter="16" >
      <el-col :span="6">
        <el-form-item label="预到货单号">
            <el-input v-model="formInline.arrivalNoticeCode" maxLength="20"></el-input>
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
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="来源单号">
            <el-input v-model="formInline.purchaseOrderCode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="formInline.status" filterable multiple placeholder="请选择"  clearable  @focus="initStatus">
              <el-option
                v-for="item in selectStatus"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <DatePick ref="dateComponents" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: right;">
          <el-button
          v-for="(v,index) in btnList"
          v-db-click
          v-if="v.menuKey == 'WMS_NOTICE_LIST_SEARCH' || v.menuKey == 'WMS_NOTICE_LIST_INIT'"
          :class="v.className"
          :key="index" @click="callFn(v)"
          :type="filteType(v.className)"
        >
          {{v.name}}
        </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: -10px;">
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

          <template slot-scope="props" slot="arrivalNoticeCode">
            <a @click="noticeDetail(props.obj.row)" >{{props.obj.row.arrivalNoticeCode}}</a>
          </template>
          
      </table-configure>
      <div class="btn-box" style="text-align: left;margin-top: 20px">
        <!--// 目前只配置了红黄蓝绿。-->
        <div v-for="(v,index) in btnList" style="float: left;margin-left: 10px">
          <el-button
            v-db-click
            v-if="v.menuKey == 'WMS_NOTICE_LIST_EXAMINE' || v.menuKey == 'WMS_NOTICE_LIST_CASE'"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
          <el-button
            v-db-click
            v-if="v.menuKey == 'WMS_NOTICE_LIST_CANCEL'"
            :class="v.className"
            disabled
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>   
        </div>
        <div v-for="(v,index) in btnList" style="float: left;margin-left: 10px">
          <el-button
            v-db-click
            v-if="v.menuKey == 'WMS_NOTICE_PRINT'"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </div>
    </el-row>
  </el-card>
</template>

<script src="./js/notice.js">

</script>

<style scoped>
  a:hover{
    cursor: pointer;
  }
</style>
