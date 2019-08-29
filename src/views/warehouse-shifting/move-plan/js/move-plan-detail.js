import DatePick from '@/components/DatePicker/index';
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getMovePlanDtlList, addMovePlanDtl, editMovePlanDtl, deleteMovePlanDtl, getCommoditDetail} from '@/api/warehouse-shifting/move-plan/move-plan-detail';
import { userFromErp } from '@/api/common/common-info';
import { spacePrinterList } from '@/api/storage-manage/warehouse-area/space'; // 储位查询
import { dictionarysTypeNew, standardDic, standardDicPage} from '@/api/common/type.js';//字典返回值，编码规则
import { ownersList, brandList } from '@/api/common/business.js'
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'

export default {
  components: {
    DatePick,
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data () {
    return{
      btnList: [], // 存放权限的按钮
      //移库计划主表
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 单选功能
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
        tableCode: "WMS_MOVE_PLAN_DTL"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 主表用户多选框选中的数据
      //主表
      formInline: {
        movePlanCode: '',
        statusName: '',
        createrName: '',
        createTime: '',
        remark: '',
        status: ''
      },
      //主表
      form: {
        commodityName: '', // 商品名称
        ownerId: '', // 委托业主id
        spaceId: '', // 储位编码id
        standardId: '', // 标准
        specification: '', // 规格
        surfaceTreatmentId: '', // 表色
        brandId: '' // 品牌
      },
      //移库计划主表
      dataTableDialog: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 单选功能
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
      tableNameDialog: {
        tableCode: "WMS_STOCK_INFORMATION_MOVE_ADD_PAGE"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRowDialog: [], // 主表用户多选框选中的数据
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      userList: [],
      searchParam: {},
      dialogCommodityVisible: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveCommodityDialog: {//确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      //将需要比较的数组存起来
      oldDataTableDialog: [],
      isMainSave: false,//若有数据新增，未点击保存
      isMainSaveCommodityDialog: {//确认是否保存
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      oldDataTable: [],
      commodityTitle: '',
      spaceArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      spaceArrPage: 1,
      searchSpaceCode: '',
      //品牌
      brandsArrPage: 1,
      brandPageDate: { // 品牌页码数据
        data: [],
        start: 1,
        limit: 10,
      },
      standardArrPage: 1,
      standardPageDate: { // 标准页码数据
        data: [],
        start: 1,
        limit: 10,
      },
      ownersArrPage: 1, 
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      colorList: [],//表色
      tableSpaceArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      tableSpaceArrPage: 1,
      searchTableSpaceCode: '',
      //主表的储位
      mainTableSpaceArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      mainTableSpaceArrPage: 1,
      searchMainTableSpaceCode: '',
      surfaceTreatmentArrPage: 1,//表色
      surfaceTreatmentArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchSurfaceTreatment: '',
    }
  },
  created () {
    this.initBtn() // 按钮初始化
    // this.initDictionary()//获取字段值
    let movePlanDetail =  JSON.parse(window.localStorage.getItem("movePlanDetail"))
    if(movePlanDetail && movePlanDetail.movePlanCode){
      this.formInline = movePlanDetail
    }
  },
  watch: {
    'dataTableDialog.data':{
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnit != 10 && !(reg.test(item.stayCol1))) {
            return this.$message.warning('请输入整数')
          }
        })
  　　　for(let i=0; i<this.oldDataTableDialog.length; i++) {
          if((this.oldDataTableDialog[i].stayCol1 != this.dataTableDialog.data[i].stayCol1) || (this.oldDataTableDialog[i].stayCol2 != this.dataTableDialog.data[i].stayCol2)){//比较不同的数据返回true
            this.isSave = true
            return
          }
        }
　　　},
　　　deep: true
    },
    'dataTable.data':{
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnit != 10){
            if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))){
              return this.$message.warning('请输入整数')
            }
          }else{
            if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber))){
              return this.$message.warning('请输入整数')
            }
          }
          item.movePlanQuantity = item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount
          if((this.oldDataTable[index].movePlanQuantity != item.movePlanQuantity) || (this.oldDataTable[index].movePlanQuantity != item.movePlanQuantity)){//比较不同的数据返回true
            this.isMainSave = true
            return
          }
        })
　　　},
　　　deep: true
    },
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
    initBtn () {
      let menusKey = 'WMS_MOVE_PLAN_DTL';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    getUser(){
      let params = {
        isOnWork: true
      }
      userFromErp(this.filteParams(params)).then(res => {
        if(res.data){
          this.userList = res.data
        }
      })
    },
    //储位编码
    initMainTableSpace (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.mainTableSpaceArr.data));
      let params = {
        spaceCode: this.searchMainTableSpaceCode,
        start: this.mainTableSpaceArr.start,
        limit: this.mainTableSpaceArr.limit
      };
      spacePrinterList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.mainTableSpaceArr.data = oldData.concat(data.records) : this.mainTableSpaceArr.data = JSON.parse(JSON.stringify(data.records));
          this.mainTableSpaceArrPage = data.pages // 总页码
        }
      })
    },
    mainTableSpaceMore () {
      if ( this.mainTableSpaceArr.start == this.mainTableSpaceArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.mainTableSpaceArr.start = this.mainTableSpaceArr.start + 1
        this.initMainTableSpace(true);
      }
    },
    searchMainTableSpace(val){
      this.searchMainTableSpaceCode = val
      this.mainTableSpaceArr.data =[]
      this.mainTableSpaceArr.start = 1
      this.initMainTableSpace()
    },
    focusMainTableSpace(Event){
      // this.searchMainTableSpaceCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchMainTableSpaceCode = Event.srcElement.value
      }else{
        this.searchMainTableSpaceCode = Event.target.value
      }
      this.mainTableSpaceArr.data =[]
      this.mainTableSpaceArr.start = 1
      this.initMainTableSpace()
    },
    changeMainTableSpace(val){
      console.log(val)
      // this.searchMainTableSpaceCode = val
      let key = this.mainTableSpaceArr.data.findIndex(item => item.spaceId == val)
      if(key != -1){
        this.searchMainTableSpaceCode = this.mainTableSpaceArr.data[key].spaceCode
      }
    },
    clearMainTableSpace(){
      this.searchMainTableSpaceCode = ''
    },
    //移库计划主表
    initTable (current) { // 初始化表格
      this.getSelectedRow = []
      let params = {
        movePlanId: this.formInline.movePlanId,
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      getMovePlanDtlList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTable.data = [];
          this.dataTable.start = 1;
          this.dataTable.limit = 10;
          this.dataTable.total = 0;
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.oldDataTable = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current;
          this.dataTable.limit = data.size;
          this.dataTable.total = data.total;
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
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'largePackageNumber' || item.prop == 'mediumPackageNumber' || item.prop == 'smallPackageNumber' || item.prop == 'dstSpaceCode') {
          item.hasCenterCol = true
          item.show = 'template'
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
      this.$refs.tableConfig.domShow = false;
      this.$nextTick(() => {
        this.$refs.tableConfig.domShow = true;
        this.$refs.tableConfig.dialogVisible = false;
      });
      if(this.formInline.movePlanCode){
        this.initTable(1)
      }
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#move-plan-detail-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 5
      this.dataTableDialog.height = $(window).height() / 2
    },
    //表色下拉框
    searchFastenerSurfaceTreatment(val){
      this.searchSurfaceTreatment = val
      this.surfaceTreatmentArr.data =[]
      this.surfaceTreatmentArr.start = 1
      this.initSurfaceTreatmentList()
    },
    changeSurfaceTreatment(val){
      this.searchSurfaceTreatment = val
    },
    clearSurfaceTreatment(){
      this.searchSurfaceTreatment = ''
    },
    initSurfaceTreatmentList(concatOldData) {
      let localArr = this.surfaceTreatmentArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchSurfaceTreatment,
        code: 'standard_fastener_surface',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.surfaceTreatmentArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页表色数据下拉框
    loadMoreSurfaceTreatmentList() {
      let localArr = this.surfaceTreatmentArr;
      if (localArr.start == this.surfaceTreatmentArrPage) {
        //this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initSurfaceTreatmentList(true);
      }
    },
    //新增
    movePlanDtlAdd(){
      //显示弹出表格
      // this.initDictionary()   
      this.getBrandList()
      this.getStandardList()
      this.initOwnersList()
      this.dialogCommodityVisible = true
    },
    //新增弹窗的保存
    movePlanDtlSaveCommodity(){
      if(this.getSelectedRowDialog.length == 0){
        return this.$message.warning("请选择需要保存的数据")
      }
      let flag = true//比较可移数量
      let flag1 = true//正则校验
      let flag2 = true//目标储位
      for (var i = 0; i < this.getSelectedRowDialog.length; i++) {
        let reg = /^(-|\+)?\d+$/
        if(this.getSelectedRowDialog[i].stayCol1 == 0){
          this.$message.warning("移库数量不能为0")
          return flag = false
        }
        if(this.getSelectedRowDialog[i].availableAmount < this.getSelectedRowDialog[i].stayCol1){
          this.$message.warning("移库数量不能大于可移数量！")
          return flag = false
        }
        // if(!(reg.test(this.getSelectedRowDialog[i].stayCol1))){
        //   this.$message.warning('请输入整数')
        //   return flag1 = false
        // }
        if(this.getSelectedRowDialog[i].smallPackageUnit != 10 && !(reg.test(this.getSelectedRowDialog[i].stayCol1))) {
            this.$message.warning('请输入整数')
            return flag1 = false
          }
        if(!this.getSelectedRowDialog[i].stayCol2){
          this.$message.warning('请选择储位')
          return flag2 = false
        }
      }
      if(flag && flag1 && flag2){
        let params = []
        for (var i = this.getSelectedRowDialog.length - 1; i >= 0; i--) {
          let item = {
            "movePlanId": this.formInline.movePlanId,//移库单id,（非必填）
            "commodityId": this.getSelectedRowDialog[i].commodityId,//商品id,
            "commodityCode":this.getSelectedRowDialog[i].commodityCode,//商品编码,
            "ownerId": this.getSelectedRowDialog[i].ownerId,//委托业主id,
            "ownerCode": this.getSelectedRowDialog[i].ownerCode,//委托业主编码,
            "movePlanQuantity": this.getSelectedRowDialog[i].stayCol1,//计划移库数量,
            "srcSpaceId": this.getSelectedRowDialog[i].spaceId,//来源储位id,
            "dstSpaceId": this.getSelectedRowDialog[i].stayCol2,//目标储位id
            "srcLabelId": this.getSelectedRowDialog[i].containerLabelId,
            "srcLabelCode": this.getSelectedRowDialog[i].containerLabelCode
          }
          params.push(item)
        }
        addMovePlanDtl(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.cancel()
            this.$message.success("保存成功！")
            this.formInline = data[0]
            this.initTable(1)
          }
        })
      }
    },
    //关闭弹窗
    resetCommodityForm() {//关闭弹窗
      //重置数据
      if(this.isSave){
        this.isSaveCommodityDialog.modalShow = true
      }else{
        this.cancel()
      }
    },
    cancel(){
      this.dataTableDialog.data = []
      this.oldDataTableDialog = []
      for (let item in this.form) {
        this.form[item] = '';
      }
      this.brandPageDate.start = 1
      this.ownersArr.start = 1
      this.spaceArr.start = 1
      this.standardPageDate.start = 1
      this.dialogCommodityVisible = false
      this.isSaveCommodityDialog.modalShow = false
      this.isSave = false
    },
    //关闭弹窗
    closeCommodityDialog(){//点击弹窗的X
      this.resetCommodityForm()
    },
    //保存
    movePlanDtlSave(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要保存的明细数据!")
      }
      let flag = true
      this.getSelectedRow.forEach((item, index) => {
        let reg = /^(-|\+)?\d+$/
        if(item.smallPackageUnit != 10){
          if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber) && reg.test(item.smallPackageNumber))){
            this.$message.warning('请输入整数')
            return flag = false
          }
        }else{
          if(!(reg.test(item.largePackageNumber) && reg.test(item.mediumPackageNumber))){
            this.$message.warning('请输入整数')
            return flag = false
          }
        }
        item.movePlanQuantity = item.largePackageNumber * item.largePackageCount + item.mediumPackageNumber * item.mediumPackageCount + item.smallPackageNumber * item.smallPackageCount
      })
      if(flag){
        let params = []
        this.getSelectedRow.forEach((item, index) => {
          var item = {
            movePlanId: this.formInline.movePlanId, // 移库计划id
            movePlanDtlId: item.movePlanDtlId, //移库计划明细Id
            movePlanQuantity: item.movePlanQuantity, //计划移库数量
            srcSpaceId: item.srcSpaceId,//来源储位id,
            dstSpaceCode: item.dstSpaceCode,//目的储位id,
            cmmodityId: item.cmmodityId//商品id
          } 
          params.push(item)
        })
        editMovePlanDtl(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success("保存成功！")
            this.isMainSave = false
            this.initTable(1)
          }
        })
      }else{
        this.$message.warning('请输入整数')
      }
    },
    /*
    [{"dictDtlName":"建单","dictDtlValue":"0"},
    {"dictDtlName":"审核","dictDtlValue":"1"},
    {"dictDtlName":"已发起","dictDtlValue":"2"},
    {"dictDtlName":"移库中","dictDtlValue":"3"},
    {"dictDtlName":"结案","dictDtlValue":"4"},
    {"dictDtlName":"取消","dictDtlValue":"5"}]
     */
    //修改
    movePlanDtlEdit(){
      
    },
    //删除
    movePlanDtlDelete(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要删除的明细数据")
      }
      this.delDialog.modalShow = true
    },
    removeRow () {
      let flag = true
      let params = []
      for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
        if(this.formInline.status == 0){
          params.push(this.getSelectedRow[i].movePlanDtlId)
        }else{
          flag = false
        }
      }
      if(flag){
        //建单和审核状态
        params = params.join(",")
        deleteMovePlanDtl(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success("明细删除成功！")
            this.delDialog.modalShow = false
            this.initTable(1)
          }
        })
      }else{
        this.$message.warning("数据状态不允许删除！")
      }
    },
    back(item){
      // window.localStorage.setItem("movePlanDetail", JSON.stringify(item))
      if(this.isMainSave){
        this.isMainSaveCommodityDialog.modalShow = true
      }else{
        try {
          this.routeERP("WMS_MOVE_PLAN", '移库计划页', '/iwms/#/warehouse-shifting/move-plan') //其他环境跳转公用方法
        } catch (e) {
          this.$router.push({
            path: '/warehouse-shifting/move-plan',
            query: {}
          })
        }
      }
    },
    backMovePlan(){
      try {
        this.routeERP("WMS_MOVE_PLAN", '移库计划页', '/iwms/#/warehouse-shifting/move-plan') //其他环境跳转公用方法
      } catch (e) {
        this.$router.push({
          path: '/warehouse-shifting/move-plan',
          query: {}
        })
      }
    },
    //新增移库计划商品明细区域
    //移库计划商品主表
    //品牌下拉框
    loadMoreBrandsList() {
      if (this.brandPageDate.start == this.brandsArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.brandPageDate.start = this.brandPageDate.start + 1;
        this.getBrandList(true);
      }
    },
    //品牌下拉框
    getBrandList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.brandPageDate.data));
      let params = {
        start: this.brandPageDate.start,
        limit: this.brandPageDate.limit
      }
      brandList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.brandPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.brandsArrPage = data.pages; // 总页码
        }
      })
    },
    //标准下拉框
    loadMoreStandardList() {
      if (this.standardPageDate.start == this.standardArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.standardPageDate.start = this.standardPageDate.start + 1;
        this.getStandardList(true);
      }
    },
    //标准下拉框
    getStandardList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.standardPageDate.data));
      let params = {
        code: 'standard_fastener_standard',
        start: this.standardPageDate.start,
        limit: this.standardPageDate.limit
      }
      standardDicPage(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.standardPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.standardArrPage = data.pages; // 总页码
        }
      })
    },
    //委托业主
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
    //储位编码
    initSpace (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.spaceArr.data));
      let params = {
        spaceCode: this.searchSpaceCode,
        start: this.spaceArr.start,
        limit: this.spaceArr.limit
      };
      spacePrinterList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.spaceArr.data = oldData.concat(data.records) : this.spaceArr.data = JSON.parse(JSON.stringify(data.records));
          this.spaceArrPage = data.pages // 总页码
        }
      })
    },
    spaceMore () {
      if ( this.spaceArr.start == this.spaceArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.spaceArr.start = this.spaceArr.start + 1
        this.initSpace(true);
      }
    },
    searchSpace(val){
      this.searchSpaceCode = val
      this.spaceArr.data =[]
      this.spaceArr.start = 1
      this.initSpace()
    },
    focusSpace(Event){
      // this.searchSpaceCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchSpaceCode = Event.srcElement.value
      }else{
        this.searchSpaceCode = Event.target.value
      }
      this.spaceArr.data =[]
      this.spaceArr.start = 1
      this.initSpace()
    },
    changeSpace(val){
      this.searchSpaceCode = val
      // let key = this.spaceArr.data.findIndex(item => item.spaceId == val)
      // if(key != -1){
      //   this.searchSpaceCode = this.spaceArr.data[key].spaceCode
      // }
    },
    clearSpace(){
      this.searchSpaceCode = ''
    },
    searchCommodityList () {
      this.searchParam = {
        commodityName: this.form.commodityName, // 商品名称
        ownerId: this.form.ownerId, // 委托业主id
        spaceId: this.form.spaceId, // 储位编码
        standardId: this.form.standardId, // 标准
        specification: this.form.specification, // 规格
        surfaceTreatmentId: this.form.surfaceTreatmentId, // 表色
        brandId: this.form.brandId // 品牌
      }
      //通过表单数据获取表格
      this.initTableDialog(1)
    },
    resetCommodityList () {
      for (let item in this.form) {
        this.form[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
    },
    //储位编码
    initTableSpace (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.tableSpaceArr.data));
      let params = {
        spaceCode: this.searchTableSpaceCode,
        start: this.tableSpaceArr.start,
        limit: this.tableSpaceArr.limit
      };
      spacePrinterList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.tableSpaceArr.data = oldData.concat(data.records) : this.tableSpaceArr.data = JSON.parse(JSON.stringify(data.records));
          this.tableSpaceArrPage = data.pages // 总页码
        }
      })
    },
    tableSpaceMore () {
      if ( this.tableSpaceArr.start == this.tableSpaceArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.tableSpaceArr.start = this.tableSpaceArr.start + 1
        this.initTableSpace(true);
      }
    },
    searchTableSpace(val){
      this.searchTableSpaceCode = val
      this.tableSpaceArr.data =[]
      this.tableSpaceArr.start = 1
      this.initTableSpace()
    },
    focusTableSpace(Event){
      // this.searchTableSpaceCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchTableSpaceCode = Event.srcElement.value
      }else{
        this.searchTableSpaceCode = Event.target.value
      }
      this.tableSpaceArr.data =[]
      this.tableSpaceArr.start = 1
      this.initTableSpace()
    },
    changeTableSpace(val){
      let key = this.tableSpaceArr.data.findIndex(item => item.spaceId == val)
      if(key != -1){
        this.searchTableSpaceCode = this.tableSpaceArr.data[key].spaceCode
      }
    },
    clearTableSpace(){
      this.searchTableSpaceCode = ''
    },
    initTableDialog (current) { // 初始化表格
      this.getSelectedRow = []
      let params = {
        start: current,
        limit: this.dataTableDialog.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getCommoditDetail(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTableDialog.data = []
          this.dataTableDialog.start = 1
          this.dataTableDialog.limit = 10
          this.dataTableDialog.total = 0
        }else{
          for (var i = data.records.length - 1; i >= 0; i--) {
            data.records[i].stayCol1 = data.records[i].availableAmount
          }
          this.dataTableDialog.data = JSON.parse(JSON.stringify(data.records))
          this.oldDataTableDialog = JSON.parse(JSON.stringify(data.records))
          this.dataTableDialog.start = data.current
          this.dataTableDialog.limit = data.size
          this.dataTableDialog.total = data.total
        }
      });
    },
    handleCurrentChangeDialog (val) { // 分页页码
      this.dataTableDialog.start = val
      this.initTableDialog(this.dataTableDialog.start)
    },
    handleSizeChangeDialog (val) { // 分页每页展示的数量
      this.dataTableDialog.start = 1
      this.dataTableDialog.limit = val
      this.initTableDialog(this.dataTableDialog.start)
    },
    onHandleSelectionChangeDialog(val) { // 用户的选择框事件
      this.getSelectedRowDialog = val
    },
    tableDataHandleDialog(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'stayCol1' || item.prop == 'stayCol2') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dataTableDialog.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableDialog.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTableDialog.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      this.$refs.tableConfigDialog.domShow = false
      this.$nextTick(() => {
        this.$refs.tableConfigDialog.domShow = true
        this.$refs.tableConfigDialog.dialogVisible = false
      })
      this.initTableDialog(1)
    }
  }
}
