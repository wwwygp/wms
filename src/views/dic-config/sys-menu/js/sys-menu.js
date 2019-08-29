// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import { loaddBtn } from '@/api/common/load-btn.js'
import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import {listSysMenuByMenu,pageSysMenu,increasedSysMenu,modifySysMenu,sysMenuRefresh } from '@/api/dic-config/sys-menu/index';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'sys-menu',
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
      mainteTitle: '',
      dialogVisible: false,
      formInline: {//主页表单
        id: '',
        parentId: '',
        name: '',
        ismenu: '',
        sort: '',
        url: '',
        menuKey: '',
        methodName: '',
        className: '',
        requestType: '',
        systemId: '',
        parentName: '',
        parentMenuKey: '',
        interfaceType: '',
        btnCode: ''
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
      parentWay: [],
      isMenuTypeWay: '',
      interfaceTypeWay: '',
      isMenuTypeName:[],
      interfaceTypeName:[],
      editForbid: true,
      tableName: {
        tableCode: "SYS_MENU_TABEL_KEY"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      rulesForm: {
        menuKey: [{ required: true, message: '编码只能大写字母和_，且必须以WMS_，MRP_，MES_，COMMON_，PAY_开头', trigger: 'change',pattern: /^(SYS_|WMS_|MRP_|MES_|COMMON_|PAY_)[A-Z\_]+$/ }],
        name: [{ required: true, message: '接口权限名称不能为空', trigger: 'change' }],
        url: [{ required: true, message: '接口权限路径不能为空', trigger: 'change' }],
        requestType: [{ required: true, message: '请求类型不能为空', trigger: 'change' }],
        systemId: [{ required: true, message: '系统编号不能为空', trigger: 'change' }],
        interfaceType: [{ required: true, message: '接口类型不能为空', trigger: 'change' }],
        ismenu: [{ required: true, message: '接口权限类别不能为空', trigger: 'change' }],
        parentId: [{ required: false, message: '父级菜单不能为空', trigger: 'change' }],
        methodName: [{ required: false, message: '方法名称不能为空', trigger: 'change' }],
        className: [{ required: false, message: '按钮样式不能为空', trigger: 'change' }],
        sort: [{ required: false, message: '按钮排序不能为空且必须为正整数', trigger: 'change'}],
      },
      updateDisabled: true,//部分字段是否可编辑
      isSave: false,//若有数据新增，未点击保存
      dataChange: false,//是否有数据被修改
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {},
      form : {
        id: '',
        parentId: '',
        name: '',
        ismenu: '',
        sort: '',
        url: '',
        menuKey: '',
        methodName: '',
        className: '',
        requestType: '',
        systemId: '',
        parentName: '',
        parentMenuKey: '',
        interfaceType: '',
        btnCode: ''
      },
      sqlForm : {
        sql : ''
      },
      viewSqls : false,
      sqlTitle : '查看sql'

    }
  },
  created() {
    this.initBtn();
    this.initSysMenuByMenu();
    this.initIsMenu();
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
    initSysMenuByMenu() {
      listSysMenuByMenu().then(res => {
        this.parentWay = JSON.parse(JSON.stringify(res.data))
      }).catch(error=>{
        this.$message.warning('服务错误');
      });
    },
    searchList(){
      this.searchParam = {
        name: this.formInline.name,
        menuKey: this.formInline.menuKey,
        systemId: this.formInline.systemId,
      }
      this.initTable(1)
    },
    resetForm(formName) { // 清空表单
      if(this.dataChange){
        this.isSaveDialog.modalShow = true
      }else{
        this.cancel(formName);
      }
      // if(this.isSave){
      //   this.isSaveDialog.modalShow = true
      // }else{
      //   for (let item in this.form) {
      //     this.form[item] = '';
      //   };
      //   this.$refs[formName].resetFields();
      //   this.dialogVisible = false;
      // }
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
    initBtn() { // 按钮加载函数
      let menusKey = 'SYS_MENU_CONFIG_PAGE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    //新增
    increasedSysMenu() {
      this.mainteTitle = '新增'
      this.dialogVisible = true
      this.updateDisabled = false
      // for (let obj in this.addForm) {
      //   this.addForm[obj] = ''
      //   console.log(this.addForm[obj])
      // }
      this.form ={
        parentId: '',
        name: '',
        ismenu: '',
        sort: '',
        url: '',
        menuKey: '',
        methodName: '',
        className: '',
        requestType: '',
        systemId: '',
        interfaceType: '',
        btnCode: ''
      }
      // if(this.$refs.form){
      //   this.$refs.form.resetFields()
      // }
    },
    modifySysMenu() {
      // this.dataChange = false
      this.mainteTitle = '修改'
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择一行要修改的数据')
      }else if (len > 1) {
        this.$message.warning('修改数据不能大于一条')
      }
      else {
        this.dialogVisible = true
        this.updateDisabled = true // 是否可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.id = newForm.id
        newForm.parentId = newForm.parentId
        newForm.name = newForm.name
        newForm.sort = newForm.sort
        newForm.url = newForm.url
        newForm.menuKey = newForm.menuKey
        newForm.methodName = newForm.methodName
        newForm.className = newForm.className
        newForm.requestType = newForm.requestType
        newForm.systemId = newForm.systemId
        newForm.interfaceType = String(newForm.interfaceType)
        newForm.ismenu = String(newForm.ismenu)
        this.form = JSON.parse(JSON.stringify(newForm))
        // this.oldForm = JSON.parse(JSON.stringify(newForm))
      }
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.mainteTitle == '修改') {
            modifySysMenu(this.form).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('修改成功')
                this.dialogVisible = false
                // this.resetForm()
                this.initSysMenuByMenu();
                this.cancel()
                this.resetList()
                this.initTable()
              }
            })
          } else {
            increasedSysMenu(this.form).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('新增成功')
                this.dialogVisible = false
                // this.resetForm()
                this.initSysMenuByMenu();
                this.cancel()
                this.resetList()
                this.initTable()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    sqlView(){
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择要预览的数据')
      }
      // let delAndadd = [];
      let titSql = 'USE ygp_common_gateway;';
      let delAddSql = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++) {
        let delSql = 'DELETE FROM ygp_common_gateway.sys_menu WHERE menu_key = \''+this.getSelectedRow[i].menuKey+'\';';
        let addSql = 'INSERT INTO `ygp_common_gateway`.`sys_menu`(`id`, `parent_id`, `name`, `ismenu`, `sort`, `url`, `menu_key`, `method_name`, `class_name`, `request_type`, `system_id`, `btn_code`, `interface_type`) ' +
          'VALUES (\''+this.getSelectedRow[i].id+'\',\' '+this.getSelectedRow[i].parentId+'\', \''+this.getSelectedRow[i].name+'\', \''+this.getSelectedRow[i].ismenu+'\', \''+this.getSelectedRow[i].sort+'\', \''+this.getSelectedRow[i].url+'\', \''+this.getSelectedRow[i].menuKey+'\', \''+this.getSelectedRow[i].methodName+'\', \''+this.getSelectedRow[i].className+'\', \''+this.getSelectedRow[i].requestType+'\', \''+this.getSelectedRow[i].systemId+'\', \''+this.getSelectedRow[i].btnCode+'\',\''+this.getSelectedRow[i].interfaceType+'\');';
        delAddSql += delSql+'\n'+addSql+'\n';
        // delAndadd.push(delAddSql);
      }
      // for (var j = 0; j < delAndadd.length ; j++) {
      //
      // }
      this.sqlForm.sql = titSql + '\n'+delAddSql
      this.viewSqls = true;
    },
    sysMenuRefresh(){
      sysMenuRefresh(this.filteParams()).then(res => {
        let re = res.data
        if(re == "success"){
          this.$message.success('刷新成功')
        }
      })
    },
    //取消确认弹窗
    cancel(formName){
      // for (let item in this.form) {
      //   this.form[item] = '';
      // };
      // this.$refs[formName].resetFields();
      // this.isSaveDialog.modalShow = false
      // this.dialogVisible = false
      // this.isSave = false;
      for (let obj in this.form) {
        this.form[obj] = ''
      }
      // for (let obj in this.oldForm) {
      //   this.oldForm[obj] = ''
      // }
      this.$refs['form'].resetFields()
      this.isSaveDialog.modalShow = false
      // this.delDialog.modalShow = false
      this.dialogVisible = false
      this.viewSqls = false;
      this.updateDisabled = true
    },
    resetList () {
      this.formInline.id = ''
      this.formInline.parentId = ''
      this.formInline.name = ''
      this.formInline.sort = ''
      this.formInline.url = ''
      this.formInline.menuKey = ''
      this.formInline.methodName = ''
      this.formInline.className = ''
      this.formInline.requestType = ''
      this.formInline.systemId = ''
      this.formInline.interfaceType = ''
      this.formInline.ismenu = ''
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    initTable (current) { // 初始化表格
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      pageSysMenu(this.filteParams(params)).then(res => {
        let re = res.data
        this.dataTable.data = JSON.parse(JSON.stringify(re.records))
        this.dataTable.start = re.current
        this.dataTable.limit = re.size
        this.dataTable.total = re.total
      })
    },
    //
    isMenuTypeChange(){
      if(this.form.ismenu == 1){
        this.editForbid = false
        this.rulesForm.parentId[0].required = true
        this.rulesForm.methodName[0].required = true
        this.rulesForm.className[0].required = true
        this.rulesForm.sort[0].required = true
      }else{
        this.editForbid = true
        this.rulesForm.parentId[0].required = false
        this.rulesForm.methodName[0].required = false
        this.rulesForm.className[0].required = false
        this.rulesForm.sort[0].required = false
        this.$refs['form'].clearValidate()
      }
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
    //接口权限类别
    initIsMenu() {
      let params = {
        code: 'SYS_MENU_TYPE'
      }
      dictionarysType(params).then(res => {
        this.isMenuTypeWay = JSON.parse(JSON.stringify(res.data))
        this.isMenuTypeWay.forEach((item, index) => {
          this.isMenuTypeName.push(item.dictDtlName)
        })
      })
      let faceParams = {
        code: 'SYS_INTERFACE_TYPE'
      }
      dictionarysType(faceParams).then(res => {
        this.interfaceTypeWay = JSON.parse(JSON.stringify(res.data))
        this.interfaceTypeWay.forEach((item, index) => {
          this.interfaceTypeName.push(item.dictDtlName)
        })
      })
    },
    closeDialog(){
      this.resetForm('form');
    }

  }
}
