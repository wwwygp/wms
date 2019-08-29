import DatePick from '@/components/DatePicker/index';
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue';
import {arrivalNoticeList, noticeExamine, noticeFinish} from '@/api/warehousing-management/preview-notice/notice';
import selfDialog from '@/components/selfDialog/selfDialog';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import {suppliersList,ownersList} from '@/api/common/business.js'; // 供应商
import store from '@/store';
import {printerNotice} from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
export default {
  name: 'notice',
  components: {
    DatePick,
    tableConfigure,
    selfDialog
  },
  data () {
    return{
      formInline: {
        arrivalNoticeCode: '', // 预到货单号
        purchaseOrderCode: '', // 采购单号
        arrivalNoticeTypeId: '', // 预到货类型
        ownerId: '', // 委托业主ID
        supplierId: '', // 供应商ID
        status: '', // 预到单状态
        startCreateTime: '', // 起始时间
        endCreateTime: '', // 创建时间
        start: 1,
        limit: 10,
      },
      btnList: [], // 存放权限的按钮
      heightResize: true,
      dataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "WMS_WAREHOUSINGMANAGEMENT_NOTICE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户多选框选中的数据
      selectNoticeType: [], // 预到货单类型
      selectStatus: [], // 状态
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
      searchParam: {}
    }
  },
  created () {
    this.initBtn(); // 按钮初始化
    this.initSupplier(false); // 供应商 // 给false是初始化的时候不需要累加
    this.initOwnersList(false); // 委托书
  },
  mounted() {
    this.tableHeight(); // 表格高度
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
      let menusKey = 'WMS_NOTICE';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTable.start = val;
      this.initTable(val);
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      this.initTable(1);
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
        if (item.prop == 'arrivalNoticeCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        // width: '100%'
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
      this.initTable(1); // 表格初始化
    },
    tableHeight() {
      let formHeight = $("#notice-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 40;
    },
    initTable (current) { // 初始化表格
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // this.formInline.endCreateTime = this.formInline.endCreateTime + '23:59:59'
      arrivalNoticeList(this.filteParams(params)).then(res => {
        let data = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(data.records));
        this.dataTable.start = data.current;
        this.dataTable.limit = data.size;
        this.dataTable.total = data.total;
      });
    },
    initNoticeType () { // 预到货单类型
      let params = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_TYPE'
      };
      dictionarysType(params).then(res => {
          this.selectNoticeType = JSON.parse(JSON.stringify(res.data));
      });
    },
    initStatus () { // 状态
      let params = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_STATUS'
      };
      dictionarysType(params).then(res => {
        this.selectStatus = JSON.parse(JSON.stringify(res.data));
      });
    },
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.endCreateTime = val + ' 23:59:59';
      }else {
        this.formInline.endCreateTime = val
      }
    },
    getStartTime (val) { // 开始日期
        this.formInline.startCreateTime = val;
    },
    searchList(){
      let status = ''
      if(this.formInline.status.length > 0){
        status = this.formInline.status.join(",")
      }
      this.searchParam = {
        arrivalNoticeCode: this.formInline.arrivalNoticeCode, // 预到货单号
        purchaseOrderCode: this.formInline.purchaseOrderCode, // 采购单号
        arrivalNoticeTypeId: this.formInline.arrivalNoticeTypeId, // 预到货类型
        ownerId: String(this.formInline.ownerId), // 委托业主ID
        supplierId: String(this.formInline.supplierId), // 供应商ID
        status: status, // 预到单状态
        startCreateTime: this.formInline.startCreateTime, // 起始时间
        endCreateTime: this.formInline.endCreateTime, // 创建时间
      }
      this.initTable(1)
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.formInline.status = []
      this.searchParam.status = []
      this.formInline.start = 1
      this.formInline.limit = 10
      this.$refs.dateComponents.resetTime();
    },
    noticeDetail (row) {
      sessionStorage.setItem('detail',JSON.stringify(row));
      if(top && top.createTab){
        this.routeERP("WMS_DELIVE_NOTICE_DTL", '预到货通知单明细页', '/iwms/#/warehousing-management/notice-detail')
      }else{
        this.$router.push({ path: '/warehousing-management/notice-detail' })
      }
    },
    examineList () { // 审核
      if (this.getSelectedRow.length ==0) {
        this.$message.warning('请选择需要审核的预到货通知单信息')
        return false;
      }
      let idsArr = []; // 存放arrivalNoticeId的数组
      this.getSelectedRow.forEach(item => {
        idsArr.push(item.arrivalNoticeId);
      });
      let ids = idsArr.join(',');
      let params = {
        arrivalNoticeIds: ids,
        isAudit: true, // 目前只有审核通过,
      };
      noticeExamine(params).then(res => {
        let data = res.data;
          if (data.status == 10001) {
              this.$message.error(data.message);
          } else {
            this.$message.success('审核通过');
            this.initTable(1);
          }
      })
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
    resetTable () {
    },
    caseList () { // 结案
      if (this.getSelectedRow.length ==0) {
        this.$message.warning('请选择需要结案的预到货通知单信息')
        return false;
      }
      let idsArr = []; // 存放arrivalNoticeId的数组
      this.getSelectedRow.forEach(item => {
        idsArr.push(item.arrivalNoticeId);
      });
      let ids = idsArr.join(',');
      let params = {
        arrivalNoticeIds: ids,
      };
      noticeFinish(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success('结案成功');
          this.initTable(1);
        }
      })
    },
    printer() {
      if(this.getSelectedRow.length < 1){
        this.$message.warning('请选择需要打印的预到货通知单信息')
        return false;
      } else if(this.getSelectedRow.length > 1) {
        this.$message.warning('打印预到货通知单信息不能大于一条');
        return false;
      }
      let arrivalNoticeIdArr = []
      this.getSelectedRow.forEach((item, index) => {
        arrivalNoticeIdArr.push(item.arrivalNoticeId)
      });
      let arrivalNoticeIds = arrivalNoticeIdArr.join(',')
      let params = {
        arrivalNoticeIds: arrivalNoticeIds//收货单id
      }
      printerNotice(params).then(res => {
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
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params);
    }
  }
}
