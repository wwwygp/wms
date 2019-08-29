<template>
  <div class="receipt" style="height: calc(100vh);overflow-y: auto;overflow-x: hidden">
    <el-row class="receipt-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="上架单号">
              <el-input v-model="formInline.putawayTaskCode" class='' maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="formInline.operationTypeId" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in operationTypeList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="状态">
              <el-select v-model="formInline.status" placeholder="请选择" filterable clearable >
                <el-option
                  v-for="item in statusList"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <DatePick ref="dateComponents" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="btn-box">
              <el-button-group>
                <el-button  type="primary" class="blue" @click="searchList">查询</el-button>
                <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin:0 !important;" :gutter='14'>
          <el-col :span="12">
            <table-configure
              v-if="heightResize"
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
          <el-col :span="12" style="margin-top: 80px;">
            <el-form :inline="true" :model="formTable" class="demo-form-inline">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="制单人">
                    <el-input v-model="formTable.createName" disabled class=''></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="制单时间">
                    <el-input v-model="formTable.createTime" disabled class=''></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="上架人">
                    <el-select v-model="formTable.editorId" placeholder="请选择" filterable clearable>
                      <el-option
                        v-for="item in operatorList"
                        :key="item.ID"
                        :label="item.Full_Name"
                        :value="item.ID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="上架时间">
                    <el-date-picker
                      :picker-options="pickerBeginDate"
                      v-model="formTable.editTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy/MM/dd HH:mm:ss"
                      value-format="yyyy/MM/dd HH:mm:ss"
                      :default-value="defaultDate"
                      default-time="00:00:00"
                      clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" :offset="15">
                  <div class="btn-box">
                    <el-button
                      v-db-click
                      v-for="(v,index) in putawayBtn"
                      :class="v.className"
                      :key="index" @click="callFn(v)"
                      :type="filteType(v.className)">
                      {{v.name}}
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="margin:0 !important;">
          <el-col :span="24">
            <table-configure
              ref="dataTableConfig"
              :data-table="dataTableDetail"
              :table-code="dataTableDetail.tableName"
              @tableDataHandle="dataTableDetailDataHandle"
              @onHandleSelectionChange="onHandleSelectionSonChange"
            >
              <!--实际上架储位编码-->
              <template slot-scope="props" slot="actualSpaceCode">
                <el-input class='right-num' v-model='props.obj.row.actualSpaceCode'@blur="onSpaceblur(props.obj.row)" maxLength="20"> </el-input>
              </template>
              <!--实际上架数量-->
              <template slot-scope="props" slot="actualLargePackageNumber">
                <el-input class='right-num' v-model='props.obj.row.actualLargePackageNumber'@blur="onNumblur(props.obj.row)" maxLength="10" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
              </template>
              <template slot-scope="props" slot="actualMediumPackageNumber">
                <el-input class='right-num' v-model='props.obj.row.actualMediumPackageNumber'@blur="onNumblur(props.obj.row)" maxLength="10" :disabled='props.obj.row.disabledMediumPackageNumber'> </el-input>
              </template>
              <template slot-scope="props" slot="actualSmallPackageNumber">
                <el-input class='right-num' v-model='props.obj.row.actualSmallPackageNumber'@blur="onNumblur(props.obj.row)" maxLength="10" :disabled='props.obj.row.disabledSmallPackageNumber'> </el-input>
              </template>
              <!--实际容器编码-->
              <template slot-scope="props" slot="actualPalletLabelCode">
                <el-input class='right-num' v-model='props.obj.row.actualPalletLabelCode' @blur="onLabelblur(props.obj.row)" maxLength="20"> </el-input>
              </template>
            </table-configure>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in printerBtn"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)">
            {{v.name}}
          </el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <div style="text-align: right;">
          <span>共&nbsp{{dataTableDetail.data.length}}&nbsp条</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./js/shelf-receipt.js"></script>


<style scoped>

</style>
