<template>
  <div class="receipt" style="height: calc(100vh);">
    <el-row class="receipt-form">
      <el-form :inline="true" :model="formInline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="波次号">
              <el-select v-model="formInline.moveWaveCode" placeholder="请选择" filterable clearable v-loadmore="waveCodeMore" remote :remote-method="searchWave" @focus="focusWaveCode" @clear="clearWaveCode" @change="changeWaveCode">
                <el-option
                  v-for="item in waveArr.data"
                  :key="item.moveWaveCode"
                  :label="item.moveWaveCode"
                  :value="item.moveWaveCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="移库单号">
              <el-select v-model="formInline.moveNoteCode" placeholder="请选择" filterable clearable v-loadmore="moveNoteCodeMore" remote :remote-method="searchMoveNote" @focus="focusMoveNoteCode" @clear="clearMoveNoteCode" @change="changeMoveNoteCode">
                <el-option
                  v-for="item in moveNoteArr.data"
                  :key="item.moveNoteCode"
                  :label="item.moveNoteCode"
                  :value="item.moveNoteCode">
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
          <el-col :span="6">
            <div class="btn-box">
              <el-button-group>
                <el-button  type="primary" class="blue" @click="searchList">查询</el-button>
                <el-button type="primary" class="blue"  @click="reseltForm('formInline')">重置</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin:0 !important;" :gutter='14'>
          <el-col :span="14">
            <table-configure
              ref="tableConfig"
              :data-table="dataTable"
              :table-code="dataTable.tableName"
              @onRowClick="onRowClick"
              @tableDataHandle="tableDataHandle"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            >
            </table-configure>
          </el-col>
          <el-col :span="10" style="margin-top: 80px;">
            <el-form :inline="true" :model="formTable">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="实际移库人">
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
              </el-row>
              <el-row>
                <el-col :span="24" :offset="5">
                  <div class="btn-box">
                    <el-button
                      v-db-click
                      v-for="(v,index) in btnList"
                      v-if="v.menuKey != 'WMS_MOVE_NOTE_PRINTING'"
                      :class="v.className"
                      :key="index" @click="extendFn(v)"
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
              <template slot-scope="props" slot="actualBoxAmount">
                <el-input class='right-num' v-model='props.obj.row.actualBoxAmount' maxLength="10" :disabled='props.obj.row.disabledLargePackageNumber'> </el-input>
              </template>
              <template slot-scope="props" slot="actualCaseAmount">
                <el-input class='right-num' v-model='props.obj.row.actualCaseAmount' maxLength="10" :disabled='props.obj.row.disabledMediumPackageNumber'> </el-input>
              </template>
              <template slot-scope="props" slot="actualPieceAmount">
                <el-input class='right-num' v-model='props.obj.row.actualPieceAmount' maxLength="10" :disabled='props.obj.row.disabledSmallPackageNumber'> </el-input>
              </template>
              <!--实际容器编码-->
              <template slot-scope="props" slot="dstLabelCode">
                <el-input class='right-num' v-model='props.obj.row.dstLabelCode' @blur="onLabelblur(props.obj.row)" maxLength="20"> </el-input>
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
            v-for="(v,index) in btnList"
            v-if="v.menuKey == 'WMS_MOVE_NOTE_PRINTING'"
            :class="v.className"
            :key="index" @click="extendFn(v)"
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
    <tips-dialog :parent-data="comfirmDialog" @handleOkTip="comfirm"></tips-dialog>
  </div>
</template>

<script src="./js/move-receipt.js"></script>


<style lang="scss">
.receipt .el-date-editor.el-input,
.receipt .el-date-editor.el-input__inner {
  width: 166px !important;
}
.receipt{
  padding:20px 20px 0;
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.el-button-group .el-button:not(:last-child){
  margin:0 10px;
}
.el-footer {
  height:30px!important;
  line-height:30px;
  background: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 5;
  padding: 0;
}

</style>
