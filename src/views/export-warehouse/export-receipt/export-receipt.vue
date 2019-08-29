<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row class="receipt-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="波次号">
              <!-- <el-select v-model="formInline.waveCode" placeholder="请选择" v-loadmore="loadMoreWaveCode" filterable clearable> -->
                <el-select 
                v-model="formInline.waveCode" 
                placeholder="请选择" 
                remote 
                filterable 
                clearable 
                v-loadmore="waveCodeMore"  
                :remote-method="searchWave" 
                @focus="focusWaveCode" 
                @clear="clearWaveCode" 
                @change="changeWaveCode">
                <el-option v-for="item in waveCode.data" :key="item.waveCode" :label="item.waveCode" :value="item.waveCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下架单号">
              <el-input v-model="formInline.pickNoteCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="btn-box">
              <el-button-group>
                <el-button type="primary" class="blue" @click="searchList">查询</el-button>
                <el-button type="primary" class="blue" @click="reseltForm('formInline')">重置</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row :gutter="20" style="margin-top: -20px !important;">
      <el-col :span="18">
        <table-configure v-if="heightResize" ref="tableConfig" :data-table="dataTable" :table-code="dataTable.tableName" @onRowClick="onRowClick" @tableDataHandle="tableDataHandle" @onHandleSelectionChange="onHandleSelectionChange" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        </table-configure>
      </el-col>
    </el-row>
    <el-row style="margin-top: -20px !important;">
      <el-col :span="24">
        <table-configure v-if="heightResize" ref="dataTableConfig" :data-table="dataTableDetail" :table-code="dataTableDetail.tableName" @tableDataHandle="dataTableDetailDataHandle" @onHandleSelectionChange="onHandleDetailSelectionChange">
          <template slot-scope="props" slot="actualBoxAmount">
            <el-input v-model='props.obj.row.actualBoxAmount' maxLength="9" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
          </template>
          <template slot-scope="props" slot="actualCaseAmount">
            <el-input v-model='props.obj.row.actualCaseAmount' maxLength="9" :disabled='props.obj.row.disabledMediumPackageNumber'> </el-input>
          </template>
          <template slot-scope="props" slot="actualPieceAmount">
            <el-input v-model='props.obj.row.actualPieceAmount' maxLength="9" :disabled='props.obj.row.disabledSmallPackageNumber'> </el-input>
          </template>
        </table-configure>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-col :span="6" style="text-align: left;">
            <span>实际拣货人</span>
            <el-select v-model="actualshipperId" placeholder="请选择" filterable clearable>
              <el-option v-for="item in actualshipper" :key="item.ID" :label="item.Full_Name" :value="item.ID">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-button v-db-click v-for="(v,index) in btnList" :class="v.className" :key="index" @click="callFn(v)" :type="filteType(v.className)">
              {{v.name}}
            </el-button>
          </el-col>
          <el-col :span="2">
            <div style="text-align: right;">
              <span>共&nbsp{{dataTableDetail.data.length}}&nbsp条</span>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script src="./js/export-receipt.js"></script>
<style scoped>
</style>
