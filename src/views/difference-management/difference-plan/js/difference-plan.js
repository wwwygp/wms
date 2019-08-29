import DatePick from '@/components/DatePicker/index'
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue'
import { getProcessPlanList } from '@/api/difference-management/difference-plan/difference-plan'
import { ownersList } from '@/api/common/business.js'
import { dictionarysTypeNew } from '@/api/common/type.js'//字典返回值，编码规则
import tipsDialog from '@/components/dialog/tipsDialog'
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
      status: [],//移库计划状态
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
        tableCode: "WMS_PROCESS_PLAN"
      }, // 表格ID ，就是表格自定义名称
      //主表
      formInline: {
        processPlanCode: '', // 计划单号
        ownerId: '', // 委托业主
        status: '', // 状态
        createTimeStart: '',
        createTimeEnd: ''
      },
      getSelectedRow: [], // 主表用户多选框选中的数据
      userList: [],
      searchParam: {},
      ownersArrPage: 1,
      ownerArr: { // 委托业主页码数据
        data:[],
        start: 1,
        limit: 10,
      },
    }
  },
  created () {
    this.initBtn() // 按钮初始化
    this.initDictionary()//获取字段值
    this.getOwnerList()//获取委托业主
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
      let menusKey = 'WMS_DIFFERENCE_PLAN';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initDictionary() {//初始化字典值
      dictionarysTypeNew('WMS_PROCESS_PLAN_STATUS', this, 'status')
    },
    //委托业主下拉框
    getOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownerArr.data));
      let params = {
        start: this.ownerArr.start,
        limit: this.ownerArr.limit
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.ownerArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        }
      })
    },
    //加载更多委托业主
    loadMoreOwnerList() {
      if (this.ownerArr.start == this.ownersArrPage) {
        //this.$message.warning('没有更多数据了')
      } else {
        this.ownerArr.start = this.ownerArr.start + 1
        this.getOwnerList(true)
      }
    },
    //移库计划主表
    searchList () {
      this.searchParam = {
        processPlanCode: this.formInline.processPlanCode, // 计划单号
        ownerId: this.formInline.ownerId, // 委托业主
        status: this.formInline.status, // 状态
        createTimeStart: this.formInline.createTimeStart,
        createTimeEnd: this.formInline.createTimeEnd
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
      this.$refs.dateComponents.resetTime()
      this.$refs.editComponents.resetTime()
    },
    initTable (current) { // 初始化表格
      this.getSelectedRow = []
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getProcessPlanList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTable.data = [];
          this.dataTable.start = 1;
          this.dataTable.limit = 10;
          this.dataTable.total = 0;
        }else{
          for (var i = data.records.length - 1; i >= 0; i--) {
            data.records[i].processPlanDate = data.records[i].processPlanDate.split(/\s+/)[0]
          }
          this.dataTable.data = JSON.parse(JSON.stringify(data.records));
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
        if (item.prop == 'processPlanCode') {
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
      this.initTable(1)
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#difference-plan-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
    getCreateStartTime (val) { // 开始日期
      if(val){
        this.formInline.createTimeStart = val + ' 00:00:00';
      }else{
        this.formInline.createTimeStart = val
      }
    },
    getCreateEndTime (val) { // 结束日期
      if(val){
        this.formInline.createTimeEnd = val + ' 23:59:59';
      }else{
        this.formInline.createTimeEnd = val
      }
    },
    getEditStartTime (val) { // 开始日期
      if(val){
        this.formInline.editStartTime = val + ' 00:00:00';
      }else{
        this.formInline.editStartTime = val
      }
    },
    getEditEndTime (val) { // 结束日期
      if(val){
        this.formInline.editEndTime = val + ' 23:59:59';
      }else{
        this.formInline.editEndTime = val
      }
    },
    //新增-按商品
    addCommodity(){
      window.localStorage.setItem("differencePlanDetailCommodity", JSON.stringify({}))
      if(top && top.createTab){
        this.routeERP("WMS_DIFFERENCE_PLAN_DTL_COMMODITY", '盘点计划单明细', '/iwms/#/difference_plan_detail_commodity')
      }else{
        this.$router.push({
          path: '/difference_plan_detail_commodity', // difference_plan_detail_space
          query: {}
        })
      }
    },
    //新增-按储位
    addSpace(){
      window.localStorage.setItem("differencePlanDetailSpace", JSON.stringify({}))
      if(top && top.createTab){
        this.routeERP("WMS_DIFFERENCE_PLAN_DTL_SPACE", '盘点计划单明细', '/iwms/#/difference_plan_detail_space')
      }else{
        this.$router.push({
          path: '/difference_plan_detail_space', // difference_plan_detail_space
          query: {}
        })
      }
    },
    //审核
    check(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要修改的移库计划单！")
      }
      let flag = true
      let params = []
      for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
        if(this.getSelectedRow[i].status != 0){
          flag = false
        }else if(this.getSelectedRow[i].status == 0){
          params.push(this.getSelectedRow[i].processPlanId)
        }
      }
      if(flag){
        //建单状态
        params = params.join(",")
        approveMovePlan(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success("审核成功！")
            this.initTable(1)
          }
        })
      }else{
        //非建单状态
        this.$message.warning("非建单状态，不允许审核！")
      }
    },
    //发起盘点计划
    startDifference(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要修改的移库计划单！")
      }
      let flag = true
      let items = []
      let params = []
      for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
        if(this.getSelectedRow[i].status != 1){
          items.push(this.getSelectedRow[i].processPlanCode)
          flag = false
        }else if(this.getSelectedRow[i].status == 1){
          params.push(this.getSelectedRow[i].processPlanId)
        }
      }
      if(flag){
        //审核状态
        params = params.join(",")
        startMovePlan(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            // this.$message.warning("发起移库计划中")
            this.$emit('changeTab', 'second')
            // let _self = this
            // setTimeout(function(){
            //   _self.$message.close()
            //   _self.$emit('changeTab', 'second')
            // }, 2000)
          }
        })
      }else{
        // 非审核状态
        this.$message.warning("单号" + items.join(",") +"非审核状态，不允许发起！")
      }
    },
    // 结案
    closeDifference(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要结案的移库计划单！")
      }
      let flag = true
      let params = []
      for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
        if(this.getSelectedRow[i].status == 0 || this.getSelectedRow[i].status == 1 || this.getSelectedRow[i].status == 3){
          params.push(this.getSelectedRow[i].processPlanId)
        }else if(this.getSelectedRow[i].status == 2){
          flag = false
          return this.$message.warning("已发起状态不允许结案")
        }else if(this.getSelectedRow[i].status == 4){
          flag = false
          return this.$message.warning("不允许重复结案！")
        }else if(this.getSelectedRow[i].status == 5){
          flag = false
          return this.$message.warning("已取消的单据不能再做任何操作！")
        }
      }
      if(flag){
        //建单、审核、移库状态
        params = params.join(",")
        overMovePlan(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success("结案成功！")
            this.initTable(1)
          }
        })
      }
    },
    //整单取消
    allCancel(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning("请选择需要整单取消的移库计划单！")
      }
      let flag = true
      let params = []
      for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
        if(this.getSelectedRow[i].status == 0 || this.getSelectedRow[i].status == 1){
          params.push(this.getSelectedRow[i].processPlanId)
        }else{
          flag = false
        }
      }
      if(flag){
        //建单和审核状态
        params = params.join(",")
        cancelMovePlan(params).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success("整单取消成功！")
            this.initTable(1)
          }
        })
      }else{
        this.$message.warning("数据状态不允许整单取消！")
      }
    },
    handleRoute(item){
      window.localStorage.setItem("differencePlanDetail", JSON.stringify(item))
      if(top && top.createTab){
        this.routeERP("WMS_DIFFERENCE_PLAN_DTL", '盘点计划单明细', '/iwms/#/difference_plan_detail_commodity')
      }else{
        this.$router.push({
          path: '/difference_plan_detail_commodity', // difference_plan_detail_space
          query: {}
        })
      }
    }
  }
}
