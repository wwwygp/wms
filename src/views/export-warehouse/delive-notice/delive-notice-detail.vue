<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row :gutter="16" id="delive-detail-top-form">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="formInlineRule" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
              <el-form-item label="委托业主">
                <el-select v-model="formInline.ownerName" placeholder="" v-loadmore="loadMoreOwner" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in owners.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="出货单号">
                <el-input v-model="formInline.deliveNoticeCode" maxLength="20" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="出货类型">
                <el-select v-model="formInline.deliveNoticeTypeName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
                    :key="item.dictDtlValue"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="订单号">
                <el-input v-model="formInline.orderCode" maxLength="20" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
              <el-form-item label="订单类型">
                <el-select v-model="formInline.orderTypeName" placeholder="" v-loadmore="loadMoreOwner" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in owners.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="是否紧急单号">
                <el-checkbox v-model="formInline.emergencyId == 0" :disabled="disable">是否紧急单</el-checkbox>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="订单优先级">
                <el-select v-model="formInline.orderPriorityName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
                    :key="item.dictDtlValue"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="客户">
                <el-select v-model="formInline.customerName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
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
              <el-form-item label="客户地址码">
                <el-select v-model="formInline.customerAddressCode" placeholder="" v-loadmore="loadMoreOwner" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in customerAddressCode.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="12" class="col-width">
              <el-form-item label="客户地址">
                <el-input v-model="formInline.customerAddress" maxLength="50" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="预到货单号">
                <el-input v-model="formInline.arrivalNoticeCode" maxLength="50" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
              <el-form-item label="出货日期">
                <el-input v-model="formInline.deliveTime" maxLength="50" :disabled="disable"></el-input>
                <!-- <el-date-picker
                  v-model="formInline.deliveTime"
                  type="date"
                  placeholder="选择日期"
                  style="width: 165.41px;" :disabled="disable">
                </el-date-picker> -->
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="补单订单号">
                <el-input v-model="formInline.addOrderCode" maxLength="20":disabled="disable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="出货方式">
                <el-select v-model="formInline.deliveTypeName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
                    :key="item.dictDtlValue"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="formInline.deliveStatusName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
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
              <el-form-item label="配送方式">
                <el-select v-model="formInline.distributionTypeName" placeholder="" v-loadmore="loadMoreOwner" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in owners.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="运输方式">
                <el-select v-model="formInline.transportTypeName" placeholder="" v-loadmore="" filterable clearable :disabled="disable">
                  <el-option
                    v-for="item in deliveTypeData.data"
                    :key="item.dictDtlValue"
                    :label="item.dictDtlName"
                    :value="item.dictDtlValue">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model="formInline.contact" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="电话">
                <el-input v-model="formInline.phone" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
              <el-form-item label="邮箱地址">
                <el-input v-model="formInline.email" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="18" class="col-width">
              <el-form-item label="备注">
                <el-input v-model="formInline.remark" maxLength="50" :disabled="disable"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <div class="btn-box" style="text-align: right;">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button v-db-click type="primary" class="blue" @click="back()">返回</el-button>
          <!--<el-button-->
            <!--v-db-click-->
            <!--:class="v.className"-->
            <!--:key="index" @click="callFn(v)"-->
            <!--:type="filteType(v.className)"-->
          <!--&gt;-->
            <!--{{v.name}}-->
          <!--</el-button>-->

        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16">
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
  </el-card>
</template>

<script src="./js/detail.js"></script>

<style lang="scss">
  .col-width{
    .el-form-item__content{
      width: calc(60vh);
    }
  }
</style>
