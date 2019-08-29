// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import { getDeliveNotice, updateDeliveNotice, updateDeliveNoticeDelivestatus,
  addDeliveNotice, getDeliveNoticeDtl,  addDeliveNoticeDtl} from '@/api/export-warehouse/delive-notice/index';
import { getWaveDataOfWave, getWaveDataOfOperation, getWaveDataOfDetail, pickNoteInsert, selectWaveDataOfWave} from '@/api/export-warehouse/delive-order/index';
import { loaddBtn } from '@/api/common/load-btn.js';
import { ownersList } from '@/api/common/business.js'; // 供应商
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'delive-order',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    return {
      heightResize:true,
      btnList: [],//按钮集
      printerBtn: [], //打印按钮
      formInline: { // 主页表单 貌似没有用了,随后迭代版本记得删掉
        deliveNoticeTypeId: '',
        waveCode: '',
        // operationTypeId: '0',
        // customerAreaType: '0'
      },
      operationTypeId: '0', // 作业类型 默认 P-托盘
      customerAreaType: '0', // 区域/客户 默认 区域
      //波次单号表
      dataTableWaveOrder: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        hasRadio: true, // 单选功能
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        radio: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        pagerCount: 5,
        tableName: {
          tableCode: "EXPORT_WAVE_DATA_ORDER"
        } // 表格ID ，就是表格自定义名称
      },
      //波次区域表
      dataTableWaveArea: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        hasRadio: true, // 单选功能
        border: true,
        start: 1,
        paginationShow: true, // 是否需要分页
        limit: 100,
        total: 0,
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        tableName: {
          tableCode:"EXPORT_WAVE_DATA_AREA"
        } // 表格ID ，就是表格自定义名称
      },
      //波次客户表
      dataTableWaveCustomer: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        hasRadio: true, // 单选功能
        border: true,
        start: 1,
        paginationShow: true, // 是否需要分页
        limit: 100,
        total: 0,
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        tableName: {
          tableCode:"EXPORT_WAVE_DATA_CUSTOMER"
        } // 表格ID ，就是表格自定义名称
      },
      //波次详请表
      dataTableWaveDetail: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        hasRadio: false, // 单选功能
        border: true,
        start: 1,
        paginationShow: true, // 是否需要分页
        limit: 100,
        total: 0,
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        tableName: {
          tableCode:"EXPORT_WAVE_DATA"
        } // 表格ID ，就是表格自定义名称
      },
      selectedRowOrder: null, // 波次单号表中用户选择的数据
      selectedRowArea: null, // 波次区域表中用户选择的数据
      selectedRowCustomer: null, // 波次用户表中用户选择的数据
      selectedRowType: null, // 波次客户/区域表中用户选择的数据
      selectedRowDetail: null, // 波次详细表中用户选择的数据
      deliveNoticeTypeData : { // 出货单类型数据
        data: [],
        start : 1,
        limit: 10
      },
      deliveNoticeTypePage: 1,//出货单类型页码
      orders: { //波次号
        data: [],
        start: 1,
        limit: 10
      },
      ordersPage: 1, //波次号页码
      searchWaveCode: '',
      operationTypeList: [], //作业类型下拉框集合
      searchParam: {}      
    }
  },
  created() {
    this.initDictionary();//从字典中获取配置参数
    // this.initOrdersList()//获取波次号
    this.initBtn()
    this.initOrderTable(1)
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods: {
    initDictionary(accumulation) {
      let params = {
        code: 'delive_notice_type_id'//出库类型
      }
      dictionarysType(params).then(res => {
        this.deliveNoticeTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
      let params1= {
        code: 'operation_type_id'//作业类型
      }
      dictionarysType(params1).then(res => {
        this.operationTypeList= JSON.parse(JSON.stringify(res.data))
      })
    },
    initOrdersList (accumulation) { //波次号
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.orders.data));
      let params = {
        waveCode: this.searchWaveCode,
        start: this.orders.start,
        limit: this.orders.limit
      };
      selectWaveDataOfWave(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.orders.data = oldData.concat(data.records) : this.orders.data = JSON.parse(JSON.stringify(data.records));
          this.ordersPage = data.pages; // 总页码
        };
      })
    },
    loadMoreOrder () {
      if ( this.orders.start == this.ordersPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.orders.start = this.orders.start + 1;
        this.initOrdersList(true);
      }
    },
    searchOrder(val){
      this.searchWaveCode = val
      this.orders.data =[]
      this.orders.start = 1
      this.initOrdersList()
    },
    focusOrder(Event){
      if(Event.srcElement){
        this.searchWaveCode = Event.srcElement.value
      }else{
        this.searchWaveCode = Event.target.value
      }
      // this.searchWaveCode = Event.srcElement.value
      this.orders.data =[]
      this.orders.start = 1
      this.initOrdersList()
    },
    changeOrder(val){
      let key = this.orders.data.findIndex(item => item.waveId == val)
      if(key != -1){
        this.searchWaveCode = this.orders.data[key].waveCode
      }
    },
    clearOrder(){
      this.searchWaveCode = ''
    },
    customerAreaTypeChange( ) {
      this.queryWaveDataOfOperation()
    },
    operationTypeIdChange( ) {
      this.queryWaveDataOfOperation()
    },
    //出货成单之未成单波次号查询
    searchList (current) {
      //通过表单数据获取表格
      this.searchParam = {
        waveCode: this.formInline.waveCode,
        deliveNoticeTypeId: this.formInline.deliveNoticeTypeId,
        isAsc: true
      }
      this.initOrderTable(1)
    },
    resetList () {
      //重置查询条件但不刷新表单
      this.formInline.deliveNoticeTypeId = ''
      this.formInline.waveCode = ''
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
    },
    initOrderTable (current) { // 生成波次单号表格,联动区域客户表和波次详请表
      let params = {
        start: current,
        limit: this.dataTableWaveOrder.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      this.queryWaveOrderList(this.filteParams(params))
    },
    //查询表操作
    queryWaveOrderList(params){ //查询波次单号表
      let that = this
      return new Promise(function (resolve, reject) {
        getWaveDataOfWave(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            if(data.records){
              data.records.forEach((item,index) => {
                item.index = index
              })
              that.dataTableWaveOrder.data = JSON.parse(JSON.stringify(data.records))
              that.$refs.tableWaveOrder.setCurrentRow();
              // 这里绑定第一行
              that.dataTableWaveOrder.radio = 0
              that.selectedRowOrder = that.dataTableWaveOrder.data[0]
              that.queryWaveDataOfOperation()
              that.dataTableWaveOrder.start = data.current
              that.dataTableWaveOrder.limit = data.size
              that.dataTableWaveOrder.total = data.total

            }
          }
          resolve()
        })
      })
    },
    queryWaveDataOfOperation(){ //查询波次区域/客户表
      let that = this
      if(this.selectedRowOrder === undefined){
        this.selectedRowType = undefined
        this.dataTableWaveArea.data = []
        this.dataTableWaveArea.total = 0
        this.dataTableWaveArea.start = 1
        this.dataTableWaveArea.limit =100
        this.dataTableWaveCustomer.data = []
        this.dataTableWaveCustomer.total = 0
        this.dataTableWaveCustomer.start = 1
        this.dataTableWaveCustomer.limit = 100
        this.dataTableWaveDetail.data = []
        this.dataTableWaveDetail.total = 0
        this.dataTableWaveDetail.start = 1
        this.dataTableWaveDetail.limit = 100
        return;
      }
      let params = {
        waveCodes:that.selectedRowOrder.waveCode,
        customerAreaType: that.customerAreaType,
        operationTypeId: that.operationTypeId,
        isAsc: true,
        start: (that.customerAreaType == 0)? that.dataTableWaveArea.start : that.dataTableWaveCustomer.start,
        limit: (that.customerAreaType == 0)? that.dataTableWaveArea.limit : that.dataTableWaveCustomer.limit,
      }
      return new Promise(function (resolve, reject) {
        getWaveDataOfOperation(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            that.$message.warning(data.message)
          }else{
            if(that.customerAreaType == '0' ||that.customerAreaType == 0) {
              if(data.records){
                data.records.forEach((item,index) => {
                  item.index = index
                })
                that.dataTableWaveArea.data = JSON.parse(JSON.stringify(data.records))
                that.dataTableWaveArea.radio = 0
                that.$refs.tableWaveArea.getCurrentRow(0)
                that.dataTableWaveArea.start = data.current
                that.dataTableWaveArea.limit = data.size
                that.dataTableWaveArea.total = data.total
              }else {
                data.forEach((item,index) => {
                  item.index = index
                })
                that.dataTableWaveArea.data = JSON.parse(JSON.stringify(data))
                that.dataTableWaveArea.radio = 0
                that.$refs.tableWaveArea.getCurrentRow(0)
                that.dataTableWaveArea.start = data.current
                that.dataTableWaveArea.limit = data.size
                that.dataTableWaveArea.total = data.total
              }
            }else {
              if(data.records) {
                data.records.forEach((item, index) => {
                  item.index = index
                })
                that.dataTableWaveCustomer.data = JSON.parse(JSON.stringify(data.records))
                that.dataTableWaveCustomer.radio = 0
                that.$refs.tableWaveCustomer.getCurrentRow(0)
                that.dataTableWaveCustomer.start = data.current
                that.dataTableWaveCustomer.limit = data.size
                that.dataTableWaveCustomer.total = data.total
              }else {
                data.forEach((item, index) => {
                  item.index = index
                })
                that.dataTableWaveCustomer.data = JSON.parse(JSON.stringify(data))
                that.dataTableWaveCustomer.radio = 0
                that.$refs.tableWaveCustomer.getCurrentRow(0)
                that.dataTableWaveCustomer.start = data.current
                that.dataTableWaveCustomer.limit = data.size
                that.dataTableWaveCustomer.total = data.total
              }
            }
          }
          resolve()
        })
      })
      //默认加载第一行查询明细表
    },
    queryWaveDetailList(){ //查询波次明细表
      let that = this
      let params = {
        limit: that.dataTableWaveDetail.limit,
        start: that.dataTableWaveDetail.start,
        customerAreaId: null,
        waveCodes: '',
        customerAreaType: 0,
        operationTypeId: 0
      }
      if(that.selectedRowType === undefined || that.selectedRowType === null || that.selectedRowOrder === undefined || that.selectedRowOrder === null) {
        that.dataTableWaveDetail.data = []
        that.dataTableWaveDetail.total = 0
        that.dataTableWaveDetail.start = 1
        that.dataTableWaveDetail.limit = 100
        return
      }else {
        params.customerAreaId = that.selectedRowType.customerAreaId
        params.waveCodes = that.selectedRowOrder.waveCode
        params.customerAreaType = that.customerAreaType
        params.operationTypeId = that.operationTypeId
      }
      //删除掉为空的参数
      for(let item in params) {
        if (params[item] == null || params[item] == undefined ) {
          delete params[item]
        }
      }
      return  new Promise(function (resolve, reject) {
        getWaveDataOfDetail(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            that.$message.warning(data.message)
          }else{
            that.dataTableWaveDetail.data = JSON.parse(JSON.stringify(data.records))
            that.dataTableWaveDetail.start = data.current
            that.dataTableWaveDetail.limit = data.size
            that.dataTableWaveDetail.total = data.total
          }
        })
      })
    },
    orderHandleCurrentChange (val) { // 分页页码
      this.dataTableWaveOrder.start = val
      this.initOrderTable(this.dataTableWaveOrder.start)
    },
    orderHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableWaveOrder.start = 1
      this.dataTableWaveOrder.limit = val
      this.initOrderTable(this.dataTableWaveOrder.start)
    },
    orderRowClick (val) { // 表格行点击
      this.dataTableWaveOrder.radio = val.row.index
      this.selectedRowOrder = val.row
      this.queryWaveDataOfOperation()
      let params = {
        waveCodes:val.row.waveCode,
        customerAreaType: this.customerAreaType,
        operationTypeId: this.operationTypeId,
        isAsc: true,
        start: (this.customerAreaType == 0)? this.dataTableWaveArea.start : this.dataTableWaveCustomer.start,
        limit: (this.customerAreaType == 0)? this.dataTableWaveArea.limit : this.dataTableWaveCustomer.limit,
      }
      getWaveDataOfOperation(params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          if(this.customerAreaType == '0' ||this.customerAreaType == 0) {
            if(data.records){
              data.records.forEach((item,index) => {
                item.index = index
              })
              this.dataTableWaveArea.data = JSON.parse(JSON.stringify(data.records))
              this.dataTableWaveArea.radio = 0
              this.$refs.tableWaveArea.getCurrentRow(0)
              this.dataTableWaveArea.start = data.current
              this.dataTableWaveArea.limit = data.size
              this.dataTableWaveArea.total = data.total
            }else {
              data.forEach((item,index) => {
                item.index = index
              })
              this.dataTableWaveArea.data = JSON.parse(JSON.stringify(data))
              this.dataTableWaveArea.radio = 0
              this.$refs.tableWaveArea.getCurrentRow(0)
              this.dataTableWaveArea.start = data.current
              this.dataTableWaveArea.limit = data.size
              this.dataTableWaveArea.total = data.total
            }
          }else {
            if(data.records) {
              data.records.forEach((item, index) => {
                item.index = index
              })
              this.dataTableWaveCustomer.data = JSON.parse(JSON.stringify(data.records))
              this.dataTableWaveCustomer.radio = 0
              this.$refs.tableWaveCustomer.getCurrentRow(0)
              this.dataTableWaveCustomer.start = data.current
              this.dataTableWaveCustomer.limit = data.size
              this.dataTableWaveCustomer.total = data.total
            }else {
              data.forEach((item, index) => {
                item.index = index
              })
              this.dataTableWaveCustomer.data = JSON.parse(JSON.stringify(data))
              this.dataTableWaveCustomer.radio = 0
              this.$refs.tableWaveCustomer.getCurrentRow(0)
              this.dataTableWaveCustomer.start = data.current
              this.dataTableWaveCustomer.limit = data.size
              this.dataTableWaveCustomer.total = data.total
            }
          }
        }
      })
    },
    orderHandleSelectionChange(val) { // 用户的选择框事件
      // this.selectedRowOrder = val[0];
      // this.queryWaveDataOfOperation()
    },
    orderTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; //是 否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'deliveNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTableWaveOrder.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableWaveOrder.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableWaveOrder.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableWaveOrder.domShow = false;
      this.$nextTick(() => {.0

        // this.domShow = true;
        this.$refs.tableWaveOrder.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableWaveOrder.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      // this.initOrderTable(1) // 波次单号表格初始化
    },
    //波次储区表操作
    areaHandleCurrentChange (val) { // 分页页码
      this.dataTableWaveArea.start = val
      this.queryWaveDataOfOperation()
    },
    areaHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableWaveArea.start = 1
      this.dataTableWaveArea.limit = val
      this.queryWaveDataOfOperation()
    },
    areaRowClick (val) { // 表格行点击
      this.dataTableWaveArea.radio = val.row.index;
      this.selectedRowType = val.row
      this.queryWaveDetailList()
    },
    areaHandleSelectionChange(val) { // 用户的选择框事件
      this.selectedRowType = val[0]
      this.queryWaveDetailList()
    },
    areaTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; //是 否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'deliveNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTableWaveArea.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableWaveArea.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableWaveArea.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableWaveArea.domShow = false;
      this.$nextTick(() => {

        // this.domShow = true;
        this.$refs.tableWaveArea.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableWaveArea.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      this.queryWaveDetailList()// 表格初始化
    },
    //波次客户表操作
    customerHandleCurrentChange (val) { // 分页页码
      this.dataTableWaveCustomer.start = val
      this.queryWaveDataOfOperation()
    },
    customerHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableWaveCustomer.start = 1
      this.dataTableWaveCustomer.limit = val
      this.queryWaveDataOfOperation()
    },
    customerRowClick (val) { // 表格行点击
      this.dataTableWaveCustomer.radio = val.row.index;
      this.selectedRowType = val.row
      this.queryWaveDetailList()
    },
    customerHandleSelectionChange(val) { // 用户的选择框事件
      this.selectedRowType = val[0];
      this.queryWaveDetailList()
    },
    customerTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; //是 否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'deliveNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTableWaveCustomer.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableWaveCustomer.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableWaveCustomer.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableWaveCustomer.domShow = false;
      this.$nextTick(() => {.0

        // this.domShow = true;
        this.$refs.tableWaveCustomer.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableWaveCustomer.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      this.queryWaveDetailList() // 主表格初始化
    },
    //波次明细表操作
    detailHandleCurrentChange (val) { // 分页页码
      this.dataTableWaveDetail.start = val
      this.queryWaveDetailList()
    },
    detailHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableWaveDetail.start = 1
      this.dataTableWaveDetail.limit = val
      this.queryWaveDetailList()
    },
    detailRowClick () { // 表格行点击
    },
    detailHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    detailTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; //是 否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'deliveNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTableWaveDetail.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableWaveDetail.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableWaveDetail.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableWaveDetail.domShow = false;
      this.$nextTick(() => {.0

        // this.domShow = true;
        this.$refs.tableWaveDetail.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableWaveDetail.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#delive-order-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      let tableHeight = ($(window).height() - formHeight - this.$store.state.basic.height - '40')/2;
      this.dataTableWaveDetail.height = this.dataTableWaveArea.height = this.dataTableWaveCustomer.height = this.dataTableWaveOrder.height = tableHeight
    },
    closeDialog(){

    },
    removeRow(){

    },
    //新增
    addList(){
      this.dialogVisible = true
    },
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params)
    },
    //判断参数是否为空
    isEmpty(obj) {
      if(!obj || obj === '' || obj === [] || obj === undefined){
        return true
      }
    },
    //清除表格数据
    clearTable(dataTable){
      dataTable.data = []
    },
    //出货成单-拣货单生成
    getPickNoteInsert() {
      // // 出货成单不再使用WaveIds作为参数
      // if(this.selectedRowType == undefined){
      //   this.$message.warning('请先勾选一行储区编码或者客户编码再点击出货成单按钮')
      //   return
      // }
      // let params = {
      //   waveDataIds : this.selectedRowType.waveId
      //   // waveDataIds : "1"
      // }
      //出货成单改用波次号作为参数
      if(this.selectedRowOrder == undefined){
        this.$message.warning('请先勾选一行波次单号数据再点击出货成单按钮')
        return
      }
      let params = {
        waveCodes : this.selectedRowOrder.waveCode
      }
      pickNoteInsert(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }else{
          this.$message.success('出货成单成功!')
          return this.initOrderTable(1);
        }
      }).catch(error => {
        this.$message.error('出货成单失败!')
      })
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_EXPORT_ORDER_TABLE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.btnList.length; i++) {
          if (this.btnList[i].menuKey == 'WMS_EXPORT_ORDER_PICK_NOTE_INSERT') {
            this.printerBtn.push(this.btnList[i])
            continue
          }
        }
      })
    },
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g
      const reg2 = /\(([^)]+)\)/
      if (reg2.test(item.methodName)) {
        let methodName = item.methodName.match(reg1)
        let args = item.methodName.match(reg2)
        this[methodName[0]].apply(this, args[1].split(','))
      } else {
        this[item.methodName].apply(this)
      }
    },
  }
}
