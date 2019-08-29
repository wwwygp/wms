import DatePick from '@/components/DatePicker/index';
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getAcceptanceNoteList, confirmAcceptanceNote, cancelAcceptanceNote, overAcceptanceNote, printerAcceptanceNote } from '@/api/warehousing-management/accepttance-note/accepttance-note';
import { dictionarysType } from '@/api/common/type.js';//字典返回值，编码规则
import {suppliersList,ownersList} from '@/api/common/business.js'; // 供应商
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import acceptancePallet from '@/views/warehousing-management/acceptance-note/acceptance-pallet';
import acceptanceDetail from '@/views/warehousing-management/acceptance-note/acceptance-detail';
// import acceptanceProcessPallet from '@/views/warehousing-management/acceptance-note/acceptance-process-pallet';

export default {
  name: 'acceptance',
  components: {
    DatePick,
    tableConfigure,
    selfDialog,
    tipsDialog,
    acceptancePallet,
    acceptanceDetail,
    // acceptanceProcessPallet
  },
  data () {
    return{
      activeName: 'first',//tab切换
      arrivalNoticeType: [],//预到货单类型
      purchaseOrderType: [],//采购类型
      owner: [],//委托业主
      supplier: [],//供应商
      status: [],//收货单状态
      brand: [],//品牌
      btnList: [], // 存放权限的按钮
      heightResize: true,
      //收货单主表
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true, // 有无选中功能
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
        tableCode: "WMS_ACCEPTANCE_NOTE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      //主表
      formInline: {
        acceptanceNoteCode: '', // 验收单号
        receiveNoteCode: '', // 收货单号
        arrivalNoticeCode: '', // 预到货单号
        arrivalNoticeTypeId: '', // 预到货单类型
        proprietorId: '', // 委托业主唯一码,当前仓库下的业主
        supplierId: '', // 供应商唯一码
        status: '',//状态
        startCreateTime: '', // 起始时间
        endCreateTime: '', // 创建时间
      },
      getSelectedRow: [], // 主表用户多选框选中的数据
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
      tabHeight: '',
      isDefalut: false,//是否选中
      selectAcceptanceNote: '',//选中的验收单id
      searchParam: {}
    }
  },
  created () {
    this.initBtn() // 按钮初始化
    this.initDictionary()//获取字段值
    this.initOwnersList()
    this.initSupplier()
  },
  mounted() {
    this.tableHeight() // 表格高度
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
      let menusKey = 'WMS_ACCEPTANCE_NOTE';
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
      let params5 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_STATUS'//收货单状态
      }
      dictionarysType(params5).then(res => {
        this.status = JSON.parse(JSON.stringify(res.data))
      })
    },
    //收货单主表
    searchList () {
      //通过表单数据获取表格
      this.formInline.start = 1
      this.supplierArr.start = 1
      this.supplierArr.data = []
      this.ownersArr.start = 1
      this.ownersArr.data = []
      this.formInline.limit = this.dataTable.limit
      this.dataTable.radio = null
      this.acceptanceNoteId = ''
      this.selectAcceptanceNote = ''
      this.getSelectedRow = []
      this.isDefalut = false
      this.searchParam ={
        acceptanceNoteCode: this.formInline.acceptanceNoteCode, // 验收单号
        receiveNoteCode: this.formInline.receiveNoteCode, // 收货单号
        arrivalNoticeCode: this.formInline.arrivalNoticeCode, // 预到货单号
        arrivalNoticeTypeId: this.formInline.arrivalNoticeTypeId, // 预到货单类型
        proprietorId: this.formInline.proprietorId, // 委托业主唯一码,当前仓库下的业主
        supplierId: this.formInline.supplierId, // 供应商唯一码
        status: this.formInline.status,//状态
        startCreateTime: this.formInline.startCreateTime, // 起始时间
        endCreateTime: this.formInline.endCreateTime, // 创建时间
      }
      this.initTable(this.formInline.start)
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.formInline.start = 1
      this.formInline.limit = 10
      this.$refs.dateComponents.resetTime()
    },
    changeValue(flag){//修改默认值
      this.isDefalut = flag
    },
    cancelNote(){//整单取消
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要整单取消的验收单信息')
      }
      let acceptanceNoteId = this.getSelectedRow[0].acceptanceNoteId
      let params ={
        
      }
      cancelAcceptanceNote(acceptanceNoteId, params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.$message.success('整单取消成功')
          this.changeValue(true)
          this.initTable(1)
        }
      })
    },
    confirmNote(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要验收完成的验收单信息')
      }
      let acceptanceNoteId = this.getSelectedRow[0].acceptanceNoteId
      confirmAcceptanceNote(acceptanceNoteId).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.$message.success('验收完成')
          this.changeValue(true)
          this.initTable(1)
        }
      })
    },
    overNote(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要结案的验收单信息')
      }
      let acceptanceNoteId = this.getSelectedRow[0].acceptanceNoteId
      overAcceptanceNote(acceptanceNoteId).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.$message.success('结案成功')
          this.changeValue(true)
          this.initTable(1)
        }
      })
    },
    printerNote(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的验收单信息')
      }
      let params = {}
      printerAcceptanceNote(params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.$message.success('打印成功')
          this.initTable(1)
        }
      })
    },
    initTable (current) { // 初始化表格
      //重置table的样式
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getAcceptanceNoteList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          data.records.forEach((item,index) => {
            item.index = index
          });
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
          //清空明细表
          //是否有默认值
          if(this.isDefalut){
            let index = 0
            //是否有选择的验收单
            if(this.selectAcceptanceNote){
              let key = this.dataTable.data.findIndex(item => item.acceptanceNoteId == this.selectAcceptanceNote)
              if(key != -1){
                index = key
              }
            }
            this.dataTable.radio = index
            this.$refs.acceptanceDetail.initTable(this.dataTable.data[index].acceptanceNoteId, 1)
            this.$refs.acceptanceDetail.setAcceptanceStatus(this.dataTable.data[index].status)
            this.$refs.acceptancePallet.initTable(this.dataTable.data[index].acceptanceNoteId, 1)
            // this.$refs.acceptanceProcessPallet.initTable(this.dataTable.data[index].acceptanceNoteId, 1)
          }else{
            this.dataTable.radio = null
            this.$refs.tableConfig.setCurrentRow()
            this.getSelectedRow = []
            this.$refs.acceptanceDetail.resetTable()
            this.$refs.acceptanceDetail.resetAcceptanceNote()
            this.$refs.acceptancePallet.resetTable()
            this.$refs.acceptancePallet.resetAcceptanceNote()
            // this.$refs.acceptanceProcessPallet.resetTable()
            // this.$refs.acceptanceProcessPallet.resetAcceptanceNote()
          }          
        }
      })
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
        this.selectAcceptanceNote = ''
        if(val.row.acceptanceNoteId == this.getSelectedRow[0].acceptanceNoteId){
          this.dataTable.radio = null
          this.$refs.tableConfig.setCurrentRow()
          this.getSelectedRow = []
          //清空明细表
          this.$refs.acceptanceDetail.resetTable()
          this.$refs.acceptanceDetail.resetAcceptanceNote()
          this.$refs.acceptancePallet.resetTable()
          this.$refs.acceptancePallet.resetAcceptanceNote()
          // this.$refs.acceptanceProcessPallet.resetTable()
          // this.$refs.acceptanceProcessPallet.resetAcceptanceNote()
        }else{
          this.getSelectedRow = [val.row]
          if(this.getSelectedRow.length > 0){
            this.dataTable.radio = val.row.index
            this.selectAcceptanceNote = this.getSelectedRow[0].acceptanceNoteId
            this.$refs.acceptanceDetail.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
            this.$refs.acceptanceDetail.setAcceptanceStatus(this.getSelectedRow[0].status)
            this.$refs.acceptanceDetail.setOwner(this.getSelectedRow[0].ownerId)
            this.$refs.acceptancePallet.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
            // this.$refs.acceptanceProcessPallet.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
          }
        }
      }else{
        this.getSelectedRow = [val.row]
        if(this.getSelectedRow.length > 0){
          this.dataTable.radio = val.row.index
          this.selectAcceptanceNote = this.getSelectedRow[0].acceptanceNoteId
          this.$refs.acceptanceDetail.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
          this.$refs.acceptanceDetail.setAcceptanceStatus(this.getSelectedRow[0].status)
          this.$refs.acceptanceDetail.setOwner(this.getSelectedRow[0].ownerId)
          this.$refs.acceptancePallet.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
          // this.$refs.acceptanceProcessPallet.initTable(this.getSelectedRow[0].acceptanceNoteId, 1)
        }
      }
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      // this.getSelectedRow = val;
      // if(val.length > 0){
      //   this.$refs.acceptanceDetail.initTable(val[0].acceptanceNoteId, 1)
      //   this.$refs.acceptanceDetail.setAcceptanceStatus(val[0].status)
      //   this.$refs.acceptancePallet.initTable(val[0].acceptanceNoteId, 1)
      // }
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
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
      this.initTable(1) // 主表格初始化
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = ($(window).height() - this.$store.state.basic.height) / 2 - formHeight ;
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
    }
  }
}
