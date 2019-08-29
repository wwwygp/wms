// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import { getDeliveNotice, updateDeliveNotice, updateDeliveNoticeDelivestatus, 
  addDeliveNotice, getDeliveNoticeDtl,  addDeliveNoticeDtl, closeDeliveNotice} from '@/api/export-warehouse/delive-notice/index';
  import { customerList } from '@/api/basic-data/customer/customer-api.js'
import { loaddBtn } from '@/api/common/load-btn.js';
import { ownersList } from '@/api/common/business.js'; // 供应商
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'delive-notice',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    return {
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      title: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的预到货通知单?'
      },
      dialogVisible: false,
      formInline: {//主页表单
        deliveNoticeCode: '',
        deliveNoticeTypeId: '',
        ownerId: '',
        deliveTypeId: '',
        orderCode: '',
        orderTypeId: '',
        arrivalNoticeCode: '',
        customerId: '',
        routeCode: '',
        status: '',
        deliveStatus: '',
        createStartTime: '',
        createEndTime: '',
      },
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        pageSizes: [10, 20, 30, 50,100],
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "WMS_EXPORT_DELIVE_NOTICE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      // form: {//弹窗表单
      //   // baseWharfDto: '',//码头实体接收类
      //   // warehouseId: '',//仓库名称
      //   wharfCode: '',//码头编码
      //   wharfName: '',//码头名称
      //   wharfType: '',//码头类型名称
      //   hasLiftingBoard: "0",//是否有调节板,默认否
      //   status: "1",//状态，默认启用
      //   remark: '',//备注
      //   printerGroupId: '0'
      // },
      rulesForm: {
        wharfCode: [{ required: true, message: '码头编码不能为空', trigger: 'change' }],
        wharfName: [{ required: true, message: '码头名称不能为空', trigger: 'change' }],
        wharfType: [{ required: true, message: '码头类型不能为空', trigger: 'change' }],
        hasLiftingBoard: [{ required: true, message: '请选择是否有调节板', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        printerGroupId: [{required: true,message: '请选择打印机组', trigger: 'change'}]
      },
      deliveNoticeTypeData : { // 出货单类型数据
        data: [],
        start : 1,
        limit: 10
      },
      deliveNoticeTypePage: 1,//出货单类型页码
      owners: {
        data: [],
        start: 1,
        limit: 10
      },
      ownersPage: 1, //委托业主
      deliveTypeData : { // 出货方式数据
        data: [],
        start : 1,
        limit: 10
      },
      deliveTypePage: 1,//出货方式页码
      orderTypeData : { // 订单类型数据
        data: [],
        start : 1,
        limit: 10
      },
      orderTypePage: 1,//订单类型页码
      statusData : { // 状态数据
        data: [],
        start : 1,
        limit: 10
      },
      statusPage: 1,//状态页码
      deliveStatusData : { // 出货状态数据
        data: [],
        start : 1,
        limit: 10
      },
      deliveStatusPage: 1,//出货状态页码
      form: {
        addOrderCode: '', //补单订单号,
        addOrderId: '', //补单订单号id,
        arrivalNoticeCode: '', //预到货单号,
        arrivalNoticeId: '', //预到货单ID,
        backId: '', //回传标识,
        contact: '', //联系人,
        createTime: '', //创建时间,
        createTypeId: '', //创建标识id,
        createrId: '', //创建人id,
        customerAddress: '', //客户地址,
        customerAddressCode: '', //客户地址编码,
        customerCode: '', //客户编码,
        customerId: '', //客户id,
        customerName: '', //客户名称,
        deleteStatus: '', //'',//删除状态(1删除，0显示),
        deliveNoticeCode: '', //出库单号,
        deliveNoticeId: '', //出库单ID,
        deliveNoticeTypeId: '', //出库类型id,
        deliveStatus: '', //出库状态,
        deliveTime: '', //出库时间,
        deliveTypeId: '', //出库方式,
        distributionTypeId: '', //配送方式id,
        editTime: '', //编辑时间,
        editorId: '', //编辑人id,
        email: '', //邮箱,
        emergencyId: '', //是否紧急单,
        errorStatus: '', //错误状态,
        orderCode: '', //订单号,
        orderId: '', //订单id,
        orderPriority: '', //订单优先级,
        orderTypeId: '', //订单类型,
        ownerId: '', //委托业主id,
        phone: '', //电话,
        remark: '', //备注,
        routeCode: '', //线路编码,
        routeId: '', //路线id,
        routeName: '', //路线名称,
        status: '', //出库单状态,
        transportId: '', //传输标识,
        transportTypeId: '', //运输方式,
        warehouseId: '', //仓库id
      },
      // rulesForm:{
      //
      // },
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {},
      customers: [],
      customersArrPage: 1,
      customersPageDate: {
        start: 1,
        limit: 10,
        total: 100
      },
    }
  },
  created() {
    this.initBtn()
    this.initDictionary()//从字典中获取配置参数
    this.initOwnersList()//获取委托业主信息
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch: {
    // form: {
    //   handler: function (newVal, oldVal) {
    //     for(let item in newVal) {
    //       if(newVal[item] != this.oldForm[item]){//比较不同的数据返回true
    //         this.isSave = true
    //         return
    //       }
    //     };
    //   },
    //   deep: true
    // }
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
      let menusKey = 'WMS_DELIVE_NOTICE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initDictionary(accumulation) {
      let params = {
        code: 'delive_notice_type_id'//出库类型
      }
      dictionarysType(params).then(res => {
        this.deliveNoticeTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'delive_type_id'//出库方式
      };
      dictionarysType(params1).then(res => {
        this.deliveTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'delive_status'//出库状态
      };
      dictionarysType(params2).then(res => {
        this.deliveStatusData.data = JSON.parse(JSON.stringify(res.data))
      })
      let params3 = {
        code: 'export_delive_notice_status'//状态
      };
      dictionarysType(params3).then(res => {
        this.statusData.data = JSON.parse(JSON.stringify(res.data))
      })
      let params4 = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_PURCHASE_TYPE'//订单类型
      };
      dictionarysType(params4).then(res => {
        this.orderTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
      
    },
    initOwnersList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.owners.data));
      let params = {
        start: this.owners.start,
        limit: this.owners.limit
      };
      ownersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.owners.data = oldData.concat(data.records) : this.owners.data = JSON.parse(JSON.stringify(data.records));
          this.ownersPage = data.pages; // 总页码
        };
        // this.
      })
    },
    loadMoreOwner () {
      if ( this.owners.start == this.ownersPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.owners.start = this.owners.start + 1;
        this.initOwnersList(true);
      }
    },
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.createEndTime = val + ' 23:59:59';
      }else{
        this.formInline.createEndTime = val
      }
    },
    getStartTime (val) { // 开始日期
      if(val){
        this.formInline.createStartTime = val + ' 00:00:00';
      }else{
        this.formInline.createStartTime = val
      }
    },
    //客户下拉框
    loadMoreCustomerList() {
      if (this.customersPageDate.start == this.customersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.customersPageDate.start = this.customersPageDate.start + 1;
        this.getCustomerList(true);
      }
    },
    //客户下拉框
    getCustomerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.customers));
      let params = {
        ownerId: this.formInline.ownerId,
        start: this.customersPageDate.start,
        limit: this.customersPageDate.limit,
        sort: 'editorDate',
        isAsc: false//升序
      }
      customerList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.customers = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.customersArrPage = data.pages; // 总页码
        };
      })
    },
    //出货通知单
    searchList () {
      let status = ''
      let deliveStatus = ''
      if(this.formInline.status.length > 0){
        status = this.formInline.status.join(",")
      }
      if(this.formInline.deliveStatus.length > 0){
        deliveStatus = this.formInline.deliveStatus.join(",")
      }
      this.searchParam = {
        deliveNoticeCode: this.formInline.deliveNoticeCode,
        deliveNoticeTypeId: this.formInline.deliveNoticeTypeId,
        ownerId: this.formInline.ownerId,
        deliveTypeId: this.formInline.deliveTypeId,
        orderCode: this.formInline.orderCode,
        orderTypeId: this.formInline.orderTypeId,
        arrivalNoticeCode: this.formInline.arrivalNoticeCode,
        customerId: this.formInline.customerId,
        routeCode: this.formInline.routeCode,
        status: status,
        deliveStatus: deliveStatus,
        createStartTime: this.formInline.createStartTime,
        createEndTime: this.formInline.createEndTime,
      }
      //通过表单数据获取表格
      this.initTable(1)
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.formInline.status = []
      this.formInline.deliveStatus = []
      this.$refs.dateComponents.resetTime()
    },
    initTable (current) { // 初始化表格
      let params ={
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getDeliveNotice(this.filteParams(params)).then(res => {
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
      this.initTable(this.dataTable.start)
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
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
        if (item.prop == 'deliveNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if(item.prop == 'receiverAddress'){
          item.showTooltip = true
          item.width = '137'
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
      this.initTable(1) // 主表格初始化
    },
    //表格高度
    tableHeight() {
      let formHeight = $("#delive-notice-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
    closeDialog(){

    },
    removeRow(){

    },
    //新增
    addList(){
      this.dialogVisible = true
    },
    //结案
    closeExportNotice(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要结案的出货通知单信息')
      }
      //若勾选的数据状态为建单、审核、已完成、取消[status]，点击按钮 出货通知单为XXX状态，不允许结案操作！
      //若勾选的数据状态为已调度[status],若出货状态在部分拣货前的状态  出货状态为XXX，不允许结案操作！
      //先判断状态再拼装id
      let flag = true
      this.getSelectedRow.forEach((item, index) => {
        if(this.getSelectedRow[index].status != 3){//状态为未完成
          if(this.getSelectedRow[index].status == 2){
            if(this.getSelectedRow[index].deliveStatus == 0 || this.getSelectedRow[index].deliveStatus == 1 || this.getSelectedRow[index].deliveStatus == 2){
              if(this.getSelectedRow[index].deliveStatus == 0){
                flag = false
                return this.$message.warning('出货状态为初始状态，不允许结案操作！')
              }else if(this.getSelectedRow[index].deliveStatus == 1){
                flag = false
                return this.$message.warning('出货状态为部分调度，不允许结案操作！')
              }else if(this.getSelectedRow[index].deliveStatus == 2){
                flag = false
                return this.$message.warning('出货状态为调度完成，不允许结案操作！')
              }
            }
          }else {
            if(this.getSelectedRow[index].status == 0){
              flag = false
              return this.$message.warning('出货通知单为建单状态，不允许结案操作！')
            }else if(this.getSelectedRow[index].status == 1){
              flag = false
              return this.$message.warning('出货通知单为审核状态，不允许结案操作！')
            }else if(this.getSelectedRow[index].status == 4){
              flag = false
              return this.$message.warning('出货通知单为已完成状态，不允许结案操作！')
            }else if(this.getSelectedRow[index].status == 5){
              flag = false
              return this.$message.warning('出货通知单为取消状态，不允许结案操作！')
            }  
          }
        }
      });
      if(flag){
        let deliveNoticeIdArr = [];
        this.getSelectedRow.forEach((item, index) => {
          deliveNoticeIdArr.push(item.deliveNoticeId);
        });
        let deliveNoticeIds = deliveNoticeIdArr.join(',');
        let params = {
          deliveNoticeId: deliveNoticeIds,
          status: 4//结案是4
        }
        closeDeliveNotice(this.filteParams(params)).then(res => {
          let data = res.data;
          if (data.status == 10001) {
            this.$message.warning(data.message)
          } else {
            this.$message.success('结案成功')
            this.initTable(1)
          }
        }) 
      }
    },
    //打印
    checkPrint() {
      let params = {}
      acceptNoteLablePrint(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
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
    deliveDetail(row){
      sessionStorage.setItem('deliveDetail',JSON.stringify(row));
      try{
        this.routeERP("WMS_DELIVE_NOTICE_DTL", '出货通知单明细页', '/iwms/#/export-warehouse/delive-notice-detail')
      }catch(e){
        this.$router.push({ path: '/export-warehouse/delive-notice-detail' })
      }
    }
  }
}
