import DatePick from '@/components/DatePicker/index';
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getAcceptancePalletList, acceptanceByCommodity,
  acceptanceByCase, updateAcceptancePallet,
  delAcceptancePallet, getContainerList, checkLabelNumber, getSpaceList
} from '@/api/warehousing-management/accepttance-note/accepttance-pallet';
import {getAcceptanceNoteDetailList} from '@/api/warehousing-management/accepttance-note/accepttance-detail';
import { dictionarysType } from '@/api/common/type.js';//字典返回值，编码规则
import {suppliersList,ownersList} from '@/api/common/business.js'; // 供应商
import {getBrand} from '@/api/warehousing-management/receive-node/commodity.js';
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import acceptancePallet from '@/views/warehousing-management/acceptance-note/acceptance-pallet';
import acceptanceDetail from '@/views/warehousing-management/acceptance-note/acceptance-detail';
import {acceptNoteLablePrint} from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机

export default {
  name: 'acceptance-pallet',
  components: {
    DatePick,
    tableConfigure,
    selfDialog,
    tipsDialog,
    acceptancePallet,
    acceptanceDetail
  },
  data () {
    return{
      btnList: [], // 存放权限的按钮
      acceptanceNoteId: '',//验收单id
      heightResize: true,
      formInline: {
        commodityName: '',//商品名称
        commodityBarcode: '', // 预发货单类型
        caseCode: '',//委托业主
        palletCode: ''//商品类型
      },
      //收货单主表
      dataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: "270px", // 表格高度。
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
      tableName: {
        tableCode: "WMS_ACCEPTANCE_PALLET_DETAIL_TABLE"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户多选框选中的数据
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      getDialogSelectedRow: [],
      dialogVisible: false,
      dialogDataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: "405px", // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      oldDialogDataTable: [],
      dialogTableName: {
        tableCode: "WMS_ACCEPTANCE_PALLET_DETAIL_COMMODITY_TABLE"
      },
      title: '',
      form: {
        commodityName: '',//商品名称
        ownerId: '',//委托业主
        brand: '',
        isShowDetail: 1//过滤未组板数为0的数据
      },
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {//确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      //委托业主
      ownersArrPage: 1,
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      //品牌
      brandsArrPage: 1,
      brandsArr: {
        data: [],
        start: 1,
        limit: 10
      },
      //储位
      spaceArrPage: 1, //储位
      spaceArr: {
        data: [],
        start: 1,
        limit: 10
      },
      containerLabeArrPage: 1, //托盘
      containerLabeArr: {
        data: [],
        start: 1,
        limit: 10
      },
      spaceId: '',//储位
      containerLabelId: '',//托盘
      labelCode: '',
      labelNumber: '',
      labelRuleId: '',
      labelTypeId: '',
      acceptanceTypeId: 1,//验收类型
      searchlabelNumber: '',
      searchParam: {}
    }
  },
  created () {
    this.initBtn() // 按钮初始化
    // this.initTable(this.acceptanceNoteId) // 主表格初始化
  },
  mounted() {
    this.tableHeight() // 表格高度
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch:{
    'dialogDataTable.data':{
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))) {
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber))) {
              return this.$message.warning('请输入整数')
            }
          }
          item.acceptPalletAmount = parseFloat((item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount).toFixed(6));
          //实际总数量必须小于等于计划总数量
          if((0<item.acceptPalletAmount) && (item.acceptPalletAmount<=item.notAcceptAmount)){
            //不做处理
          }else{
            this.$message.warning('当前组板数大于0且不能大于未组板数')
          }
        })
  　　　for(let i=0; i<this.oldDialogDataTable.length; i++) {
          if(this.oldDialogDataTable[i].acceptPalletAmount != this.dialogDataTable.data[i].acceptPalletAmount){//比较不同的数据返回true
            this.isSave = true
            return
          }
        };
　　　},
　　　deep: true
    },
    labelNumber(curVal,oldVal){
  　　this.isSave = true
  　},
    spaceId(curVal,oldVal){
  　　this.isSave = true
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
      let menusKey = 'WMS_ACCEPTANCE_PALLET';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    searchList(){//查询
      if(this.acceptanceNoteId){
        this.searchParam ={
          commodityName: this.formInline.commodityName,//商品名称
          commodityBarcode: this.formInline.commodityBarcode, // 预发货单类型
          caseCode: this.formInline.caseCode,//委托业主
          palletCode: this.formInline.palletCode//商品类型
        }
        this.initTable(this.acceptanceNoteId, 1)
      }else{
        this.$message.warning('请选择需要查询的验收单')
      }
    },
    resetForm(){
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
    },
    acceptancePalletCommodity(){
      if(this.acceptanceNoteId){
        this.dialogVisible = true
        this.isSave = false
        this.initBrandsList()
        this.initOwnersList()
        this.initContainerLabeList()
        this.initSpaceList()
        this.initDialogTable(1)
      }else{
        this.$message.warning('请选择需要验收的验收单')
      }
    },
    saveCheckCommodity(){//保存验收组板
      let len = this.getDialogSelectedRow.length
      if(len == 0){
        this.$message.warning('请选择需要保存的验收组板信息')
      }else{
        if(!this.spaceId){
          this.$message.warning('请选择存储储位')
          return false
        }
        if(!this.containerLabelId){
          this.$message.warning('请新取托盘号')
          return false
        }
        let flag = true//判断是否填入当前组板数
        let flag1 = true//判断是否为正整数
        this.getDialogSelectedRow.forEach((item, index) => {
          if(item.acceptPalletAmount){
            let reg = /^(-|\+)?\d+$/
            if(item.smallPackageUnitId != 10) {
              if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))) {
                this.$message.warning("请输入整数")
                return flag1 = false
              } else {
                if (item.acceptPalletAmount > item.notAcceptAmount) {
                  this.$message.warning("当前组板数大于0且不能大于未组板数")
                  return flag1 = false
                }
              }
            }else{
              if (!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) )) {
                this.$message.warning("请输入整数")
                return flag1 = false
              } else {
                if (item.acceptPalletAmount > item.notAcceptAmount) {
                  this.$message.warning("当前组板数大于0且不能大于未组板数")
                  return flag1 = false
                }
              }
            }
          }else{
            return flag = false
          }
        })
        if(flag){
          if(flag1){
            let params = []
            let tempValue = this.getDialogSelectedRow
            let key = this.spaceArr.data.findIndex(item => item.spaceId == this.spaceId)
            let spaceCode = this.spaceArr.data[key].spaceCode
            let key1 =  this.containerLabeArr.data.findIndex(item => item.labelId == this.containerLabelId)
            let labelRuleId = ''
            let labelCode = ''
            let labelTypeId = ''
            if(key1 != -1){
              labelRuleId = this.containerLabeArr.data[key1].labelRuleId
              labelCode = this.containerLabeArr.data[key1].labelCode
              labelTypeId = this.containerLabeArr.data[key1].labelTypeId
            }
            for(var i=0; i<tempValue.length; i++){
              let temp = {
                "acceptanceTypeId": this.acceptanceTypeId,
                "acceptPalletAmount": tempValue[i].acceptPalletAmount,//当前组板数
                "acceptanceNoteId": tempValue[i].acceptanceNoteId,
                "acceptanceNoteDtlId": tempValue[i].acceptanceNoteDtlId,
                "palletLabelId": this.containerLabelId,//标签id labelId
                // "containerLabelId": labelRuleId,//托盘  labelRuleId
                "containerLabelId": this.containerLabelId,//托盘  labelRuleId
                "containerLabelCode": labelCode,//容器编码 labelCode
                "containerLabelTypeId": labelTypeId,//容器id  labelTypeId
                "spaceId": this.spaceId,//储位id
                "spaceCode": spaceCode,//储位编码
                "commodityId": tempValue[i].commodityId,
                "commodityCode": tempValue[i].commodityCode,
                "commodityName": tempValue[i].commodityName,
                "commodityBarcode": tempValue[i].commodityBarCode,
                "specification": tempValue[i].specification,
                "commodityQualityId": tempValue[i].commodityQualityId,
                "packageCommodityAmount": tempValue[i].packageCommodityAmount,
                "storageId": tempValue[i].storageId,
                "commodityPileCount": tempValue[i].commodityPileCount,
                "commodityVolume": tempValue[i].commodityVolume,
                "acceptAmount": tempValue[i].acceptAmount
              }
              params.push(temp)
            }
            acceptanceByCommodity(params).then(res => {
              let data = res.data
              if(data.status == 10001){
                this.$message.warning(data.message)
              }else{
                this.$message.success('保存成功')
                //操作完成，刷新表单
                this.cancelCheck()
                if(this.acceptanceNoteId){
                  this.acceptanceNoteId = ''
                  this.$emit('changeValue', true)
                  this.$emit('initTable')
                }else{
                  this.acceptanceNoteId = ''
                  this.$emit('changeValue', false)
                  this.$emit('initTable')
                }
              }
            })
          }
        }else{
          this.$message.warning('请输入当前验收数量或选择品质')
        }
      }
    },
    acceptancePalletCase(){
      //按箱验收组板
      let params = {}
      acceptanceByCase(params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          //操作完成，刷新表单
          this.initTable(this.acceptanceNoteId, 1)
        }
      })
    },
    updateList () {//修改

    },
    updateForm() {

    },
    delList(){//删除
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的验收板明细信息');
        return false
      }else{
        this.delDialog.modalShow = true;
      }
    },
    removeRow() {
      let palletDtlIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        palletDtlIdArr.push(item.palletDtlId);
      });
      let palletDtlIds = palletDtlIdArr.join(',');
      delAcceptancePallet(palletDtlIds).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false
          this.acceptanceNoteId = ''
          this.$emit('initTable')
          this.$emit('changeValue', false)
          // if(this.acceptanceNoteId){
          //   this.initTable(this.acceptanceNoteId, 1)
          // }
        }
      })
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
    initTable (acceptanceNoteId, current) { // 初始化表格
      //验收单id
      if(acceptanceNoteId){
        this.acceptanceNoteId = acceptanceNoteId
      }
      let params = {
        start: current,
        limit: this.dataTable.limit,
        palletType: 0
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getAcceptancePalletList(acceptanceNoteId, this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
        }
      })
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTable.start = val
      this.initTable(this.acceptanceNoteId, this.dataTable.start)
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.acceptanceNoteId, this.dataTable.start)
    },
    onRowClick () { // 表格行点击
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
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
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#pallet-top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      // this.dataTable.height = ($(window).height() - formHeight - this.$store.state.basic.height - '120') / 2;
      // this.dialogDataTable.height = ($(window).height() - formHeight - this.$store.state.basic.height - '250');
      this.dataTable.height = ($(window).height() / 2 - formHeight )
      this.dialogDataTable.height = 470;
    },
    //弹窗的事件
    initDialogTable (current) { // 初始化表格
      this.form.start = current
      this.form.limit = this.dialogDataTable.limit
      getAcceptanceNoteDetailList(this.acceptanceNoteId,this.filteParams(this.form)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dialogDataTable.data = []
          this.oldDialogDataTable.data = []
          // this.dialogDataTable.start = 1;
          // this.dialogDataTable.limit = 10;
          // this.dialogDataTable.total = 0;
        }else{
          let records = data
          let temp = []
          records.forEach((item,index) => {
            if(!item.notAcceptAmount == 0){
              if(item.largePackageNumber == null || item.largePackageNumber == 0){
                item.largePackageNumber = 0
              }
              if(item.largePackageCount == null || item.largePackageCount == 0){
                item.largePackageCount = 0
                item.disabledLargePackageNumber = true
              }
              if(item.mediumPackageNumber == null || item.mediumPackageNumber == 0){
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
              item.acceptPalletAmount = item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount
              temp.push(item)
            }
          })
          this.dialogDataTable.data = JSON.parse(JSON.stringify(temp));
          this.oldDialogDataTable = JSON.parse(JSON.stringify(temp))
          // this.dialogDataTable.start = data.current;
          // this.dialogDataTable.limit = data.size;
          // this.dialogDataTable.total = data.total;
        }
      });
    },
    handleDialogCurrentChange (val) { // 分页页码
      this.dialogDataTable.start = val
      this.initDialogTable(this.dataTable.start)
    },
    handleDialogSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dialogDataTable.limit = val
      this.initDialogTable(this.dataTable.start)
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
    searchCommodityList () {
      //通过表单数据获取表格
      this.initDialogTable(1)
    },
    resetDialogForm(){
      for (let item in this.form) {
        this.form[item] = ''
      }
      this.form.isShowDetail = 1
    },
    closeDialog(){
      this.resetCommodityForm()
    },
    resetCommodityForm() {//按商品收货表单取消
      //重置数据
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.cancelCheck()
      }
    },
    cancelDialog(){
      this.cancelCheck()
    },
    cancelCheck(){
      this.dialogDataTable.data = []
      this.oldDialogDataTable = []
      this.resetForm()
      // this.labelNumber = ''
      this.ownersArr.start = 1
      this.ownersArr.data = []
      this.brandsArr.start = 1
      this.brandsArr.data = []
      this.spaceId = ''
      this.spaceArr.start = 1
      this.spaceArr.data = []
      this.containerLabelId = ''
      this.containerLabeArr.start = 1
      this.containerLabeArr.data = []
      this.dialogVisible = false
      this.isSaveDialog.modalShow = false
      this.isSave = false
    },
    focusPalletLabe(Event){
      // this.searchlabelNumber = Event.srcElement.value
      if(Event.srcElement){
        this.searchlabelNumber = Event.srcElement.value
      }else{
        this.searchlabelNumber = Event.target.value
      }
      this.containerLabeArr.data =[]
      this.containerLabeArr.start = 1
      this.initContainerLabeList()
    },
    changePalletLabe(val){
      let key = this.containerLabeArr.data.findIndex(item => item.labelId == val)
      if(key != -1){
        this.searchlabelNumber = this.containerLabeArr.data[key].labelNumber
      }
    },
    clearPalletLabe(){
      this.searchlabelNumber = ''
    },
    searchPalletLabe(val){
      this.searchlabelNumber = val
      this.containerLabeArr.data =[]
      this.containerLabeArr.start = 1
      this.initContainerLabeList()
    },
    initContainerLabeList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.containerLabeArr.data));
      let params = {
        start: this.containerLabeArr.start,
        limit: this.containerLabeArr.limit,
        isAsc: true,
        sort: 'containerLabeName',
        labelNumber: this.searchlabelNumber
      };
      getContainerList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.containerLabeArr.data = oldData.concat(data.records) : this.containerLabeArr.data = JSON.parse(JSON.stringify(data.records));
          this.containerLabeArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    containerLabeMore () {
      if ( this.containerLabeArr.start == this.containerLabeArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.containerLabeArr.start = this.containerLabeArr.start + 1;
        this.initContainerLabeList(true);
      }
    },
    initSpaceList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.spaceArr.data));
      let params = {
        attributeId: '1',//储区属性id
        attributeTypeId: '0',//属性类型id
        start: this.spaceArr.start,
        limit: this.spaceArr.limit
      };
      getSpaceList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.spaceArr.data = oldData.concat(data.records) : this.spaceArr.data = JSON.parse(JSON.stringify(data.records));
          this.spaceArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    spaceMore () {
      if ( this.spaceArr.start == this.spaceArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.spaceArr.start = this.spaceArr.start + 1;
        this.initSpaceList(true);
      }
    },
    checkPrint() {
      let params = {}
      acceptNoteLablePrint(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.containerLabeArr.data = data
          this.containerLabelId = data[0].labelId
          this.labelCode = data[0].labelCode
          this.labelNumber = data[0].labelNumber
          this.labelRuleId = data[0].labelRuleId
          this.labelTypeId = data[0].labelTypeId
          // this.initContainerLabeList()
          let template = data[0].template
          let templateId = template[0].template_id
          let templateType = template[0].template_type
          this.printOk(templateId, templateType, data)
        }
      })
    },
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params)
    },
    resetTable(){
      this.dataTable = {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: "270px", // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      }
    },
    resetAcceptanceNote(){
      this.acceptanceNoteId = ''
    }
  }
}
