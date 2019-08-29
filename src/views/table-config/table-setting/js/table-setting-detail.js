// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getTableDtlPage,insertTableDtl,updateTableDtl,getFormType,delFieldBatch} from '@/api/table-config/table-setting/index';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
import baseWarehouseArea from '@/views/table-config/table-setting/quick-insert-url';//字典配置
import baseStorageArea from '@/views/table-config/table-setting/quick-insert-input';//字典修改记录
export default {
  name: 'table-setting-detail',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick,

    baseWarehouseArea,
    baseStorageArea,
  },
  data() {
    return {

      activeName: 'first',

      disable : true,
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      title: '新增',
      dicTitle:'新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的字段?'
      },
      dialogVisible: false,
      quickInsertVisible : false,
      quickInsertTitle : '快速录入',
      quickInsertForm : {

      },
      formInline: {//主页表单
        tableId :'',
        tableName: '',
        tableCode: '',
        fieldName :'',
        propName : ''
      },
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
        tableCode: "SYS_TABLE_FIELD_INFO"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      rulesForm: {
        fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'change' }],
        propName: [{ required: true, message: '绑定的字段key不能为空', trigger: 'change' }],
        isFixed: [{ required: true, message: '是否固定选项不能为空', trigger: 'change' }],
        isView: [{ required: true, message: '是否显示选项不能为空', trigger: 'change' }],
        isSearch: [{ required: true, message: '是否查询字段不能为空', trigger: 'change' }],
        // formTypeId: [{ required: true, message: '是否查询字段不能为空', trigger: 'change' }],
        // isViewSearch: [{ required: true, message: '是否查询字段不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空且只能是数字', trigger: 'change',pattern: /^[0-9]*$/}]
      },
      isFixedData : { // 是否固定数据
        data: [],
        start : 1,
        limit: 10
      },
      isViewData : { // 是否显示数据
        data: [],
        start : 1,
        limit: 10
      },

      isSearchData : { // 是否查询字段数据
        data: [],
        start : 1,
        limit: 10
      },
      formTypeData : { // 是否查询字段数据
        data: [],
        start : 1,
        limit: 10
      },
      isViewSearchData : { // 是否查询字段数据
        data: [],
        start : 1,
        limit: 10
      },

      statusPage: 1,//状态页码
      dataTypeData : { // 状态数据
        data: [],
        start : 1,
        limit: 10
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
      tableId:'',
      form : {
        tableId : '',
        fieldId : '',
        fieldName:'',
        propName : '',
        isFixed : '',
        isView : '',
        sort : '',
        remark : '',
        isSearch:'',
        formTypeId:'',
        isViewSearch:''
      },
      searchForm : {
        tableId : '',
        fieldName : '',
        propName : ''
      },
      sqlForm : {
        sql : ''
      },
      viewSqls : false,
      sqlTitle : '查看sql',
      tabId:"",
    }
  },
  created() {
    this.storeData()
    this.initBtn()
    this.initDictionary()//从字典中获取配置参数
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
    removeRow() {
      let param = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++){
        if (i == this.getSelectedRow.length - 1) {
          param = param + this.getSelectedRow[i].fieldId
        } else {
          param = param + this.getSelectedRow[i].fieldId + ","
        }
      }
      let params = {
        fieldIds : param
      }
      delFieldBatch(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message);
        } else {
          this.$message.success("删除成功")
          this.delDialog.modalShow = false;
          this.initTable(1)
        }
      })
    },
    delField(){
      if (this.getSelectedRow.length == 0){
        this.$message.warning("请选择要删除的数据")
        return;
      }
      this.delDialog.modalShow = true;
    },
    handleComfirm(){
      this.quickInsertVisible = false;
      this.initTable(1)
    },
    quickInsert(){
      if (this.dataTable.data.length > 0) {
        this.$message.warning("已存在表头数据，不能快速录入");
        return;
      }
      this.quickInsertVisible = true;
    },
    isSearchChange(){
      if (this.form.isSearch == 0){
        this.form.isViewSearch = '';
        this.form.formTypeId = '';
      }
    },
    initDictionary(accumulation) {
      let params = {
        code: 'SYS_TABLE_CONFIG_IS_FIXED'//是否固定
      }
      dictionarysType(params).then(res => {
        this.isFixedData.data = JSON.parse(JSON.stringify(res.data))
      })

      let viewParams = {
        code: 'SYS_TABLE_CONFIG_IS_VIEW'//是否显示
      }
      dictionarysType(viewParams).then(res => {
        this.isViewData.data = JSON.parse(JSON.stringify(res.data))
      })

      let searchParams = {
        code: 'SYS_TABLE_FIELD_IS_SEARCH'//是否查询字段
      }
      dictionarysType(searchParams).then(res => {
        this.isSearchData.data = JSON.parse(JSON.stringify(res.data))
      })

      let viewSearchParams = {
        code: 'SYS_TABLE_FIELD_IS_VIEW_SEARCH'//是否查询字段
      }
      dictionarysType(viewSearchParams).then(res => {
        this.isViewSearchData.data = JSON.parse(JSON.stringify(res.data))
      })

      getFormType().then(res => {
        this.formTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
    },
    back () {
      this.$router.go(-1);
    },
    storeData () {
      this.formInline = JSON.parse(sessionStorage.getItem('tableSettingDetail'))
      console.log("表头id："+this.formInline.tableId)
      this.tabId=this.formInline.tableId;
      this.searchForm.tableId = this.formInline.tableId;
      this.tableId = this.formInline.tableId;
      console.log("表头id2："+this.form.tableId)
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
    updateForm() {
      let axiosApi;
      this.form.tableId = this.formInline.tableId;
      this.dicTitle == '修改' ? axiosApi = updateTableDtl(this.form) : axiosApi = insertTableDtl(this.form);
      console.log(this.form)
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.dicTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.sortString = ''
          this.initTable();
          // this.getAllBaseWareHouseArea();//获取所有库区列表
        }
      })
    },
    resetForm(formName) { // 清空表单
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.$refs[formName].resetFields();
        for (let item in this.form) {
          this.form[item] = '';
        };
        this.dialogVisible = false;
        this.viewSqls = false;
        this.quickInsertVisible = false;
      }
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
      let menusKey = 'SYS_TABLE_FIELD_PAGE';
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
    addTableField(){
      this.isSave = false; // 初始化
      this.dicTitle = '新增';
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
      this.updateDisabled= false
      let params = {
        codeName: "WMS_WAREHOUSE_AREA_CODE_KQ"
      }
    },
    updateTableField(){
      this.isSave = false;
      this.dicTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的表格字段信息');
        return false
      } else if(len > 1){
        this.$message.warning('修改表格字段信息不能大于一条');
        return false
      }else{
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.isView = String(newForm.isView);
        newForm.isFixed = String(newForm.isFixed);
        newForm.isSearch = String(newForm.isSearch);
      
        if (newForm.formTypeId != '' && newForm.formTypeId != null) {
          getFormType().then(res => {
            this.formTypeData.data = JSON.parse(JSON.stringify(res.data))
          newForm.formTypeId = String(newForm.formTypeId);
          })
        }
        if (newForm.isViewSearch != '' && newForm.isViewSearch != null){
          newForm.isViewSearch = String(newForm.isViewSearch);
        } else if (newForm.isViewSearch == 0) {
          newForm.isViewSearch = String(newForm.isViewSearch);
        }

        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
      }
    },
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.createEndTime = val + ' 23:59:59';
      }else{
        this.formInline.createEndTime = val
      }
    },
    getStartTime (val) { // 开始日期
      if(val){
        this.formInline.createStartTime = val + ' 00:00:00';
      }else{
        this.formInline.createStartTime = val
      }
    },
    //表格配置表获取
    searchList () {
      let status = ''
      this.searchParam = {
        tableId : this.tableId,
        fieldName: this.searchForm.fieldName,
        propName: this.searchForm.propName
      }
      this.formInline.tableId = this.tableId;
      //通过表单数据获取表格
      this.initTable(1)
    },
    resetList () {
      for (let item in this.searchForm) {
        this.searchForm[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.$refs.dateComponents.resetTime()
      this.formInline.tableId = this.tableId;
    },
    initTable (current) { // 初始化表格
      let params ={
        start: current,
        limit: this.dataTable.limit,
        tableId : this.tableId
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getTableDtlPage(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = Number(data.total)
        }
      })
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
        if (item.prop == 'tableCode') {
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
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 100
    },
    closeDialog(){
      this.resetForm('form');
      this.sqlForm.sql = '';
      this.$refs.resetForm.resetForm();
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
    }
  }
}
