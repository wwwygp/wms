import { loaddBtn } from '@/api/common/load-btn.js'
import tableConfigure from '@/components/table/tableConfigure.vue'
import { dictionarysType } from '@/api/common/type.js'//字典接口
import tipsDialog from '@/components/dialog/tipsDialog'
import {
  shipConfigList,
  shipConfigAdd,
  shipConfigUpdate,
  shipConfigDel
} from '@/api/basic-manage/shipment-configuration/index.js'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue'

export default {
  name: 'shipment-configuration',
  components: {
    tableConfigure,
    tipsDialog, // 弹窗
    selectScroll
  },
  data() {
    return {
      btnList: [],
      configIds: '',
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
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        tableName: {
          tableCode: 'BASE_EXPORT_COMBINE_CONFIG'
        } // 表格ID ，就是表格自定义名称
      },
      formInline: {
        takeDownTypeId: '',//下架类型
        storageAreaTypeId: '',//储区类型
        operationTypeId: '',//作业类型
        combineRangeId: '',//成单范围
        combineRuleId: '',//成单规则
        taskTypeId: ''//任务类型
      },
      addForm: {
        configId: '', //配置id
        takeDownTypeId: '',//下架类型
        storageAreaTypeId: '',//储区类型
        operationTypeId: '',//作业类型
        combineRangeId: '',//成单范围
        combineRuleId: '',//成单规则
        taskTypeId: '',//任务类型
        // warehouseId: '', //仓库
        ruleValue: '',  //规则值
        remark: '' //备注
      },
      //将需要比较的数组存起来
      oldForm: {
        configId: '', //配置id
        takeDownTypeId: '',//下架类型
        storageAreaTypeId: '',//储区类型
        operationTypeId: '',//作业类型
        combineRangeId: '',//成单范围
        combineRuleId: '',//成单规则
        taskTypeId: '',//任务类型
        ruleValue: '',  //规则值
        remark: '' //备注
      },
      takeDownTypeWay: '',
      storageAreaTypeWay: '',
      operationTypeWay: '',
      combineRangeWay: '',
      combineRuleWay: '',
      taskTypeWay: '',
      takeDownTypeName: [],
      storageAreaTypeName: [],
      mainteTitle: '',
      operationTypeName: [],
      combineRangeName: [],
      combineRuleName: [],
      taskTypeName: [],
      getSelectedRow: [], // 用户选择的数据
      heightResize: true,
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除?'
      },
      isSaveShipmentsDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      // codeArr:'',
      updateDisabled: true,//部分字段是否可编辑
      dataChange: false,//是否有数据被修改
      rulesForm: {
        takeDownTypeId: [{ required: true, message: '下架类型不能为空', trigger: 'change' }],
        storageAreaTypeId: [{ required: true, message: '储区类型不能为空', trigger: 'change' }],
        operationTypeId: [{ required: true, message: '作业类型不能为空', trigger: 'change' }],
        combineRangeId: [{ required: true, message: '成单范围不能为空', trigger: 'change' }],
        taskTypeId: [{ required: true, message: '任务类型不能为空', trigger: 'change' }],
        combineRuleId: [{ required: true, message: '成单规则不能为空', trigger: 'change' }],
        ruleValue: [
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
      },
      searchParam: {}
    }
  },
  created() {
    this.initBtn()
    this.initTakeDownType()
    this.initStorageAreaType()
    this.initOperationTypeId()
    this.initCombineRangeId()
    this.initCombineRuleId()
    this.initTaskType()
  },
  mounted() {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  computed: {},
  watch: {
    addForm: {
      handler: function (newVal, oldVal) {
        for(let item in newVal) {
          if(newVal[item] != this.oldForm[item]){//比较不同的数据返回true
            this.dataChange = true
            return
          }
        };
      },
      deep: true
    }
  },
  methods: {
    tableHeight() {
      let formHeight = $("#search-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
    onRowClick(val) { // 表格行点击
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_EXPORT_COMBINE_CONFIG_SHOW_LIST'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    searchList(){
      this.searchParam = {
        takeDownTypeId: this.formInline.takeDownTypeId,
        storageAreaTypeId: this.formInline.storageAreaTypeId,
        operationTypeId: this.formInline.operationTypeId,
        combineRangeId: this.formInline.combineRangeId,
        combineRuleId: this.formInline.combineRuleId,
        taskTypeId: this.formInline.taskTypeId,
      }
      this.initShipConfigList(1)
    },
    resetList() {
      this.formInline.takeDownTypeId = ''
      this.formInline.storageAreaTypeId = ''
      this.formInline.operationTypeId = ''
      this.formInline.combineRangeId = ''
      this.formInline.combineRuleId = ''
      this.formInline.taskTypeId = ''
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    resetForm() { // 清空表单
      if(this.dataChange){
        this.isSaveShipmentsDialog.modalShow = true
      }else{
        this.confirmCancel()
      }

    },
    //取消确认弹窗-确认退出
    //点击弹窗的X/取消
    cancelExit() {
      this.delDialog.modalShow = false
    },
    // searchList () {
    //
    // },
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g
      const reg2 = /\(([^)]+)\)/
      if (reg2.test(item.methodName)) {
        let methodName = item.methodName.match(reg1)
        console.log(methodName)
        let args = item.methodName.match(reg2)
        console.log(args[1])
        this[methodName[0]].apply(this, args[1].split(','))
      } else {
        this[item.methodName].apply(this)
      }
    },
    //表格
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
        width: '100%',
        className: ''
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
      this.initShipConfigList(1);
    },
    // 分页页码
    handleCurrentChange(val) {
      this.dataTable.start = val
      this.initShipConfigList(this.dataTable.start)
    },
    // 分页每页展示的数量
    handleSizeChange(val) {
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initShipConfigList(this.dataTable.start)
    },
    handleClose(){
      this.resetForm()
    },
    //下拉框字典
    //下架类型
    initTakeDownType() {
      let params = {
        code: 'WMS_TAKE_DOWN_TYPE_ID_TDTID'
      }
      dictionarysType(params).then(res => {
        this.takeDownTypeWay = JSON.parse(JSON.stringify(res.data))
        this.takeDownTypeWay.forEach((item, index) => {
          this.takeDownTypeName.push(item.dictDtlName)
        })
      })
    },
    //储区类型
    initStorageAreaType() {
      let params = {
        code: 'storage_area_type_id'
      }
      dictionarysType(params).then(res => {
        this.storageAreaTypeWay = JSON.parse(JSON.stringify(res.data))
        this.storageAreaTypeWay.forEach((item, index) => {
          this.storageAreaTypeName.push(item.dictDtlName)
        })
      })
    },
    //作业类型
    initOperationTypeId() {
      let params = {
        code: 'WMS_OPERATION_TYPE_ID_OTID'
      }
      dictionarysType(params).then(res => {
        this.operationTypeWay = JSON.parse(JSON.stringify(res.data))
        this.operationTypeWay.forEach((item, index) => {
          this.operationTypeName.push(item.dictDtlName)
        })
      })
    },
    //成单范围
    initCombineRangeId() {
      let params = {
        code: 'WMS_COMBINE_RANGE_ID_CRANGEID'
      }
      dictionarysType(params).then(res => {
        this.combineRangeWay = JSON.parse(JSON.stringify(res.data))
        this.combineRangeWay.forEach((item, index) => {
          this.combineRangeName.push(item.dictDtlName)
        })
      })
    },
    //成单规则
    initCombineRuleId() {
      let params = {
        code: 'WMS_COMBINE_RULE_ID_CRULEID'
      }
      dictionarysType(params).then(res => {
        this.combineRuleWay = JSON.parse(JSON.stringify(res.data))
        this.combineRuleWay.forEach((item, index) => {
          this.combineRuleName.push(item.dictDtlName)
        })
      })
    },
    //任务类型
    initTaskType() {
      let params = {
        code: 'WMS_TASK_TYPE_ID_TTID'
      }
      dictionarysType(params).then(res => {
        this.taskTypeWay = JSON.parse(JSON.stringify(res.data))
        this.taskTypeWay.forEach((item, index) => {
          this.taskTypeName.push(item.dictDtlName)
        })
      })
    },
    // initDictionarylinename(){
    //   getlinename_sec().then(res => {
    //     this.mainteName=JSON.parse(JSON.stringify(res.data))
    //   })
    // },
    initShipConfigList(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      shipConfigList(this.filteParams(params)).then(res => {
        let re = res.data
        this.dataTable.data = JSON.parse(JSON.stringify(re.records))
        this.dataTable.start = re.current
        this.dataTable.limit = re.size
        this.dataTable.total = re.total
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((rulesForm) => {
        if (rulesForm) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addList() {
      this.dataChange = false
      this.mainteTitle = '新增'
      this.dialogVisible = true
      this.updateDisabled = false
      // for (let obj in this.addForm) {
      //   this.addForm[obj] = ''
      //   console.log(this.addForm[obj])
      // }
      this.addForm ={
        configId: '', //配置id
          takeDownTypeId: '',//下架类型
          storageAreaTypeId: '',//储区类型
          operationTypeId: '',//作业类型
          combineRangeId: '',//成单范围
          combineRuleId: '',//成单规则
          taskTypeId: '',//任务类型
          // warehouseId: '', //仓库
          ruleValue: '',  //规则值
          remark: '' //备注
      }
      if(this.$refs.addForm){
        this.$refs.addForm.resetFields()
      }
    },
    updateList() {
      this.dataChange = false
      this.mainteTitle = '修改'
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择一行要修改的数据')
      }else if (len > 1) {
        this.$message.warning('修改出货成单配置信息不能大于一条')
      }
      else {
        this.dialogVisible = true
        this.updateDisabled = true // 是否可编辑
        let newForm = Object.assign({},this.addForm,this.getSelectedRow[0]);
        newForm.configId = newForm.configId
        newForm.takeDownTypeId = String(newForm.takeDownTypeId)//下架类型
        newForm.storageAreaTypeId = String(newForm.storageAreaTypeId)
        newForm.operationTypeId = String(newForm.operationTypeId)
        newForm.combineRangeId = String(newForm.combineRangeId)
        newForm.combineRuleId = String(newForm.combineRuleId)
        newForm.taskTypeId = String(newForm.taskTypeId)
        newForm.ruleValue = newForm.ruleValue
        newForm.remark = newForm.remark
        this.addForm = JSON.parse(JSON.stringify(newForm))
        this.oldForm = JSON.parse(JSON.stringify(newForm))
      }
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addForm.ruleValue == ''){
            this.addForm.ruleValue = null
          }
          if (this.mainteTitle == '修改') {
            shipConfigUpdate(this.addForm).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('修改成功')
                this.dialogVisible = false
                // this.resetForm()
                this.confirmCancel()
                this.resetList()
                this.initShipConfigList(1)
              }
            })
          } else {
            shipConfigAdd(this.addForm).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('新增成功')
                this.dialogVisible = false
                // this.resetForm()
                this.confirmCancel()
                this.resetList()
                this.initShipConfigList(1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    delList() {
      let len = this.getSelectedRow.length
      if (len < 1) {
        this.$message.warning('请选择需要删除的出货成单配置信息')
      } else {
        this.delDialog.modalShow = true
      }
    },
    //删除
    removeRow() {
      let configIdArr = []
      this.getSelectedRow.forEach((item, index) => {
        configIdArr.push(item.configId)
      })
      this.configIds = configIdArr.join(',')
      let params = {
        configIds: this.configIds
      }
      shipConfigDel(params).then(res => {
        this.$message.success('删除成功')
        this.delDialog.modalShow = false
        this.resetList()
        this.initShipConfigList(1)
      })
    },
    confirmCancel(){
      for (let obj in this.addForm) {
        this.addForm[obj] = ''
      }
      for (let obj in this.oldForm) {
        this.oldForm[obj] = ''
      }
      this.$refs['addForm'].resetFields()
      this.isSaveShipmentsDialog.modalShow = false
      this.delDialog.modalShow = false
      this.dialogVisible = false
      this.updateDisabled = true
    }

  }
}
