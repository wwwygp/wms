import DatePick from '@/components/DatePicker/index'
import {loaddBtn} from '../../../../api/common/load-btn'
import tableConfigure from '@/components/table/tableConfigure.vue'
import {getProcessNote, getProcessNoteDetail } from '@/api/processing-management/inbound-process/inbound-process'
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
      //主档
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true, // 单选功能
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
        tableCode: "WMS_PROCESS_NOTE"
      },
      //主档
      sonDataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 单选功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        radio: null,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      sonTableName: {
        tableCode: "WMS_PROCESS_NOTE_DTL"
      }, // 表格ID ，就是表格自定义名称
      //主表
      formInline: {
        processNoteCode: '', // 加工单号
        ownerId: '', // 委托业主id
        status: '', // 状态
      },
      getSelectedRow: {}, // 主表用户多选框选中的数据
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
    //表格高度
    tableHeight() {
      let formHeight = $("#move-plan-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = ($(window).height() - formHeight - this.$store.state.basic.height) / 2
      this.sonDataTable.height = this.dataTable.height
    },
    initBtn () {
      let menusKey = 'WMS_MOVE_PLAN';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    initDictionary() {//初始化字典值
      dictionarysTypeNew('WMS_PROCESS_NOTE_STATUS', this, 'status')
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
        processNoteCode: this.formInline.processNoteCode, // 加工单号
        ownerId: this.formInline.ownerId, // 委托业主id
        status: this.formInline.status, // 状态
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
      this.$refs.dateEditComponents.resetTime()
    },
    initTable (current) { // 初始化表格
      this.dataTable.radio = null
      this.$refs.mainTable.setCurrentRow()
      this.getSelectedRow = {}
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getProcessNote(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
        }else{
          if(data.records.length > 0){
            data.records.forEach((item,index) => {
              item.index = index
              item.processDate = item.processDate.split(/\s+/)[0]
            })
            this.dataTable.radio = 0
            this.getSelectedRow = data.records[0]
            this.dataTable.data = JSON.parse(JSON.stringify(data.records))
            this.dataTable.start = data.current
            this.dataTable.limit = data.size
            this.dataTable.total = data.total
            this.initSonTable(1)
          }else{
            this.dataTable.data = []
            this.dataTable.start = 1
            this.dataTable.limit = 10
            this.dataTable.total = 0
            this.sonDataTable.data = []
            this.sonDataTable.start = 1
            this.sonDataTable.limit = 100
            this.sonDataTable.total = 0
          }
        }
      })
    },
    initSonTable (current) { // 初始化表格
      let params = {
        processNoteId: this.getSelectedRow.processNoteId,
        start: current,
        limit: this.sonDataTable.limit
      }
      getProcessNoteDetail(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.sonDataTable.data = []
          this.sonDataTable.start = 1
          this.sonDataTable.limit = 100
          this.sonDataTable.total = 0
        }else{
          this.sonDataTable.data = JSON.parse(JSON.stringify(data.records))
          this.sonDataTable.start = data.current
          this.sonDataTable.limit = data.size
          this.sonDataTable.total = data.total
        }
      })
    },
    handleTable(data) { // table数据处理函数
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
      this.$refs.mainTable.domShow = false;
      this.$nextTick(() => {
        this.$refs.mainTable.domShow = true;
        this.$refs.mainTable.dialogVisible = false;
      });
      this.initTable(1)
    },
    handleRadio(val) { // 用户的选择框事件
      if(val){
        this.dataTable.radio = val.row.index
        this.getSelectedRow = val.row
        this.initSonTable(1)
      }
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    handleSonTable(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.sonDataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.sonDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.sonDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      this.$refs.sonTable.domShow = false;
      this.$nextTick(() => {
        this.$refs.sonTable.domShow = true;
        this.$refs.sonTable.dialogVisible = false;
      });
    },
    handleSonMultipleSelect(val) { // 用户的选择框事件
      // this.getSelectedRow = val
    },
    handleSonSizeChange (val) { // 分页每页展示的数量
      this.sonDataTable.start = 1
      this.sonDataTable.limit = val
      this.initSonTable(this.sonDataTable.start)
    },
    handleSonCurrentChange (val) { // 分页页码
      this.sonDataTable.start = val
      this.initSonTable(this.sonDataTable.start)
    },
  }
}
