// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getDicDef,addDicDef,updateDicDef,getAllDataType,delDicDef,viewSql,getParentData } from '@/api/dic-config/dic-setting/index';
import { customerList } from '@/api/basic-data/customer/customer-api.js'
import { loaddBtn } from '@/api/common/load-btn.js';
import { ownersList } from '@/api/common/business.js'; // 供应商
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'dic-setting',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    return {
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
      formInline: {//主页表单
        dicCode: '',
        dicName: '',
        status: ''
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
        tableCode: "SYS_DICT_DEF_DICT_DEF"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      rulesForm: {
        dicCode: [{ required: true, message: '必须以SYS_或WMS_或MRP_或MES_或COMMON_或PAY_或INVOICE_开头，且只包含大写字母和_', trigger: 'change',pattern: /^(SYS_|WMS_|MRP_|MES_|COMMON_|PAY_|INVOICE_)[A-Z\_]+$/ }],
        defName: [{ required: true, message: '字典名称不能为空', trigger: 'change' }],
        dataTypeId: [{ required: true, message: '数据类型不能为空', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        sysCode: [{ required: true, message: '系统编码不能为空', trigger: 'change' }]
      },
      statusData : { // 状态数据
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
      form : {
        dictDefId:'',
        dicCode : '',
        defName : '',
        dataTypeId : '',
        parentId : '',
        status : '',
        sysCode : '',
        remark : '',
        parentDictDefName:''
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
    this.initBtn()
    this.initDictionary()//从字典中获取配置参数
    this.initParentList(false);
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

    //父字典数据下拉框输入值模糊搜索
    reloadParentData(val) {
      this.form.parentDictDefName = val;

      let localArr = this.parentArr;
      localArr.start = 0;
      this.parentArr.data = [];
      this.parentArr.start = 1;
      this.initParentList(true);
    },
    // 父字典数据下拉框
    initParentList(concatOldData) {
      let localArr = this.parentArr;
      if (!concatOldData){
        localArr.start = 1;
      }
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        // spaceCode:this.formInline.spaceCode,
        dictDefId:this.form.dictDefId,
        start: localArr.start,
        limit: localArr.limit
      };
      if (this.form.parentDictDefName != '') {
        params.dictDefName = this.form.parentDictDefName;
      }
      getParentData(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.parentArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页父字典数据下拉框
    loadMoreParentList() {
      let localArr = this.parentArr;
      if (localArr.start == this.parentArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initParentList(true);
      }
    },
    viewSql () {
      if (this.getSelectedRow.length == 0) {
        this.$message.warning("请选择要查看的数据");
        return;
      }
      let dicCodes = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++) {
        dicCodes = dicCodes + this.getSelectedRow[i].dicCode + ","
      }
      // alert(dicCodes)
      let params = {
        dicCodes:dicCodes
      }
      viewSql(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          data.forEach((item) => {
            this.sqlForm.sql += item + '\n'
            }
          )
          // alert(this.sqlForm.sql);
        }
      })

      this.viewSqls = true;
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
      this.dicTitle == '修改' ? axiosApi = updateDicDef(this.form) : axiosApi = addDicDef(this.form);
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
      let menusKey = 'SYS_DIC_DEF_CONFIG_PAGE';
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
    addDicDef(){
      this.initParentList(false);
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
    editDicDef(){
      this.initParentList(false);
      this.isSave = false;
      this.dicTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的字典信息');
        return false
      } else if(len > 1){
        this.$message.warning('修改字典信息不能大于一条');
        return false
      }else{
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.status = String(newForm.status);
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
      }
    },
    delDicDef(){
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的字典信息');
        return false
      }
      this.delDialog.modalShow = true;
    },
    removeRow(){
      let ids = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++) {
        ids = this.getSelectedRow[i].dictDefId + ",";
      }
      let params = {
        ids : ids,
      }
      delDicDef(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.$message.success('删除成功');
          this.delDialog.modalShow = false;
          this.initTable(this.dataTable.start)
        }
      })
    },
    initDictionary(accumulation) {
      let params = {
        code: 'SYS_DICT_DEF_DICT_DEF_STATUS'//字典值状态
      }
      dictionarysType(params).then(res => {
        this.statusData.data = JSON.parse(JSON.stringify(res.data))
      })
      getAllDataType().then(res => {
        this.dataTypeData.data = JSON.parse(JSON.stringify(res.data))
      })
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
    //客户下拉框
    loadMoreCustomerList() {
      if (this.customersPageDate.start == this.customersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.customersPageDate.start = this.customersPageDate.start + 1;
        this.getCustomerList(true);
      }
    },
    //客户下拉框
    getCustomerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.customers));
      let params = {
        ownerId: this.formInline.ownerId,
        start: this.customersPageDate.start,
        limit: this.customersPageDate.limit,
        sort: 'editorDate',
        isAsc: false//升序
      }
      customerList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.customers = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.customersArrPage = data.pages; // 总页码
        };
      })
    },
    //出货通知单
    searchList () {
      let status = ''
      this.searchParam = {
        code: this.formInline.dicCode,
        name: this.formInline.dicName,
        status: this.formInline.status
      }
      //通过表单数据获取表格
      this.initTable(1)
    },
    resetList () {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.formInline.status = []
      this.formInline.deliveStatus = []
      this.$refs.dateComponents.resetTime()
    },
    initTable (current) { // 初始化表格
      let params ={
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getDicDef(this.filteParams(params)).then(res => {
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
        if (item.prop == 'dicCode') {
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
      let formHeight = $("#delive-notice-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 50
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
    dicSettingDetail(row){
      sessionStorage.setItem('dicSettingDetail',JSON.stringify(row));
      try {
        this.routeERP("SYS_DICT_DTL_DICT_DTL", '字典明细页面', '/iwms/#/dic-config/dic-setting-detail') //其他环境跳转公用方法
      } catch (e) {
        this.$router.push({
          path: '/dic-config/dic-setting-detail',
          query: {}
        })
      }

      // this.$router.push({ path: '/dic-config/dic-setting-detail' })
    }
  }
}
