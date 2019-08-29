// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import {
  loaddBtn
} from '@/api/common/load-btn.js'
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {
  getActivity,
  upperShelfOnly,
  lowerShel
} from '@/api/activity/act-management/index';

import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import winnerListArea from '@/views/activity/act-management/winner-list'; //获奖名单
import winnerCensusArea from '@/views/activity/act-management/winner-census'; //各奖品统计
import '../style/index.scss'
export default {
  name: 'act-management',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick,
    winnerListArea,
    winnerCensusArea
  },
  data() {
    return {
      heightResize: true,
      dialogVisible: false,
      formInline: { //主页表单
        initiateType: '',
        status: '',
        activityName: '',
      },
      initiateTypes: [{
        id: '0',
        name: '内置活动'
      }, {
        id: '1',
        name: '自定义活动'
      }],
      statuses: [{
        id: '0',
        name: '未上架'
      }, {
        id: '1',
        name: '进行中'
      }, {
        id: '2',
        name: '已下架'
      }, {
        id: '3',
        name: '已结束'
      }],
      dataTable: { //tql
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        pageSizes: [10, 20, 30, 50, 100],
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
      },
      tableName: {
        tableCode: "LOTTERY_ACTIVITY_INFO"
      }, // 表格ID ，就是表格自定义名称
      activityIdList: '',
      getSelectedRow: [], // 用户选择的数据     
      searchParam: {},
      form: {
        activityId: '', //tql
      },
      customers: [{
        id: '1',
        name: '平台级活动'
      }, {
        id: '2',
        name: '商城级活动'
      }], //tql
      activeName: 'first',
    }
  },
  created() {},
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch: {

  },
  methods: {
    addActivity() {
      if (this.form.activityId == '') {
        this.$message.warning('请先选择活动名称');
        return
      } else {
        sessionStorage.setItem('activityType', JSON.stringify(this.form.activityId));
        this.$router.push({
          path: '/act-configure',
          query: {}
        })
      }
    },
    updateSumbit(row) {
      var activityId = row.activityId
      var status = row.status
      sessionStorage.setItem('activityType', JSON.stringify(row.activityTypeId));
      this.$router.push({
        path: '/act-configure',
        query: {
          activityId: activityId,
          status: status
        }
      })
    },
    UpperShelFoperation(scope) {
      let params = {
        activityId: String(scope.activityId),
        status: String(scope.status)
      }
      let axiosApi
      scope.status == 1 ? axiosApi = upperShelfOnly(params) : axiosApi = lowerShel(params)
      axiosApi.then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          scope.status == 1 ? this.$message.success('上架成功') : this.$message.success('下架成功')
          this.dialogVisible = false
          this.initTable(1) //刷新表格
        }
      })
    },

    actGoDetail(row) {
      sessionStorage.setItem('activityType', JSON.stringify(row.activityTypeId));
      this.$router.push({
        path: '/act-configure'
      })
    },
    actWinners(row) {
      this.dialogVisible = true
      this.activityIdList = String(row.activityId)
    },

    searchList() {
      this.initTable(1)
    },

    initTable(current) { // 初始化表格
      var params = {
        initiateType: this.formInline.initiateType, //活动发起类型
        activityName: this.formInline.activityName, //活动名称
        status: this.formInline.status, //
        start: current, //
        limit: this.dataTable.limit, //
      }

      getActivity(params).then(res => {
        let re = res.data
        for (var i = 0; i < re.records.length; i++) {
          if(re.records[i].status==1){
            re.records[i].upperName = '上架'
          }else{
            re.records[i].upperName = '下架'
          }
        }
        this.dataTable.data = JSON.parse(JSON.stringify(re.records))
        
        this.dataTable.start = re.current
        this.dataTable.limit = re.size
        this.dataTable.total = re.total
      })
    },
    handleCurrentChange(val) { // 分页页码
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    handleSizeChange(val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
    },
    onRowClick() { // 表格行点击
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    //tql
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'name' || item.prop == 'winnerList' || item.propName == 'operation') {
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
      let formHeight = $("#search-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },

    closeDialog() {
      this.dialogVisible = false;
    }

  }
}
