// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'//字典返回值，编码规则
import { commondityPropertyList } from '@/api/stock-manage/commondity-property/commondity-property-api.js'
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import DatePick from '@/components/DatePicker/index';

export default {
  name: 'commondity-property',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    return {
      heightResize: true,
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
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: 'WMS_COMMONDITY_PROPERTY'
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      selectCommodityQuality: [],
      selectCommodityType: [],
      btnList: [],
      sortString: 'editorDate',
      searchForm: {
        commodityCode: null,
        commodityBarcode: null,
        supplierCode: null,
        productBatch: null,
        productStartDate: null,
        productEndDate: null,
        expireStartDate: null,
        expireEndDate: null,
        commodityQualityId: null,
        commodityTypeId: null,
        acceptanceNoteCode: null,
        batchId: null,
      },
      hasChange: false,
      searchParam: {}
    }
  },
  created() {
    this.initCommodityQuality();
    this.initCommodityType();
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
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '100'
    },
    searchList(){
      this.searchParam ={
        commodityCode: this.searchForm.commodityCode,
        commodityBarcode: this.searchForm.commodityBarcode,
        supplierCode: this.searchForm.supplierCode,
        productBatch: this.searchForm.productBatch,
        productStartDate:this.searchForm.productStartDate,
        productEndDate: this.searchForm.productEndDate,
        expireStartDate: this.searchForm.expireStartDate,
        expireEndDate: this.searchForm.expireEndDate,
        commodityQualityId: this.searchForm.commodityQualityId,
        commodityTypeId: this.searchForm.commodityTypeId,
        acceptanceNoteCode: this.searchForm.acceptanceNoteCode,
        batchId: this.searchForm.batchId,
        sort: this.sortString,
        isAsc: false//升序
      }
      this.initTable()
    },
    initTable(val) {
      let params = {
        limit: this.dataTable.limit,
        start: val,
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      commondityPropertyList(this.filteParams(params)).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
        } else {
          for (var i = data.records.length - 1; i >= 0; i--) {
            if(data.records[i]['testReportOssurl']){
              let key = data.records[i]['testReportOssurl'].indexOf('https')
              if(key == -1){
                data.records[i]['testReportOssurl'] = data.records[i]['testReportOssurl'].slice(0, 4) + 's' + data.records[i]['testReportOssurl'].slice(4)
              }
            }
          }
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
        }
      })
    },
    onRowClick(row) {

    },
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'testReportNo') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      // this.tablelist();
      // 数据copy表头数据不用管

      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
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
      this.initTable(1)
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      // this.dataTable.loading = true;
      this.initTable(this.dataTable.start)
    },
    initCommodityQuality () { // 商品品质
      let params = {
        code: 'quality_id'
      };
      dictionarysType(params).then(res => {
        this.selectCommodityQuality = JSON.parse(JSON.stringify(res.data));
    });
    },
    initCommodityType () { // 商品类型
      let params = {
        code: 'WMS_COMMODITY_TYPE_ID_COMTYPE'
      };
      dictionarysType(params).then(res => {
        this.selectCommodityType = JSON.parse(JSON.stringify(res.data));
    });
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    resetSearchForm(){
      for(let obj in this.searchForm){
        this.searchForm[obj] = null;
      }
      for(let obj in this.searchParam){
        this.searchParam[obj] = null;
      }
      this.$refs.productDate.resetTime()
      this.$refs.expireDate.resetTime()
    },
    cancelExit () {
      this.editDialog.dialogVisible = true
    },
    getEndTime (val) { // 生产日期开始
    	if(val){
        this.searchForm.productEndDate = val + " 00:00:00";
      }else{
        this.searchForm.productEndDate = '';
      }
    },
    getStartTime (val) { // 生产日期结束
    	if(val){
        this.searchForm.productStartDate = val + " 23:59:00";
      }else{
        this.searchForm.productStartDate = '';
      }
    },
    getExpireEndTime (val) { // 到期日开始
    	if(val){
        this.searchForm.expireEndDate = val + " 00:00:00";
      }else{
        this.searchForm.expireEndDate = '';
      }
    },
    getExpireStartTime (val) { // 到期日结束
    	if(val){
        this.searchForm.expireStartDate = val + " 23:59:00";
      }else{
        this.searchForm.expireStartDate = '';
      }
    },
    downloadPDF(url){
      window.open(url)
    }
  }
}
