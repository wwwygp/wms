<template>
  <el-card style="height: calc(100vh);overflow: auto" class='act-manage'>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="search-form">
      <el-row style='margin:0'>
        <el-col :span="10">
          <el-popover placement="bottom-end" width="400" popper-class='act-pops' :ref="`popover1`">
            <el-row style='margin:0' class=''>
              <el-col :span="12">
                <el-form-item label="">
                  <el-select v-model="form.activityId" filterable clearable>
                    <el-option v-for="item in customers" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class='set-up'>
                <el-form-item class='addBtn'>
                  <p>选中一个活动，点击按钮完成创建</p>
                  <el-button class='setup-btn' @click='addActivity()'>创建</el-button>
                </el-form-item>
              </el-col>
              <i class="el-dialog__close el-icon el-icon-close pop-close" @click="$refs[`popover1`].doClose()"></i>
            </el-row>
            <el-button slot="reference" class='add-activity'>+添加内置活动</el-button>
          </el-popover>
          <el-popover placement="top-start" width="400" trigger="hover">
            <div>
              <p>活动主要分自定义活动、内置活动</p>
              <p>自定义活动：运营人员自行设定规则的活动，需要单独开发活动页面，需要迭代版本。</p>
              <p>内置活动：一般开发好活动模板后，通过后台直接配置营销参数的活动，一次性开发完成，无需改版本，触发新增规则或优化活动规则。</p>
              <p>活动投放：如果想借助banner进行活动投放，请在banner里面设置。</p>
            </div>
            <i class="el-icon el-icon-warning" slot="reference"></i>
          </el-popover>
        </el-col>
        <el-col :span="14" style='text-align:center'>
          <el-form-item label="">
            <el-select v-model="formInline.initiateType" placeholder="所有活动" clearable>
              <el-option v-for="item in initiateTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="所有状态" clearable>
              <el-option v-for="item in statuses" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input maxLength="20" v-model="formInline.activityName" placeholder="输入活动名称"></el-input>
          </el-form-item>
          <el-button type="primary" class='blue' @click="searchList">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--// 表格控件-->
    <table-configure v-if="heightResize" ref="tableConfig" :data-table="dataTable" :table-code="tableName"
      @onRowClick="onRowClick" @UpperShelFoperation='UpperShelFoperation' @updateSumbit='updateSumbit'
      @onHandleSelectionChange="onHandleSelectionChange" @tableDataHandle="tableDataHandle"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      <template slot-scope="props" slot="name">
        <a @click="actGoDetail(props.obj.row)">{{props.obj.row.name}}</a>
      </template>
      <template slot-scope="props" slot="winnerList">
        <a @click="actWinners(props.obj.row)">查看</a>
      </template>
      <template slot-scope="props" slot="operation">
        <el-button @click="updateSumbit(props.obj.row)" type="text" size="small">设置</el-button>
        <el-button @click="UpperShelFoperation(props.obj.row)" type="text" size="small">{{props.obj.row.upperName}}
        </el-button>
      </template>
    </table-configure>
    <self-dialog :visible.sync="dialogVisible" width="50%" custom-class="checkDialog" :modal-append-to-body="false"
      :before-close="closeDialog" :close-on-click-modal="false">
      <el-tabs v-model="activeName" v-if='dialogVisible' type="card">
        <el-tab-pane label="获奖名单" name="first">
          <winner-list-area v-if="activeName == 'first'" :activityId='activityIdList'></winner-list-area>
        </el-tab-pane>
        <el-tab-pane label="各奖品统计" name="second">
          <winner-census-area v-if="activeName == 'second'" :activityId='activityIdList'></winner-census-area>
        </el-tab-pane>
      </el-tabs>
    </self-dialog>

  </el-card>
</template>

<script src="./js/act-management.js"></script>

<style scoped>

</style>
