import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import { ownersList, getStaffsFromErp, getCustomerFromErp, getRouteFromErp } from '@/api/common/business.js'
import { searchDtlLabelInfo } from '@/api/stock-manage/label-info/index.js'
export default {
  name: 'detail',
  components: {
    DatePick,
    tableConfigure,
  },
  data() {
    return {
      formInline: {
        commodityCode: '',//商品编码
        deliveNoticeId: '', //出库单号
        waveCode: '',//波次号
      },
      form: {

      },
      statusList: [],//状态下拉框集合
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
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
        tableCode: 'WMS_STOCK_LABEL_DTL_INFO'
      },
      searchParam: {}
    }
  },
  created() {
    this.storeData(); // 表单初始化数据
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
    //获取字典值
    initDictionaryPermit() {
      //获取状态字典值
      let statusParams = {
        code: 'WMS_STOCK_LABEL_STATUS_STATUSNAME'
      }
      dictionarysType(statusParams).then(res => {
        this.statusList = JSON.parse(JSON.stringify(res.data))
      })
    },
    // 表单重置
    reseltForm() {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
    },
    searchTabelList(){
      this.searchParam ={
        labelId: this.form.labelId,
        commodityCode: this.formInline.commodityCode,
        deliveNoticeId: this.formInline.deliveNoticeId,
        waveCode: this.formInline.waveCode,
      }
      this.initTabelList(1)
    },
    //获取首页列表
    initTabelList(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      searchDtlLabelInfo(this.filteParams(params)).then(res => {
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
      })
    },
    storeData () {
      console.log(123)
      this.form = JSON.parse(window.localStorage.getItem('detail'))
      this.formInline.labelId = this.form.labelId
      this.searchParam.labelId = this.form.labelId
      this.initTabelList(1)
    },
    backLabel () {
      this.$router.go(-1);
    },
    //表格高度
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height 
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
      this.initTabelList(1);
    },
    // 表格行点击
    onRowClick(val) {},
    // 分页页码
    handleCurrentChange(val) {
      this.dataTable.start = val
      this.initTabelList(this.dataTable.start)
    },
    // 分页每页展示的数量
    handleSizeChange(val) {
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTabelList(this.dataTable.start)
    },
    // 用户的选择框事件
    onHandleSelectionChange(val) {},
  }
}
