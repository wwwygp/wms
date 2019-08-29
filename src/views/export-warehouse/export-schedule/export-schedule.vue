<template>
  <el-card class="receipt">
    <el-row id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="出货单号">
              <el-input v-model="formInline.deliveNoticeCode" class='' maxLength='20'></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="formInline.orderCode" class='' maxLength='20'></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="6">
            <el-form-item label="客户">
              <el-select v-model="formInline.customerId" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in customerList"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="线路">
              <el-select v-model="formInline.routeId" placeholder="请选择"  filterable clearable >
                <el-option
                  v-for="item in routeList"
                  :key="item.routeId"
                  :label="item.routeName"
                  :value="item.routeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-checkbox style="margin-left: 43px;" v-model="formInline.report" ><label class="el-form-item__label">是否检报</label></el-checkbox>
          </el-col>
          <el-col :span="12" style="text-align: left;">
              <el-button type="primary" class='blue' @click="searchTabelList">查询</el-button>
              <el-button type="primary" class='blue' @click="reseltForm('formInline')">重置</el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top: -10px;'>
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
        </el-row>
        <el-row style='margin-top: -10px;'>
          <table-configure
            v-if="heightResize"
            ref="tableConfig"
            :data-table="detailDataTable"
            :table-code="detailTableName"
            @onRowClick="onDetailRowClick"
            @onHandleSelectionChange="onHandleSelectionDetailChange"
            @tableDataHandle="detailTableDataHandle"
          >
          </table-configure>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="5">
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
      </el-col>
      <el-col :span="5" class="red-number">
        总计划数量： <span>{{this.planDeliveSum}}</span>
      </el-col>
      <el-col :span="5" class="red-number">
        总可用数量： <span>{{this.availableSum}}</span>
      </el-col>
      <el-col :span="5" class="red-number">
        总缺量： <span>{{this.notEnoughSum}}</span>
      </el-col>
      <el-col :span="4" class="red-number">
        共 <span>{{ detailDataTable.data.length}}</span>条
      </el-col>
    </el-row>
  </el-card>
</template>

<script src="./js/export-schedule.js">
</script>

<style lang="scss" scoped>
  .red-number {
    span{
      color: red
    }
  }
  .receipt {
    padding: 5px 20px;
  }
</style>
