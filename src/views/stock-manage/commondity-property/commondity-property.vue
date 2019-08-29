 <template>
 <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-row id="top-form">
        <el-col :span="8">
          <el-form-item label="商品编码">
              <el-input v-model="searchForm.commodityCode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品条码">
              <el-input v-model="searchForm.commodityBarcode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
         <el-form-item label="供应商编码">
              <el-input v-model="searchForm.supplierCode" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row id="top-form">
        <el-col :span="8">
          <el-form-item label="商品品质">
            <el-select v-model="searchForm.commodityQualityId" filterable placeholder="请选择" clearable  >
              <el-option
                v-for="item in selectCommodityQuality"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品类型">
            <el-select v-model="searchForm.commodityTypeId" filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in selectCommodityType"
                :key="item.dictDtlValue"
                :label="item.dictDtlName"
                :value="item.dictDtlValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="批号">
            <el-input v-model="searchForm.productBatch" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产日期">
            <DatePick ref="productDate" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日">
            <DatePick ref="expireDate" :pickRange="true" @getExpireStartTime="getExpireStartTime" @getExpireEndTime="getExpireEndTime"></DatePick>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-button type="primary" class="blue" @click="searchList">查询</el-button>
          <el-button type="primary" class="blue" @click="resetSearchForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
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
      <template slot-scope="props" slot="testReportNo">
        <a @click="downloadPDF(props.obj.row.testReportOssurl)"> {{ props.obj.row.testReportNo }}</a>
      </template>
      </table-configure>
    </el-row>
  </el-card>
</template>

<script src="./js/property.js">

</script>

<style scoped>
  a:hover{
    cursor: pointer;
  }
</style>
