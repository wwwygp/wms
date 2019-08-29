<template>
  <el-card class="automatic" style="overflow: auto;height: 100%;">
    <el-row class="automatic-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="来源单号:">
            <el-input v-model="formInline.acceptanceNoteCode" class='' maxLength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托业主">
            <el-select v-model="formInline.ownerId" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable >
              <el-option
                v-for="item in ownersPageDate.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-button  type="primary" class="blue" @click="searchList">查询</el-button>
            <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    </el-row>
    <el-row :gutter="14" style="margin-top: -15px;">
      <el-col :span="10" class="table-scheduing">
        <table-configure
          ref="tableConfig"
          :data-table="dataTable"
          :table-code="dataTable.tableName"
          @onRowClick="onRowClick"
          @tableDataHandle="tableDataHandle"
          @onHandleSelectionChange="onHandleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
        </table-configure>
      </el-col>
      <el-col :span="14" class="table-scheduing">
        <table-configure
          v-if="heightResize"
          ref="dataTableConfig"
          :data-table="dataTableDetail"
          :table-code="dataTableDetail.tableName"
          @onRowClick="onRowClick"
          @tableDataHandle="dataTableDetailDataHandle"
          @handleSizeChange="handleDetailSizeChange"
          @handleCurrentChange="handleDetailCurrentChange"
        >
        </table-configure>
      </el-col>
    </el-row>
    <div class="btn-box">
      <el-button
        v-db-click
        v-for="(v,index) in btnList"
        :class="v.className"
        :key="index" @click="callFn(v)"
        :type="filteType(v.className)">
        {{v.name}}
      </el-button>
    </div>
  </el-card>
</template>
<script src="./js/scheduling-automatic.js"></script>

<style lang="scss">
  .table-scheduing {
    .el-pagination .el-select .el-input {
    width: 85px !important;
    }
    .el-pagination__total {
    left: 0px !important;
    }
    .el-pagination__jump {
    margin-left: 5px !important;
    }
    .el-pagination__editor.el-input{
    width: 45px !important;
    }
    .el-pagination__sizes{
    margin: 0;
    }
  }
  </style>