// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'//字典返回值，编码规则
import { customerList, customerEdit, customerAdd, customerDel } from '@/api/basic-data/customer/customer-api.js'
import { ownersList } from '@/api/common/business.js'
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import DatePick from '@/components/DatePicker/index'
import '../style/index.scss'

export default {
  name: 'BaseCustomer',
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
        tableCode: 'WMS_BASICDATA_CUSTOMER'
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      customerTypes: [],  //客户类型字典值
      customerStatuses: [], //客户状态字典值
      customerMarks: [],  //客户标识字典值
      exportTypes: [],  //出货方式字典值
      hasCirculationBoxs: [], //是否物流箱发货字典值
      fromErps: [], //是否ERP下发字典值
      priorityTypes: [],  //优先级类型字典值
      foreignTradeTypes: [],  //外贸标识字典值
      isFirstLoadOwner: true,
      ownersArrPage: 1,
      ownersPageDate: { // 库区编码页码数据
        start: 1,
        limit: 10,
        total: 100,
        data:[]
      },
      ownersAddArrPage: 1,
      ownersAddPageDate: { // 库区编码页码数据
        start: 1,
        limit: 10,
        total: 100,
        data:[]
      },
      customers: [],
      customersArrPage: 1,
      customersPageDate: {
        start: 1,
        limit: 10,
        total: 100
      },
      sortString: 'editorDate',
      searchForm: {
        ownerId: null,
        customerId: null,
        customerName: '',
        customerType: null,
        status: null
      },
      isEdit:false, //是否可编辑
      oldForm: {}, // 初始化的form数据
      isSave: false,//若有数据新增，未点击保存
      //确认是否保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      form: {
        customerCode: '',
        ownerId: null,
        ownerCode:'',
        ownerCustomerCode: null,
        customerName: null,
        customerShortName: null,
        customerType: null,
        customerMarkId: null,
        exportTypeId: null,
        hasCirculationBox: null,
        address: null,
        postCode: null,
        sendAddress: null,
        telephone: null,
        fax: null,
        email: null,
        concatPerson: null,
        status: null,
        receiveTimeStart: null,
        receiveTimeEnd: null,
        fromErp: null,
        priorityTypeId: null,
        customerProvince: null,
        customerCity: null,
        customerCounty: null,
        foreignTradeType: null,
        parentCustomerId: null,
        remark: null
      },
      rulesForm: {
        customerCode: [{ pattern: /^[0-9a-zA-Z\-\_]+$/, message: '请输入数字或者字母或_-', trigger: 'change' },
          { required: true, message: '请输入客户编码', trigger: 'change' }],
        ownerId: [{ required: true, message: '请选择委托业主名称', trigger: 'change' }],
        ownerCustomerCode: [{ required: true, message: '请选择委托业主客户编码', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
        customerType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
        customerMarkId: [{ required: true, message: '请选择客户标识', trigger: 'change' }],
        exportTypeId: [{ required: true, message: '请选择出货方式', trigger: 'change' }],
        hasCirculationBox: [{ required: true, message: '请选择是否物流箱发货', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        fromErp: [{ required: true, message: '请选择是否ERP下发', trigger: 'change' }],
        priorityTypeId: [{ required: true, message: '请选择优先级类型', trigger: 'change' }],
        foreignTradeType: [{ required: true, message: '请选择外贸标识', trigger: 'change' }],
        remark: [{ min: 0, max: 50, message: '长度50个字符以内', trigger: 'blur' }]
      },
      editDialog: {
        title: '',
        dialogVisible: false,
        ownerNames: []
      },
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的客户信息?'
      },
      searchParam: {}
    }
  },
  created() {
    this.initBtn();
    this.initDictionary();
    this.getOwnerList(false);
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
      const reg1 = /^\w+/g
      const reg2 = /\(([^)]+)\)/
      if (reg2.test(item.methodName)) {
        let methodName = item.methodName.match(reg1)
        let args = item.methodName.match(reg2)
        this[methodName[0]].apply(this, args[1].split(','))
      } else {
        this[item.methodName].apply(this)
      }
    },
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '60'
    },
    initBtn() {
      let menusKey = 'WMS_CUSTOMER'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    initDictionary() {
      let customerTypeParams = {
        code: 'WMS_CUSTOMER_TYPE_TTD'
      }
      dictionarysType(customerTypeParams).then(res => {
        this.customerTypes = JSON.parse(JSON.stringify(res.data))
      })
      let customerStatusParams = {
        code: 'WMS_CUSTOMER_STATUS_TTD'
      }
      dictionarysType(customerStatusParams).then(res => {
        this.customerStatuses = JSON.parse(JSON.stringify(res.data))
      })
      let customerMarksParams = {
        code: 'WMS_CUSTOMER_MARK_ID_TTD'
      }
      dictionarysType(customerMarksParams).then(res => {
        this.customerMarks = JSON.parse(JSON.stringify(res.data))
      })
      let exportTypesParams = {
        code: 'WMS_EXPORT_TYPE_ID_TTD'
      }
      dictionarysType(exportTypesParams).then(res => {
        this.exportTypes = JSON.parse(JSON.stringify(res.data))
      })
      let hasCirculationBoxsParams = {
        code: 'yes_or_no'
      }
      dictionarysType(hasCirculationBoxsParams).then(res => {
        this.hasCirculationBoxs = JSON.parse(JSON.stringify(res.data))
        this.fromErps = JSON.parse(JSON.stringify(res.data))
      })
      let priorityTypesParams = {
        code: 'WMS_PRIORITY_TYPE_TTD'
      }
      dictionarysType(priorityTypesParams).then(res => {
        this.priorityTypes = JSON.parse(JSON.stringify(res.data))
      })
      let foreignTradeTypesParams = {
        code: 'WMS_FOREIGN_TRADE_TYPE_TTD'
      }
      dictionarysType(foreignTradeTypesParams).then(res => {
        this.foreignTradeTypes = JSON.parse(JSON.stringify(res.data))
      })
      //foreignTradeTypes
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
        ownerId: this.searchForm.ownerId,
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
    initCustomers(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
        
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      customerList(params).then(res => {
        let re = res.data
        if (re.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(re.records))
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(re))
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        }
      }).catch(error => {
        console.error('加载客户数据失败')
        this.$message.error('加载客户数据失败')
      })
    },
   /* loadCustomerNames() {
      if (this.customersPageDate.start >= this.customersPageDate.total) {
       /!* this.$message.warning('没有更多数据了')*!/
      } else {
        let params = {
          ownerId: this.searchForm.ownerId,
          start: this.customersPageDate.start,
          limit: this.customersPageDate.limit,
          sort: 'editorDate',
          isAsc: false//升序
        }
        customerList(this.filteParams(params)).then(res => {
          let re = res.data
          let customerArray = this.customers
          if (re.records) {
            if (customerArray.length == 0) {
              customerArray = JSON.parse(JSON.stringify(re.records))
            } else {
              //concat行不通，很奇怪
              for (let customer of re.records) {
                customerArray.push(customer)
              }
            }
            this.customers = customerArray
            this.customersPageDate.start++
            this.customersPageDate.total = re.total
          } else {
          }
        }).catch(error => {
          console.error('加载客户数据失败')
          this.$message.error('加载客户数据失败')
        })
      }
    },*/
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
      this.initCustomers(1)
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initCustomers(this.dataTable.start)
    },
    handleCurrentChange(val) { // 页码选择
      this.dataTable.start = val
      this.initCustomers(this.dataTable.start)
    },
    //委托业主下拉框
    loadMoreOwnerList() {
      if (this.ownersPageDate.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersPageDate.start = this.ownersPageDate.start + 1;
        this.getOwnerList(true);
      }
    },
    //委托业主下拉框
    getOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownersPageDate.data));
      let params = {
        start: this.ownersPageDate.start,
        limit: this.ownersPageDate.limit,
        sort: 'ownerName',
        isAsc: false//升序
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.ownersPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
      })
    },
    //委托业主下拉框
    loadMoreAddOwnerList() {
      if (this.ownersAddPageDate.start == this.ownersAddArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersAddPageDate.start = this.ownersAddPageDate.start + 1;
        this.getAddOwnerList(true);
      }
    },
    //委托业主下拉框
    getAddOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownersAddPageDate.data));
      let params = {
        start: this.ownersAddPageDate.start,
        limit: this.ownersAddPageDate.limit,
        sort: 'ownerName',
        isAsc: false//升序
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.ownersAddPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersAddArrPage = data.pages; // 总页码
        };
      })
    },
    searchList(){
      this.searchParam = {
        ownerId: this.searchForm.ownerId,
        customerId: this.searchForm.customerId,
        customerType: this.searchForm.customerType,
        status: this.searchForm.status,
        sort: this.sortString,
        isAsc: false,//升序
      }
      this.initCustomers(1)
    },
    resetSearchForm() {
      for (let obj in this.searchForm) {
        this.searchForm[obj] = null
      }
      for (let obj in this.searchParam) {
        this.searchParam[obj] = null
      }
    },
    // 清空表单
    resetForm () {
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.editDialog.dialogVisible = false;
        for (let obj in this.form) {
          this.form[obj] = null
        }
        this.$refs['form'].resetFields();
      }
    },
    // 清空表单
    resetSaveForm () {
      this.editDialog.dialogVisible = false;
      for (let obj in this.form) {
        this.form[obj] = null
      }
      this.$refs['form'].resetFields();
    },
    //取消确认弹窗
    cancel(){
      this.editDialog.dialogVisible = false;
      this.isSaveDialog.modalShow = false
      for (let item in this.form) {
        this.form[item] = null
      }
      this.$refs['form'].resetFields();
      this.isSave = false//是否保存置为默认值
    },
    //新增
    insertCustomer(){
      this.editDialog.title = '新增';
      this.isEdit = false;
      this.isSave = false;
      this.form.ownerCustomerCode = null;
      this.form.customerCode = '';
      this.form.ownerCode = '';
      this.getAddOwnerList(false);
      this.editDialog.dialogVisible = true;
    },
    //修改
    openEditDialog() {
      if (this.getSelectedRow.length < 1) {
        this.$message.warning('请选择需要修改的客户信息')
      } else if (this.getSelectedRow.length > 1) {
        this.$message.warning('修改客户信息不能大于一条')
      } else {
        this.isSave = false;
        this.editDialog.title = '修改';
        this.isEdit = true;
        this.editDialog.dialogVisible = true
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        let timeArray = /(\d{2}:\d{2})~(\d{2}:\d{2})/.exec(this.getSelectedRow[0].receiveTimeBlock)
        if (timeArray) {
          newForm.receiveTimeStart = timeArray[1]
          newForm.receiveTimeEnd = timeArray[2]
        } else {
          newForm.receiveTimeStart = '00:00'
          newForm.receiveTimeEnd = '24:00'
        }
        newForm.customerType = String(this.getSelectedRow[0].customerType)
        newForm.status = String(this.getSelectedRow[0].status)
        newForm.customerMarkId = String(this.getSelectedRow[0].customerMarkId)
        newForm.exportTypeId = String(this.getSelectedRow[0].exportTypeId)
        newForm.hasCirculationBox = String(this.getSelectedRow[0].hasCirculationBox)
        newForm.fromErp = String(this.getSelectedRow[0].fromErp)
        newForm.priorityTypeId = String(this.getSelectedRow[0].priorityTypeId)
        newForm.foreignTradeType = String(this.getSelectedRow[0].foreignTradeType)

        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
        this.addParentCustomer(this.getSelectedRow[0].parentCustomerId)
      }
    },
    addParentCustomer(parentCustomerId) {
      if (parentCustomerId == null) {
        return
      }
      let hasThisCustomer = false
      for (let customer in this.customers) {
        if (customer.customerId == parentCustomerId) {
          hasThisCustomer = true
          break
        }
      }
      if (hasThisCustomer == false) {
        let params = {
          customerId: parentCustomerId
        }
        customerList(params).then(res => {
          let re = res.data
          let customerArray = this.customers
          if (re.records) {
            if (customerArray.length == 0) {
              customerArray = JSON.parse(JSON.stringify(re.records))
            } else {
              //concat行不通，很奇怪
              for (let customer of re.records) {
                customerArray.push(customer)
              }
            }
            this.customers = customerArray
          }
        }).catch(error => {
          console.error('加载客户数据失败')
          this.$message.error('加载客户数据失败')
        })
      }
    },
    saveCustomerBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.receiveTimeBlock = this.form.receiveTimeStart + '~' + this.form.receiveTimeEnd;
          let axiosApi;
          this.editDialog.title == '修改' ? axiosApi = customerEdit(this.form) : axiosApi = customerAdd(this.form);
          axiosApi.then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message);
            } else {
              this.editDialog.title == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
              this.editDialog.dialogVisible = false;
              this.resetSaveForm();
              this.initCustomers(1);
            }
          })
        }else{
          return false;
        }
      })
    },
    deleteCustomer() {
      if (this.getSelectedRow.length != 0) {
        this.delDialog.modalShow = true;
      } else {
        this.$message.warning('请勾选要删除的客户信息')
      }
    },
    removeRow () {
      let customerIdArr = [];
      this.getSelectedRow.forEach((item,index) => {
        customerIdArr.push(item.customerId);
      });
      let ids = customerIdArr.join(',');
      let params = {
        customerIds : ids
      }
      customerDel(params).then(res => {
        this.$message.success('删除成功')
        this.delDialog.modalShow = false;
        this.initCustomers(1);
      })
    },
    customerChange() {
      this.form.ownerCustomerCode = this.form.ownerCode + this.form.customerCode;
    },
    ownerChange() {
      let data = this.ownersAddPageDate.data;
      for(let i=0;i<data.length;i++){
        if(data[i].id == this.form.ownerId){
          this.form.ownerCode = data[i].code;
          break;
        }
      }
      this.form.ownerCustomerCode = this.form.ownerCode + this.form.customerCode;
    },
    onClearOwner() {
      this.form.ownerCode = '';
      this.form.ownerCustomerCode = this.form.customerCode;
    },
  }
}
