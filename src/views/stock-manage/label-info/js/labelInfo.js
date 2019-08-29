import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType, dictionarysTypeNew } from '@/api/common/type.js'
import { ownersList, getStaffsFromErp, getCustomerFromErp, getRouteFromErp } from '@/api/common/business.js'
import { searchLabelInfo } from '@/api/stock-manage/label-info/index.js'
import { stockLabelPagePrint } from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
export default {
  components: {
    DatePick,
    tableConfigure,
  },
  data() {
    return {
      formInline: {
        ownerName: '',//委托业主名称
        srcFormCode: '', //来源单号
        labelNumber: '',//标签号
        checkFormCode: '',   //复核单号
        customerName: '',   //客户名称
        originalCaseCode: '',  //原箱标签
        status: '',  //状态
        labelCode: '',//容器编码
        entityId: '',//标识
        labelTypeId: ''//容器类型
      },
      btnList: [], //按钮集合
      getSelectedRow: [], // 用户选择的数据
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
        tableCode: 'WMS_STOCK_LABEL_INFO'
      },
      searchParam: {},
      containerType: [],
      entity: [],
      btnList: []
    }
  },
  created() {
    this.initDictionaryPermit();
    this.getOwnerList(false);
    this.initBtn()
    //获取调度状态字典值
   dictionarysTypeNew('container_type', this, 'containerType')
   dictionarysTypeNew('entityId', this, 'entity')
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
    initBtn() {
      let menusKey = 'WMS_STOCK_LABEL_TABEL';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    //委托业主下拉框
    loadMoreOwnerList() {
      debugger
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
    searchTabelList(){
      this.searchParam = {
        ownerName: this.formInline.ownerName,
        srcFormCode: this.formInline.srcFormCode,
        labelNumber: this.formInline.labelNumber,
        checkFormCode: this.formInline.checkFormCode,
        customerName: this.formInline.customerName,
        originalCaseCode: this.formInline.originalCaseCode,
        status: this.formInline.status,
        labelTypeId: this.formInline.labelTypeId,
        entityId: this.formInline.entityId,
        labelCode: this.formInline.labelCode
      }
      this.initTabelList(1)
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
    labelDetail (row) {
      window.localStorage.setItem('detail',JSON.stringify(row));
      this.$router.push({ path: '/stock-manage/label-dtl-info' })
    },
    //获取首页列表
    initTabelList(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      searchLabelInfo(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        let data = res.data
        if (data.status == 10001) {
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
        }
      })
    },
    //表格高度
    tableHeight() {
      let formHeight = $('.lable-info').height()
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
        if (item.prop == 'labelCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
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
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
    },
    //打印
    lablePrinter(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的标签信息');
      }
      let labelTypeId = this.getSelectedRow[0].labelTypeId
      let entityId = this.getSelectedRow[0].entityId
      let flag = true
      for (var i =  0; i < this.getSelectedRow.length; i++) {
        if(this.getSelectedRow[i].labelTypeId != 0){
          return this.$message.warning('当前只支持容器类型为托盘的打印')
        }
        if(this.getSelectedRow[i].labelTypeId != labelTypeId || this.getSelectedRow[i].entityId != entityId){
          return this.$message.warning('标签信息的容器类型和实体标识必须相同才能打印')
        }
      }
      let params = this.getSelectedRow
      stockLabelPagePrint(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          let template = data[0].template
          if(template.length > 0){
            let templateId = template[0].template_id
            let templateType = template[0].template_type
            this.printOk(templateId, templateType, data)
          }else{
            this.$message.warning('没有打印模板')
          }
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
  }
}
