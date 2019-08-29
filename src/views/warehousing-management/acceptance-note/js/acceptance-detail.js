import DatePick from '@/components/DatePicker/index';
import { loaddBtn } from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import { getAcceptanceNoteDetailList, checkCommodity, delAcceptanceNoteDetail, cancelAcceptanceNoteDetail, addCommodity, getReceiveDtl, getTestReportUrl} from '@/api/warehousing-management/accepttance-note/accepttance-detail';
import { dictionarysType } from '@/api/common/type.js'; //字典返回值，编码规则
import { suppliersList, ownersList } from '@/api/common/business.js'; // 供应商
import { getPackageCount } from '@/api/basic-data/package/index.js'
import { staffsFromErp } from '@/api/common/common-info';
import { selectWharf } from '@/api/basic-data/wharf/index.js';
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import acceptancePallet from '@/views/warehousing-management/acceptance-note/acceptance-pallet';
import acceptanceDetail from '@/views/warehousing-management/acceptance-note/acceptance-detail';
import { getCommodity } from '@/api/warehousing-management/receive-node/commodity.js';
export default {
  name: 'acceptance-detail',
  components: {
    DatePick,
    tableConfigure,
    selfDialog,
    tipsDialog,
    acceptancePallet,
    acceptanceDetail
  },
  data() {
    return {
      btnList: [], // 存放权限的按钮
      heightResize: true,
      //收货单主表
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 100,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "WMS_ACCEPTANCE_NOTE_DETAIL_TABLE"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户多选框选中的数据
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      isReport: {
        modalClickShow: false,
        title: '提示',
        modalShow: false,
        text: '是否重新生成检报？'
      },
      dialogVisible: false,
      dialogDataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      dialogTableName: {
        tableCode: "WMS_ACCEPTANCE_COMMODITY_TABLE"
      },
      title: '',
      getDialogSelectedRow: [], //
      form: {
        receiveNoteCode: '', // 收货单号
        arrivalNoticeCode: '', //预发货单号
        arrivalNoticeTypeId: '', // 预发货单类型
        commodityName: '', //商品名称
        ownerId: '', //委托业主
        commodityTypeId: '' //商品类型
      },
      isSave: false, //若有数据新增，未点击保存
      isSaveDialog: { //确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      ownersArrPage: 1, //委托业主
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      wharfArrPage: 1,
      wharfArr: {
        data: [],
        start: 1,
        limit: 10
      },
      staffs: [],
      // accepterId: '', //验收人
      wharfId: '', //验收码头
      //新增品项
      commodityDialogVisible: false,
      isCommoditySave: false, //若有数据新增，未点击保存
      isSaveCommodityDialog: { //确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      }, //
      commodityForm: {
        acceptanceNoteId: '', //验收单id
        commodityId: '', //商品id
        // accepterId: '', //验收人
        nowAcceptAmount: '', //验收数量
        packageCommodityAmount: '', //包装数量
        commodityQualityId: '',
        standardName: '', //标准
        specification: '', //规格
        brandName: '', //品牌
        commodityTypeId: '', //商品类型
      },
      commodityFormRule: {
        commodityId: [{ required: true, message: '请选择商品', trigger: 'change' }], //商品id
        // accepterId: [{ required: true, message: '请选择验收人', trigger: 'change' }], //验收人
        nowAcceptAmount: [{ required: true, message: '请输入验收数量', trigger: 'change' }], //验收数量
        commodityQualityId: [{ required: true, message: '请选择品质', trigger: 'change' }],
        packageCommodityAmount: [{ required: true, message: '请选择商品数量', trigger: 'change' }],
        commodityTypeId: [{ required: true, message: '请选择商品类型', trigger: 'change' }]
      },
      commodityArrPage: 1, //商品
      commodityArr: {
        data: [],
        start: 1,
        limit: 10
      },
      staffs: [],
      commodityQuality: [], //品质
      oldCommodityForm: [], //新增品项原数据
      acceptanceNoteId: '', //验收单id
      arrivalNoticeType: [], //预到货单类型
      commodityType: [], //商品类型
      commodityDialogType: [],
      acceptanceStatus: '', //验收状态
      ownerId: '',
      packageCommodityAmount: [], //包装数量
      searchCommodityCode: '',
      searchParam: {}
    }
  },
  created() {
    this.initBtn() // 按钮初始化
    // this.initTable() // 主表格初始化
  },
  mounted() {
    this.tableHeight() // 表格高度
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch: {
    commodityForm: {
      handler(newValue, oldValue) {
        for (let item in newValue) {
          if (newValue[item] != this.oldCommodityForm[item]) { //比较不同的数据返回true
            this.isCommoditySave = true
            return
          }
        };
      },
      deep: true
    },
    'dialogDataTable.data': {
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))) {
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) )) {
              return this.$message.warning('请输入整数')
            }
          }
          item.nowAcceptAmount = parseFloat((item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount).toFixed(6));
          //实际总数量必须小于等于计划总数量
          if ((0 < item.nowAcceptAmount) && (item.nowAcceptAmount <= item.maxCommodityAmount)) {
            //不做处理
          } else {
            this.$message.warning('验收数量大于0且小于最大验收数量' + item.maxCommodityAmount)
          }
        })
        if (this.oldDialogDataTable.length > 0) {
          for (let i = 0; i < this.oldDialogDataTable.length; i++) {
            if (this.oldDialogDataTable[i].nowAcceptAmount != this.dialogDataTable.data[i].nowAcceptAmount || this.oldDialogDataTable[i].commodityQualityId != this.dialogDataTable.data[i].commodityQualityId) { //比较不同的数据返回true
              this.isSave = true
              return
            }
          }
        }
      },
      deep: true
    },
    // accepterId(curVal, oldVal) {
    //   this.isSave = true
    // },
    wharfId(curVal, oldVal) {
      this.isSave = true
    },
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
    initBtn() {
      let menusKey = 'WMS_ACCEPTANCE_NOTE_DETAIL';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    delAcceptanceDetail() { //删除
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要删除的验收单明细信息');
        return false
      } else {
        // let notDel = true
        // notDel = this.getSelectedRow.every((item,index) => {//不可删除
        //   if(item.status != 1){//1--新建可删除
        //     return false
        //   }
        // });
        // if (notDel) {
        this.delDialog.modalShow = true;
        // }else{
        //   this.$message.warning('只有建单状态的数据允许删除！');
        //   return false;
        // }
      }
    },
    removeRow() {
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要取消的验收单明细信息');
        return false
      } else {
        let acceptanceNoteDtlIdArr = [];
        this.getSelectedRow.forEach((item, index) => {
          acceptanceNoteDtlIdArr.push(item.acceptanceNoteDtlId)
        })
        let acceptanceNoteDtlIds = acceptanceNoteDtlIdArr.join(',')
        delAcceptanceNoteDetail(acceptanceNoteDtlIds).then(res => {
          let data = res.data
          if (data.status == 10001) {
            this.$message.warning(data.message)
          } else {
            this.delDialog.modalShow = false
            this.$message.success('删除成功')
            this.acceptanceNoteId = ''
            this.$emit('initTable')
            this.$emit('changeValue', false)
            // if(this.acceptanceNoteId){
            //   this.initTable(this.acceptanceNoteId, 1)
            // }
          }
        })
      }
    },
    cancelAcceptanceDetail() { //单品取消
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要取消的验收单明细信息');
        return false
      }
      let acceptanceNoteDtlIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        acceptanceNoteDtlIdArr.push(item.acceptanceNoteDtlId)
      })
      let acceptanceNoteDtlIds = acceptanceNoteDtlIdArr.join(',')
      cancelAcceptanceNoteDetail(acceptanceNoteDtlIds).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message)
        } else {
          this.$message.success('单品取消成功')
          this.acceptanceNoteId = ''
          this.$emit('initTable')
          this.$emit('changeValue', true)
          // if(this.acceptanceNoteId){
          //   this.initTable(this.acceptanceNoteId, 1)
          // }
        }
      })
    },
    addCommodity() { //新增品项
      this.isCommoditySave = false
      if (!this.acceptanceNoteId) {
        this.$message.warning('请选择需要新增品项的验收单')
        return false
      }
      this.commodityDialogVisible = true
      for (let item in this.commodityForm) {
        this.commodityForm[item] = ''
      }
      this.oldCommodityForm = this.commodityForm // 获取初始化的数据
      //this.initCommodityList()//商品
      this.getStaffs() //验收人
      this.getCommodityQuality() //获取品质
      this.getCommodityType()
    },
    initCommodityList(accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.commodityArr.data));
      let params = {
        commodityCode: this.searchCommodityCode,
        stId: this.ownerId,
        start: this.commodityArr.start,
        limit: this.commodityArr.limit
      };
      let params1 = {

      }
      getCommodity(params, params1).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.commodityArr.data = oldData.concat(data.records) : this.commodityArr.data = JSON.parse(JSON.stringify(data.records));
          this.commodityArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    commodityMore() {
      if (this.commodityArr.start == this.commodityArrPage) {
        //this.$message.warning('没有更多数据了');
      } else {
        this.commodityArr.start = this.commodityArr.start + 1;
        this.initCommodityList(true);
      }
    },
    focusCommodity(Event) {
      // this.searchCommodityCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchCommodityCode = Event.srcElement.value
      }else{
        this.searchCommodityCode = Event.target.value
      }
      this.commodityArr.data = []
      this.commodityArr.start = 1
      this.initCommodityList()
    },
    clearCommodity() {
      this.searchCommodityCode = ''
    },
    selectCommodity(val) {
      let key = this.commodityArr.data.findIndex(item => item.commodityId == this.commodityForm.commodityId)
      if (key != -1) {
        // this.commodityForm.packageCommodityAmount = this.commodityArr.data[key].smallPackageQt
        this.commodityForm.standardName = this.commodityArr.data[key].standardName
        this.commodityForm.specification = this.commodityArr.data[key].specification
        this.commodityForm.brandName = this.commodityArr.data[key].brandName
        this.getPackageByCommidityCode(this.commodityArr.data[key])
      }
    },
    searchCommodity(val) {
      this.searchCommodityCode = val
      this.commodityArr.data = []
      this.commodityArr.start = 1
      this.initCommodityList()
    },
    addCommodityList() {
      this.$refs['commodityForm'].validate((valid) => {
        if (valid) {
          let key = this.commodityArr.data.findIndex(item => item.commodityId == this.commodityForm.commodityId)
          let code = ''
          let name = ''
          if (key != -1) {
            code = this.commodityArr.data[key].code
            name = this.commodityArr.data[key].name
          }
          let params = {
            acceptanceNoteId: this.acceptanceNoteId,
            // accepterId: this.commodityForm.accepterId,
            commodityId: this.commodityForm.commodityId,
            commodityCode: code,
            commodityName: name,
            nowAcceptAmount: this.commodityForm.nowAcceptAmount,
            packageCommodityAmount: this.commodityForm.packageCommodityAmount,
            commodityQualityId: this.commodityForm.commodityQualityId,
            commodityTypeId: this.commodityForm.commodityTypeId
          }
          addCommodity(params).then(res => {
            let data = res.data
            if (data.status == 10001) {
              this.$message.warning(data.message)
            } else {
              this.$message.success('保存成功')
              //新增品项成功后   弹窗消失 数据置空
              this.cancel()
              this.acceptanceNoteId = ''
              this.$emit('initTable')
              this.$emit('changeValue', true)
              // if(this.acceptanceNoteId){
              //   this.initTable(this.acceptanceNoteId, 1)
              // }
            }
          })
        } else {
          return false;
        }
      });
    },
    cancelAddCommodity(formName) {
      this.cancel()
    },

    closeAddCommodityDialog() {
      //点击X
      this.resetAddCommodity()
    },
    resetAddCommodity() {
      //清空表单
      if (this.isCommoditySave) {
        this.isSaveCommodityDialog.modalShow = true
      } else {
        this.cancel()
      }
    },
    cancel() {
      //置空表单  置空验收人  验收码头
      for (let item in this.commodityForm) {
        this.commodityForm[item] = ''
      }
      this.commodityArr.start = 1
      this.$refs['commodityForm'].resetFields()
      this.oldCommodityForm = JSON.parse(JSON.stringify(this.commodityForm)) // 获取初始化的数据
      this.isSaveCommodityDialog.modalShow = false
      this.commodityDialogVisible = false
      this.isCommoditySave = false
    },
    initOwnersList(accumulation) {
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
    ownersMore() {
      if (this.ownersArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersArr.start = this.ownersArr.start + 1;
        this.initOwnersList(true);
      }
    },
    //验收码头
    initWharf(accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.wharfArr.data));
      let params = {
        wharfType: 0, //码头类型
        // start: this.wharfArr.start,
        // limit: this.wharfArr.limit
      };
      selectWharf(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.wharfArr.data = oldData.concat(data) : this.wharfArr.data = JSON.parse(JSON.stringify(data));
          this.wharfArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    wharfMore() {
      if (this.wharfArr.start == this.wharfArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.wharfArr.start = this.wharfArr.start + 1;
        this.initWharf(true);
      }
    },
    getStaffs() {
      let params = {
        isOnWork: true
      }
      staffsFromErp(this.filteParams(params)).then(res => {
        let re = res.data
        if (re.length > 0) {
          this.staffs = re
        }
      })
    },
    //获取品质
    getCommodityQuality(data) { //初始化字典值
      let params1 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_QUALITY' //预到货单类型
      }
      dictionarysType(params1).then(res => {
        this.commodityQuality = JSON.parse(JSON.stringify(res.data))
        //表格设置品质默认值  良品的value为1
        if (data) {
          for (let i = 0; i < data.length; i++) {
            data[i].commodityQualityId = "0"
            if (data[i].largePackageNumber == null || data[i].largePackageNumber == 0) {
              data[i].largePackageNumber = 0
            }
            if (data[i].largePackageCount == null || data[i].largePackageCount == 0) {
              data[i].largePackageCount = 0
              data[i].disabledLargePackageNumber = true
            }
            if (data[i].mediumPackageNumber == null || data[i].mediumPackageNumber == 0) {
              data[i].mediumPackageNumber = 0
            }
            if (data[i].mediumPackageCount == null || data[i].mediumPackageCount == 0) {
              data[i].mediumPackageCount = 0
              data[i].disabledMediumPackageNumber = true
            }
            if (data[i].smallPackageNumber == null || data[i].smallPackageNumber == 0) {
              data[i].smallPackageNumber = 0
            }
            if (data[i].smallPackageCount == null || data[i].smallPackageCount == 0) {
              data[i].smallPackageCount = 0
              data[i].disabledSmallPackageNumber = true
            }
            data[i].nowAcceptAmount =  parseFloat((data[i].largePackageNumber * data[i].largePackageCount + data[i].mediumPackageNumber * data[i].mediumPackageCount + data[i].smallPackageNumber * data[i].smallPackageCount).toFixed(6));
          }
          this.dialogDataTable.data = data
          this.oldDialogDataTable = data
        }
      })
    },
    initTable(acceptanceNoteId, current) { // 初始化表格
      //验收单id
      if (acceptanceNoteId) {
        this.acceptanceNoteId = acceptanceNoteId
      }
      let params = {
        // start: current,
        // limit: this.dataTable.limit
      }
      getAcceptanceNoteDetailList(acceptanceNoteId, params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message)
        } else {
          data = JSON.parse(JSON.stringify(data))
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i]['ossUrl']){
              let key = data[i]['ossUrl'].indexOf('https')
              if(key == -1){
                data[i]['ossUrl'] = data[i]['ossUrl'].slice(0, 4) + 's' + data[i]['ossUrl'].slice(4)
              }
            }
          }
          this.dataTable.data = data
          // this.dataTable.start = data.current;
          // this.dataTable.limit = data.size;
          // this.dataTable.total = data.total;
        }
      })
    },
    handleCurrentChange(val) { // 分页页码
      this.dataTable.start = val
      this.initTable(this.acceptanceNoteId, this.dataTable.start)
    },
    handleSizeChange(val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.acceptanceNoteId, this.dataTable.start)
    },
    onRowClick() { // 表格行点击
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'testReportNo') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // this.domShow = false // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false // 表格配置弹出框隐藏
      })
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#detail-top-form").height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = ($(window).height() / 2 - formHeight)
      this.dialogDataTable.height = 470
    },
    //弹窗的事件
    checkCommodity() { //商品验收
      if (this.acceptanceStatus == '6' || !this.acceptanceNoteId) {
        this.dialogVisible = true
        this.isSave = false
        this.initDialogTable(1)
        this.initWharf()
        this.initOwnersList()
        this.getStaffs()
        this.getArrivalType()
        this.getCommodityType()
      } else {
        this.$message.warning('验收单状态不为验收中!')
      }
    },
    getArrivalType() { //预发货类型
      let params1 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_TYPE' //预到货单类型
      }
      dictionarysType(params1).then(res => {
        this.arrivalNoticeType = JSON.parse(JSON.stringify(res.data))
      })
    },
    getCommodityType() {
      let params1 = {
        code: 'WMS_COMMODITY_TYPE_ID_COMTYPE' //商品类型
      }
      dictionarysType(params1).then(res => {
        this.commodityType = JSON.parse(JSON.stringify(res.data))
        this.commodityDialogType = JSON.parse(JSON.stringify(res.data))
      })
    },
    searchList(flag) {
      this.searchParam = {
        receiveNoteCode: this.form.receiveNoteCode, // 收货单号
        arrivalNoticeCode: this.form.arrivalNoticeCode, //预发货单号
        arrivalNoticeTypeId: this.form.arrivalNoticeTypeId, // 预发货单类型
        commodityName: this.form.commodityName, //商品名称
        ownerId: this.form.ownerId, //委托业主
        commodityTypeId: this.form.commodityTypeId, //商品类型
        acceptanceNoteId: this.acceptanceNoteId
      }
      if(flag == 1){
          if(this.form.commodityName){
            if(!this.form.ownerId){
              return this.$message.warning('请选择委托业主')
            }
          }
      }
      //通过表单数据获取表格
      this.initDialogTable(1)
    },
    resetForm() {
      for (let item in this.form) {
        this.form[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
    },
    saveCheckCommodity() {
      let len = this.getDialogSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择需要保存的验收单信息')
      } else {
        if (!this.wharfId) {
          this.$message.warning('请选择验码头')
          return false
        }
        // if (!this.accepterId) {
        //   this.$message.warning('请选择验收人')
        //   return false
        // }
        let flag = true //判断是否填入验收数量
        let flag1 = true //判断是否为正整数
        this.getDialogSelectedRow.forEach((item, index) => {
          if (!item.nowAcceptAmount) {
            return flag = false
          } else {
            let reg = /^(-|\+)?\d+$/
            if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))) {
              this.$message.warning("请输入整数")
              return flag1 = false
            }
            }else{
              if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) )) {
                this.$message.warning("请输入整数")
                return flag1 = false
              }
            }
            if (item.nowAcceptAmount > item.maxCommodityAmount) {
              this.$message.warning("验收数量大于0且小于最大验收数量" + item.maxCommodityAmount)
              return flag1 = false
            } else {
              if (!item.commodityQualityId) {
                return flag = false
              }
            }
          }
        })
        if (flag) {
          if (flag1) {
            let params = []
            let tempValue = this.getDialogSelectedRow
            let key = this.wharfArr.data.findIndex(item => item.wharfId == this.wharfId)
            let printerGroupId = this.wharfArr.data[key].printerGroupId
            for (var i = 0; i < tempValue.length; i++) {
              let temp = {
                acceptanceNoteId: tempValue[i].acceptanceNoteId,
                // accepterId: this.accepterId,
                arrivalNoticeId: tempValue[i].arrivalNoticeId,
                arrivalNoticeTypeId: tempValue[i].arrivalNoticeTypeId,
                commodityId: tempValue[i].commodityId,
                commodityName: tempValue[i].commodityName,
                commodityQualityId: tempValue[i].commodityQualityId,
                nowAcceptAmount: tempValue[i].nowAcceptAmount,
                printerGroupId: printerGroupId,
                receiveNoteDtlId: tempValue[i].receiveNoteDtlId,
                receiveNoteId: tempValue[i].receiveNoteId,
                wharfId: this.wharfId
              }
              params.push(temp)
            }
            checkCommodity(params).then(res => {
              let data = res.data
              if (data.status == 10001) {
                this.$message.warning(data.message)
              } else {
                this.$message.success('保存成功')
                //按商品验收成功后，弹窗消失  所有数据置空
                this.cancelCheck()
                if (this.acceptanceNoteId) {
                  this.acceptanceNoteId = ''
                  this.$emit('changeValue', true)
                  this.$emit('initTable')
                } else {
                  this.acceptanceNoteId = ''
                  this.$emit('changeValue', false)
                  this.$emit('initTable')
                }
                // if(this.acceptanceNoteId){
                //   this.initTable(this.acceptanceNoteId, 1)
                // }
              }
            })
          }
        } else {
          this.$message.warning('请输入当前验收数量或选择品质')
        }
      }
    },
    cancelDialog() {
      this.cancelCheck()
    },
    resetCommodityForm() { //按商品收货表单取消
      //重置数据
      if (this.isSave) {
        this.isSaveDialog.modalShow = true
      } else {
        this.cancelCheck()
      }
    },
    cancelCheck() {
      this.dialogDataTable.data = []
      this.oldDialogDataTable = []
      this.resetForm()
      // this.accepterId = ''
      this.wharfId = ''
      this.wharfArr.start = 1
      this.ownersArr.start = 1
      this.dialogVisible = false
      this.isSaveDialog.modalShow = false
      this.isSave = false
    },
    closeCommodityDialog() { //点击弹窗的X
      this.resetCommodityForm()
    },
    initDialogTable(current) { // 初始化表格
      let params = {
        start: current,
        limit: this.dialogDataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getReceiveDtl(this.filteParams(params)).then(res => {
        let re = res.data
        if (re.records) {
          // let temp = []
          re.records.forEach((item, index) => {
            // if(!item.arrivalCommodityAmount == 0){
            //   temp.push(item)
            // }
            if (item.largePackageNumber == null) {
              item.largePackageNumber = 0
            } else if (item.mediumPackageNumber == null) {
              item.mediumPackageNumber = 0
            } else if (item.smallPackageNumber == null) {
              item.smallPackageNumber = 0
            }
            item.nowAcceptAmount = item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount
          })
          this.getCommodityQuality(JSON.parse(JSON.stringify(re.records)))
          // this.dialogDataTable.data = JSON.parse(JSON.stringify(re.records));
          // this.oldDialogDataTable = JSON.parse(JSON.stringify(re.records))
          this.dialogDataTable.start = re.current;
          this.dialogDataTable.limit = re.size;
          this.dialogDataTable.total = re.total;
        } else {
          this.dialogDataTable.data = JSON.parse(JSON.stringify(re));
          this.dialogDataTable.start = re.current;
          this.dialogDataTable.limit = re.size;
          this.dialogDataTable.total = re.total;
        }
      });
    },
    handleDialogCurrentChange(val) { // 分页页码
      this.dialogDataTable.start = val
      this.initDialogTable(this.dataTable.start)
    },
    handleDialogSizeChange(val) { // 分页每页展示的数量
      this.dialogDataTable.start = 1
      this.dialogDataTable.limit = val
      this.initDialogTable(this.dialogDataTable.start)
    },
    onRowDialogClick() { // 表格行点击

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
        if (item.prop == 'largePackageNumber' || item.prop == 'mediumPackageNumber' || item.prop == 'smallPackageNumber' || item.prop == 'commodityQualityId') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'commodityQualityId') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dialogDataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dialogDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%',
        height: '471px'
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
    resetTable() {
      this.dataTable = {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: "270px", // 表格高度。
        border: true,
        start: 1,
        limit: 100,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      }
    },
    //主档选择验收单后赋值验收状态
    setAcceptanceStatus(val) {
      this.acceptanceStatus = val
    },
    setOwner(val) {
      this.ownerId = val
    },
    resetAcceptanceNote() {
      this.acceptanceNoteId = ''
    },
    //获取包装数量
    getPackageByCommidityCode(data) {
      let params = {
        commodityId: data.commodityId
      }
      getPackageCount(params).then(res => {
        if (res.status == 10001) {
          this.$message.warning(res.message)
        } else {
          this.packageCommodityAmount = res.data
        }
      }).catch(error => {
        this.$message.error('获取包装数量失败')
      })
    },
    //生成检报按钮
    createReport() {
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要生成检报的验收单明细')
        return false
      } else if (this.getSelectedRow.length == 1) {
        if (this.acceptanceStatus == '6') {
          if(this.getSelectedRow[0].testReportNo){
            this.isReport.modalShow = true
          }else{
            this.isHasReportCode()
          }
        } else {
          this.$message.warning('只有验收中状态的验收单明细允许生成检报')
        }
      } else if (this.getSelectedRow.length > 1) {
        this.$message.warning('生成检报的验收单明细不能大于一条')
      }
    },
    isHasReportCode() {
      let url = '';
      let paramsOne = {
        tenantId: this.getSelectedRow[0].factoryId,
        brandProductId: this.getSelectedRow[0].brandProductID,
        appTypeId: 101,
        businessKey: 0+'|' + this.getSelectedRow[0].acceptanceNoteDtlId + '|' + this.getSelectedRow[0].warehouseId  + '|' + this.getSelectedRow[0].testReportVersion
      }
      getTestReportUrl(paramsOne).then(res => {
        if (res.status == 10001) {
          this.$message.warning(res.message)
        } else {
          url = res.data
          //跳转到erp生成检报页面
          let params = '?TenantId=' + this.getSelectedRow[0].factoryId + '&BrandProductId=' + this.getSelectedRow[0].brandProductID + '&AppTypeId=101&BusinessKey=0|' + this.getSelectedRow[0].acceptanceNoteDtlId + '|' + this.getSelectedRow[0].warehouseId  + '|' + this.getSelectedRow[0].testReportVersion + '&warehouseId=' + this.getSelectedRow[0].warehouseId; //打包环境传参
          //https://internal-dev.51hgp.com/erp_development/TestReport/TestReport/Create?TenantId=95&BrandProductId=2815687&AppTypeId=101&BusinessKey=4220&warehouseId=87
          //testreport_testreport_goodsindex   生成检测报告   /erp_development/testreport/testreport/goodsindex
          // let reportUrl = staticConfiguration.uploadUrl + '/TestReport/TestReport/Create' + params
          //新的url 从后端接口获取
          let reportUrl = staticConfiguration.uploadUrl + url
          let tabId = this.replaceUrl(reportUrl)
          try {
            this.routeERP(tabId, '生成检测报告', staticConfiguration.uri +url) //其他环境跳转公用方法
          } catch (e) {
            window.location.href = reportUrl
          }
        }
      }).catch(error => {
        this.$message.error('获取检报url失败')
      })
    },
    routeERPReport(){
      this.isReport.modalShow = false
      this.isHasReportCode()
    },
    downloadPDF(url){
      window.open(url)
    }
  }
}
