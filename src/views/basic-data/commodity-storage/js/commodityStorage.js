import tableConfigure from '@/components/table/tableConfigure.vue';
import { getCommodityStorage, addCommodityStorage, editCommodityStorage, delCommodityStorage,importCommodityChannel } from '@/api/basic-data/commodity-storage/index.js';
import { commodityList, getCommodityByCode, getCommodityById } from '@/api/basic-data/commodity/index.js';
import { ownersList } from '@/api/common/business.js';
import { baseCommodityPackageDto } from '@/api/basic-data/package/index.js'
import { getSpaceList, getSpaceListByChannel, getWarehouseList, getChannelList, getStorageList, getCommodityCountList ,getBaseStorageByStorageId} from '@/api/common/warehouse-dic.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType, standardDic, standardDicPage, standardDicChild } from '@/api/common/type.js';
import { spacePrinterList } from '@/api/storage-manage/warehouse-area/space'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import '../style/commodityStorage.scss';
import { uniqueJsonArr } from '@/utils'

export default {
  name: 'commodity-storage',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog // 弹窗
  },
  data() {
    let checkCommodityCode = (rule, value, callback) => {
      if (this.commodityTitle == '修改') {
        callback()
      }else{
        if(this.form.commodityCode == ''){
          callback(new Error('商品编码不能为空'))
          this.packageAmounts = [];
          this.form.packageCommodityAmount = '';
          return;
        }
        let params = {
          commodityCode: this.form.commodityCode,
        }
        getCommodityByCode(params).then(res => {
          let re = res.data
          if (re.commodityId != null) {
            this.getPackageByCommidityCode(re)
            callback()
          } else {
            this.packageAmounts = [];
            this.form.packageCommodityAmount = '';
            callback(new Error('商品编码不存在'))
          }
        }).catch(error => {
          this.$message.error('检验商品编码失败')
        })
      }
    }
    return{
      list: [],
      options: [],
      states: [],
      paramsOption:{
        multiple: true,//是否多选
        disabled: false,//是否禁用
        filterable: true,//是否可搜索
        remote: true,//是否为远程搜索
        clearable:true,//单选时是否可以清空选项
        multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制
      },
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的商品储位关系?'
      },
      heightResize: true,
      commodityTitle: '',
      dialogVisible: false,
      commodityCounts: '',
      commodityIds: '',
      conveyorPermitList:[],
      id:'',
      code:'',
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      // spaceCodeArrPage: 1,
      // spaceCodePageDate: { // 储位编码页码数据
      //   data:[],
      //   start: 1,
      //   limit: 10,
      // },
      spaceChannelArrPage: 1,
      spaceChannelPageDate: { // 储位编码页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      commodityArrPage: 1,
      commodityPageDate: { // 商品页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      warehouseList:[],//库区下拉框集合
      packageAmounts: [],//包装数量下拉框集合
      storageAreaList:[],//储区下拉框集合
      channelCodeList:[],//通道下拉框集合
      pickCommodityTypeList:[],//拣货位类型下拉框集合
      formInline: {
        companyName: '',
        spaceCode: '',
        commodityCode: ''
      },
      dataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableName: {
        tableCode: "WMS_COMMODITY_STORAGE_TABLE"
      },
      // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      largePackageCount:'',
      mediumPackageCount:'',
      smallPackageCount:'',
      form:{
        ownerId: '',
        ownerName: '',
        commodityId: '',
        commodityCode: '',
        warehouseAreaId: '',
        packageCommodityAmount: '',
        storageAreaId: '',
        storageAreaCode: '',
        atypeMaxAmount: '',
        notAMaxAmount: '',
        channelId: '',
        atypeAlarmAmount: '',
        notAAlarmAmount: '',
        atypeCyclicAlarmAmount: '',
        notACyclicAlarmAmount: '',
        spaceId: '',
        atypeMaxSpaceAmount: '',
        notAMaxSpaceAmount: '',
        commodityTypeAmount: '',
        pickCommodityTypeId: '',
        pickCommodityTypeName:'',
        remark: ''
      },
      rulesForm: {
        //ownerName: [{ required: true, message: '委托业主不能为空', trigger: 'change' }],
        commodityCode: [{ required: true, message: '商品编码不能为空', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z\-\_]+$/, message: '请输入数字或者字母', trigger: 'change' },
          { validator: checkCommodityCode, trigger: 'blur' }],
        warehouseAreaId: [{ required: true, message: '库区编码不能为空', trigger: 'change' }],
        atypeMaxAmount: [
          { required: true, message: '最大存储量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        notAMaxAmount: [
          { required: true, message: '最大存储量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        storageAreaCode: [{ required: true, message: '储区编码不能为空', trigger: 'change' }],
        atypeAlarmAmount: [
          { required: true, message: '补货警示量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        notAAlarmAmount: [
          { required: true, message: '补货警示量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        atypeCyclicAlarmAmount: [
          { required: true, message: '补货触发量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        notACyclicAlarmAmount: [
          { required: true, message: '补货触发量不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        atypeMaxSpaceAmount: [
          { required: true, message: '可用储位数不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        notAMaxSpaceAmount: [
          { required: true, message: '可用储位数不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '只能输入整数数字', trigger: 'change' }
          ],
        packageCommodityAmount: [{ required: true, message: '包装数量不能为空', trigger: 'change' }],
        // pickCommodityTypeId: [{ required: true, message: '拣货位类型不能为空', trigger: 'change' }]
      },
      count: 0,
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        age: ''
      },
      oldForm: {}, // 初始化的form数据
      isSave: false,//若有数据新增，未点击保存
      updateDisabled: false,
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {},
      spaceArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      spaceArrPage: 1,
      searchSpaceCode: '',
      excelImportShow: false,
      fileName:'',
      addLoading: false,
      fileList: []
    }
  },
  created(){
    this.showCommodityStorage(1);
    this.initBtn();
    this.getOwnerList(false);
    // this.getSpeaceListByPage(false);
    this.initDictionaryPermit();
    this.getWarehouseListByPage();
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
  mounted () {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
    this.options = this.list;
  },
  methods:{
    //导入
    importData(){
      this.excelImportShow=true;
    },
    beforeUpload(file){
      console.log(file,'文件');
      this.files = file;
      const extension = file.name.split('.')[1] === 'xls';
      const extension2 = file.name.split('.')[1] === 'xlsx';
      const isLt1M = file.size / 1024 / 1024 < 1; //(校验上传文件的大小)
      if (!extension && !extension2) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!');
        return;
      }
      if (!isLt1M) {
        this.$message.warning('上传模板大小不能超过 1MB!')
        return ;
      }
      console.log(file.name);
      this.fileName = file.name;
      return false // 返回false不会自动上传
    },
    submitUpload() {
      if(this.fileName == ""){
        this.$message.warning('请选择要上传的文件！');
        return false
      }
      let fileFormData = new FormData();
      fileFormData.append('file', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      importCommodityChannel(fileFormData).then((res) => {
        this.addLoading = false;
        this.fileName="";
        if (res.data.status === 10001) {
          return this.$message.warning(res.data.message);
        }
        this.$message({
          message: '导入成功',
          type: 'success'
        });
        this.excelImportShow=false;
        // this.initTable();//重新请求一次页面数据
        setTimeout('location.reload()',2000);
      })
    },
    exportData(){
      this.exportCommodityStorage(true);
    },
    //导出数据
    exportCommodityStorage(val) {
      let params = {
        ownerId: this.formInline.companyName,
        spaceId: this.formInline.spaceCode,
        commodityCode: this.formInline.commodityCode,
        // exportType : val,
        // dtlCountStart: null,
        // dtlCountEnd: null,
      }
      window.location.href = this.setQueryConfig("/apiz/rest/wms/stock/v1/commodity_storage/date-to-excel?", params,val)
      this.excelImportShow = false
      // setTimeout('this.excelImportShow = false',1000);
    },
    setQueryConfig (url, queryConfig,val){
      var _str = url;
      for(var o in queryConfig){
        if(queryConfig[o] != -1 && queryConfig[o] != '' && queryConfig[o] != undefined && undefined != null && queryConfig[o] != null){
          _str += o + "=" + queryConfig[o] + "&";
        }
      }
      _str += "exportType=" + Boolean(val);
      var _str = _str.substring(0, _str.length);
      console.log(_str)
      return _str;
    },


    tableHeight() {
      let formHeight = $(".demo-form-inline").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height()- formHeight -this.$store.state.basic.height;
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
      let menusKey = 'WMS_COMMODITY_STORAGE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
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
        limit: this.ownersPageDate.limit
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.ownersPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
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
    //根据通道获取储位编码下拉框
    loadMoreSpeaceListByChannel() {
      if (this.spaceChannelPageDate.start == this.spaceChannelArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.spaceChannelPageDate.start = this.spaceChannelPageDate.start + 1;
        this.getSpeaceListByChannel(true);
      }
    },
    //根据通道获取储位编码下拉框
    getSpeaceListByChannel(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.spaceChannelPageDate.data));
      let params = {
        channelId: this.form.channelId,
        start: this.spaceChannelPageDate.start,
        limit: this.spaceChannelPageDate.limit
      }
      getSpaceListByChannel(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          let _data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(oldData.concat(data.records)));
          _data = uniqueJsonArr(_data, 'spaceId')
          this.spaceChannelPageDate.data = _data
          this.spaceChannelArrPage = data.pages; // 总页码
        }
      })
    },
    //库区编码下拉框
    getWarehouseListByPage() {
      let params = {
      }
      getWarehouseList(params).then(res => {
        this.warehouseList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载库区信息数据失败')
      })
    },
    //储区编码下拉框
    getStorageListByPage() {
      let params = {
        warehouseAreaId: this.form.warehouseAreaId,
        attributeTypeId: 2,
      }
      getStorageList(params).then(res => {
        this.storageAreaList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载储区信息数据失败')
      })
    },
    //通道编码下拉框
    getChannelListByPage() {
      let params = {
        storageAreaId: this.form.storageAreaId,
      }
      getChannelList(params).then(res => {
        this.channelCodeList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载通道信息数据失败')
      })
    },
    //获取字典值
    initDictionaryPermit () {
      //获取拣货位类型字典值
      let pickCommodityTypeParams = {
        code: 'WMS_COMMODITY_CHANNEL_PICK_TYPE'
      };
      dictionarysType(pickCommodityTypeParams).then(res => {
        this.pickCommodityTypeList = JSON.parse(JSON.stringify(res.data));
      })
    },
    onSelectWarehouseCounts(val){
      this.id = parseInt(val);
      this.form.storageAreaCode = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.form.commodityTypeAmount = '';
      this.storageAreaList = [];
      this.channelCodeList = [];
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    onSelectStorageCounts(val){
      if (val == null || val == ''){
        this.form.channelId = '';
        this.form.spaceId = '';
        return;
      }
      this.form.storageAreaId = parseInt(val);
      this.code = 'storageAreaId';
      this.getCommodityCounts();
      this.form.channelId = '';
      this.form.spaceId = '';
      this.channelCodeList = [];
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;

      let param = {
        storageAreaId:this.form.storageAreaId
      }
      getBaseStorageByStorageId(param).then(res => {
         var data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.form.pickCommodityTypeId = String(data.operationTypeId)
          // if (this.form.pickCommodityTypeId == 1 || this.form.pickCommodityTypeId == 0){
          //     this.form.pickCommodityTypeName = 'C-整箱拣货位'
          // } else if (this.form.pickCommodityTypeId == 2) {
          //   this.form.pickCommodityTypeName = 'B-零散拣货位'
          // }
        }
      })
    },
    onSelectChannelCounts(val){
      if (val == null || val == ''){
        this.form.spaceId = '';
        return;
      }

      this.id = parseInt(val);
      this.code = 'channelId';
      this.getCommodityCounts();
      this.form.spaceId = '';
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    onSelectSpaceCounts(val){
      if (val == null || val == '') {
        return;
      }
      this.id = parseInt(val);
      this.code = 'spaceId';
      this.getCommodityCounts();
    },
    //清除库区
    onClearWarehouseList(){
      this.form.warehouseAreaId = '';
      this.form.storageAreaCode = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.form.commodityTypeAmount = '';
      this.storageAreaList = [];
      this.channelCodeList = [];
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除储区
    onClearStorage(){
      this.form.storageAreaCode = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.form.commodityTypeAmount = '';
      this.channelCodeList = [];
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除通道
    onClearChannel(){
      this.form.channelId = '';
      this.form.spaceId = '';
      this.id = this.form.storageAreaCode;
      this.code = 'storageAreaId';
      this.getCommodityCounts();
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除储位
    onClearSpace(){
      this.form.spaceId = '';
      this.id = this.form.channelId;
      this.code = 'channelId';
      this.getCommodityCounts();
    },
    //获取包装数量
    getPackageByCommidityCode(data) {
      this.form.commodityId = data.commodityId  //mixPackageSpecId  packageSpec
      let params = [{
        commodityId: data.commodityId
      }];
      baseCommodityPackageDto(params).then(res => {
        let packageList=[];
        let largePackageCount=  {
          packageAmount: res.data[0].largePackageCount,
        };
        let mediumPackageCount=  {
          packageAmount: res.data[0].mediumPackageCount,
        };
        let smallPackageCount=  {
          packageAmount: res.data[0].smallPackageCount,
        };
        packageList.push(largePackageCount);
        packageList.push(mediumPackageCount);
        packageList.push(smallPackageCount);
        this.packageAmounts = packageList;
      }).catch(error => {
        this.$message.error('获取包装数量失败')
      })
    },
    //A类存储量校验
    aMaxAmountCheckout() {
      if(this.form.atypeMaxAmount != '' && this.form.atypeCyclicAlarmAmount != ''){
        if(parseInt(this.form.atypeMaxAmount) < parseInt(this.form.atypeCyclicAlarmAmount)){
          this.$message.warning('A类型循环补货触发量不能大于A类最大存储量！')
        }
      }
    },
    //非A存储量校验
    bMaxAmountCheckout() {
      if(this.form.notAMaxAmount != '' && this.form.notACyclicAlarmAmount != ''){
        if(parseInt(this.form.notAMaxAmount) < parseInt(this.form.notACyclicAlarmAmount)){
          this.$message.warning('非A类型循环补货触发量不能大于非A类最大存储量！')
        }
      }
    },
    //查询列表
    showCommodityStorage (current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      getCommodityStorage(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        this.dataTable.start = re.current;
        this.dataTable.limit = re.size;
        this.dataTable.total = re.total;
      })
    },
    //新增
    addCommodityStorage () {
      this.isSave = false;
      this.commodityTitle = '新增';
      this.dialogVisible = true;
      this.updateDisabled= false;
    },
    editCommodityStorage () {
      this.isSave = false;
      this.commodityTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择要修改的商品储位关系')
        return false
      }else if(len > 1){
        this.$message.warning('修改商品储位关系不能大于一条')
        return false
      }else {
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.pickCommodityTypeId = String(newForm.pickCommodityTypeId);
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
        // this.form.pickCommodityTypeName =
        this.spaceChannelPageDate.data = [
          {
            spaceCode: newForm.spaceCode,
            spaceId: newForm.spaceId,
          }
        ]
        let params = {
          productIds: this.form.commodityId
        }
        getCommodityById(this.filteParams(params)).then(res => {
          if(res.data.length > 0){
            let params = [{
              commodityId: res.data[0].commodityId
            }]
            baseCommodityPackageDto(params).then(res => {
              let packageList=[];
              let largePackageCount=  {
                packageAmount: res.data[0].largePackageCount,
              };
              let mediumPackageCount=  {
                packageAmount: res.data[0].mediumPackageCount,
              };
              let smallPackageCount=  {
                packageAmount: res.data[0].smallPackageCount,
              };
              packageList.push(largePackageCount);
              packageList.push(mediumPackageCount);
              packageList.push(smallPackageCount);
              this.packageAmounts = packageList;
            }).catch(error => {
              this.$message.error('获取包装数量失败')
            })
          }
        })
        this.getStorageListByPage();
        this.getChannelListByPage();
        this.getSpeaceListByChannel(false);
        this.dialogVisible = true;
        this.updateDisabled= true;
      }
    },
    updateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(parseInt(this.form.atypeMaxAmount) < parseInt(this.form.atypeCyclicAlarmAmount)){
            return this.$message.warning('A类型循环补货触发量不能大于A类最大存储量！')
          }
          if (parseInt(this.form.notAMaxAmount) < parseInt(this.form.notACyclicAlarmAmount)) {
            return this.$message.warning('非A类型循环补货触发量不能大于非A类最大存储量！')
          }
          let axiosApi;
          if(this.commodityTitle == '新增'){
            this.form.ownerId = this.form.ownerName;
          }
          this.commodityTitle == '修改' ? axiosApi = editCommodityStorage(this.form): axiosApi = addCommodityStorage(this.form);
          axiosApi.then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message);
            } else {
              this.commodityTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
              this.$refs['form'].resetFields();
              this.resetCommodityStorage();
              for(let item in this.form){
                  this.form[item] = '';
                  this.oldForm[item] = '';
                }
              //商品储位绑定关系新增保存后当前弹窗不关闭，清空表单字段
              if(this.commodityTitle == '新增'){
                this.isSave = false
              }else{
                this.dialogVisible = false;
                this.showCommodityStorage(1);
              }
            }
          })
        } else {
          return false;
        }
      })
    },
    //删除
    delCommodityStorage () {
      if (this.getSelectedRow.length != 0) {
        this.delDialog.modalShow = true;
      } else {
        this.$message.warning('请勾选要删除的商品储位关系')
      }
    },
    removeRow () {
      let commodityIdArr = [];
      this.getSelectedRow.forEach((item,index) => {
        commodityIdArr.push(item.dtlId);
      });
      this.commodityIds = commodityIdArr.join(',');
      let params = {
        dtlIds : this.commodityIds
      }
      delCommodityStorage(params).then(res => {
        this.$message.success('删除成功')
        this.delDialog.modalShow = false;
        // this.dataTable.loading = true;
        this.showCommodityStorage(1);
      })
    },
    //获取品项数
    getCommodityCounts () {
      if (this.id) {
        let params = {
          id: this.id,
          code: this.code,
        };
        getCommodityCountList(params).then(res => {
          this.form.commodityTypeAmount = res.data.counts;
        })
      }

    },
    searchList(){
      this.searchParam = {
        ownerId: this.formInline.companyName,
        spaceId: this.formInline.spaceCode,
        commodityCode: this.formInline.commodityCode,
        fieldIsAsc: '',
        isAsc: '',
      }
      this.showCommodityStorage(1)
    },
    //重置
    resetCommodityStorage () {
      this.formInline.companyName = '';
      this.formInline.spaceCode = '';
      this.formInline.commodityCode = '';
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    // 清空表单
    resetForm () {
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.cancel('form')
      }
    },
    //取消确认弹窗
    cancel(formName){
      // 重置数据表
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
      let _form = JSON.parse(JSON.stringify(this.form));
      for (let key in _form) {
        _form[key] = '';
      }
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
      this.form = _form;
      this.dialogVisible = false;
      this.isSaveDialog.modalShow = false
      this.isSave = false//是否保存置为默认值
    },
    onRowClick (row) {
    },
    onHandleSelectionChange(val){
      this.getSelectedRow = val;
    },
    tableDataHandle (data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item,index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left': 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign:'center',
        width: '100%'
      };
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign:'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
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
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.showCommodityStorage(this.dataTable.start);
    },
    handleCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.showCommodityStorage(this.dataTable.start);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    }
  }
}
