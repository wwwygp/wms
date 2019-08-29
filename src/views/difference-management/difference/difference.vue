<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row id="move-plan-form">
      <el-form :inline="true" :model="formInline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="加工单号">
                <el-input v-model="formInline.processNoteCode" maxLength='20'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托业主">
              <el-select v-model="formInline.ownerId" filterable clearable placeholder="请选择" v-loadmore="loadMoreOwnerList">
                <el-option
                  v-for="item in ownerArr.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="formInline.status" placeholder="请选择" v-loadmore="" filterable clearable >
                <el-option
                  v-for="item in status"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="btn-box" style="text-align: right;">
              <el-button type="primary" class='blue' @click="searchList">查询</el-button>
              <el-button type="primary" class='blue' @click="resetList">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style='margin-top: -10px;'>
      <table-configure
        ref="mainTable"
        :data-table="dataTable"
        :table-code="tableName"
        @tableDataHandle="handleTable"
        @onRowClick="handleRadio"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </table-configure>
    </el-row>
    <el-row>
      <table-configure
        ref="sonTable"
        :data-table="sonDataTable"
        :table-code="sonTableName"
        @tableDataHandle="handleSonTable"
        @onHandleSelectionChange="handleSonMultipleSelect"
        @handleSizeChange="handleSonSizeChange"
        @handleCurrentChange="handleSonCurrentChange"
      >
          <template slot-scope="props" slot="movePlanCode">
          <a @click="route(props.obj.row)"> {{ props.obj.row.movePlanCode }}</a>
        </template>
      </table-configure>
    </el-row>
    <!-- <el-row :gutter="16">
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="extendFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row> -->
  </el-card>
</template>

<script src="./js/difference.js"></script>
