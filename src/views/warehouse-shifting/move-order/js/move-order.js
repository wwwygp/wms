// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import { getMoveOrderList, getMoveOrderStorageList, getMoveOrderDtl, MoveOrder } from '@/api/warehouse-shifting/move-order/move-order';
import { getMoveWaveCode } from '@/api/warehouse-shifting/move-receipt/move-receipt.js'
import { loaddBtn } from '@/api/common/load-btn.js';
import { ownersList } from '@/api/common/business.js'; // 供应商
import { dictionarysTypeNew } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    return {
      btnList: [],//按钮集
      formInline: { // 主页表单 貌似没有用了,随后迭代版本记得删掉
        deliveNoticeTypeId: '',
        waveCode: ''
        // status: ''
      },
      //左上方
      dataTableMoveOrder: {
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
          tableCode: "WMS_MOVE_NOTE_WAVE_DATA"
        } // 表格ID ，就是表格自定义名称
      },
      //右上方
      dataTableMoveStorage: {
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
          tableCode:"WMS_MOVE_NOTE_STORAGE_DATA"
        } // 表格ID ，就是表格自定义名称
      },
      //详请表
      dataTableMoveDetail: {
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
          tableCode:"WMS_MOVE_NOTE_DETAIL_DATA"
        } // 表格ID ，就是表格自定义名称
      },
      selectedRowOrder: [], // 波次单号表中用户选择的数据
      selectedStorage: [], // 波次区域表中用户选择的数据
      selectedRowDetail: [], // 波次详细表中用户选择的数据
      moveType: [],//移库类型
      status: [],//状态
      singleWayArr: [],//成单方式
      singleWay: '0',
      deliveNoticeTypePage: 1,//出货单类型页码
      waveArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      waveArrPage: 1,
      searchWaveCode: '',
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
      dictionarysTypeNew
      //WMS_MOVE_PLAN_TYPE_VALUE 移库类型
      //WMS_MOVE_NOTE_DTL_STATUS_VALUE 状态
      //WMS_MOVE_NOTE_TYPE_SINGLE_WAY_VALUE 成单方式
      dictionarysTypeNew('WMS_MOVE_PLAN_TYPE_VALUE', this, 'moveType')
      dictionarysTypeNew('WMS_MOVE_NOTE_DTL_STATUS_VALUE', this, 'status')
      dictionarysTypeNew('WMS_MOVE_NOTE_TYPE_SINGLE_WAY_VALUE', this, 'singleWayArr')
    },
    //波次号
    initWaveCode (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.waveArr.data));
      let params = {
        moveWaveCode: this.searchWaveCode,
        start: this.waveArr.start,
        limit: this.waveArr.limit
      };
      getMoveWaveCode(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.waveArr.data = oldData.concat(data.records) : this.waveArr.data = JSON.parse(JSON.stringify(data.records));
          this.waveArrPage = data.pages // 总页码
        }
      })
    },
    waveCodeMore () {
      if ( this.waveArr.start == this.waveArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.waveArr.start = this.waveArr.start + 1
        this.initWaveCode(true);
      }
    },
    searchWave(val){
      this.searchWaveCode = val
      this.waveArr.data =[]
      this.waveArr.start = 1
      this.initWaveCode()
    },
    focusWaveCode(Event){
      // this.searchWaveCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchWaveCode = Event.srcElement.value
      }else{
        this.searchWaveCode = Event.target.value
      }
      this.waveArr.data =[]
      this.waveArr.start = 1
      this.initWaveCode()
    },
    changeWaveCode(val){
      this.searchWaveCode = val
    },
    clearWaveCode(){
      this.searchWaveCode = ''
    },
    singleWayChange() {
      if(!this.singleWay){
        return this.$message.warning("请选择成单方式！")
      }
      this.getMoveStorageList()
    },
    //查询移库成单列表
    searchList (current) {
      //通过表单数据获取表格
      this.searchParam = {
        moveWaveId: this.formInline.moveWaveId,
        moveTypeId: this.formInline.moveTypeId
        // status: this.formInline.status
      }
      this.initOrderTable(1)
    },
    resetList () {
      //重置查询条件但不刷新表单
      for (let item in this.formInline) {
        this.formInline[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
    },
    initOrderTable (current) {
      let params = {
        start: current,
        limit: this.dataTableMoveOrder.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      this.getMoveOrderList(this.filteParams(params))
    },
    //查询表操作
    getMoveOrderList(params){ //查询波次单号表
      getMoveOrderList(params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
          this.dataTableMoveOrder.start = 1
          this.dataTableMoveOrder.limit = 10
          this.dataTableMoveOrder.total = 0
        }else{
          if(data.records){
            data.records.forEach((item,index) => {
              item.index = index
            })
            this.dataTableMoveOrder.data = JSON.parse(JSON.stringify(data.records))
            this.$refs.tableMoveOrder.setCurrentRow();
            // 这里绑定第一行
            this.dataTableMoveOrder.radio = 0
            this.selectedRowOrder = this.dataTableMoveOrder.data[0]
            this.dataTableMoveOrder.start = data.current
            this.dataTableMoveOrder.limit = data.size
            this.dataTableMoveOrder.total = data.total
            //获取右上方列表
            if(this.dataTableMoveOrder.data.length > 0){
              this.getMoveStorageList()
            }else{
              this.dataTableMoveStorage.data = []
              this.dataTableMoveStorage.total = 0
              this.dataTableMoveStorage.start = 1
              this.dataTableMoveStorage.limit =100
              this.dataTableMoveDetail.data = []
              this.dataTableMoveDetail.total = 0
              this.dataTableMoveDetail.start = 1
              this.dataTableMoveDetail.limit = 100
            }
          }
        }
      })
    },
    getMoveStorageList(){ //右上方列表
      if(this.selectedRowOrder === undefined){
        this.selectedStorage = undefined
        this.dataTableMoveStorage.data = []
        this.dataTableMoveStorage.total = 0
        this.dataTableMoveStorage.start = 1
        this.dataTableMoveStorage.limit =100
        this.dataTableMoveDetail.data = []
        this.dataTableMoveDetail.total = 0
        this.dataTableMoveDetail.start = 1
        this.dataTableMoveDetail.limit = 100
        return
      }
      let params = {
        moveWaveId: this.selectedRowOrder.moveWaveId,
        moveTypeId: this.selectedRowOrder.moveTypeId,
        singleWay: this.singleWay,
        status: this.selectedRowOrder.status,
        isAsc: true,
        start: this.dataTableMoveStorage.start,
        limit: this.dataTableMoveStorage.limit
      }
      getMoveOrderStorageList(params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
          this.dataTableMoveStorage.start = 1
          this.dataTableMoveStorage.limit = 10
          this.dataTableMoveStorage.total = 0
        }else{
          if(data.records){
            data.records.forEach((item,index) => {
              item.index = index
            })
            this.dataTableMoveStorage.data = JSON.parse(JSON.stringify(data.records))
            this.dataTableMoveStorage.radio = 0
            this.selectedStorage = this.dataTableMoveStorage.data[0]
            this.dataTableMoveStorage.start = data.current
            this.dataTableMoveStorage.limit = data.size
            this.dataTableMoveStorage.total = data.total
            if(this.dataTableMoveStorage.data.length > 0){
              this.getWaveDetailList()
            }else{
              this.dataTableMoveDetail.data = []
              this.dataTableMoveDetail.total = 0
              this.dataTableMoveDetail.start = 1
              this.dataTableMoveDetail.limit = 100
            }
          }
        }
      })
    },
    getWaveDetailList(){ //查询明细表
      let params = {
        limit: this.dataTableMoveDetail.limit,
        start: this.dataTableMoveDetail.start,
        moveWaveId: this.selectedStorage.moveWaveId,
        moveTypeId: this.selectedStorage.moveTypeId,
        storageAreaId: this.selectedStorage.storageAreaId,
        singleWay: this.singleWay
      }
      getMoveOrderDtl(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.dataTableMoveDetail.data = JSON.parse(JSON.stringify(data.records))
          this.dataTableMoveDetail.start = data.current
          this.dataTableMoveDetail.limit = data.size
          this.dataTableMoveDetail.total = data.total
        }
      })
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#move-order-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      let tableHeight = ($(window).height() - formHeight - this.$store.state.basic.height - '40')/2;
      this.dataTableMoveOrder.height = this.dataTableMoveDetail.height = this.dataTableMoveStorage.height = tableHeight
    },
    orderHandleCurrentChange (val) { // 分页页码
      this.dataTableMoveOrder.start = val
      this.initOrderTable(this.dataTableMoveOrder.start)
    },
    orderHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableMoveOrder.start = 1
      this.dataTableMoveOrder.limit = val
      this.initOrderTable(this.dataTableMoveOrder.start)
    },
    orderRowClick (val) { // 表格行点击
      this.dataTableMoveOrder.radio = val.row.index
      this.selectedRowOrder = val.row
      this.getMoveStorageList()
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
      this.dataTableMoveOrder.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableMoveOrder.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableMoveOrder.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableMoveOrder.domShow = false;
      this.$nextTick(() => {.0

        // this.domShow = true;
        this.$refs.tableMoveOrder.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableMoveOrder.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      // this.initOrderTable(1) // 波次单号表格初始化
    },
    //波次储区表操作
    storageHandleCurrentChange (val) { // 分页页码
      this.dataTableMoveStorage.start = val
      this.getMoveStorageList()
    },
    storageHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableMoveStorage.start = 1
      this.dataTableMoveStorage.limit = val
      this.getMoveStorageList()
    },
    storageRowClick (val) { // 表格行点击
      this.dataTableMoveStorage.radio = val.row.index;
      this.selectedStorage = val.row
      this.getWaveDetailList()
    },
    storageTableDataHandle(data) { // table数据处理函数
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
      this.dataTableMoveStorage.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableMoveStorage.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableMoveStorage.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      this.$refs.tableMoveStorage.domShow = false;
      this.$nextTick(() => {
        this.$refs.tableMoveStorage.domShow = true;
        this.$refs.tableMoveStorage.dialogVisible = false;
      });
    },
    //波次明细表操作
    detailHandleCurrentChange (val) { // 分页页码
      this.dataTableMoveDetail.start = val
      this.getWaveDetailList()
    },
    detailHandleSizeChange (val) { // 分页每页展示的数量
      this.dataTableMoveDetail.start = 1
      this.dataTableMoveDetail.limit = val
      this.getWaveDetailList()
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
      this.dataTableMoveDetail.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableMoveDetail.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableMoveDetail.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableMoveDetail.domShow = false;
      this.$nextTick(() => {.0

        // this.domShow = true;
        this.$refs.tableMoveDetail.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableMoveDetail.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
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
    //移库成单
    moveOrder() {
      if(!this.selectedRowOrder){
        return this.$message.warning('请选择移库波次单!')
      }
      if(!this.selectedStorage){
        return this.$message.warning('请选择移库成单储区!')
      }
      let params = {
        moveWaveId : this.selectedRowOrder.moveWaveId,
        moveWaveCode: this.selectedRowOrder.moveWaveCode,
        moveTypeId: this.selectedRowOrder.moveTypeId,
        singleWay: this.singleWay,
        storageAreaIds:this.selectedStorage.storageAreaId,
        status: this.selectedRowOrder.status,
      }
      MoveOrder(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }else{
          this.$message.success('移库成单成功！!')
          this.initOrderTable(1);
        }
      }).catch(error => {
        this.$message.error('移库成单失败!')
      })
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_MOVE_ORDER'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    }
  }
}
