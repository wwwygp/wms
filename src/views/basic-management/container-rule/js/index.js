// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import { getContainerRule, addContainerRule, updateContainerRule, delContainerRule } from '@/api/basic-manage/container-rule/index.js'
import {suppliersList, ownersList} from '@/api/common/business.js' // 供应商
import { wareHouseAreaList } from '@/api/storage-manage/warehouse-area/warehouse-area'
import { selectStorageArea } from '@/api/storage-manage/warehouse-area/storage'
import { selectChannel } from '@/api/storage-manage/warehouse-area/channel'
import { spacePrinterList } from '@/api/storage-manage/warehouse-area/space'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import DatePick from '@/components/DatePicker/index'
import '../style/index.scss'
export default {
  name: 'create-template',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog,
    DatePick
  },
  data() {
    var checkNumber = (rule,value,callback) => {
      var value = String(value);
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
      if(value == "null"){
        callback()
      }else if(value){
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('数字或小数点后最多两位'))
        }
      }else{
        callback()
      }
    }
    var validateNumber = (rule,value,callback) => {
      var value = String(value);
      let reg = /^(-|\+)?\d+$/
      if(!value){
        callback(new Error('请输入流水码长度'))
      }else if(value > 10){
        callback(new Error('最大值为10'))
      }else if(!reg.test(value)){
        callback(new Error('请输入数字'))
      }else{
        callback()
      }
    }
    return {
      oldForm: {//弹窗表单
        containerTypeId: '',
        containerPrefix: '',
        containerDesc: '',
        containerPurposeId: '1',
        length: '',
        width: '',
        height: '',
        weightCapacity: '',
        volumeCapacity: '',
        serialNumberLength: '',
        containerAmount: 0,
        entityId: '',
        status: '0',
        remark: ''
      }, // 初始化的form数据
      heightResize: true,
      title: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      dialogVisible: false,
      mainForm: {//主页表单
        containerTypeId: ''
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
        tableCode: "WMS_BASE_CONTAINER_RULE_LIST"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        containerTypeId: '',
        containerPrefix: '',
        containerDesc: '',
        containerPurposeId: '1',
        length: '',
        width: '',
        height: '',
        weightCapacity: '',
        volumeCapacity: '',
        serialNumberLength: '',
        containerAmount: 0,
        entityId: '',
        status: '0',
        remark: ''
      },
      rulesForm: {
        containerTypeId: [{ required: true, message: '请选择容器类型', trigger: 'change' }],
        containerPrefix: [{ required: true, message: '请输入容器前缀', trigger: 'change' }],
        containerPurposeId: [{ required: true, message: '请选择容器用途', trigger: 'change' }],
        serialNumberLength: [{ required: true, validator: validateNumber, trigger: 'change' }],
        entityId: [{ required: true, message: '请选择容器标识', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        length: [{ validator: checkNumber, trigger: 'change' }],
        width: [{ validator: checkNumber, trigger: 'change' }],
        height: [{ validator: checkNumber, trigger: 'change' }],
        weightCapacity: [{ validator: checkNumber, trigger: 'change' }],
        volumeCapacity: [{ validator: checkNumber, trigger: 'change' }],
      },
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      containerType: [],
      containerDialogType: [],
      containerPurpose: [],
      entity: [],
      status: [],
      searchParam: {}
    }
  },
  created() {
    this.initBtn()
    this.initDictionary()
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
        }
      },
      deep: true
    }
  },
  methods: {
    closeDialog () {
      this.resetForm('form')
    },
    initDictionary(accumulation) {
      let params = {
        code: 'container_type'
      }
      dictionarysType(params).then(res => {
        this.containerType = JSON.parse(JSON.stringify(res.data))
      })
    },
    initDialogDictionary(accumulation) {
      let params = {
        code: 'container_type'
      }
      dictionarysType(params).then(res => {
        this.containerDialogType = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'container_purpose'
      }
      dictionarysType(params1).then(res => {
        this.containerPurpose = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'entityId'
      }
      dictionarysType(params2).then(res => {
        this.entity = JSON.parse(JSON.stringify(res.data))
      })
      let params3 = {
        code: 'container_rule_status'
      }
      dictionarysType(params3).then(res => {
        this.status = JSON.parse(JSON.stringify(res.data))
      })
    },
    tableHeight() {
      let formHeight = $("#form").height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
    resetForm(formName) { // 清空表单
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.form = {
          containerTypeId: '',
          containerPrefix: '',
          containerDesc: '',
          containerPurposeId: '1',
          length: '',
          width: '',
          height: '',
          weightCapacity: '',
          volumeCapacity: '',
          serialNumberLength: '',
          containerAmount: 0,
          entityId: '',
          status: '0',
          remark: ''
        }
        this.oldForm = {
          containerTypeId: '',
          containerPrefix: '',
          containerDesc: '',
          containerPurposeId: '1',
          length: '',
          width: '',
          height: '',
          weightCapacity: '',
          volumeCapacity: '',
          serialNumberLength: '',
          containerAmount: 0,
          entityId: '',
          status: '0',
          remark: ''
        }
        this.$refs[formName].resetFields()
        this.dialogVisible = false
      }
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
    initBtn() {
      let menusKey = 'WMS_SUPPLIER_LIST'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    initContainerRule(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      getContainerRule(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
        }
      })
    },
    onRowClick(row) {
      // console.log(row.type)
    },
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
    },
    searchList() {
      this.searchParam = {
        containerTypeId: this.mainForm.containerTypeId
      }
      this.initContainerRule(1)
    },
    resetList() {
      // 清空搜索框
      for (let obj in this.mainForm) {
        this.mainForm[obj] = '';
      }
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    addList() {
      this.isSave = false // 初始化
      this.title = '新增'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
      this.form = {
        containerTypeId: '',
        containerPrefix: '',
        containerDesc: '',
        containerPurposeId: '1',
        length: '',
        width: '',
        height: '',
        weightCapacity: '',
        volumeCapacity: '',
        serialNumberLength: '',
        containerAmount: 0,
        entityId: '',
        status: '0',
        remark: ''
      }
      this.oldForm = {
        containerTypeId: '',
        containerPrefix: '',
        containerDesc: '',
        containerPurposeId: '1',
        length: '',
        width: '',
        height: '',
        weightCapacity: '',
        volumeCapacity: '',
        serialNumberLength: '',
        containerAmount: 0,
        entityId: '',
        status: '0',
        remark: ''
      }
      this.updateDisabled = false 
      this.initDialogDictionary()//从字典中获取配置参数
    },
    updateList () {
      this.isSave = false
      this.title = '修改'
      let len = this.getSelectedRow.length
      if ( len == 0) {
        this.$message.warning('请选择需要修改的容器规则信息')
        return false
      }else if(len > 1){
        this.$message.warning('修改容器规则信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true
        this.updateDisabled = true // 不可编辑
        this.initDialogDictionary()//从字典中获取配置参数
        let newForm = Object.assign({},this.form,this.getSelectedRow[0])
        newForm.containerTypeId = String(newForm.containerTypeId)
        newForm.containerPrefix = newForm.containerPrefix
        newForm.containerDesc = newForm.containerDesc
        newForm.containerPurposeId = String(newForm.containerPurposeId)
        newForm.length = newForm.length
        newForm.width = newForm.width
        newForm.height = newForm.height
        newForm.weightCapacity = newForm.weightCapacity
        newForm.volumeCapacity = newForm.volumeCapacity
        newForm.serialNumberLength = newForm.serialNumberLength
        newForm.containerAmount = newForm.containerAmount
        newForm.entityId = String(newForm.entityId)
        newForm.status = String(newForm.status)
        newForm.remark = newForm.remark
        this.form = JSON.parse(JSON.stringify(newForm))
        this.oldForm = JSON.parse(JSON.stringify(newForm))
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateForm()
        } else {
          return false
        }
      })
    },
    updateForm() {
      let axiosApi
      this.title == '修改' ? axiosApi = updateContainerRule(this.form) : axiosApi = addContainerRule(this.form)
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.title == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功')
          this.dialogVisible = false
          this.resetList()
          this.initContainerRule(1)//刷新表格
          
        }
      })
    },
    delList() {
      let len = this.getSelectedRow.length
      if ( len == 0) {
        this.$message.warning('请选择需要删除的容器规则信息')
        return false
      }else {
        this.delDialog.modalShow = true
      }
      
    },
    removeRow() {
      let containerRuleIdsArr = []
      this.getSelectedRow.forEach((item, index) => {
        containerRuleIdsArr.push(item.containerRuleId)
      })
      let containerRuleIds = containerRuleIdsArr.join(',')
      let params = {
        containerRuleIds: containerRuleIds
      }
      delContainerRule(containerRuleIds).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false
          this.resetList()
          this.initContainerRule(1)//刷新表格
        }
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
        if(item.prop == 'remark'){
          item.width = 200
        }
        if(item.prop == 'createTime' || item.prop == 'editTime'){
          item.width = 140
        }
      })
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // this.dataTable.hasSelect = false // 是否多选
      // this.dataTable.hasExpand = false // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList))  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // this.domShow = false // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false // 表格配置弹出框隐藏
      })
      this.initContainerRule(1)
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initContainerRule(this.dataTable.start)
    },
    handleCurrentChange(val) { // 页码选择
      this.dataTable.start = val
      this.initContainerRule(this.dataTable.start)
    },
    //取消确认弹窗
    cancel(formName){
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.isSave = false
      this.resetForm('form')
    },
  }
}
