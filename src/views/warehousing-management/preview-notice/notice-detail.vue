<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-row :gutter="16" id="top-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item label="委托业主">
            <el-input v-model="formInline.ownerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预到货单号">
            <el-input v-model="formInline.arrivalNoticeCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预到货单类型">
            <el-input v-model="formInline.arrivalNoticeTypeName"></el-input>
            <!--<el-select v-model="formInline.arrivalNoticeTypeName" filterable placeholder="请选择" clearable >-->
              <!--<el-option-->
                <!--v-for="item in selectNoticeType"-->
                <!--:key="item.dictDtlId"-->
                <!--:label="item.dictDtlName"-->
                <!--:value="item.dictDtlId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源单号">
            <el-input v-model="formInline.purchaseOrderCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源类型">
            <el-input v-model="formInline.arrivalNoticeTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商">
            <el-input v-model="formInline.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购发单日期">
            <!--<el-select v-model="formInline.status" filterable placeholder="请选择" clearable  @focus="initStatus">-->
              <!--<el-option-->
                <!--v-for="item in selectStatus"-->
                <!--:key="item.dictDtlId"-->
                <!--:label="item.dictDtlName"-->
                <!--:value="item.dictDtlId">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-input v-model="formInline.purchaseOrderDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预到货日期">
            <el-input v-model="formInline.predictArriveDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有效天数">
            <el-input v-model="formInline.effectiveDays"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结算方式">
            <el-input v-model="formInline.settleTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单有效期">
            <el-input v-model="formInline.purchaseOrderIndate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品质">
            <el-input v-model="formInline.qualityName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽检方式">
            <el-input v-model="formInline.checkTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽检值">
            <el-input v-model="formInline.checkValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传输标志">
            <el-input v-model="formInline.transportTypeName"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">-->
          <!--<el-form-item label="错误状态">-->
            <!--<el-input v-model="formInline.errorStatusName"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="6">
          <el-form-item label="创建标志">
            <el-input v-model="formInline.createTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-input v-model="formInline.statusName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="formInline.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <div class="btn-box" style="text-align: right;margin-top: 20px">
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

<script src="./js/detail.js">

</script>

<style scoped>

</style>
