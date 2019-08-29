<template>
<div>
   <el-row>
      <el-col>
        <el-form>
          <el-form-item label="号码搜索">
                <el-select v-model="formInline.searchNum" placeholder="请选择" clearable filterable @change='searchNumChange'>
                     <el-option v-for="item in searchNums" :key="item.prizeId" :label="item.phoneNumber" :value="item.phoneNumber"></el-option>
                </el-select>
             </el-form-item>
             </el-form>
      </el-col>
    </el-row>
   <table-configure
        v-if="heightResize"
        ref="tableConfig"
        :data-table="winnersDataTable"
        :table-code="winnersTableName"
        @onRowClick="onRowClick"
        @onHandleSelectionChange="onHandleSelectionWinnersChange"
        @tableDataHandle="tableDataWinnersHandle"
        @handleSizeChange="handleSizeWinnersChange"
        @handleCurrentChange="handleWinnersCurrentChange">
        <template slot-scope="props" slot="operationCol">
          <el-button type="primary" class="blue" @click="updateSumbit(props.obj.row)">{{props.obj.row.hasGiveName}}</el-button>
        </template>
    </table-configure>
      <el-row>
        <el-button type="primary"  class="blue" @click='updateSumbit()'>批量标为已领取</el-button>
        <el-button  type="primary" class="blue" @click='exportWinnerList'>导出未领取名单</el-button>
      </el-row>
  </div> 
</template>

<script src="./js/winner-list.js"></script>

<style>
 .tableWinnerDialog .el-dialog__footer{
   text-align: left;
 }
</style>
