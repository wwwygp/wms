import tableConfigure from '@/components/table/tableConfigure.vue'
import DatePick from '@/components/DatePicker/index';
import { packageList, commodityUpdate, getPackageById, insertPackage,commodityBatchUpdate } from '@/api/basic-data/package/index.js'
import { commodityList, getCommodityByCode } from '@/api/basic-data/commodity/index.js'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue'
import tipsDialog from '@/components/dialog/tipsDialog'
import '../style/package.scss'
import moment from "moment"

export default {
  name: 'package-maintenance',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog, // 弹窗
    DatePick
  },
  data() {
    let checkCommodityCode = (rule, value, callback) => {
      if (this.packageTitle == '修改') {
        callback()
      }else{
        if(this.form.commodityCode == null){
          callback(new Error('商品编码不能为空'))
          return
        }
        let params = {
          commodityCode: this.form.commodityCode
        }
        getCommodityByCode(params).then(res => {
          let re = res.data
          if (re.commodityId != null) {
            this.getPackageByCommidityCode(re)
            callback()
          } else {
            callback(new Error('商品编码不存在'))
          }
        }).catch(error => {
          this.$message.error('检验商品编码失败')
        })
      }
    }
    return {
      list: [],
      options: [],
      states: [],
      paramsOption: {
        multiple: true,//是否多选
        disabled: false,//是否禁用
        filterable: true,//是否可搜索
        remote: true,//是否为远程搜索
        clearable: true,//单选时是否可以清空选项
        multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制
      },
      heightResize: true,
      packageTitle: '',
      dialogVisible: false,
      dialogEditDisabled: true,//部分字段是否可编辑
      conveyorPermitList: [],
      packageUnits: [],
      fromErps: [],
      editBtn: [],//修改按钮
      selectBtn: [],//查询重置按钮
      formInline: {
        commodityCode: '',
        createTimes: [],
        editTimes: [],
        createTimeStart: '',
        createTimeEnd: '',
        editTimesStart: '',
        editTimesEnd: ''
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
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: 'WMS_COMMODITY_PACKAGE_TABLE'
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      packageAmounts: [], //包装数量
      form: {
        packageId: null,
        commodityId: null,
        commodityCode: null,
        mixPackageSpecId: null,
        packageAmount: null,
        packageTypeId: null,
        packageUnitId: null,
        packageSpec: null,
        fromErp: null,
        remark: null,
        packageLength: null,
        packageWidth: null,
        packageHeight: null,
        packageWeight: null,
        conveyorPermitId: null,
        standardCaseFloorAmount: null,
        standardFloorAmount: null,
        standardPalletAmount: null
      },
      rulesForm: {
        commodityCode: [{ required: true, message: '请输入商品编码', trigger: 'change' },
          { validator: checkCommodityCode, trigger: 'blur' }],
        packageAmount: [{ required: true, message: '请选择包装数量', trigger: 'change' }],
        packageUnitId: [{ required: true, message: '请选择包装单位', trigger: 'change' }],
        packageSpec: [{ required: true, message: '请输入包装规格', trigger: 'change' }],
        packageLength: [
          { required: true, message: '长不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageWidth: [
          { required: true, message: '宽不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageHeight: [
          { required: true, message: '高不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageWeight: [
          { required: true, message: '重量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        conveyorPermitId: [{ required: true, message: '上输送线标识不能为空', trigger: 'change' }],
        standardCaseFloorAmount: [
          { required: true, message: '标准栈板量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        standardFloorAmount: [
          { required: true, message: '标准栈板量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        standardPalletAmount: [
          { required: true, message: '标准堆叠量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        remark: [{ required: false, message: '备注不能为空', trigger: 'blur' }]
      },
      rulesFormBatch: {
        packageLength: [
          { required: false, message: '长不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageWidth: [
          { required: false, message: '宽不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageHeight: [
          { required: false, message: '高不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        packageWeight: [
          { required: false, message: '重量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }
        ],
        conveyorPermitId: [{ required: false, message: '上输送线标识不能为空', trigger: 'change' }],
        standardCaseFloorAmount: [
          { required: false, message: '标准栈板量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        standardFloorAmount: [
          { required: false, message: '标准栈板量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        remark: [{ required: false, message: '备注不能为空', trigger: 'blur' }]
      },
      count: 0,
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        age: ''
      },
      accumulationData: true, // 是否需要加载更多
      oldForm: {}, // 初始化的form数据
      dataChange: false,//是否有数据被修改
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      updateDisabled: false,
      tips: '',
      searchParam: {}
    }
  },
  created() {
    this.initBtn()
    this.initDictionaryPermit()
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
    this.list = this.states.map(item => {
      return { value: item, label: item }
    })
    this.options = this.list
  },
  methods: {
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
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
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_NEW_PACKAGE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    showPackage(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      packageList(this.filteParams(params)).then(res => {
        let re = res.data
        this.dataTable.data = JSON.parse(JSON.stringify(re.records))
        this.dataTable.start = re.current
        this.dataTable.limit = re.size
        this.dataTable.total = re.total
      })
    },
    searchPackage() {
      //clearable会导致对象为null
      if(!this.formInline.createTimes){
        this.formInline.createTimes = [];
      }
      if(!this.formInline.editTimes){
        this.formInline.editTimes = [];
      }
      this.searchParam = {
        commodityCode: this.formInline.commodityCode,
        // createTimeStart: this.formInline.createTimes[0],
        // createTimeEnd : this.formInline.createTimes[1],
        // editTimeStart: this.formInline.editTimes[0],
        // editTimeEnd: this.formInline.editTimes[1],
        createTimeStart: this.formInline.createTimes[0]==null?null:moment(this.formInline.createTimes[0]).format('YYYY/MM/DD HH:mm:ss'),
        createTimeEnd : this.formInline.createTimes[1]==null?null:moment(this.formInline.createTimes[1]).format('YYYY/MM/DD HH:mm:ss'),
        editTimeStart: this.formInline.editTimes[0]==null?null:moment(this.formInline.editTimes[0]).format('YYYY/MM/DD HH:mm:ss'),
        editTimeEnd: this.formInline.editTimes[1]==null?null:moment(this.formInline.editTimes[1]).format('YYYY/MM/DD HH:mm:ss'),
      }
      this.showPackage(1)
    },
    onRowClick(row) {
    },
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
    },
    resetPackage() {
      this.formInline.commodityCode = '';
      this.formInline.createTimes = [];
      this.formInline.editTimes = [];
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
      // this.dataTable.start = 1
      // this.showPackage()
    },
    addPackage() {
      this.dataChange = false
      this.packageTitle = '新增'
      this.dialogVisible = true
      this.dialogEditDisabled = false
      this.form.fromErp = '1' //默认是ERP下发，后端也写死的
      this.updateDisabled= false
      this.$refs['form'].resetFields();
    },
    editPackage() {
      this.dataChange = false
      this.packageTitle = '修改'
      this.dialogEditDisabled = true
      this.updateDisabled= false
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择需要要修改的商品包装信息')
        return false
      } else if (len > 1) {
        this.$message.warning('修改商品包装信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true
        // let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        // newForm.packageLength = String(newForm.packageLength);
        // newForm.packageWidth = String(newForm.packageWidth);
        // newForm.packageHeight = String(newForm.packageHeight);
        // newForm.packageWeight = String(newForm.packageWeight);
        // newForm.conveyorPermitId = String(newForm.conveyorPermitId);
        // newForm.standardCaseFloorAmount = String(newForm.standardCaseFloorAmount);
        // newForm.standardFloorAmount = String(newForm.standardFloorAmount);
        // newForm.standardPilleAmount = String(newForm.standardPilleAmount);
        // newForm.remark = String(newForm.remark);
        // this.form = JSON.parse(JSON.stringify(newForm));
        // this.oldForm = JSON.parse(JSON.stringify(newForm));

        this.form.packageId = this.getSelectedRow[0].packageId
        this.form.commodityId = this.getSelectedRow[0].commodityId
        this.form.commodityCode = this.getSelectedRow[0].commodityCode
        this.form.packageAmount = this.getSelectedRow[0].packageAmount
        this.form.packageUnitId = String(this.getSelectedRow[0].packageUnitId)
        this.form.packageSpec = this.getSelectedRow[0].packageSpec
        this.form.fromErp = String(this.getSelectedRow[0].fromErp)
        this.form.remark = this.getSelectedRow[0].remark
        this.form.packageLength = this.getSelectedRow[0].packageLength
        this.form.packageWidth = this.getSelectedRow[0].packageWidth
        this.form.packageHeight = this.getSelectedRow[0].packageHeight
        this.form.packageWeight = this.getSelectedRow[0].packageWeight
        this.form.conveyorPermitId = String(this.getSelectedRow[0].conveyorPermitId)
        this.form.standardCaseFloorAmount = this.getSelectedRow[0].standardCaseFloorAmount
        this.form.standardFloorAmount = this.getSelectedRow[0].standardFloorAmount
        this.form.standardPalletAmount = this.getSelectedRow[0].standardPalletAmount

      }
    },
    batchEditPackage() {
      this.dataChange = false
      this.packageTitle = '批量修改'
      this.dialogEditDisabled = true
      this.tips ="请输入内容"
      this.rulesForm =this.rulesFormBatch
      this.form.getPackageExtendId
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择需要要批量修改的商品包装信息')
        return false
      } else if (len < 2) {
        this.$message.warning('批量修改商品包装信息不能小于两条')
        return false
      } else {
        this.dialogVisible = true
        this.updateDisabled = true
        this.$nextTick(() => {
          this.$refs['form'].resetFields();
        });

      }
    },
    updateForm(formName) {
    	this.$refs[formName].validate((valid) => {
    		if(valid) {
    			if(this.packageTitle == '修改') {
    				commodityUpdate(this.form).then(res => {
    					if(res.data.status == 10001) {
    						this.$message.warning(res.data.message)
    					} else {
    						this.$message.success('修改成功')
    						this.resetForm()
    						this.dialogVisible = false
    						this.resetPackage()
    						this.showPackage(1)
    					}
    				})
    			} else if(this.packageTitle == '批量修改') {
    				let packageExtendIdArr = [];
    				this.getSelectedRow.forEach((item, index) => {
    					packageExtendIdArr.push(item.packageId);
    				});
    				let packageExtendIds = {
    				  'packageIds' : packageExtendIdArr.join(',')
            };
    				commodityBatchUpdate(packageExtendIds, this.form).then(res => {
    					if(res.data.status == 10001) {
    						this.$message.warning(res.data.message)
    					} else {
    						this.$message.success('修改成功')
    						this.resetForm()
    						this.dialogVisible = false
    						this.resetPackage()
    						this.showPackage(1)
    					}
    				})
    			} else {
    				insertPackage(this.form).then(res => {
    					if(res.data.status == 10001) {
    						this.$message.warning(res.data.message)
    					} else {
    						this.$message.success('新增成功')
    						this.resetForm()
    						this.dialogVisible = false
    						this.resetPackage()
    						this.showPackage(1)
    					}
    				})
    			}
    			// let axiosApi
    			// this.packageTitle == '修改' ? axiosApi = commodityUpdate(this.form) : insertPackage(this.form)
    			// axiosApi.then(res => {
    			//   if (res.data.status == 10001) {
    			//     this.$message.warning(res.data.message)
    			//   } else {
    			//     this.packageTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功')
    			//     this.resetForm()
    			//     this.dialogVisible = false
    			//     this.resetPackage()
    			//   }
    			//
    			// })
    		} else {
    			return false
    		}
    	})
    },
    getPackageByCommidityCode(data) {
      this.form.commodityId = data.commodityId  //mixPackageSpecId  packageSpec
/*      this.form.packageSpec = data.packageSpec*/
      let params = {
        mixPackageSpecId: data.mixPackageSpecId
      }
      getPackageById(params).then(res => {
        this.packageAmounts = res.data
        if(res.data.length > 0){
          this.form.packageSpec = res.data[0].packageSpec
        }
        // console.log(this.packageAmounts)
      }).catch(error => {
        this.$message.error('获取包装数量失败')
      })
    },
    autoSelectPackageUnit() {
      this.dataChange = true
      for (let obj of this.packageAmounts) {
        // console.log(obj)
        if (this.form.packageAmount == obj.packageAmount) {
          this.form.packageUnitId = String(obj.packageUnitId)
          this.form.packageTypeId = obj.packageTypeId
          this.form.mixPackageSpecId = obj.mixPackageSpecId
        }
      }
    },
    // insertCommidityPackage(){
    //   let params = {
    //     packageId: this.form.packageId,
    //     commodityId: this.form.commodityId,
    //     commodityCode: this.form.commodityCode,
    //     packageType: this.form.packageType,
    //     packageAmount: this.form.packageAmount,
    //     packageUnit: this.form.packageUnit,
    //     packageSpec: this.form.packageSpec,
    //     packageLength: this.form.packageLength,
    //     packageWidth: this.form.packageWidth,
    //     packageHeight: this.form.packageHeight,
    //     packageWeight: this.form.packageWeight,
    //     standardCaseFloorAmount: this.form.standardCaseFloorAmount,
    //     standardFloorAmount: this.form.standardFloorAmount,
    //     standardPilleAmount: this.form.standardPilleAmount,
    //     conveyorPermitId: this.form.conveyorPermitId,
    //     remark: this.form.remark
    //   }
    //   return insertPackage(params)
    // },
    checkBeforeExit() {
      if (this.dataChange) {
        this.isSaveDialog.modalShow = true
      } else {
        this.dialogVisible = false
        this.resetForm()
      }
    },
    resetForm() { // 清空表单
      for (let obj in this.form) {
        this.form[obj] = null
      }
      this.packageAmounts = []
      this.$refs['form'].resetFields()
      this.dialogEditDisabled = true
      this.tips = ""
    },
    //取消确认弹窗-确认退出
    cancelExit() {
      this.isSaveDialog.modalShow = false
    },
    exitSave() {
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.resetForm()
    },
    initDictionaryPermit() {
      let params = {
        code: 'WMS_BASE_COMMODITY_PACKAGE_PERMIT'
      }
      dictionarysType(params).then(res => {
        this.conveyorPermitList = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'WMS_BASE_COMMODITY_PACKAGE_UNIT'
      }
      dictionarysType(params1).then(res => {
        this.packageUnits = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'yes_or_no'
      }
      dictionarysType(params2).then(res => {
        this.fromErps = JSON.parse(JSON.stringify(res.data))
      })
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
      this.showPackage(1)
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      // this.dataTable.loading = true;
      this.showPackage(this.dataTable.start)
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val
      this.showPackage(this.dataTable.start)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    getCreateStartTime (val) { // 开始日期
      if(val){
        this.formInline.createTimeStart = val + ' 00:00:00';
      }else{
        this.formInline.createTimeStart = val;
      }
    },
    getCreateEndTime (val) { // 结束日期
      if(val){
        this.formInline.createTimeEnd = val + ' 23:59:59';
      }else{
        this.formInline.createTimeEnd = val;

      }
    },
    getEditStartTime (val) { // 开始日期
      if(val){
        this.formInline.editTimeStart = val + ' 00:00:00';
      }else{
        this.formInline.editTimeStart = val;
      }
    },
    getEditEndTime (val) { // 结束日期
      if(val){
        this.formInline.editTimeEnd = val + ' 23:59:59';
      }else{
        this.formInline.editTimeEnd = val;

      }
    }
  }
}
