<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" id="search-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="节点名称">
            <el-input v-model="formInline.name" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="权限Key">
            <el-input v-model="formInline.menuKey" maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统编号">
            <el-select v-model="formInline.systemId" placeholder="请选择" clearable>
              <el-option value="WMS">WMS</el-option>
              <el-option value="MES">MES</el-option>
              <el-option value="MRP">MRP</el-option>
              <el-option value="WMSAPP">WMSAPP</el-option>
              <el-option value="GATEWAY">GATEWAY</el-option>
              <el-option value="COMMON">COMMON</el-option>
              <el-option value="DICT">DICT</el-option>
              <el-option value="SYSMENU">SYSMENU</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="btn-box" style="text-align: right;">
            <el-button type="primary" class='blue' @click="searchList">查询</el-button>
            <el-button type="primary" class='blue' @click="resetList">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--// 表格控件-->
    <table-configure
      v-if="heightResize"
      ref="tableConfig"
      :data-table="dataTable"
      :table-code="tableName"
      @onRowClick="onRowClick"
      @onHandleSelectionChange="onHandleSelectionChange"
      @tableDataHandle="tableDataHandle"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </table-configure>
    <el-row>
      <el-col :span="24">
        <div class="btn-box" style="text-align: left;">
          <el-button
            v-db-click
            v-for="(v,index) in btnList"
            :class="v.className"
            :key="index" @click="callFn(v)"
            :type="filteType(v.className)"
          >
            {{v.name}}
          </el-button>
        </div>
      </el-col>
    </el-row>

    <self-dialog
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="mainteTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 是否保存数据 -->
      <tips-dialog :parent-data="isSaveDialog" @handleOkTip="cancel('form')">
      </tips-dialog>
      <el-form :model="form" ref="form" :rules="rulesForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="节点名称:" prop="name">
              <el-input v-model="form.name" class='inputWidth'  :maxLength="50"></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="10">-->
            <!--<el-form-item label="权限类型:" prop="">-->
              <!--<el-select  v-model="" placeholder="请选择">-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="10">
            <el-form-item label="URL:" prop="url">
              <el-input v-model="form.url" class='inputWidth'  :maxLength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="权限Key:" prop="menuKey">
              <el-input v-model="form.menuKey" class='inputWidth'  :maxLength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="请求类型:" prop="requestType">
              <el-select  v-model="form.requestType" placeholder="请选择">
                <el-option value="GET">GET</el-option>
                <el-option value="POST">POST</el-option>
                <el-option value="PUT">PUT</el-option>
                <el-option value="DELETE">DELETE</el-option>
                <el-option value="PATCH">PATCH</el-option>
                <el-option value="ALL">ALL</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
          <el-form-item label="系统编号:" prop="systemId">
            <el-select  v-model="form.systemId" placeholder="请选择">
              <el-option value="WMS">WMS</el-option>
              <el-option value="MES">MES</el-option>
              <el-option value="MRP">MRP</el-option>
              <el-option value="WMSAPP">WMSAPP</el-option>
              <el-option value="GATEWAY">GATEWAY</el-option>
              <el-option value="COMMON">COMMON</el-option>
              <el-option value="DICT">DICT</el-option>
              <el-option value="SYSMENU">SYSMENU</el-option>
            </el-select>
          </el-form-item>
        </el-col>
          <el-col :span="8">
            <el-form-item label="接口类型:" prop="interfaceType">
              <el-select  v-model="form.interfaceType" placeholder="请选择">
                <el-option
                  v-for="item in interfaceTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="权限类别:" prop="ismenu">
              <el-select  v-model="form.ismenu" placeholder="请选择" @change="isMenuTypeChange">
                <el-option
                  v-for="item in isMenuTypeWay"
                  :key="item.dictDtlValue"
                  :label="item.dictDtlName"
                  :value="item.dictDtlValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父级名称:" prop="parentId">
              <el-select v-model="form.parentId" placeholder="请选择" filterable clearable :disabled="editForbid">
                <el-option
                  v-for="item in parentWay"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="父级权限Key:" prop="parentId">
              <el-select v-model="form.parentId" placeholder="请选择" filterable clearable :disabled="editForbid">
                <el-option
                  v-for="item in parentWay"
                  :key="item.id"
                  :label="item.menuKey"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="方法名称:" prop="methodName">
              <el-input v-model="form.methodName" class='inputWidth'  :maxLength="20" :disabled="editForbid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="按钮样式:" prop="className">
              <el-input v-model="form.className" class='inputWidth'  :maxLength="20" :disabled="editForbid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="按钮排序:" prop="sort">
              <el-input v-model="form.sort" class='inputWidth'  :maxLength="20" :disabled="editForbid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
        <!--<el-col :span="18">-->
        <!--<el-form-item label="备注:" prop="remark">-->
        <!--<el-input v-model="form.remark" maxLength="50" class='inputWidth'></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')" class="blue">保 存</el-button>
        <el-button  type="primary" class="blue" @click="resetForm('form')">取 消</el-button>
      </span>
    </self-dialog>
    <self-dialog
      :visible.sync="viewSqls"
      width="50%"
      custom-class="minWidth tableConfigDialog"
      :title="sqlTitle"
      :modal-append-to-body="false"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- sql查看窗口 -->
      <tips-dialog :parent-data="viewSqls" @handleOkTip="cancel('sqlForm')"></tips-dialog>
      <el-form :model="sqlForm" ref="sqlForm">
        <el-row>
          <el-col :span="24">
            <el-input v-model="sqlForm.sql" class='inputWidth' autosize type="textarea"></el-input>
          </el-col>
        </el-row>
      </el-form>
    </self-dialog>
  </el-card>
</template>

<script src="./js/sys-menu.js"></script>

<style scoped>

</style>
