import DatePick from '@/components/DatePicker/index';
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getReceiveNoteList, receiveNote, receiveNoteConfirm,
  getReceiveNoteDetail, delReceiveNoteDetail,
  isComplete, getArrivalDtl, allCancel} from '@/api/warehousing-management/receive-node/receive-node';
import {staffsFromErp} from '@/api/common/common-info';
import { dictionarysType } from '@/api/common/type.js';//字典返回值，编码规则
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import {arrivalNoticeList} from '@/api/warehousing-management/preview-notice/notice';
import {suppliersList, ownersList} from '@/api/common/business.js'; // 供应商
import {getBrand} from '@/api/warehousing-management/receive-node/commodity.js';
import {printerReceiveNode} from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
export default {
  name: 'node',
  components: {
    DatePick,
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data () {
    return{
      // receiveNote: [],//收货单号
      arrivalNoticeType: [],//预到货单类型
      purchaseOrderType: [],//采购类型
      supplierArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 供应商对象集合
      supplierArrPage: 1, // 判断是否需要数据累加
      ownersArrPage: 1, //
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      brandsArrPage: 1,
      brandsArr: {
        data: [],
        start: 1,
        limit: 10
      },//品牌
      status: [],//收货单状态
      btnList: [], // 存放权限的按钮
      heightResize: true,
      //收货单主表
      dataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true, // 单选功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        radio: null,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "WMS_RECEIVE_NODE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      //主表
      formInline: {
        receiveNoteCode: '', // 收货单号
        arrivalNoticeTypeId: '', // 预到货单类型
        purchaseOrderTypeId: '', // 采购类型
        ownerId: '', // 委托业主唯一码,当前仓库下的业主
        supplierId: '', // 供应商唯一码
        status: '', // 收货单状态
        startCreateTime: '', // 起始时间
        endCreateTime: '' // 创建时间
      },
      getSelectedRow: [], // 主表用户多选框选中的数据
      //收货单明细表
      detailDataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableDetailName: {
        tableCode: "WMS_RECEIVE_NODE_DETAIL_TABLE"
      }, // 表格ID ，就是表格自定义名称
      getDetailSelectedRow: [], // 明细表用户多选框选中的数据
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      //按商品收货弹出框表单
      //按商品收货表格
      dialogDataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      dialogTableName: {
        tableCode: "WMS_RECEIVE_NODE_COMMODITY_TABLE"
      },
      form: {
        receiveNoticeId: '',//收货单id
        arrivalNoticeCode: '',//预到货单号
        arrivalNoticeTypeId: '',//预到货单类型
        commodityName: '',//商品名称
        ownerId: '',//委托业主
        brand: '',//品牌
        status: '2,4'
      },
      getDialogSelectedRow: [], // 弹出框用户多选框选中的数据
      dialogCommodityVisible: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveCommodityDialog: {//确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      //将需要比较的数组存起来
      oldDialogDataTable: [],
      commodityTitle: '',
      confirmDialog: {//收货确认
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该收货单的预到货通知单未完成，是否强制收货完成？'
      },
      staffs: [],
      receiverId: '',
      searchParam: {}
    }
  },
  created () {
    this.initBtn() // 按钮初始化
    this.initSupplier()//供应商
    this.initOwnersList()//委托业主
    // this.initDetailTable()//明细表
    this.initDictionary()//获取字段值

  },
  watch: {
    receiverId(curVal,oldVal){
　　　this.isSave = true
　　},
    'dialogDataTable.data':{
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/;
          if(item.smallPackageUnitId != 10){
            if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))){
              return this.$message.warning('请输入整数')
            }
          }else{
            if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber))){
              return this.$message.warning('请输入整数')
            }
          }
          item.arrivalCommodityAmount = parseFloat((item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount).toFixed(6))
          //实际总数量必须小于等于计划总数量
          if((0<item.arrivalCommodityAmount) && (item.arrivalCommodityAmount<=item.maxCommodityAmount)){
            //不做处理
          }else{
            this.$message.warning('实际总数量大于0且小于等于最大收货数量' + item.maxCommodityAmount)
          }
        })
  　　　for(let i=0; i<this.oldDialogDataTable.length; i++) {
          if(this.oldDialogDataTable[i].arrivalCommodityAmount != this.dialogDataTable.data[i].arrivalCommodityAmount){//比较不同的数据返回true
            this.isSave = true
            return
          }
        };
　　　},
　　　deep: true
    }
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
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g;
      const reg2 = /\(([^)]+)\)/;
      if (reg2.test(item.methodName)) {
        let methodName = item.methodName.match(reg1);
        let args = item.methodName.match(reg2);
        this[methodName[0]].apply(this, args[1].split(','));
      } else {
        this[item.methodName].apply(this);
      }
    },
    initBtn () {
      let menusKey = 'WMS_RECEIVE_NODE';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initDictionary() {//初始化字典值
      let params1 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_TYPE'//预到货单类型
      }
      dictionarysType(params1).then(res => {
        this.arrivalNoticeType = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_PURCHASE_TYPE'//采购类型
      }
      dictionarysType(params2).then(res => {
        this.purchaseOrderType = JSON.parse(JSON.stringify(res.data))
      })
      let params5 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_STATUS'//收货单状态
      }
      dictionarysType(params5).then(res => {
        this.status = JSON.parse(JSON.stringify(res.data))
      })
    },
    getStaffs(){
      let params = {
        isOnWork: true
      }
      staffsFromErp(this.filteParams(params)).then(res => {
        let re = res.data
        if(re.length > 0){
          this.staffs = re
        }
      })
    },
    //收货单主表
    searchList () {
      this.searchParam = {
        receiveNoteCode: this.formInline.receiveNoteCode, // 收货单号
        arrivalNoticeTypeId: this.formInline.arrivalNoticeTypeId, // 预到货单类型
        purchaseOrderTypeId: this.formInline.purchaseOrderTypeId, // 采购类型
        ownerId: this.formInline.ownerId, // 委托业主唯一码,当前仓库下的业主
        supplierId: this.formInline.supplierId, // 供应商唯一码
        status: this.formInline.status, // 收货单状态
        startCreateTime: this.formInline.startCreateTime, // 起始时间
        endCreateTime: this.formInline.endCreateTime // 创建时间
      }
      //通过表单数据获取表格
      this.initTable(1)
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.$refs.dateComponents.resetTime();
    },
    cancelOrderList(){//整单取消
      if(this.getSelectedRow.length < 1){
        this.$message.warning('请选择需要整单取消的收货单信息')
        return false
      }else if (this.getSelectedRow.length > 1){
        this.$message.warning('收货单整单取消不能大于一条');
        return false
      }else{
        let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
        allCancel(receiveNoteId).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success('整单取消成功!')
            this.initTable(1)//初始化主表
            this.initDetailTable(1)//初始化明细表
          }
        })
      }

    },
    closeList(){//结案
      this.$message.warning('结案功能暂未开通')
    },
    initTable (current) { // 初始化表格
      this.dataTable.radio = null
      this.$refs.tableConfig.setCurrentRow()
      this.getSelectedRow = []
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getReceiveNoteList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTable.data = [];
          this.dataTable.start = 1;
          this.dataTable.limit = 10;
          this.dataTable.total = 0;
        }else{
          data.records.forEach((item,index) => {
            item.index = index;
          });
          this.dataTable.data = JSON.parse(JSON.stringify(data.records));
          this.dataTable.start = data.current;
          this.dataTable.limit = data.size;
          this.dataTable.total = data.total;
          this.resetDetailTable();
        }
      });
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
    },
    onRowClick (val) { // 表格行点击
      if(this.getSelectedRow.length > 0){
        if(val.row.receiveNoteId == this.getSelectedRow[0].receiveNoteId){
          this.dataTable.radio = null
          this.$refs.tableConfig.setCurrentRow()
          this.getSelectedRow = []
          this.resetDetailTable()
        }else{
          this.getSelectedRow = [val.row]
          //获取明细表的数据
          if(this.getSelectedRow.length > 0){
            this.dataTable.radio = val.row.index
            this.$refs.tableConfig.setCurrentRow(val.row)
            this.initDetailTable(1)
          }
        }
      }else{
        this.getSelectedRow = [val.row]
        //获取明细表的数据
        if(this.getSelectedRow.length > 0){
          this.dataTable.radio = val.row.index
          this.$refs.tableConfig.setCurrentRow(val.row)
          this.initDetailTable(1)
        }
      }
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      // if(this.getSelectedRow.length > 0){
      //   if(val.row.receiveNoteId == this.getSelectedRow[0].receiveNoteId){
      //     this.dataTable.radio = null
      //     this.$refs.tableConfig.setCurrentRow()
      //     this.getSelectedRow = []
      //     this.resetDetailTable()
      //   }else{
      //     this.getSelectedRow = val
      //     //获取明细表的数据
      //     if(this.getSelectedRow.length > 0){
      //       this.dataTable.radio = val.index
      //       this.initDetailTable(1)
      //     }
      //   }
      // }else{
      //   this.getSelectedRow = val
      //   //获取明细表的数据
      //   if(this.getSelectedRow.length > 0){
      //     this.dataTable.radio = val.index
      //     this.initDetailTable(1)
      //   }
      // }
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'receiveNoteCode') {
          item.width = 160;
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      this.initTable(1)
    },
    //收货单明细表
    initDetailTable (current) { // 初始化表格
      if(this.getSelectedRow.length == 0){
        this.detailDataTable.data = []
        this.detailDataTable.start = 1
        this.detailDataTable.limit = 100
        this.detailDataTable.total = 0
      }else{
        let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
        let params = {
          limit: this.detailDataTable.limit,
          start: current
        }
        getReceiveNoteDetail(receiveNoteId,params).then(res => {
          let re = res.data
          if(re.status == 10001){
            this.detailDataTable.data = []
            this.detailDataTable.start = 1
            this.detailDataTable.limit = 100
            this.detailDataTable.total = 0
          }else{
            this.detailDataTable.data = JSON.parse(JSON.stringify(re.records))
            this.detailDataTable.start = re.current
            this.detailDataTable.limit = re.size
            this.detailDataTable.total = re.total
          }
        });
      }
    },
    //重置收货单明细表
    resetDetailTable(){
      this.detailDataTable.data = []
      this.detailDataTable.start = 1
      this.detailDataTable.limit = 100
      this.detailDataTable.total = 0
    },
    handleDetailCurrentChange (val) { // 分页页码
        this.detailDataTable.start = val;
        this.initDetailTable(this.detailDataTable.start);
    },
    handleDetailSizeChange (val) { // 分页每页展示的数量
      this.detailDataTable.limit = val;
      this.detailDataTable.start = 1;
      this.initDetailTable(this.detailDataTable.start);
    },
    onRowDetailClick () { // 表格行点击

    },
    onHandleDetailSelectionChange(val) { // 用户的选择框事件
      this.getDetailSelectedRow = val;
    },
    detailTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'receiveNoteCode') {
          item.width = 160;
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.detailDataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.detailDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.detailDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.detaiTableConfig.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.detaiTableConfig.domShow = true;
        // this.detailDataTable.loading = false; // loading事件取消
        this.$refs.detaiTableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    addList(){//按商品收货
      this.isSave = false
      this.dialogCommodityVisible = true
      this.searchCommodityList()
      this.getStaffs()//获取收货人
      this.initOwnersList()//获取委托业主
      this.initBrandsList()//获取品牌数据
    },
    caseList() {//按箱收货

    },
    delList() {//删除明细表的数据
      if(this.getDetailSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的收货单明细信息');
        return false
      }else{
        let notDel = this.getDetailSelectedRow.every((item,index) => {//不可删除
          if(item.status == 1){
            return true
          }
        });
        if (notDel) {
          this.delDialog.modalShow = true;
        }else{
          this.$message.warning('收货单状态为非新建状态，不允许删除！');
          return false;
        }
      }
    },
    removeRow() {
      let receiveNoteDtlIdArr = [];
      this.getDetailSelectedRow.forEach((item, index) => {
        receiveNoteDtlIdArr.push(item.receiveNoteDtlId)
      });
      let receiveNoteDtlIds = receiveNoteDtlIdArr.join(',')
      delReceiveNoteDetail(receiveNoteDtlIds).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false
          this.initDetailTable(1)
          this.initTable(1)
        }
      })
    },
    //弹窗 按商品收货表
    searchCommodityList(flag){//按商品收货表单查询
      if(flag == 1){
          if(this.form.commodityName || this.form.brand){
            if(!this.form.ownerId){
              return this.$message.warning('请选择委托业主')
            }
          }
      }
      this.initDialogTable(1)
    },
    resetCommodityList() {//按商品收货表单重置
      let form = {
        arrivalNoticeCode: '',//预到货单号
        arrivalNoticeTypeId: '',//预到货单类型
        commodityName: '',//商品名称
        ownerId: '',//委托业主
        brand: '',//品牌
        status: '2,4'
      }
      this.form = JSON.parse(JSON.stringify(form))
    },
    initDialogTable (current) { // 初始化表格
      if(this.getSelectedRow.length > 0){
        let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
        this.form.receiveNoticeId = receiveNoteId
      }
      this.form.start = current
      this.form.limit = this.dialogDataTable.limit
      getArrivalDtl(this.filteParams(this.form)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dialogDataTable.data = []
          this.oldDialogDataTable = []
          this.dialogDataTable.start = 1
          this.dialogDataTable.limit = 10
          this.dialogDataTable.total = 0
        }else{
          data.records.forEach(item => {
            if(item.largePackageNumber == null){
              item.largePackageNumber = 0
            }
            if(item.largePackageCount == null || item.largePackageCount == 0){
              item.largePackageCount = 0
              item.disabledLargePackageNumber = true
            }
            if(item.mediumPackageNumber == null){
              item.mediumPackageNumber = 0
            }
            if(item.mediumPackageCount == null || item.mediumPackageCount == 0){
              item.mediumPackageCount = 0
              item.disabledMediumPackageNumber = true
            }
            if(item.smallPackageNumber == null || item.smallPackageNumber == 0){
              item.smallPackageNumber = 0
            }
            if(item.smallPackageCount == null || item.smallPackageCount == 0){
              item.smallPackageCount = 0
              item.disabledSmallPackageNumber = true
            }
            item.arrivalCommodityAmount = item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount
          })
          this.dialogDataTable.data = JSON.parse(JSON.stringify(data.records))
          this.oldDialogDataTable = JSON.parse(JSON.stringify(data.records))
          this.dialogDataTable.start = data.current
          this.dialogDataTable.limit = data.size
          this.dialogDataTable.total = data.total
        }
      });
    },
    handleDialogCurrentChange (val) { // 分页页码
      this.dialogDataTable.start = val
      this.initDialogTable(this.dialogDataTable.start)
    },
    handleDialogSizeChange (val) { // 分页每页展示的数量
      this.dialogDataTable.start = 1
      this.dialogDataTable.limit = val
      this.initDialogTable(this.dialogDataTable.start)
    },
    onRowDialogClick () { // 表格行点击

    },
    onHandleDialogSelectionChange(val) { // 用户的选择框事件
      this.getDialogSelectedRow = val;
    },
    dialogTableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'largePackageNumber') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'mediumPackageNumber') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'smallPackageNumber') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dialogDataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dialogDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dialogDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      this.$refs.dialogTableConfig.domShow = false;
      this.$nextTick(() => {
        this.$refs.dialogTableConfig.domShow = true;
        this.$refs.dialogTableConfig.dialogVisible = false;
      });
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = $(window).height()  / 2 - formHeight
      this.detailDataTable.height = $(window).height() - this.dataTable.height - formHeight - 50
      this.dialogDataTable.height = ($(window).height())/2
    },
    loadMoreWarehouseArea(){
      //加载更多
    },
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.endCreateTime = val + ' 23:59:59';
      }else{
        this.formInline.endCreateTime = val
      }
    },
    getStartTime (val) { // 开始日期
      if(val){
        this.formInline.startCreateTime = val + ' 00:00:00';
      }else{
        this.formInline.startCreateTime = val
      }
    },
    confirmList() {//收货确认
      //未勾选数据 请选择需要收货确认的收货单信息
      let len = this.getSelectedRow.length
      if(len == 0){
        this.$message.warning('请选择需要收货确认的收货单信息');
      }else if(len == 1){
        let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
        isComplete(receiveNoteId).then(res => {
          if( res.data == 1){//全部完成,确认收货
            this.confirmReceive()
          }else if( res.data == 0 ){//未全部完成，强制确认收货
            this.confirmDialog.modalShow = true
          }else{
            this.$message.warning('获取确认信息失败');
          }
        })
      }else{
        this.$message.warning('请选择一条需要收货确认的收货单信息');
      }
    },
    confirmReceive (){
      let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
      receiveNoteConfirm(receiveNoteId).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.confirmDialog.modalShow = false
          this.$message.success('收货确认成功')
          this.initTable(1)//初始化主表
          this.initDetailTable(1)//初始化明细表
        }
      })
    },
    submitCommodityForm() {//按商品收货表单保存
      let len = this.getDialogSelectedRow.length
      // let this.getDialogSelectedRow[0].arrivalNoticeDtlId
      if(len == 0){
        this.$message.warning('请选择需要保存的收货单信息')
      }else{
        // if(!this.receiverId){
        //   this.$message.warning('请选择收货人')
        //   return false
        // }
        let flag = true
        this.getDialogSelectedRow.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/

          if(item.smallPackageUnitId != 10) {

            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))) {
              this.$message.warning('请输入整数')
              return flag = false
            }
          }else{

            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) )) {
              this.$message.warning('请输入整数')
              return flag = false
            }
          }
          if(item.arrivalCommodityAmount > item.maxCommodityAmount){
            this.$message.warning('实际总数量大于0且小于等于最大收货数量' + item.maxCommodityAmount)
            return flag = false
          }
        })
        if(flag){
          let params = []
          let tempValue = this.getDialogSelectedRow
          let receiveNoteId = ''
          if(this.getSelectedRow.length >0){
            receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
          }
          for(var i=0; i<tempValue.length; i++){
            let temp = {
              arrivalCommodityAmount: tempValue[i].arrivalCommodityAmount,
              arrivalNoticeCode: tempValue[i].arrivalNoticeCode,
              arrivalNoticeId: tempValue[i].arrivalNoticeId,
              arrivalNoticeDtlId: tempValue[i].arrivalNoticeDtlId,
              arrivalNoticeTypeId: tempValue[i].arrivalNoticeTypeId,
              // caseCode: tempValue[i].caseCode,
              // caseContentId: tempValue[i].caseContentId,
              packageCommodityAmount: tempValue[i].packageCommodityAmount,
              receiveTypeId: 1,//收货方式
              receiveNoteId: receiveNoteId,
              receiverId: this.receiverId
            }

            params.push(temp)
          }
          receiveNote(params).then(res => {
            if(res.data.status == 10001){
              this.$message.warning(res.data.message)
            }else{
              this.$message.success('保存成功')
              this.cancel()//清空数据，重置表单
              this.initTable(1)//初始化主表
            }
          })
        }else{
          //this.$message.warning('请输入当前收货数量')
        }

      }
    },
    resetCommodityForm() {//按商品收货表单取消
      //重置数据
      if(this.isSave){
        this.isSaveCommodityDialog.modalShow = true
      }else{
        this.cancel()
      }
    },
    cancel(){
      this.dialogDataTable.data = []
      this.oldDialogDataTable = []
      this.$refs['form'].resetFields()
      let form = {
        arrivalNoticeCode: '',//预到货单号
        arrivalNoticeTypeId: '',//预到货单类型
        commodityName: '',//商品名称
        ownerId: '',//委托业主
        brand: '',//品牌
        status: '2,4'
      }
      this.form = JSON.parse(JSON.stringify(form))
      this.receiverId = ''
      this.brandsArr.start = 1
      this.ownersArr.start = 1
      this.dialogCommodityVisible = false
      this.isSaveCommodityDialog.modalShow = false
      this.isSave = false
    },
    closeCommodityDialog(){//点击弹窗的X
      this.resetCommodityForm()
    },
    initSupplier (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.supplierArr.data));
      let params = {
        start: this.supplierArr.start,
        limit: this.supplierArr.limit
      };
      suppliersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.supplierArr.data = oldData.concat(data.records) : this.supplierArr.data = JSON.parse(JSON.stringify(data.records));
          this.supplierArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    supplierMore () {
      if ( this.supplierArr.start == this.supplierArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.supplierArr.start = this.supplierArr.start + 1;
        this.initSupplier(true);
      }
    },
    initOwnersList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.ownersArr.data));
      let params = {
        start: this.ownersArr.start,
        limit: this.ownersArr.limit
      };
      ownersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    ownersMore () {
      if ( this.ownersArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersArr.start = this.ownersArr.start + 1;
        this.initOwnersList(true);
      }
    },
    initBrandsList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.brandsArr.data));
      let params = {
        start: this.brandsArr.start,
        limit: this.brandsArr.limit,
        isAsc: true,
        sort: 'Brand_Name'
      };
      getBrand(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.brandsArr.data = oldData.concat(data.records) : this.brandsArr.data = JSON.parse(JSON.stringify(data.records));
          this.brandsArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    brandsMore () {
      if ( this.brandsArr.start == this.brandsArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.brandsArr.start = this.brandsArr.start + 1;
        this.initBrandsList(true);
      }
    },
    printer() {
      if(this.getSelectedRow.length < 1){
        this.$message.warning('请选择需要打印的收货单信息')
        return false
      }
      let receiveNoteIdArr = []
      this.getSelectedRow.forEach((item, index) => {
        receiveNoteIdArr.push(item.receiveNoteId)
      });
      let receiveNoteIds = receiveNoteIdArr.join(',')
      let params = {
        receiveNoteIds: receiveNoteIds//收货单id
      }
      printerReceiveNode(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          let template = data[0].template
          let templateId = template[0].template_id
          let templateType = template[0].template_type
          this.printOk(templateId, templateType, data)
        };
      })
    },
    printOk(templateId, templateType,data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params);
    }
  }
}
