// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getTablePage,updateTable,insertTable,viewSql,getUrl,addFieldBatch} from '@/api/table-config/table-setting/index';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'table-setting',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  props:{
    tabId: {
      type: Number,
      default: ''
    },
  },
  data() {
    return {
      options: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'POST',
        label: 'POST'
      }],
      fixedOptions :[{
        value: 0,
        label: '不固定'
      },{
        value: 1,
        label: '左固定'
      },{
        value: 2,
        label: '右固定'
      }],
      viewOptions : [{
        value: 0,
        label: '显示'
      },{
        value: 1,
        label: '不显示'
      }],
      formInline: {//主页表单
        requestType: '',
        url: '',
        inputJson:'',
        inputJsonModel:''
      },
      inputJsonModel:[
        "fieldName1  字段名1  0",
        "fieldName2  字段名2  10",
        "fieldName3  字段名3  20"
      ],
      tableForm:{
        fieldName:''
      },
      data : [{},{},{},{},{},{},{},{},{},{}],
      size : 10,

      oldForm: {}, // 初始化的form数据
      heightResize: true,
      title: '新增',
      dicTitle:'新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的字典?'
      },
      dialogVisible: false,
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
        pageSizes: [10, 20, 30, 50,100],
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "SYS_TABLE_COL_CONFIG_PAGE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      rulesForm: {
        tableCode: [{ required: true, message: '必须以SYS_或WMS_或MRP_或MES_或COMMON_或PAY_或INVOICE_开头，且只包含大写字母和_', trigger: 'change',pattern: /^(SYS_|WMS_|MRP_|MES_|COMMON_|PAY_|INVOICE_)[A-Z\_]+$/ }],
        tableName: [{ required: true, message: '表格编码不能为空', trigger: 'change' }]
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
      form : {
        tableName:'',
        tableCode : '',
        remark : ''
      },
      sqlForm : {
        sql : ''
      },
      viewSqls : false,
      sqlTitle : '查看sql',

      parentArrPage: 1,
      parentArr: {
        data: [],
        start: 1,
        limit: 10
      },

    }
  },
  created() {
    // this.initBtn()
    this.inputJsons()
    // this.initTable();
    // this.formInline.inputJsonModel = '[{"fieldName":"示例字段1","propName":"testKey1","sort":0},{"fieldName":"示例字段2","propName":"testKey2","sort":10},{"fieldName":"示例字段3","propName":"testKey3","sort":20},...]';
    // this.formInline.inputJsonModel = 'fieldName1  字段名1  0 ' +
    //   'fieldName2  字段名2  10';
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
    form: {
      handler: function (newVal, oldVal) {
        for(let item in newVal) {
          if(newVal[item] != this.oldForm[item]){//比较不同的数据返回true
            this.isSave = true
            return
          }
        };
      },
      deep: true
    }
  },
  methods: {
    inputJsons () {
      for (var i = 0 ; i < this.inputJsonModel.length ; i++) {
        this.formInline.inputJsonModel = this.formInline.inputJsonModel + this.inputJsonModel[i] + '\n'
      }
      this.formInline.inputJsonModel = this.formInline.inputJsonModel + "第一个参数是表头key，第二个参数是字段名称，第三个参数是排序（必须为数值），每个值之间用一个或多个空格隔开"
    },
    addRow () {
      this.dataTable.data.push({})
    },
    quickInsertBatch(){
      if (this.formInline.inputJson == null || this.formInline.inputJson == '' || this.formInline.inputJson.length == 0) {
        this.$message.warning("请根据模板示例填写要新增的内容")
        return
      }
      var reg = /(\d+)$/
      let params = [];
      let jsonArr = this.formInline.inputJson.split("\n");
      for (var i = 0 ; i < jsonArr.length; i++) {
        var jsonArrs = jsonArr[i].trim()
        if (jsonArrs == null || jsonArrs == '' || jsonArrs.length == 0) {
          continue
        }
        if (!reg.test(jsonArrs)) {
          this.$message.warning("sort必须为数值")
          return;
        }
        let jsonArrChild = jsonArr[i].split(/\s+/)
        if (jsonArrChild.length != 3) {
          this.$message.warning("请按照示例格式填写内容")
          return;
        }
        params[i] = {
          fieldName: jsonArrChild[1],
          propName : jsonArrChild[0],
          sort : jsonArrChild[2],
          tableId : this.tabId
        }
      }
      addFieldBatch(params).then(res =>{
        if (res.data.status == 10001){
          this.$message.warning(res.data.message);
        } else {
          this.$message.success("新增成功")
          this.back();
        }
      })
    },
    back () {
      this.formInline.url = '';
      this.formInline.requestType = '';
      this.dataTable.data = this.data
      this.dataTable.start = 1
      this.dataTable.limit = this.size
      this.dataTable.total = this.size
      this.formInline.inputJson = ''
      this.$emit('handleComfirm');
    },
    resetForm () {
      this.formInline.inputJson = ''
    },
    //表格配置表获取
    searchList () {
      getUrl(this.formInline.url,this.formInline.requestType).then(res => {
        if (res.data.records.length == 0) {
          this.$message.warning("接口无数据返回");
        }
        var dataArr = res.data.records[0];
        var params = []
        var i = 0;
        for (var key in dataArr) {
          params[i] = {
            propName : key
          }
          i++;
        }
        this.dataTable.data = JSON.parse(JSON.stringify(params))
        this.dataTable.start = 1
        this.dataTable.limit = params.length
        this.dataTable.total = Number(params.length)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateForm();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      })
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
    initBtn() {
      let menusKey = 'SYS_TABLE_PAGE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    //取消确认弹窗
    cancel(formName){
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.$refs[formName].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.viewSqls = false;
      this.isSave = false;
      this.sqlForm.sql = '';
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.$refs.dateComponents.resetTime()
    },
    initTable (current) { // 初始化表格
      // var data = [{},{},{},{},{},{},{},{},{},{}]
          this.dataTable.data = JSON.parse(JSON.stringify(this.data))
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = Number(10)
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
        if (item.prop == 'propName') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'fieldName') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'sort') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'isFixed') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'isView') {
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
      let formHeight = $("#table-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = ($(window).height() - formHeight )/ 2
      // this.sqlTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 50
    },
    closeDialog(){
      this.resetForm('form');
      this.sqlForm.sql = '';
    },
    //新增
    addList(){
      this.dialogVisible = true
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
