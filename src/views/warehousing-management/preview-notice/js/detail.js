import tableConfigure from '@/components/table/tableConfigure.vue';
import {noticeDetailList} from '@/api/warehousing-management/preview-notice/detail';
export default {
  name: 'detail',
  components: {
    tableConfigure
  },
  data () {
    return{
      formInline: {

      },
      heightResize: true,
      dataTable: {
        tr: [
        ], // 表头数据
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
        tableCode: "WMS_NOTICE_DETAIL_TABLE"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [] // 用户选择
    }
  },
  created () {
    this.storeData (); // 表单初始化数据
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
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '60';
    },
    storeData () {
      this.formInline = JSON.parse(sessionStorage.getItem('detail'))
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
        arrivalNoticeId: this.formInline.arrivalNoticeId, // 预到货通知单ID
        start: current,
        limit: this.dataTable.limit
      };
      noticeDetailList(params).then(res => {
        let data = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(data.records));
        this.dataTable.start = data.current;
        this.dataTable.limit = data.size;
        this.dataTable.total = data.total;
      })
    },
    back () {
      if(top && top.createTab){
        this.routeERP("WMS_NOTICE", '预到货通知单', '/iwms/#/warehousing-management/preview-notice')
      }else{
        this.$router.push({ path: '/warehousing-management/preview-notice' })
      }
    }
  }
}
