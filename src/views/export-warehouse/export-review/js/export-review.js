import tableConfigure from '@/components/table/tableConfigure.vue';
import{ getReview, getPrintingReviewList} from '@/api/export-warehouse/export-review/index';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysTypeNew } from '@/api/common/type.js'
import { labelPrint,labelPrintPage } from '@/api/label-print/index'; // 调用打印机
import HgpDialog from '@/components/selfDialog/selfDialog'

export default {
  name: 'review',
  components: {
    tableConfigure,
    HgpDialog
  },
  data(){
    return {
      formInline: {
        pickNoteCode: '',//下架单号
        tipMessage: '',//复核提示
      },
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_EXPORT_REVIEW_NOTE_DTL"
        },
      },
      getSelectedRow: [], // 用户选择的数据
      heightResize:true,
      btnList: [], // 按钮集合
      dialogVisible: false,
      title: '',
      dialogForm: {
        printTemplate: ''
      },
      printTemplate: [],
      labelTitleBrand: [],
      brandTitleUrl: '',
      lableType: '',
      templateType: '2',
      customerId: '',
      sourceNo: '101'
    }
  },
  created(){
    this.initBtn();
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods:{
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_REVIEW_PICKNOTE_TABEL'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    getDictionarys(){
      dictionarysTypeNew('WMS_BOX_LABEL_TITLE_BRAND', this, 'labelTitleBrand')
    },
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
    onRowClick (val) { // 表格行点击
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'printingNumber') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      //设置单选默认值
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      this.$refs.tableConfig.domShow = false;
      this.$nextTick(() => {
        this.$refs.tableConfig.domShow = true;
        this.$refs.tableConfig.dialogVisible = false;
      });
    },
    tableHeight() {
       let formHeight = $("#page-export-review").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - this.$store.state.basic.height - 50
    },
    onHandleSelectionChange(val){
      this.getSelectedRow = val;
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
    },
    handleCurrentChange (val) { // 页码选择
      this.dataTable.start = val;
    },
    //拣货单复核
    exportReview(){
      if(this.formInline.pickNoteCode == ''){
        return this.$message.warning('下架单号不能为空！');
      }
      let params = {
        pickNoteCode: this.formInline.pickNoteCode
      }
      this.formInline.tipMessage = ''
      getReview(this.filteParams(params)).then(res => {
        if(res.data.status == 10001){
          this.dataTable.data = null
          return this.formInline.tipMessage = res.data.message;
        }
        this.formInline.tipMessage = res.data.tipsMessage
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.exportReviewDtlVOs))
      })
    },
    //打印外箱标签
    printOutCaseLabel(){
      let len = this.getSelectedRow.length
      if(len <= 0){
        return this.$message.warning('请选择需要打印的标签的商品!');
      }
      if(this.brandTitleUrl==''){
        return this.$message.warning('请选择标签标题品牌!')
      }
      this.lableType = 1
      this.getLabelTitleBrand()
      this.dialogVisible = true
      this.title = '打印外箱标签'
    },
    //打印内盒标签
    printInnerBoxLabel(){
      let len = this.getSelectedRow.length
      if(len <= 0){
        return this.$message.warning('请选择需要打印的标签的商品!');
      }
      if(this.brandTitleUrl==''){
        return this.$message.warning('请选择标签标题品牌!')
      }
      this.lableType = 2
      this.getLabelTitleBrand()
      this.dialogVisible = true
      this.title = '打印内盒标签'
    },
    getLabelTitleBrand(){
      this.dialogForm.printTemplate=''
      let params = {
        LableType: this.lableType,
        TemplateType: this.templateType,
        CustomerId: this.customerId,
        SourceNo: this.sourceNo
      }
      labelPrint(this.filteParams(params)).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          this.printTemplate = data
        }
      })
    },
    closeCommodityDialog(){//点击弹窗的X
      this.cancel()
    },
    cancel(){
      this.dialogVisible = false
    },
    //打印标签
    getPrintingReview(){
     
      let reg = /^[1-9]\d*$/
      for(var i=0; i<this.getSelectedRow.length; i++){
        if(!(reg.test(this.getSelectedRow[i].printingNumber))){
          return this.$message.warning('请输入打印数量');
        }
      }
      for(var i=0; i<this.getSelectedRow.length; i++){
        this.getSelectedRow[i].brandTitleUrl = this.brandTitleUrl
      }
      getPrintingReviewList(this.getSelectedRow).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          if(data.length > 0){
            this.printLabel(data)
            this.dialogVisible=false
          }
        }
      })
    },
    printLabel(data){
      let params = {
        ID: this.dialogForm.printTemplate,
        // LabelType: ,
        // TemplateType: ,
        // CustomerId: ,
        JsonParameter: JSON.stringify(data) 
      }
      labelPrintPage(params)
    }
  },
}

