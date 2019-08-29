<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="formInline" class='lable-info'>
      <el-row>
        <el-col :span="6">
          <el-form-item label="委托业主名称">
            <el-select v-model="formInline.ownerName" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable >
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
          <el-form-item label="来源单号">
            <el-input v-model="formInline.srcFormCode" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签号">
            <el-input v-model="formInline.labelNumber" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="容器编码">
            <el-input v-model="formInline.labelCode" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="复核单号">
            <el-input v-model="formInline.checkFormCode" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户名称">
            <el-input v-model="formInline.customerName" class='' maxLength='20'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原箱标签">
            <el-input v-model="formInline.originalCaseCode" class='' maxLength='20'></el-input>
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
        <el-col :span="6">
          <el-form-item label="容器类型">
            <el-select v-model="formInline.labelTypeId" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in containerType"
                :key="item.dictDtlId"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="容器标识">
            <el-select v-model="formInline.entityId" placeholder="请选择" filterable clearable >
              <el-option
                v-for="item in entity"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="btn-box" style="text-align: right;">
            <!--// 目前只配置了红黄蓝绿。-->
            <el-button type="primary" class='blue' @click="searchTabelList(1)">查询</el-button>
            <el-button type="primary" class='blue' @click="reseltForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
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
          <template slot-scope="props" slot="labelCode">
            <a @click="labelDetail(props.obj.row)" >{{props.obj.row.labelCode}}</a>
          </template>
        </table-configure>
      </el-row>
      <el-row>
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
      </el-row>
  </el-card>
</template>

<script src="./js/labelInfo.js">
</script>

<style lang="scss">
</style>
