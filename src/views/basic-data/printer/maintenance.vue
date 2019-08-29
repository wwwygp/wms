<template>
  <el-card style="height: calc(100vh); overflow: auto">
    <el-row id="top-form">
      <el-col :span="16">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="12">
            <el-form-item label="打印机名称">
              <el-input v-model="formInline.printerName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印机编码">
              <el-input v-model="formInline.printerCode" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div class="btn-box" style="text-align: right">
          <!--// 目前只配置了红黄蓝绿。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            v-if='v.menuKey == "WMS_PRINTER_TABLE_LIST_SEARCH" || v.menuKey == "WMS_PRINTER_TABLE_LIST_INIT"'
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
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
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <!--// 目前只配置了红黄蓝。-->
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            v-if='v.menuKey == "WMS_PRINTER_TABLE_LIST_ADD" || v.menuKey == "WMS_PRINTER_TABLE_LIST_UPDATE" || v.menuKey == "WMS_PRINTER_TABLE_LIST_DEL"'
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="printerTitle"
      append-to-body
      :close-on-click-modal="false"
      >
          <el-form :model="form" ref="form" :rules="rulesForm">
            <el-row>
              <el-col :span="8">
                <el-form-item label="打印机编码" prop="printerCode">
                  <el-input v-model="form.printerCode" maxLength="20" :disabled="updateDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机名称" prop="printerName">
                  <el-input v-model="form.printerName" maxLength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机组" prop="printerGroupId">
                  <!-- load-more:滚动条滑动到底部加载更多   on-change：选择数据后的返回值 remote-method：模糊搜索 clearable:只适用于单选  组件宽度根据赋元素宽度分布  paramsOption:跟element的参数一直，将常用的做成配置项。multiple: true,//是否多选disabled: false,//是否禁用filterable: true,//是否可搜索remote: true,//是否为远程搜索clearable:false,//单选时是否可以清空选项multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制-->
                  <select-scroll :parent-data="form.printerGroupId" :options= "options" :paramsOption="paramsOption"  @loadMore= "loadMore" @on-change="selectChange" @remote-method= "remoteMethod"></select-scroll>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="打印机类型" prop="printerTypeId">
                  <el-select v-model="form.printerTypeId" placeholder="请选择">
                    <el-option
                      v-for="item in printerType"
                      :key="item.dictDtlId"
                      :label="item.dictDtlName"
                      :value="item.dictDtlValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="驱动程序名称" prop="driverName">
                  <el-input v-model="form.driverName" class="inputWidth" maxLength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机端口" prop="printerPort">
                  <el-input v-model="form.printerPort" class="inputWidth" maxLength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <!--<el-input v-model="form.status"></el-input>-->
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                      v-for="item in printerStatus"
                      :key="item.dictDtlId"
                      :label="item.dictDtlName"
                      :value="item.dictDtlValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注" class="widthAll">
                  <el-input v-model="form.remark" class="inputWidth" maxLength="50"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
        <el-button  class="blue" type="primary" @click="resetForm('form')" v-db-click>取 消</el-button>
        <el-button type="primary" @click="updateForm('form')" class="blue" v-db-click>保 存</el-button>
      </span>
    </el-dialog>
    <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
  </el-card>
</template>
<script src="./js/maintenance.js">
</script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>


</style>
