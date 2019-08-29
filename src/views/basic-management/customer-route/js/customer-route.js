import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import { customerList } from '@/api/basic-data/customer/customer-api.js'
import { searchRouteTable, getRouteList, getCustomerRoute, insertCustomerRoute, deleteCustomerRoute ,UpdateCustomerRoute} from '@/api/basic-manage/customer-route/index'

export default {
  name: 'customer-route',
  components: {
    DatePick,
    tableConfigure,
    tipsDialog // 弹窗
  },
  data() {
    return {
      formInline: {
        routeId: '',//线路名称
        customerId: '',//客户名称
      },
      form: {
      	dtlId: '',//关系表唯一id
        routeId: '',//线路名称
        customerId: '', //客户id
        typeId: '',//线路客户id
        sort: '',   //路顺
        distance: '',   //距离
        typeValue: '',  //类型值
        expense: '',  //费用
        tollbooths: '',  //收费站
        speedLimit: '',  //限速
        remark: '',  //备注
      },
      dialogVisible: false,
      tmpRouteTitle: '',
      warehouseCode: '',
      storageCode: '',
      channelCode: '',
      btnList: [], //按钮集合
      getSelectedRow: [], // 用户选择的数据
      getDtlSelectedRow: [], // 用户选择的数据
      routeList: [],//线路下拉框集合
      insRouteList: [],//线路下拉框集合
      selectCustomerRouteType:[],//线路客户类型
      selectCustomerRouteTypeValue:[],//类型值
      oldForm: {}, // 初始化的form数据
      isSave: false,//若有数据新增，未点击保存
      //确认是否保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的客户线路?'
      },
      customers: [],
      customersPageDate: {
        start: 1,
        limit: 10,
        total: 100
      },
      inCustomers: [],
      inCustomersPageDate: {
        start: 1,
        limit: 10,
        total: 100
      },
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        radio: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_BASE_CUSTOMER_ROUTE"
        },
      },
      dataTableDetail:{
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        start: 1,
        limit:10,
        total: 0,
        border: true,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_BASE_CUSTOMER_ROUTE_DTL"
        }
      },
      rulesForm: {
        routeId: [{ required: true, message: '线路名称不能为空', trigger: 'change' }],
        customerId: [{ required: true, message: '客户名称不能为空', trigger: 'change' }],
        typeId: [{ required: true, message: '线路客户类型不能为空', trigger: 'change' }],
        sort: [{ pattern:  /^\d{1,9}$/, message:'请输入1-999999999的整数',trigger:'change'}],
        expense: [{ pattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/, message:'最大不能超过六位整数，两位小数',trigger:'change'}],
        distance: [{ pattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/, message:'最大不能超过六位整数，两位小数',trigger:'change'}],
        speedLimit: [{ pattern:  /^\d{1,9}$/, message:'请输入1-999999999的整数',trigger:'change'}],
      },
      searchParam: {}
    }
  },
  created() {
    this.getRouteList();
    this.initBtn();
    this.initCustomerRouteType();
    this.initCustomerRouteTypeValue();
    this.loadInCustomerNames();
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
    this.tableHeight(); // 表格高度
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods: {
  	initCustomerRouteType () { //线路客户类型
      let params = {
        code: 'WMS_CUSTOMER_ROUTE_TYPE'
      };
      dictionarysType(params).then(res => {
        this.selectCustomerRouteType = JSON.parse(JSON.stringify(res.data));
    });
    },
    initCustomerRouteTypeValue () { //类型值
      let params = {
        code: 'WMS_CUSTOMER_ROUTE_TYPE_VALUE'
      };
      dictionarysType(params).then(res => {
        this.selectCustomerRouteTypeValue = JSON.parse(JSON.stringify(res.data));
    });
    },
  	 radioClick (val) {
      this.getSelectedRow = [val.row]
      this.dataTable.radio = val.row.index;
      this.initCustomerRoute()
    },
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g;
      const reg2 = /\(([^)]+)\)/;
      if(reg2.test(item.methodName)){
        let methodName = item.methodName.match(reg1);
        let args = item.methodName.match(reg2);
        this[methodName[0]].apply(this,args[1].split(','));
      }else{
        this[item.methodName].apply(this);
      }
    },
    initBtn () { // 按钮加载函数
      let menusKey = 'WMS_CUSTOMER_ROUTE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    loadCustomerNames() {
        let params = {
          customerName: this.formInline.customerName,
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
    },
    loadInCustomerNames() {
        let params = {
          customerName: this.form.customerName,
          start: this.inCustomersPageDate.start,
          limit: this.inCustomersPageDate.limit,
          sort: 'editorDate',
          isAsc: false//升序
        }
        customerList(this.filteParams(params)).then(res => {
          let re = res.data
          let customerArray = this.inCustomers
          if (re.records) {
            if (customerArray.length == 0) {
              customerArray = JSON.parse(JSON.stringify(re.records))
            } else {
              //concat行不通，很奇怪
              for (let customer of re.records) {
                customerArray.push(customer)
              }
            }
            this.inCustomers = customerArray
            this.inCustomersPageDate.start++
            this.inCustomersPageDate.total = re.total
          } else {

          }
        }).catch(error => {
          console.error('加载客户数据失败')
          this.$message.error('加载客户数据失败')
        })
    },
    //线路下拉框
    getRouteList() {
      let params = {
      }
      getRouteList(params).then(res => {
        this.routeList = JSON.parse(JSON.stringify(res.data));
        this.insRouteList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载线路数据失败')
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
    findBtn() {
      this.searchParam = {
        routeId: this.formInline.routeId
      }
      this.searchTableList(1);
    },
    //获取首页列表
    searchTableList(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      searchRouteTable(params).then(res => {
      	let data = res.data
        if (data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        if (data.records) {
        	data.records.forEach((item, index)=> {
        		item.index = index
        	})
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.getSelectedRow = [this.dataTable.data[0]]
          this.initCustomerRoute(this.formInline.customerId)
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
//        let re = this.dataTable.data;
//        let ids = [];
//        for(let i=0;i<re.length;i++){
//          ids.push(re[i].routeId);
//        }
//        this.formInline.routeIds = ids.join(',');
//        if(this.formInline.routeIds != null && this.formInline.routeIds != ''){
//          this.searchDtlTableList();
//        }
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(res.data))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = res.data.current
          this.dataTable.limit = res.data.size
          this.dataTable.total = res.data.total
          this.formInline.routeId = '';
        }
      })
    },
    initCustomerRoute (customerId) {
      let id = this.getSelectedRow[0].routeId
      let params = {
      	routeId: id,
      	customerId:customerId
      }
      getCustomerRoute(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.error(res.data.message);
        } else {
          this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    //获取首页明细列表
    searchDtlTableList() {
      let params = {
        routeId: this.formInline.routeId,
      }
      getCustomerRoute(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data))
      })
    },
    //新增
    addList(){
      this.isSave = false;
      this.dialogVisible = true;
      this.tmpRouteTitle ='新增';
      let newForm = {}
      newForm.dtlId = ""
      newForm.routeId = ""
      newForm.customerId = ""
      newForm.typeId = "0"
      newForm.sort = ""
      newForm.distance = ""
      newForm.typeValue = ""
      newForm.expense = ""
      newForm.tollbooths = ""
      newForm.speedLimit = ""
      newForm.remark = ""
      this.$nextTick(() => {
          this.$refs['form'].resetFields();
        });
      this.form = JSON.parse(JSON.stringify(newForm))
      this.oldForm = JSON.parse(JSON.stringify(newForm))
    },
    updateList() {
      this.isSave = false
      this.tmpRouteTitle = '修改'
      let len = this.getDtlSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择需要要修改的客户线路信息')
        return false
      } else if (len > 1) {
        this.$message.warning('修改客户线路信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true
        let newForm = {}
        newForm.dtlId =this.getDtlSelectedRow[0].dtlId
        newForm.routeId = this.getDtlSelectedRow[0].routeId
        newForm.customerId = this.getDtlSelectedRow[0].customerId
        newForm.typeId = String(this.getDtlSelectedRow[0].typeId)
        newForm.sort = this.getDtlSelectedRow[0].sort
        newForm.distance = this.getDtlSelectedRow[0].distance
        newForm.typeValue = String(this.getDtlSelectedRow[0].typeValue)
        newForm.expense = this.getDtlSelectedRow[0].expense
        newForm.tollbooths = this.getDtlSelectedRow[0].tollbooths
        newForm.speedLimit = this.getDtlSelectedRow[0].speedLimit
        newForm.remark = this.getDtlSelectedRow[0].remark
        this.form = JSON.parse(JSON.stringify(newForm))
        this.oldForm = JSON.parse(JSON.stringify(newForm))
      }
    },
    // 清空表单
    resetForm () {
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.dialogVisible = false;
        this.$nextTick(() => {
          this.$refs['form'].resetFields();
        });
      }
    },
    //取消确认弹窗
    cancel(formName){
      this.dialogVisible = false;
      this.isSaveDialog.modalShow = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
      this.isSave = false//是否保存置为默认值
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid){
        	if (this.tmpRouteTitle == '新增') {
            insertCustomerRoute(this.form).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
              this.$message.success('新增成功')
              this.dialogVisible = false;
              this.reseltForm();
              this.findBtn();
              }
            })
          } else {
            UpdateCustomerRoute(this.form).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('修改成功')
              this.dialogVisible = false;
              this.reseltForm();
              this.findBtn();
              }
            })
          }
        }else{
          return false;
        }
      })
    },
    deleteList() {
      if (this.getDtlSelectedRow.length != 0) {
        this.delDialog.modalShow = true;
      } else {
        this.$message.warning('请勾选要删除的客户线路')
      }
    },
    removeRow () {
      let routeIdArr = [];
      this.getDtlSelectedRow.forEach((item,index) => {
        routeIdArr.push(item.dtlId);
      });
      let ids = routeIdArr.join(',');
      let params = {
        customerRouteIds : ids
      }
      deleteCustomerRoute(params).then(res => {
        this.$message.success('删除成功')
        this.delDialog.modalShow = false;
        // this.dataTable.loading = true;
        this.findBtn();
      })
    },
    tableHeight() {
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = ($(window).height()  - this.$store.state.basic.height - 90);
      this.dataTableDetail.height = ($(window).height() - this.$store.state.basic.height - 90);
    },
    //主表格数据
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
      this.searchTableList(1);
    },
    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'nameAndAsst') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.dataTableDetail.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableDetail.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableDetail.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.dataTableConfig.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.dataTableConfig.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.dataTableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    // 表格行点击
    onRowClick(val) {},
    // 分页页码
    handleCurrentChange(val) {
      this.dataTable.start = val
      this.searchTableList(this.dataTable.start)
    },
    // 分页每页展示的数量
    handleSizeChange(val) {
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.searchTableList(this.dataTable.start)
    },
    // 用户的选择框事件
    onHandleSelectionChange(val) {},
    // 用户的选择框事件
    onHandleDtlSelectionChange(val) {
      this.getDtlSelectedRow = val;
    },
  }
}
