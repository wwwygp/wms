import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import { ownersList, getCustomerFromErp, getRouteFromErp } from '@/api/common/business.js'
import {getDeliveNotice,getDeliveNoticeDtl,exportSchedule} from '@/api/export-warehouse/export-schedule/index.js'
export default {
  components: {
    DatePick,
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    return {
      formInline: {
        ownerId: '',//委托业主
        deliveNoticeCode: '', //出货单号
        orderCode: '',//订单号
        customerId: '',   //客户
        routeId: '',   //线路
        report:false //是否检报
      },
      dialogShipmentsVisible: false,
      planDeliveSum: 0, //总计划数量
      availableSum: 0, //总可用数量
      notEnoughSum:0,//总缺量
      stockStatus: 0, //库存状态正常
      btnList: [], //按钮集合
      routeList: [],//线路集合
      customerList: [],//客户集合
      getSelectedRow: [], // 用户选择的数据
      getDetailSelectedRow: [], // 用户选择的数据
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data: [],
        start: 1,
        limit: 10
      },
      statusList: [],//状态下拉框集合
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 单选功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      // 表格ID ，就是表格自定义名称
      tableName: {
        tableCode: 'WMS_EXPORT_SCHEDULE'
      },
      //明细表
      detailDataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: false,
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      // 明细
      detailTableName: {
        tableCode: 'WMS_EXPORT_SCHEDULE_DTL'
      },
      shipmentsTitle: '',
      searchParam: {}
    }
  },
  created() {
    this.getOwnerList(false);
    this.initBtn();
    this.getcustomerIdList();
    this.getRouteIdList();
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
    //委托业主下拉框
    loadMoreOwnerList() {
      if (this.ownersPageDate.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了')
      } else {
        this.ownersPageDate.start = this.ownersPageDate.start + 1
        this.getOwnerList(true)
      }
    },
    //委托业主下拉框
    getOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownersPageDate.data))
      let params = {
        start: this.ownersPageDate.start,
        limit: this.ownersPageDate.limit
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message)
        } else {
          this.ownersPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records))
          this.ownersArrPage = data.pages // 总页码
        }

      })
    },
    // 按钮加载函数
    initBtn() {
      let menusKey = 'WMS_EXPORT_SCHEDULE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    //调用一个对象的一个方法
    callFn(item) {
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
    // 表单重置
    reseltForm(formName) {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
    },
    searchTabelList(){
      this.searchParam = {
        ownerId: this.formInline.ownerId,
        deliveNoticeCode: this.formInline.deliveNoticeCode,
        orderCode: this.formInline.orderCode,
        customerId: this.formInline.customerId,
        routeId: this.formInline.routeId,
      }
      this.initTable(1)
    },
    //获取首页列表
    initTable(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getDeliveNotice(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        let re = res.data
        if (re.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(re.records))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(re))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        }
        //清空明细
        this.detailDataTable.data = []
      })
    },
        // 用户的选择框事件
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
      if (this.getSelectedRow.length > 0) {
        this.searchDtlTabelList()
      } else {
      	//计算总计划数量
        this.planDeliveSum = 0;
        //计算总可用数量
        this.availableSum = 0;
        //计算总缺量
        this.notEnoughSum = 0;
        this.detailDataTable.data = []
        this.detailDataTable.start = 1
        this.detailDataTable.limit = 10
        this.detailDataTable.total = 0
      }
    },
    // 用户的选择框事件
    onHandleSelectionDetailChange(val) {
    	this.getDetailSelectedRow = val;
    },
        //获取首页明细列表
    searchDtlTabelList() {
      let noticeIdArray = []
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        noticeIdArray.push(this.getSelectedRow[i].deliveNoticeId)
      }
      let params = {
      	deliveNoticeIds: noticeIdArray.join(',')
      }
      getDeliveNoticeDtl(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.detailDataTable.data = JSON.parse(JSON.stringify(res.data))

        //计算总计划数量
        this.planDeliveSum = 0;
        //计算总可用数量
        this.availableSum = 0;
        //计算总缺量
        this.notEnoughSum = 0;
        let dtlData = this.detailDataTable.data;
        for(let i=0;i<dtlData.length;i++){
        	this.planDeliveSum = this.planDeliveSum + dtlData[i].planDeliveAmount;
        }
        for(let i=0;i<dtlData.length;i++){
        	this.availableSum = this.availableSum + dtlData[i].availableCount;
        }
        for(let i=0;i<dtlData.length;i++){
        	this.notEnoughSum = this.notEnoughSum + dtlData[i].notEnoughCount;
        }
      })
    },
     exportSchedule(){
      if (this.getSelectedRow.length < 1) {
        return this.$message.warning('请选择需要调度的数据!')
      }
      if(this.notEnoughSum > 0){
      	return this.$message.warning('总缺量大于0，不允许进行调度!')
      }
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        if (this.getSelectedRow[i].deliveStatus < 0 || this.getSelectedRow[i].deliveStatus > 1) {
          return this.$message.warning('只有出库状态为初始状态或部分调度的出库通知单，才允许进行调度!')
         }
       }
      let noticeIdArray = []
      var deliveNoticeIds = '';
      for (var i = 0 ; i < this.detailDataTable.data.length ; i++) {
      	noticeIdArray.push(this.detailDataTable.data[i].deliveNoticeDtlId)
      }
      let params = {
      	deliveNoticeDtlIds: noticeIdArray.join(','),
        report:this.formInline.report
      }
      exportSchedule(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        this.$message.warning('调度中')
        let _self = this
        setTimeout(function(){
          _self.$message.close()
          _self.$emit('changeTab', 'second')
        }, 2000)
        // if (res.data.status == 10001) {
        //   return this.$message.warning(res.data.message);
        // }else{
        //   this.reseltForm('formInline');
        //   this.initTable(1);
        //   return this.$message.success('调度成功')
        // }
      }).catch(error => {
        this.$emit('changeTab', 'second')
        //this.$message.error('调度失败！')
      })
    },
    //获取客户集合
    getcustomerIdList() {
      let params = {
        limit: 100
      }
      getCustomerFromErp(params).then(res => {
        this.customerList = JSON.parse(JSON.stringify(res.data.records))
      }).catch(error => {
        this.$message.warning('服务错误')
      })
    },
    //获取线路集合
    getRouteIdList() {
      getRouteFromErp().then(res => {
        this.routeList = JSON.parse(JSON.stringify(res.data))
      }).catch(error => {
        this.$message.warning('服务错误')
      })
    },
    //表格高度
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = ($(window).height() - formHeight - this.$store.state.basic.height - '100')
      this.detailDataTable.height = ($(window).height() - formHeight - this.$store.state.basic.height - '50')
    },
    // table数据处理函数
    tableDataHandle(data) {
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
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
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      })
      this.initTable(1);
    },
    // table数据处理函数
    detailTableDataHandle(data) {
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.detailDataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.detailDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.detailDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      })
    },
    // 表格行点击
    onRowClick(val) {
    },
    // 表格行点击
    onDetailRowClick(val) {
    },
    // 表格行点击
    onShipmentsRowClick(val) {
    },
    // 分页页码
    handleCurrentChange(val) {
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    // 分页每页展示的数量
    handleSizeChange(val) {
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
    }
  }
}
