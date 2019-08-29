 <template>
 <el-card style="height: calc(100vh); overflow: auto">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-row id="top-form">
        <el-col :span="6">
          <!-- 委托业主，下拉框 -->
					<el-form-item label="委托业主名称" prop="companyName">
						<el-select v-model="searchForm.ownerId" placeholder="请选择" v-loadmore="loadMoreOwnerList" filterable clearable>
							<el-option
								v-for="item in ownersArr.data"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 单据编码 -->
					<el-form-item label="单据编码">
						<el-input v-model="searchForm.invoiceCode" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 商品名称，下拉框 -->
					<el-form-item label="商品名称">
						<el-input v-model="searchForm.commodityName" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 按钮 -->
					<el-button type="primary" class="blue" @click="queryStorkChangeRecordBySearch">查询</el-button>
					<el-button type="primary" class="blue" @click="resetStockChangeRecord">重置</el-button>
        </el-col>
      </el-row>
      <el-row id="top-form">
        <el-col :span="6">
          <!-- 来源储位编码 -->
					<el-form-item label="来源储位编码">
						<el-input v-model="searchForm.srcSpaceCode" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 来源容器号 -->
					<el-form-item label="来源容器编码">
						<el-input v-model="searchForm.srcLabelCode" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 目的储位编码 -->
					<el-form-item label="目的储位编码">
						<el-input v-model="searchForm.dstSpaceCode" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 目标容器编码 -->
					<el-form-item label="目标容器编码">
						<el-input v-model="searchForm.dstLabelCode" maxLength="50" clearable></el-input>
					</el-form-item>
        </el-col>
      </el-row>
      <el-row id="top-form">
        <el-col :span="12">
          <!-- 来源储位编码 -->
          <el-form-item label="商品编码">
            <el-input v-model="searchForm.commodityCode" maxLength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <DatePick ref="createTime" :pickRange="true" @getStartTime="getStartTime" @getEndTime="getEndTime"></DatePick>
          </el-form-item>
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
      </table-configure>
    </el-row>
  </el-card>
</template>

<script src="./js/stock-changerecord.js">

</script>

<style scoped>
  a:hover{
    cursor: pointer;
  }
</style>
