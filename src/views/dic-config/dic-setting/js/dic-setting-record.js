// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getDicRecord } from '@/api/dic-config/dic-setting/index';
import { customerList } from '@/api/basic-data/customer/customer-api.js'
import { loaddBtn } from '@/api/common/load-btn.js';
import { ownersList } from '@/api/common/business.js'; // 供应商
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'dic-setting-record',
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
        createStartTime: '',
        createEndTime: '',
      },
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
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
        tableCode: "SYS_DICT_RECORD_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
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
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {},
    }
  },
  created() {
    // this.initBtn()
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
    // initBtn() {
    //   let menusKey = 'WMS_DELIVE_NOTICE';
    //   loaddBtn(menusKey).then(res => {
    //     this.btnList = JSON.parse(JSON.stringify(res.data));
    //   })
    // },
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
    //出货通知单
    searchList () {
      this.searchParam = {
        oprateTimeStart: this.formInline.createStartTime,
        oprateTimeEnd: this.formInline.createEndTime,
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
      getDicRecord(this.filteParams(params)).then(res => {
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
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params)
    },
  }
}
