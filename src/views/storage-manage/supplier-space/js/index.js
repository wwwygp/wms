// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import { getSupplierSpace, addSupplierSpace, updateSupplierSpace, delSupplierSpace } from '@/api/storage-manage/supplier-space/index.js'
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
    return {
      oldForm: {//弹窗表单
        warehouseAreaId: '',
        channelId: '',
        ownerId: '',
        remark: '',
        spaceId: '',
        status: '0',
        storageAreaId: '',
        supplierId: '',
        predictDownAmount: '',
        predictUpAmount: '',
        usedVolume: ''
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
        ownerId: '',
        supplierId: '',
        spaceId: '',
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
        tableCode: "WMS_SUPPLIER_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        warehouseAreaId: '',
        channelId: '',
        ownerId: '',
        remark: '',
        spaceId: '',
        status: '0',
        storageAreaId: '',
        supplierId: '',
        // predictDownAmount: '',
        // predictUpAmount: '',
        // usedVolume: ''
      },
      rulesForm: {
        ownerId: [{ required: true, message: '请选择库委托业主', trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择库供应商', trigger: 'change' }],
        warehouseAreaId: [{ required: true, message: '请选择库区编码', trigger: 'change' }],
        storageAreaId: [{ required: true, message: '请选择储区编码', trigger: 'change' }],
        channelId: [{ required: true, message: '请选择通道编码', trigger: 'change' }],
        spaceId: [{ required: true, message: '请选择储位编码', trigger: 'change' }],
        status: [{required: true,message: '请选择状态', trigger: 'change'}]
      },
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      supplierArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 供应商对象集合
      supplierArrPage: 1,
      spaceArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      spaceArrPage: 1,
      spaceDialogArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      spaceDialogArrPage: 1,
      supplierDialogArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 供应商对象集合
      supplierDialogArrPage: 1, 
      ownersArrPage: 1, //
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      ownersDialogArrPage: 1, //
      ownersDialogArr: {
        data: [],
        start: 1,
        limit: 10
      },
      warehouseAreaCodeData:{
        data: [],
        start : 1,
        limit: 10
      },
      warehouseAreaCodePage: 1,//库区信息
      storageAreaCodeData: {
        data: [],
        start : 1,
        limit: 10
      },
      storageAreaCodePage: 1,//储区信息
      channelData: {
        data: [],
        start : 1,
        limit: 10
      },
      channelPage: 1,//通道信息
      warehouseAreaId: '',
      storageAreaId: '',
      channelId: '',
      status: [],
      searchParam: {},
      searchSpaceCode: '',
      searchDialogSpaceCode: ''
    }
  },
  created() {
    this.initBtn()
    this.initOwnersList()//委托业主
    this.initSupplier()//供应商‘
    // this.initSpace()
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
    selectWarehouseAreaCode(val){
      //清空级联
      this.storageAreaCodeData.data = []
      this.channelData.data = []
      this.spaceDialogArr.data =[]
      this.form.storageAreaId = ''
      this.form.channelId = ''
      this.form.spaceId = ''
      //获取下一级数据
      // let key = this.warehouseAreaCodeData.data.findIndex(item => item.warehouseAreaCode == val)
      // if(key == -1){
      //   return false
      // }else{
        // let warehouseAreaId = this.warehouseAreaCodeData.data[key].warehouseAreaId
        this.warehouseAreaId = val
        this.storageAreaId = val
        this.channelId = val
        this.spaceId = val
        this.searchDialogSpaceCode = ''
        if(this.warehouseAreaId){
          this.getStorageArea(this.warehouseAreaId)
        }
      // }
    },
    loadMoreWarehouseArea(){
      if (this.warehouseAreaCodeData.start == this.warehouseAreaCodePage) { // 页码相同就不用累加了
        // this.$message.warning('没有更多数据了')
      } else {
        this.warehouseAreaCodeData.start = this.warehouseAreaCodeData.start + 1
        let accumulation = true
        this.getWarehouseArea(accumulation)
      }
    },
    getWarehouseArea(accumulation){
      let oldData = [] // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.warehouseAreaCodeData.data))
      let params = {
        start: this.warehouseAreaCodeData.start,
        limit: this.warehouseAreaCodeData.limit
      }
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      wareHouseAreaList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.records) {
          accumulation ? this.warehouseAreaCodeData.data = oldData.concat(res.data.records): this.warehouseAreaCodeData.data = JSON.parse(JSON.stringify(res.data.records))
          this.warehouseAreaCodePage = data.pages
        }
      })
    },
    selectStorageCode(val){
      //清空级联
      this.channelData.data = []
      this.spaceDialogArr.data =[]
      this.form.channelId = ''
      this.form.spaceId = ''
      //获取下一级数据
      // let key = this.storageAreaCodeData.data.findIndex(item => item.storageAreaCode == val)
      // if(key == -1){
      //   return false
      // }else{
        // let  storageAreaId= this.storageAreaCodeData.data[key].storageAreaId
        this.storageAreaId = val
        this.channelId = val
        this.spaceId = val
        this.searchDialogSpaceCode = ''
        if(this.storageAreaId){
          this.getChannel(this.storageAreaId)
        }
     //}
    },
    loadMoreStorageArea(){
      if (this.storageAreaCodeData.start == this.storageAreaCodePage) { // 页码相同就不用累加了
        // this.$message.warning('没有更多数据了')
      } else {
        this.storageAreaCodeData.start = this.storageAreaCodeData.start + 1
        let accumulation = true
        this.getStorageArea(this.warehouseAreaId, accumulation)
      }
    },
    getStorageArea(warehouseAreaId, accumulation){
      let oldData = [] // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.storageAreaCodeData.data))
      let params = {
        start: this.storageAreaCodeData.start,
        limit: this.storageAreaCodeData.limit,
        warehouseAreaId: warehouseAreaId
      }
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      selectStorageArea(this.filteParams(params)).then(res => {
        let data = res.data;
        if(data) {
          accumulation ? this.storageAreaCodeData.data = oldData.concat(res.data.records): this.storageAreaCodeData.data = JSON.parse(JSON.stringify(res.data.records))
          this.storageAreaCodePage = data.pages
        }
      })
    },
    selectChannel(val){
      this.spaceDialogArr.data =[]
      this.form.spaceId = ''
      this.channelId = val
      this.spaceId = val
      this.searchDialogSpaceCode = ''
    },
    loadMoreChannel(){
      if (this.channelData.start == this.channelPage) { // 页码相同就不用累加了
        // this.$message.warning('没有更多数据了')
      } else {
        this.channelData.start = this.channelData.start + 1
        let accumulation = true
        this.getChannel(this.storageAreaId, accumulation)
      }
    },
    getChannel(storageAreaId, accumulation){
        let oldData = [] // 存放之前的数据
        oldData = JSON.parse(JSON.stringify(this.channelData.data))
        let params = {
          start: this.channelData.start,
          limit: this.channelData.limit,
          storageAreaId: storageAreaId
        }
        // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
        selectChannel(this.filteParams(params)).then(res => {
          let data = res.data;
          if(data) {
            accumulation ? this.channelData.data = oldData.concat(res.data.records): this.channelData.data = JSON.parse(JSON.stringify(res.data.records))
            this.channelPage = data.pages
          }
        })
    },
    focusSpace(Event){
      if(Event.srcElement){
        this.searchSpaceCode = Event.srcElement.value
      }else{
        this.searchSpaceCode = Event.target.value
      }
      // this.searchSpaceCode = Event.srcElement.value
      // this.searchSpaceCode = ''
      this.spaceArr.data =[]
      this.spaceArr.start = 1
      this.initSpace()
    },
    changeSpace(val){
      let key = this.spaceArr.data.findIndex(item => item.spaceId == val)
      if(key != -1){
        this.searchSpaceCode = this.spaceArr.data[key].spaceCode
      }
    },
    clearSpace(){
      this.searchSpaceCode = ''
    },
    initSpace (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.spaceArr.data));
      let params = {
        spaceCodeMatchingType: 1,
        spaceCode: this.searchSpaceCode,
        start: this.spaceArr.start,
        limit: this.spaceArr.limit
      };
      spacePrinterList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.spaceArr.data = oldData.concat(data.records) : this.spaceArr.data = JSON.parse(JSON.stringify(data.records));
          this.spaceArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    spaceMore () {
      if ( this.spaceArr.start == this.spaceArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.spaceArr.start = this.spaceArr.start + 1;
        this.initSpace(true);
      }
    },
    searchSpace(val){
      this.searchSpaceCode = val
      this.spaceArr.data =[]
      this.spaceArr.start = 1
      this.initSpace()
    },
    initDialogSpace (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.spaceDialogArr.data))
      let params = {
        start: this.spaceDialogArr.start,
        limit: this.spaceDialogArr.limit,
        storageAreaId: this.storageAreaId,
        warehouseAreaId: this.warehouseAreaId,
        channelId: this.channelId,
        spaceCode: this.searchDialogSpaceCode,
        spaceCodeMatchingType: 1
      };
      spacePrinterList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.spaceDialogArr.data = oldData.concat(data.records) : this.spaceDialogArr.data = JSON.parse(JSON.stringify(data.records));
          this.spaceDialogArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    loadMoreDialogSpace () {
      if ( this.spaceDialogArr.start == this.spaceDialogArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.spaceDialogArr.start = this.spaceDialogArr.start + 1;
        this.initDialogSpace(true);
      }
    },
    searchDialogSpace(val){
      this.searchDialogSpaceCode = val
      this.spaceDialogArr.data =[]
      this.spaceDialogArr.start = 1
      this.initDialogSpace()
    },
    focusDialogSpace(){
      this.searchSpaceCode = ''
      this.spaceDialogArr.data =[]
      this.spaceDialogArr.start = 1
      this.initDialogSpace()
    },
    changeDialogSpace(val){
      let key = this.spaceDialogArr.data.findIndex(item => item.spaceId == val)
      if(key != -1){
        this.searchDialogSpaceCode = this.spaceDialogArr.data[key].spaceCode
      }
    },
    clearDialogSpace(){
      this.searchDialogSpaceCode = ''
    },
    initSupplier (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.supplierArr.data));
      let params = {
        start: this.supplierArr.start,
        limit: this.supplierArr.limit
      };
      suppliersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.supplierArr.data = oldData.concat(data.records) : this.supplierArr.data = JSON.parse(JSON.stringify(data.records));
          this.supplierArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    supplierMore () {
      if ( this.supplierArr.start == this.supplierArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.supplierArr.start = this.supplierArr.start + 1;
        this.initSupplier(true);
      }
    },
    initDialogSupplier (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.supplierDialogArr.data));
      let params = {
        start: this.supplierDialogArr.start,
        limit: this.supplierDialogArr.limit
      };
      suppliersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.supplierDialogArr.data = oldData.concat(data.records) : this.supplierDialogArr.data = JSON.parse(JSON.stringify(data.records));
          this.supplierDialogArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    supplierDialogMore () {
      if ( this.supplierDialogArr.start == this.supplierDialogArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.supplierDialogArr.start = this.supplierDialogArr.start + 1;
        this.initDialogSupplier(true);
      }
    },
    initOwnersList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.ownersArr.data));
      let params = {
        start: this.ownersArr.start,
        limit: this.ownersArr.limit
      };
      ownersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    ownersMore () {
      if ( this.ownersArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersArr.start = this.ownersArr.start + 1;
        this.initOwnersList(true);
      }
    },
    initOwnersDialogList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.ownersDialogArr.data));
      let params = {
        start: this.ownersDialogArr.start,
        limit: this.ownersDialogArr.limit
      };
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.ownersDialogArr.data = oldData.concat(data.records) : this.ownersDialogArr.data = JSON.parse(JSON.stringify(data.records));
          this.ownersDialogArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    ownersMoreDialog () {
      if ( this.ownersDialogArr.start == this.ownersDialogArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersDialogArr.start = this.ownersDialogArr.start + 1;
        this.initOwnersDialogList(true);
      }
    },
    closeDialog () {
      this.resetForm('form')
    },
    initDictionary(accumulation) {
      let params = {
        code: 'WMS_SUPPLIER_SPACE_STATUS_TYPE'
      }
      dictionarysType(params).then(res => {
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
        for (let item in this.form) {
          this.form[item] =''
        }
        for (let item in this.oldForm) {
          this.oldForm[item] =''
        }
        this.form.status = '0'
        this.oldForm.status = '0'
        this.form = JSON.parse(JSON.stringify(this.form))
        this.$refs[formName].resetFields()
        this.ownersDialogArr.data = []
        this.supplierDialogArr.data = []
        this.ownersDialogArr.start = 1
        this.supplierDialogArr.start = 1
        this.warehouseAreaCodeData.start = 1
        this.storageAreaCodeData.start = 1
        this.warehouseAreaCodeData.start = 1
        this.warehouseAreaCodeData.start = 1
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
    initSupplierSpace(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam);
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      console.log(params)
      getSupplierSpace(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
        }else{
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
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
        sortField: '',
        ownerId: this.mainForm.ownerId,
        supplierId: this.mainForm.supplierId,
        spaceId: this.mainForm.spaceId
      }
      this.initSupplierSpace(1)
    },
    resetList() {
      // 清空搜索框
      for (let obj in this.mainForm) {
        this.mainForm[obj] = null;
      }
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = null;
      }
    },
    addList() {
      this.isSave = false // 初始化
      this.title = '新增'
      // for (let obj in this.form) {
      //   this.form[obj] = '';
      // }
      // for (let obj in this.oldForm) {
      //   this.oldForm[obj] = '';
      // }
      // this.form.status = '0'
      // this.oldForm.status = '0'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
      this.updateDisabled = false 
      this.initDictionary()//从字典中获取配置参数
      this.getWarehouseArea()
      this.initOwnersDialogList()
      this.initDialogSupplier()
    },
    updateList () {
      this.isSave = false
      this.title = '修改'
      let len = this.getSelectedRow.length
      if ( len == 0) {
        this.$message.warning('请选择需要修改的供应商储位关系信息')
        return false
      }else if(len > 1){
        this.$message.warning('修改供应商储位关系信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true
        this.updateDisabled = true // 可编辑
        // this.ownersDialogArr.limit = 1000
        this.supplierDialogArr.limit = 1000
        this.initDictionary()//从字典中获取配置参数
        this.getWarehouseArea()
        this.initOwnersDialogList()
        this.initDialogSupplier()
        let newForm = Object.assign({},this.form,this.getSelectedRow[0])
        newForm.ownerId = String(newForm.ownerId)
        newForm.supplierId = newForm.supplierId
        newForm.warehouseAreaId = String(newForm.warehouseAreaId)
        newForm.storageAreaId = String(newForm.storageAreaId)
        newForm.channelId = String(newForm.channelId)
        newForm.spaceCode = String(newForm.spaceCode)
        newForm.predictUpAmount = newForm.predictUpAmount
        newForm.predictDownAmount = newForm.predictDownAmount
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
          // this.$message.warning('表单填写不完整')
          return false
        }
      })
    },
    updateForm() {
      let axiosApi
      this.title == '修改' ? axiosApi = updateSupplierSpace(this.form) : axiosApi = addSupplierSpace(this.form)
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.title == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功')
          this.dialogVisible = false
          this.resetList()
          this.initSupplierSpace(1)//刷新表格
          
        }
      })
    },
    delList() {
      let len = this.getSelectedRow.length
      if ( len == 0) {
        this.$message.warning('请选择需要删除的供应商储位关系信息')
        return false
      }else {
        this.delDialog.modalShow = true
      }
      
    },
    removeRow() {
      let supplierSpaceIdsArr = []
      this.getSelectedRow.forEach((item, index) => {
        supplierSpaceIdsArr.push(item.dtlId)
      })
      let supplierSpaceIds = supplierSpaceIdsArr.join(',')
      let params = {
        supplierSpaceIds: supplierSpaceIds
      }
      delSupplierSpace(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false
          this.resetList()
          this.initSupplierSpace(1)//刷新表格
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
        //设置指定列宽度
        // if(item.propName == 'remark'){
        //   item.width = 300
        //   item.sortable = false
        // }
      })
      // this.tablelist()
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
      this.initSupplierSpace(1)
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initSupplierSpace(this.dataTable.start)
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true
      this.dataTable.start = val
      this.initSupplierSpace(this.dataTable.start)
    },
    //取消确认弹窗
    cancel(formName){
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.isSave = false
      this.isSave = false
      this.resetForm('form')
    },
  }
}
