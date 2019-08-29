import tableConfigure from '@/components/table/tableConfigure.vue';
import {getDeliveNoticeDtl} from '@/api/export-warehouse/delive-notice/index';
import {acceptNoteLablePrint} from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
export default {
  name: 'detail',
  components: {
    tableConfigure
  },
  data () {
    return{
      formInline: {},
      formInlineRule:{},
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
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
      tableName: {
        tableCode: "WMS_EXPORT_DELIVE_NOTICE_DTL"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择
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
      customerAddressCode: { // 客户地址码
        data: [],
        start : 1,
        limit: 10
      },
      customerAddressCodePage: 1,//客户地址码
      deliveStatusPage: 1,//出货状态页码
      disable: true
    }
  },
  created () {
    this.storeData (); // 表单初始化数据
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
    tableHeight() {
      let formHeight = $("#delive-detail-top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '40';
    },
    storeData () {
      this.formInline = JSON.parse(sessionStorage.getItem('deliveDetail'))
      // || {
      //   ownerName: '',
      //   deliveNoticeCode: '',
      //   deliveNoticeTypeName: '',
      //   orderCode: '',
      //   orderTypeName: '',
      //   emergencyId: '', 
      //   orderPriorityName: '',
      //   customerName: '',
      //   customerAddressCode: '',
      //   customerAddress: '',
      //   arrivalNoticeCode: '',
      //   deliveTime: '',
      //   addOrderCode: '',
      //   deliveTypeName: '',
      //   deliveStatusName: '',
      //   distributionTypeName: '',
      //   transportTypeName: '',
      //   contact: '',
      //   phone: '',
      //   email: '',
      //   remark: ''
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
      // this.tablelist();
      // 数据copy表头数据不用管

      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
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
      this.initTable(1); // 表格初始化数据
    },
    onRowClick () { // 表格行点击

    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTable.start = val;
      this.initTable(this.dataTable.start);
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      this.initTable(this.dataTable.start);
    },
    initTable (current) {
      let params = {
        deliveNoticeId: this.formInline.deliveNoticeId, // 预到货通知单ID
        start: current,
        limit: this.dataTable.limit
      };
      getDeliveNoticeDtl(params).then(res => {
        let data = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(data.records));
        this.dataTable.start = data.current;
        this.dataTable.limit = data.size;
        this.dataTable.total = data.total;
      })
    },
    back () {
      try{
        this.routeERP("WMS_DELIVE_NOTICE", '出货通知单', '/iwms/#/export-warehouse/delive-notice')
      }catch(e){
        this.$router.go(-1)
      }
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
  }
}
