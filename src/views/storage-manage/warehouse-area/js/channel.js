// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { allBaseWareHouseArea } from '@/api/storage-manage/warehouse-area/warehouse-area';
import { allStorageArea, storageListById} from '@/api/storage-manage/warehouse-area/storage';
import { channelList, channelAdd, channelUpdate, channelDel,allChannel, spaceAdd } from '@/api/storage-manage/warehouse-area/channel';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType, codeCharCount } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'BaseChannel',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    let params = {
      codeName: "WMS_CHANNEL_CODE_TD"
    }
    let count = ''
    let validateChannelCode = (rule, value, callback) =>{
        codeCharCount(params).then(res => {
          count = JSON.parse(JSON.stringify(res.data.codeSize))
          let reg = /^[0-9]*$/
          if(value == ''){
            //不做处理
            callback()
          }else if(!value.match(reg) || (value.length < Number(count))){
            callback(new Error('请输入'+ count + '位数字'));
          }
          callback()
        })
      }
    
    return {
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      channelTitle: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      dialogVisible: false,
      formInline: {//主页表单
        warehouseAreaCode: '',//库存编码
        storageAreaCode: '',//储区编码
        channel: ''//通道全称
      },
      warehouseAreaCode: [],
      warehouseAreaPage: 1,//库区编码
      warehouseAreaData : { // 库区编码页码数据
        start : 1,
        limit: 10
      },
      storageAreaCode: [],
      storageAreaPage: 1,//储区编码
      storageAreaData : { // 储区编码页码数据
        start : 1,
        limit: 10
      },
      channel: [],
      channelPage: 1,//储区编码
      channelData : { // 储区编码页码数据
        start : 1,
        limit: 10
      },
      storageAreaCodeForm: [],
      storageAreaPageForm: 1,//储区编码
      storageAreaDataForm : { // 储区编码页码数据
        start : 1,
        limit: 1000
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
        tableCode: "WMS_BASICDATA_CHANNEL_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        storageAreaTypeName: '',// 储区类型
        warehouseAreaCode: '', // 储区code
        warehouseId: '',//仓库ID，
        warehouseAreaId: '',//库区ID（必传）（批量新增必传），
        warehouseAreaName: '',//库区名称
        // warehouseAreaCode: '',//库区ID（必传）（批量新增必传）
        storageAreaId: '',//储区ID（必传）（批量新增必传），
        storageAreaName: '',//储区名称，
        storageAreaCode: '',//储区编号，
        typeId: '',//储区类型
        channelId:'',//通道id,
        channelCode: '',//通道编号
        channelName: '',//通道全称
        sortTypeId: '',//排序方式id  必填
        columnAmount:'',//通道格数 必填
        rowAmount: '', //通道层数 必填
        columnSpaceAmount: '', //储位格数
        commodityMixtureId: '',//混载标识id 批量新增必填
        supplierMixtureId: '',//供应商混载标识id 批量新增必填
        status: '',
        palletMaximum: '',//最大存储板数
        caseMaximum: '',//最大存储箱数
        weightMaximum: '',//最大存储重量，
        volumeMaximum: '',//最大存储体积，
        whetherPickArea: '',//是否拣货区 批量新增必填
        volumeEstimateId: '',//容器试算标识 批量新增必填
        limitTypeId: '',//入库类型限制id
        limitValue: '',//:限制值 必填
        pickPermit: '',//允许拣货标识 必填
        atypeStorageChannel:'',//是否A类通道 必填
        atypeStorageArea:'',//是否A类储区 必填
        totalSpace: '',//总储位数，
        usageSpace: '',//已占储位数，
        channelAmount: '',//通道数（储区生成通道必传），
        remark: '',//备注
      },
      rulesForm: { //13个必填
        typeId: [{ required: false, message: '请输入储区类型', trigger: 'change'}],//储区类型不必填
        channelCode: [{ validator: validateChannelCode,trigger:'change'}],
        channelName: [{ required: true, message: '请输入通道全称', trigger: 'change'}],
        sortTypeId: [{ required: true, message: '请输入排序方式', trigger: 'change'}],//排序方式id  必填
        columnAmount:[{ required: true, message: '请输入通道格数', trigger: 'change'},{ type: 'number', message: '必须为数字值', trigger: 'change'}],//通道格数 必填
        rowAmount: [{ required: true, message: '请输入通道层数', trigger: 'change'},,{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}], //通道层数 必填
        columnSpaceAmount: [{ required: true, message: '请输入储格位数', trigger: 'change'},{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}], //储格位数 必填
        commodityMixtureId: [{ required: true, message: '请输入混载标识', trigger: 'change'}],//混载标识id 批量新增必填
        supplierMixtureId: [{ required: true, message: '请输入供应商混载标识', trigger: 'change'}],//供应商混载标识id 批量新增必填
        status: [{ required: true, message: '请输入状态', trigger: 'change'}],//状态id 批量新增必填
        whetherPickArea: [{ required: true, message: '请输入是否拣货区', trigger: 'change'}],//是否拣货区 批量新增必填
        volumeEstimateId: [{ required: true, message: '请输入容器试算标识', trigger: 'change'}],//容器试算标识 批量新增必填
        limitValue: [{ required: true, message: '请输入限制值', trigger: 'change'}],//:限制值 必填
        pickPermit: [{ required: true, message: '请输入允许拣货标识', trigger: 'change'}],//允许拣货标识 必填
        atypeStorageChannel:[{ required: true, message: '请输入是否A类通道', trigger: 'change'}],//是否A类通道 必填
        // atypeStorageArea:[{ required: true, message: '请输入是否A类储区', trigger: 'change'}],//是否A类储区 必填
        warehouseAreaId: [{ required: true, message: '请输入库区编码', trigger: 'change'}],//库区ID（必传）（批量新增必传），
        storageAreaId: [{ required: true, message: '请输入库区编码', trigger: 'change'}],//储区ID（必传）（批量新增必传），
        palletMaximum: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储板数（必传）
        caseMaximum: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储箱数
        weightMaximum: [{ required: true, message: '请输入最大存储重量', trigger: 'change'},{ type: 'number', message: '必须为数字值'}],//最大存储重量（必传）
        volumeMaximum: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储体积（必传）
        totalSpace: [{ required: true, message: '请输入总储位数', trigger: 'change'},{ type: 'number', message: '必须为数字值'}]//总储位数
        //channelAmount: [{ required: true, message: '请输入通道数不能为空', trigger: 'change'}],//通道数（储区生成通道必传），

      },
      storageAreaIds: '',//删除的储区id
      updateDisabled: false,
      //通道
      storageAreaType: [],//储区类型
      channelSortType: [],//通道排序方式
      commodityMixture: [],//混载标识
      supplierMixture: [],//供应商混载标识
      channelStatus: [],//通道状态
      whetherPickArea: [],//是否拣货区
      volumeEstimate: [],//容器试算标识
      pickPermit: [],//允许拣货标识
      atypeChannel: [],//是否A类通道
      addDisables:false,//是否显示
      codeSize: 0,//编码位数
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      isCreateDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定保存并生成储位?'
      },
      sortString: '',//根据优先级排序
      searchParam: {}
    }
  },
  created() {
    this.sortString = 'channelNamee'
    this.initBtn();
    this.initDictionary();//从字典中获取配置参数
    this.getAllBaseWareHouseArea();//获取库区编码
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
    },
    'form.warehouseAreaId': 'handleChannelName',
    'form.storageAreaId': 'handleChannelName',
    'form.channelCode': 'handleChannelName'
  },
  mounted() {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods: {
    closeDialog () {
      this.resetForm('form');
    },
    handleChannelName () {
      this.form.channelName = this.form.warehouseAreaCode+ this.form.storageAreaCode+ this.form.channelCode
    },
    handleClick(tab, event) {
    },
    //下拉选择框
    loadMoreWarehouseArea() {
      //如果当前页面小于总页数则获取其他数据
      if (this.warehouseAreaData.start == this.warehouseAreaPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.warehouseAreaData.start = this.warehouseAreaData.start + 1;
        let accumulationData = true;
        this.getAllBaseWareHouseArea(accumulationData);
      }
    },
    loadMoreStorageArea(){
      //如果当前页面小于总页数则获取其他数据
      if (this.storageAreaData.start == this.storageAreaPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.storageAreaData.start = this.storageAreaData.start + 1;
        let accumulationData = true;
        this.getAllStorageArea(accumulationData);
      }
    },
    loadMoreChannel(){
      //如果当前页面小于总页数则获取其他数据
      if (this.channelData.start == this.channelPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.channelData.start = this.channelData.start + 1;
        let accumulationData = true;
        let key = this.storageAreaCode.findIndex(item => item.storageAreaCode == this.formInline.storageAreaCode)
        let storageAreaId = ''
        if(key != -1){
          storageAreaId = this.storageAreaCode[key].storageAreaId
        }
        this.getAllChannel(storageAreaId, accumulationData);
      }
    },
    getAllBaseWareHouseArea (accumulation) { 
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.warehouseAreaCode));
      let params = JSON.parse(JSON.stringify(this.warehouseAreaData))
      allBaseWareHouseArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.warehouseAreaCode = oldData.concat(res.data): this.warehouseAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    getAllStorageArea(accumulation){
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.storageAreaCode))
      let params = JSON.parse(JSON.stringify(this.storageAreaData))
      //根据库区编码获取库区id
      let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaCode == this.formInline.warehouseAreaCode)
      let warehouseAreaId = ''
      if(key != -1){
        warehouseAreaId = this.warehouseAreaCode[key].warehouseAreaId
      }
      params.warehouseAreaId = warehouseAreaId
      allStorageArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.storageAreaCode = oldData.concat(res.data): this.storageAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    getAllChannel(storageAreaId,accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.channel));
      let params = {
        storageAreaId: storageAreaId
      }
      allChannel(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.channel = oldData.concat(res.data): this.channel = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    //选择储区编码后获取全部通道
    selectStorageCode(val){
      let key = this.storageAreaCode.findIndex(item => item.storageAreaCode == this.formInline.storageAreaCode)
      let storageAreaId = ''
      if(key != -1){
        storageAreaId = this.storageAreaCode[key].storageAreaId
      }
      this.getAllChannel(storageAreaId)
    },
    selectWarehouseAreaCode(val){
      this.storageAreaCode = []
      this.formInline.storageAreaCode = ''
      this.channel = []
      this.formInline.channel = ''
  　　this.getAllStorageArea();//获取储区编码
    },
    selectFormWarehouseAreaCode(val){
      //给库区名称赋值
      //获取储区信息
      let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaId == this.form.warehouseAreaId)
      let warehouseAreaName = '';
      let warehouseAreaCode = '';
      if(key != -1){
        warehouseAreaName = this.warehouseAreaCode[key].warehouseAreaName
        warehouseAreaCode = this.warehouseAreaCode[key].warehouseAreaCode
      }
      this.form.warehouseAreaName = warehouseAreaName
      this.form.warehouseAreaCode = warehouseAreaCode;
      //清空储区信息
      this.storageAreaCodeForm = []
      this.form.storageAreaId = ''
      this.form.storageAreaName = ''
      this.form.storageAreaCode = ''
      this.form.typeId = ''//储区类型
      this.getAllStorageAreaForm();
    },
    selecFormStorage(val,showData){
      //回填储区名称和获取储区类型
      let key = this.storageAreaCodeForm.findIndex(item => item.storageAreaId == this.form.storageAreaId)
      let storageAreaName = '',storageAreaCode = '';
      if(key != -1){
        storageAreaName = this.storageAreaCodeForm[key].storageAreaName;
        storageAreaCode = this.storageAreaCodeForm[key].storageAreaCode;
      }
      this.form.storageAreaName = storageAreaName;
      this.form.storageAreaCode = storageAreaCode;
      let params = {
        storageAreaId: val
      }
      storageListById(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.form.typeId = String(res.data.typeId);//储区类型
          this.form.commodityMixtureId = String(res.data.commodityMixtureId)//混载标识
          this.form.supplierMixtureId = String(res.data.supplierMixtureId)//供应商混载标识
          // this.form.palletMaximum = String(res.data.palletMaximum)//最大存储板数
          // this.form.caseMaximum = String(res.data.caseMaximum)//最大存储箱数
          this.form.whetherPickArea = String(res.data.whetherPickArea)//是否拣货区
          this.form.volumeEstimateId = String(res.data.volumeEstimateId)//容器试算标识
          this.form.pickPermit = String(res.data.pickPermit)//允许拣货标识
          // this.isSave = false; // 初始化
        }
      })
    },
    getAllStorageAreaForm(accumulation){
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.storageAreaCodeForm))
      let params = JSON.parse(JSON.stringify(this.storageAreaDataForm))
      params.warehouseAreaId = this.form.warehouseAreaId
      allStorageArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.storageAreaCodeForm = oldData.concat(res.data): this.storageAreaCodeForm = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    loadMorestorageAreaArea() {

    },
    initDictionary(accumulation) {
      let params1 = {
        code: 'storage_area_type_id'
      }
      dictionarysType(params1).then(res => {
        this.storageAreaType = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'sort_type_id'
      };
      dictionarysType(params2).then(res => {
        this.channelSortType = JSON.parse(JSON.stringify(res.data))
      })
      let params3 = {
        code: 'channel_status'
      };
      dictionarysType(params3).then(res => {
        this.channelStatus = JSON.parse(JSON.stringify(res.data))
      })
      let params4 = {
        code: 'commodity_mixture_id'
      };
      dictionarysType(params4).then(res => {
        this.commodityMixture = JSON.parse(JSON.stringify(res.data))
      })
      let params5 = {
        code: 'supplier_mixture_id'
      };
      dictionarysType(params5).then(res => {
        this.supplierMixture = JSON.parse(JSON.stringify(res.data))
      })
      let params6 = {
        code: 'atype_storage_channel'
      };
      dictionarysType(params6).then(res => {
        this.atypeChannel = JSON.parse(JSON.stringify(res.data))
      })
      let params7 = {
        code: 'whether_pick_area'
      };
      dictionarysType(params7).then(res => {
        this.whetherPickArea = JSON.parse(JSON.stringify(res.data))
      })
      let params8 = {
        code: 'pick_permit'
      };
      dictionarysType(params8).then(res => {
        this.pickPermit = JSON.parse(JSON.stringify(res.data))
      })
      let params9 = {
        code: 'volume_estimate_id'
      };
      dictionarysType(params9).then(res => {
        this.volumeEstimate = JSON.parse(JSON.stringify(res.data))
      })
    },
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '40';
    },
    resetForm(formName) { // 清空表单
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        for (let item in this.form) {
          this.form[item] = '';
        };
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
      }
    },
    //取消确认弹窗
    cancel(formName){
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.$refs['form'].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
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
      let menusKey = 'WMS_STORAGE_AREA';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initChannel(current) {
      //根据库区编码获取库区id
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      channelList(this.filteParams(params)).then(res => {
        let re = res.data;
        if(re.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(re.records));
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(re));
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        }
      })
    },
    onRowClick(row) {

    },
    onHandleSelectionChange(val) {
      this.getSelectedRow = val;
    },
    searchList() {
      this.sortString = 'channelName'
      //根据库区编码获取库区id
      let warehouseAreaId = ''
      let storageAreaId = ''
      if(this.warehouseAreaCode.length > 0){
        let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaCode == this.formInline.warehouseAreaCode)
        if(key != -1){
          warehouseAreaId = this.warehouseAreaCode[key].warehouseAreaId
        }
      }
      if(this.storageAreaCode.length > 0){
        let key1 = this.storageAreaCode.findIndex(item => item.storageAreaCode == this.formInline.storageAreaCode)
        if(key1 != -1){
          storageAreaId = this.storageAreaCode[key1].storageAreaId
        }
      }
      this.searchParam = {
        warehouseAreaId: warehouseAreaId,
        storageAreaId: storageAreaId,
        channelName: this.formInline.channel,
        sort: this.sortString,
        isAsc: true//升序
      };
      this.initChannel(1);
    },
    resetList() {
      this.formInline.warehouseAreaCode = ''
      this.formInline.storageAreaCode = ''
      this.formInline.channel = ''
      this.storageAreaCode = []
      this.channel = []
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      // this.dataTable.start = 1
      // this.initChannel()
    },
    initTable() {//清空查询栏信息,下拉框默认“请选择”，下方表格不刷新
      this.formInline.warehouseAreaCode = ''
      this.formInline.storageAreaCode = ''
      this.formInline.channel = ''
      this.dataTable.start = 1;
      this.initChannel(this.dataTable.start);
    },
    addList() {
      this.isSave = false; // 初始化
      this.channelTitle = '新增';
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.updateDisabled= true
      this.addDisables = false //新增不显示按钮
      let params = {
        codeName: "WMS_CHANNEL_CODE_TD"
      }
      codeCharCount(params).then(res => {
        this.codeSize = JSON.parse(JSON.stringify(res.data.codeSize))
      })
    },
    updateList () {

      this.channelTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的通道信息')
        return false
      } else if(len > 1){
        this.$message.warning('修改通道信息不能大于一条');
        return false
      } else {
        // this.selecFormStorage(this.getSelectedRow[0].storageAreaId, true);
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.sortTypeId = String(newForm.sortTypeId)
        newForm.columnAmount = String(newForm.columnAmount)
        newForm.commodityMixtureId = String(newForm.commodityMixtureId)
        newForm.supplierMixtureId = String(newForm.supplierMixtureId)
        newForm.status = String(newForm.status)
        newForm.whetherPickArea = String(newForm.whetherPickArea)
        newForm.volumeEstimateId = String(newForm.volumeEstimateId)
        newForm.pickPermit = String(newForm.pickPermit)
        newForm.atypeStorageChannel = String(newForm.atypeStorageChannel)
        newForm.storageAreaId = parseInt(newForm.storageAreaId)
        newForm.columnAmount = parseInt(newForm.columnAmount)
        // this.form = JSON.parse(JSON.stringify(newForm));
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm)); // 获取初始化的数据
        this.getAllStorageAreaForm()
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        this.addDisables = true //修改显示按钮
        this.isSave = false;
        // this.$nextTick(() => {
        //
        // });
      }
    },
    updateForm() {
      let axiosApi;
      this.channelTitle == '修改' ? axiosApi = channelUpdate([this.form]) : axiosApi = channelAdd([this.form]);
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.channelTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.sortString = ''
          this.initTable();
        }
      })
    },
    delList() {
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的通道信息');
        return false
      }
      this.delDialog.modalShow = true;
    },
    removeRow() {
      let channelIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        channelIdArr.push(item.channelId);
      });
      let channelIds = channelIdArr.join(',');
      channelDel(channelIds).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.initTable();
        }
      })
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
      // this.tablelist();
      // 数据copy表头数据不用管

      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
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
      this.initChannel(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initChannel(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initChannel(this.dataTable.start);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateForm();
        } else {
          return false;
        }
      });
    },
    //确定保存并生成通道
    createChannelDialog(formName){
      //先调用修改接口，再调用生成通道接口
      let form = this.form
      channelUpdate([form]).then(res => {
        if(res.data.status == 10001){
          this.$message.warning('保存失败，无法生成储位！');
        }else{
          spaceAdd(form).then(res => {
            if(res.data.status == 10001){
              this.$message.warning(res.data.message)
            }else{
              this.$message.success('生成储位成功')
              //has_channel是否已生成通道  0 已生成  1 未生成
              //弹窗消失
              this.isCreateDialog.modalShow = false
              this.cancel('form');
              this.initTable();
            }
          })
        }
      })
    },
    createSpace() {
      //生成储位
      let form = this.form
      if(this.isSave){
        //有未保存的先提示
        this.isCreateDialog.modalShow = true
      }else {
        spaceAdd(form).then(res => {
          if(res.data.status == 10001){
            this.$message.warning(res.data.message)
          }else{
            this.$message.success('生成储位成功')
            //弹窗消失
            this.isCreateDialog.modalShow = false
            this.cancel('form');
            this.initTable();
          }
        })
      }
    }
  }
}
