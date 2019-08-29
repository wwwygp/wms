<template>
  <div>
    <!--表格-->
    <div style="height: 100%;width: 100%;background: #fff;margin-top: 10px;">
      <el-tooltip effect="dark" content="点击设置表头" placement="left">
        <img id="configImg" src="../../images/setting.png" alt="" @click="clickDialog" style="float: right;cursor: pointer;width: 16px;opacity: 0.5;margin-right: 25px;margin-bottom: 2px;">
        </el-tooltip>
        <div class="tl-rl" v-if="domShow">
          <template :table="dataTable">
            <el-table highlight-current-row :show-summary="dataTable.hasShowSummary" :summary-method="dataTable.getSummaries" ref="TlRlTable" stripe empty-text="暂无数据" :data="dataTable.data" tooltip-effect="dark" :max-height="dataTable.maxHeight" :height="dataTable.height" :border="dataTable.border" :style="dataTable.tableStyle" :header-cell-style="dataTable.headerCellStyle" :row-class-name="rowClassName" :span-method="objectSpanMethod" @selection-change="handleSelectionChange" @row-click="rowClick" @cell-click='cellClick'>
              <el-table-column v-if="dataTable.hasSelect" type="selection" fixed style="text-align: center" width="55">
              </el-table-column>
              <el-table-column v-if="dataTable.hasRadio" fixed style="text-align: center" width="55">
                <template slot-scope="scope">
                  <!-- <el-radio-group v-model="dataTable.radio">
                    <el-radio-button  :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio-button >
                  </el-radio-group> -->
                  <el-radio  :label="scope.$index" v-model="dataTable.radio" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio >
                </template>
              </el-table-column>
              <el-table-column type="expand" v-if="dataTable.hasExpand" :render-header="labelHead" :width="item.width">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item :label="item.label" v-for="item in dataTable.expands" :key="item.id">
                      <span>{{ props.row[item.prop] }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <template v-for="item in dataTable.tr">
                <el-table-column v-if="item.isView != 0 && item.show === 'template'" :label="item.label" :class-name="item.className ? item.className : ''" :key="item.id" :sortable="item.sortable" :fixed="item.fixed" :render-header="labelHead" :width="item.width" :show-overflow-tooltip="item.showTooltip">
                  <template slot-scope="scope">
                    <slot :name="item.prop" :obj="scope"></slot>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.isView != 0 && item.show !== 'template'&& item.hasCenterCol" :label="item.label" :class-name="item.className ? item.className : ''" :key="item.id" :sortable="item.sortable" :fixed="item.fixed" :render-header="labelHead" :width="item.width" :show-overflow-tooltip="item.showTooltip">
                  <template slot-scope="scope">
                    <slot :name="item.prop" :obj="scope"></slot>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.isView != 0 && item.show !== 'template'" :label="item.label" :sortable="item.sortable" :prop="item.prop" :class-name="item.className ? item.className : ''" :key="item.id" :fixed="item.fixed" :render-header="labelHead" :width="item.width" :show-overflow-tooltip="item.showTooltip">
                </el-table-column>
              </template>
              <el-table-column column-key="operation" :label="dataTable.operation.label" :class-name="dataTable.operation.className" v-if="dataTable.hasOperation">
                <template slot-scope="scope">
                  <el-button v-for="item in dataTable.operation.data" :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size" @click.stop="handleOperation(scope.$index, scope.row, item.id)">{{ item.label }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background v-if="dataTable.paginationShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :style="dataTable.paginationStyle" :current-page="dataTable.start" :page-sizes="dataTable.pageSizes" :page-size="dataTable.limit" :pager-count="dataTable.pagerCount" prev-text="上一页" next-text="下一页" layout="total, sizes, prev, pager, next, jumper" :total="dataTable.total">
            </el-pagination>
          </template>
        </div>
    </div>
    <!--表格设置的弹出框-->
    <hgp-set-table-header 
      ref="customTable"
      :tableField="tableField"
      @handleComfirm="handleSaveConfig"
      @handleReset="handleReset"></hgp-set-table-header>
  </div>
</template>
<script>
import { tableFieConfig, updateTable, resetTable} from '../../api/common/table-config';
import draggable from 'vuedraggable';
import HgpSetTableHeader from '@/components/common/hgp-set-table-header';
import './tableConfigure.scss';
export default {
  name: "tableConfigure",
  components: {
    draggable,
    HgpSetTableHeader
  },
  props: [
    'dataTable', // 表格数据
    'tableCode', // tableID
    'centerDom', // 中间自定义slot
  ],
  data() {
    return {
      domShow: true,
      tableField: [],//表格字段
      tempTableField: [],
      checkBoxData: [], // 左侧可选的数据字段
      selectListData: [], // 这个是右侧选中的列表字段
      noSelectListData: [], // 用户没选中的
    }
  },
  created() {
    this.initTable(); // 表格初始化
  },
  watch: {
    'dataTable': 'initTable'
  },
  methods: {
    labelHead(h, { column, index }) {
      let l = column.label.length
      let f = 16 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * l + 50 //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' } }, [column.label])

    },
    initTable() { // 表格初始化
      this.checkBoxData = [];
      if(!this.dataTable.pageSizes){
        this.dataTable.pageSizes = [10, 20, 30, 50,100]
      }
      tableFieConfig(this.tableCode).then(res => {
        res.data.forEach((item, index) => {
          !Number(item.isView) ? item.isView = true : item.isView = false;
        });
        this.checkBoxData = JSON.parse(JSON.stringify(res.data));
        // this.getCurrentRow(0);
        this.$emit('tableDataHandle', this.checkBoxData);
        // this.tableDataHandle(this.checkBoxData);
        this.tempTableField = JSON.parse(JSON.stringify(res.data));
        this.tableField = JSON.parse(JSON.stringify(res.data));
        this.domShow = false
        this.$nextTick(() => {
          this.domShow = true
        });
      });
    },
    clickDialog() { // 点击出现对话框
      this.tableField = JSON.parse(JSON.stringify(this.tempTableField))
      this.$refs.customTable.handleShowDialog()
    },
    handleClose() { // 关闭对话框
      this.dialogVisible = false;
    },
    handleSaveConfig(data) {
      this.updateTableData(data);
    },
    updateTableData(data) { // 表格数据修改事件
      data.forEach(item => {
        item.isView ? item.isView = '0' : item.isView = '1'
        item.tableCode = this.tableCode.tableCode;
      });
      updateTable(data).then(res => {
        if (res.data.status == 10001) {
          this.$message.error(res.data.message);
        } else {
          this.$refs.customTable.handleClose()
          this.$message.success('操作成功');
          this.initTable();
        }
      });
    },
    //重置
    handleReset() {
      let param = {
        tableCode: this.tableCode.tableCode
      }
      resetTable(param).then(res => {
        if (res.data.status == 10001) {
          this.$message.error(res.data.message);
        } else {
          this.$refs.customTable.handleClose()
          this.$message.success('操作成功');
          this.initTable();
        }
      });
    },
    handleSelectionChange(val) {
      if (this.dataTable.hasRadio == true) { // 这个为了防止用户选了单选之后，多选触发
      } else {
        this.$emit('onHandleSelectionChange', val);
      };
    },
    handleSizeChange(val) { // size选择
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) { // 页码选择
      this.$emit('handleCurrentChange', val);
    },
    handleOperation(a, b, id) { // 点了操作按钮触发的函数
      const data = this.table.operation.data;
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].id) {
          this.$emit(data[i].Fun, a, b);
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 合并单元格触发的函数
      if (!this.hasMergeRowOrColumn) {
        return
      } else {
        this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex });
      }
    },
    // 点击某一行时触发的函数
    rowClick(Row, Event, Column) {
      if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
        return
      }
      //解决点击单选按钮执行两次行点击事件的问题
      if(Event.srcElement.className == "el-radio__original" || Event.srcElement.className == "el-radio-button__inner"){
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      };
      if(this.dataTable.hasRadio){
        this.$refs.TlRlTable.setCurrentRow(Row)
      }
      if(this.dataTable.hasSelect){
        this.$refs.TlRlTable.toggleRowSelection(Row)
      }
      this.$emit('onRowClick', data)
    },
    cellClick(row, column, cell, event){
      let data ={
        row: row,
        column: column,
        cell: cell,
        event: event
      }
      this.$emit('cellClick', data)
    },
    // 行类名的回调函数
    rowClassName(rowdata) {
      // const data = this.table.data;
      // let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '';
      // if (className.length === 0) {
      //   return
      // }
      // className = className.join(' ');
      // return className
    },
    getCurrentRow(index) {
      let newArr = []; // 为了和多选结构保持一致
      let valData = this.dataTable.data[index];
      newArr.push(valData);
      this.$emit('onHandleSelectionChange', newArr);
    },
    toggleRowSelection(row, flag){
      this.$refs.TlRlTable.toggleRowSelection(row, flag)
    },
    setCurrentRow(row){
      this.$refs.TlRlTable.setCurrentRow(row)
    }
  }
}

</script>
<style type="text/css">
  .is-in-pagination input{
    box-shadow: 0 0 0 100px #fff inset;
  }
</style>