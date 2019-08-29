import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import { searchRouteTable, getRouteList, getTmpStorage, insertTmpStorage, deleteTmpStorage } from '@/api/basic-manage/tmpstorage-route/index'
import { getSpaceList, getSpaceListByChannel, getWarehouseList, getChannelList, getStorageList, getCommodityCountList } from '@/api/common/warehouse-dic.js';

export default {
  name: 'tmp-route',
  components: {
    DatePick,
    tableConfigure,
    tipsDialog // 弹窗
  },
  data() {
    return {
      formInline: {
        routeId: '',//线路名称
        routeIds: '',//线路IDS
        status: '', //状态
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
      },
      form: {
        routeId: '',//线路名称
        status: '', //状态
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
        tmpStorageCode: '',  //暂存区编码
        tmpStorageName: '',  //暂存区名称
        remark: '',  //备注
        usageWeight: 0,  //占用重量
        usageCaseAmount: 0,  //占用箱数
        usageVolume: 0,  //占用材积
      },
      dialogVisible: false,
      tmpRouteTitle: '新增',
      warehouseCode: '',
      storageCode: '',
      channelCode: '',
      btnList: [], //按钮集合
      getSelectedRow: [], // 用户选择的数据
      getDtlSelectedRow: [], // 用户选择的数据
      routeList: [],//线路下拉框集合
      insRouteList: [],//线路下拉框集合
      warehouseList: [],//库区下拉框集合
      insWarehouseList: [],//库区下拉框集合
      storageAreaList:[],//储区下拉框集合
      insStorageAreaList:[],//储区下拉框集合
      channelCodeList:[],//通道下拉框集合
      insChannelCodeList:[],//通道下拉框集合
      spaceChannelArrPage: 1,
      spaceChannelPageDate: { // 储位编码页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      insSpaceChannelArrPage: 1,
      insSpaceChannelPageDate: { // 储位编码页码数据
        data:[],
        start: 1,
        limit: 10,
      },
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
        text: '是否确定删除勾选的暂存区线路?'
      },
      statusList: [],//状态下拉框集合
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
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
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_TMPSTORAGE_ROUTE"
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
          tableCode: "WMS_TMPSTORAGE_ROUTE_DTL"
        }
      },
      rulesForm: {
        routeId: [{ required: true, message: '线路名称不能为空', trigger: 'change' }],
        warehouseAreaId: [{ required: true, message: '库区编码不能为空', trigger: 'change' }],
        storageAreaId: [{ required: true, message: '储区编码不能为空', trigger: 'change' }],
        tmpStorageName: [{ required: true, message: '暂存区名称不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
      },
      searchParam: {}
    }
  },
  created() {
    this.initDictionaryPermit();
    this.getWarehouseListByPage();
    this.getRouteList();
    this.initBtn();
    this.searchTableList(1);
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
      let menusKey = 'WMS_TMP_STORAGE_ROUTE_TABLE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    //获取字典值
    initDictionaryPermit() {
      //获取状态字典值
      let statusParams = {
        code: 'WMS_SUPPLIER_SPACE_STATUS_TYPE'
      }
      dictionarysType(statusParams).then(res => {
        this.statusList = JSON.parse(JSON.stringify(res.data))
      })
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
        channelId: this.formInline.channelId,
        start: this.spaceChannelPageDate.start,
        limit: this.spaceChannelPageDate.limit
      }
      getSpaceListByChannel(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.spaceChannelPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.spaceChannelArrPage = data.pages; // 总页码
        }
      })
    },
    //根据通道获取储位编码下拉框
    loadMoreInsSpeaceListByChannel() {
      if (this.insSpaceChannelPageDate.start == this.insSpaceChannelArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.insSpaceChannelPageDate.start = this.insSpaceChannelPageDate.start + 1;
        this.getInsSpeaceListByChannel(true);
      }
    },
    //根据通道获取储位编码下拉框
    getInsSpeaceListByChannel(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.insSpaceChannelPageDate.data));
      let params = {
        channelId: this.form.channelId,
        start: this.insSpaceChannelPageDate.start,
        limit: this.insSpaceChannelPageDate.limit
      }
      getSpaceListByChannel(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.insSpaceChannelPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.insSpaceChannelArrPage = data.pages; // 总页码
        }
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
    //库区编码下拉框
    getWarehouseListByPage() {
      let params = {
      }
      getWarehouseList(params).then(res => {
        this.warehouseList = JSON.parse(JSON.stringify(res.data));
        this.insWarehouseList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载库区信息数据失败')
      })
    },
    //储区编码下拉框
    getStorageListByPage() {
      let params = {
        warehouseAreaId: this.formInline.warehouseAreaId,
        attributeTypeId: 7,
        attributeId: 1
      }
      getStorageList(params).then(res => {
        this.storageAreaList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载储区信息数据失败')
      })
    },
    //储区编码下拉框
    getInsStorageListByPage() {
      let params = {
        warehouseAreaId: this.form.warehouseAreaId,
        attributeTypeId: 7,
        attributeId: 1
      }
      getStorageList(params).then(res => {
        this.insStorageAreaList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载储区信息数据失败')
      })
    },
    //通道编码下拉框
    getChannelListByPage() {
      let params = {
        storageAreaId: this.formInline.storageAreaId,
      }
      getChannelList(params).then(res => {
        this.channelCodeList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载通道信息数据失败')
      })
    },
    //通道编码下拉框
    getInsChannelListByPage() {
      let params = {
        storageAreaId: this.form.storageAreaId,
      }
      getChannelList(params).then(res => {
        this.insChannelCodeList = JSON.parse(JSON.stringify(res.data));
      }).catch(error => {
        this.$message.error('加载通道信息数据失败')
      })
    },
    //清除库区
    onClearWarehouseList(){
      this.formInline.warehouseAreaId = '';
      this.formInline.storageAreaId = '';
      this.formInline.channelId = '';
      this.formInline.spaceId = '';
      this.storageAreaList = [];
      this.channelCodeList = [];
      this.spaceChannelCodeList = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除库区
    onClearInsWarehouseList(){
      this.form.warehouseAreaId = '';
      this.form.storageAreaId = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.insStorageAreaList = [];
      this.insChannelCodeList = [];
      this.insSpaceChannelCodeList = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      this.form.tmpStorageCode = '';
    },
    onSelectWarehouseCounts(val){
      this.formInline.warehouseAreaId = parseInt(val);
      this.formInline.storageAreaId = '';
      this.formInline.channelId = '';
      this.formInline.spaceId = '';
      this.storageAreaList = [];
      this.channelCodeList = [];
      this.spaceChannelCodeList = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    onSelectInsWarehouseCounts(val){
      this.form.warehouseAreaId = parseInt(val);
      this.form.storageAreaId = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.insStorageAreaList = [];
      this.insChannelCodeList = [];
      this.insSpaceChannelCodeList = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      for(let i=0;i<this.insWarehouseList.length;i++){
        if(this.insWarehouseList[i].warehouseAreaId == this.form.warehouseAreaId){
          this.warehouseCode = this.insWarehouseList[i].warehouseAreaCode;
          this.form.tmpStorageCode = this.warehouseCode;
        }
      }
    },
    //清除储区
    onClearStorage(){
      this.formInline.storageAreaId = '';
      this.formInline.channelId = '';
      this.formInline.spaceId = '';
      this.channelCodeList = [];
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除储区
    onClearInsStorage(){
      this.form.storageAreaId = '';
      this.form.channelId = '';
      this.form.spaceId = '';
      this.insChannelCodeList = [];
      this.insSpaceChannelPageDate.data = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      this.form.tmpStorageCode = this.warehouseCode;
    },
    onSelectStorageCounts(val){
      this.formInline.storageAreaId = parseInt(val);
      this.formInline.channelId = '';
      this.formInline.spaceId = '';
      this.channelCodeList = [];
      this.spaceChannelCodeList = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    onSelectInsStorageCounts(val){
      this.form.storageAreaId = parseInt(val);
      this.form.channelId = '';
      this.form.spaceId = '';
      this.insChannelCodeList = [];
      this.insSpaceChannelCodeList = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      for(let i=0;i<this.insStorageAreaList.length;i++){
        if(this.insStorageAreaList[i].storageAreaId == this.form.storageAreaId){
          this.storageCode = this.insStorageAreaList[i].storageAreaCode;
          this.form.tmpStorageCode = this.warehouseCode + this.storageCode;
        }
      }
    },
    //清除通道
    onClearChannel(){
      this.formInline.channelId = '';
      this.formInline.spaceId = '';
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    //清除通道
    onClearInsChannel(){
      this.form.channelId = '';
      this.form.spaceId = '';
      this.insSpaceChannelPageDate.data = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      this.form.tmpStorageCode = this.warehouseCode + this.storageCode;
    },
    onSelectChannelCounts(val){
      this.formInline.channelId = parseInt(val);
      this.formInline.spaceId = '';
      this.spaceChannelPageDate.data = [];
      this.spaceChannelPageDate.start = 1;
      this.spaceChannelPageDate.limit = 10;
      this.spaceChannelPageDate.total = 100;
    },
    onSelectInsChannelCounts(val){
      this.form.channelId = parseInt(val);
      this.form.spaceId = '';
      this.insSpaceChannelPageDate.data = [];
      this.insSpaceChannelPageDate.start = 1;
      this.insSpaceChannelPageDate.limit = 10;
      this.insSpaceChannelPageDate.total = 100;

      for(let i=0;i<this.insChannelCodeList.length;i++){
        if(this.insChannelCodeList[i].channelId == this.form.channelId){
          this.channelCode = this.insChannelCodeList[i].channelCode;
          this.form.tmpStorageCode = this.warehouseCode + this.storageCode + this.channelCode;
        }
      }
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
        routeId: String(this.formInline.routeId),
        status: this.formInline.status
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
      searchRouteTable(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        if (res.data.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(res.data.records))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = res.data.current
          this.dataTable.limit = res.data.size
          this.dataTable.total = res.data.total
          let re = this.dataTable.data;
          let ids = [];
          for(let i=0;i<re.length;i++){
            ids.push(re[i].routeId);
          }
          this.formInline.routeIds = ids.join(',');
          if(this.formInline.routeIds != null && this.formInline.routeIds != ''){
            this.searchDtlTableList();
          }
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(res.data))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = res.data.current
          this.dataTable.limit = res.data.size
          this.dataTable.total = res.data.total
          this.formInline.routeIds = '';
        }
      })
    },
    //获取首页列表
    searchDtlTableList() {
      if(this.formInline.routeId != null && this.formInline.routeId != ''){
         this.formInline.routeIds = this.formInline.routeId;
      }
      let params = {
        routeIds: this.formInline.routeIds,
        status: this.formInline.status,
        warehouseAreaId: this.formInline.warehouseAreaId,
        storageAreaId: this.formInline.storageAreaId,
        channelId: this.formInline.channelId,
        spaceId: this.formInline.spaceId,
      }
      getTmpStorage(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data))
      })
    },
    //新增
    insertTmpRouteBtn(){
      this.isSave = false;
      this.form.status = "0";
      this.form.usageVolume = 0;
      this.form.usageWeight = 0;
      this.form.usageCaseAmount = 0;
      this.dialogVisible = true;
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
        if (valid) {
          insertTmpStorage(this.form).then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message);
            } else {
              this.commodityTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
              // this.resetForm('form')//方法有冲突所以先直接置空
              this.$refs['form'].resetFields();
              for (let item in this.form) {
                if (item == 'status') {
                } else {
                  this.form[item] = '';
                }
              }
              this.dialogVisible = false;
              this.reseltForm();
              this.findBtn();
            }
          })
        }else{
          return false;
        }
      })
    },
    deleteTmpRouteBtn() {
      if (this.getDtlSelectedRow.length != 0) {
        this.delDialog.modalShow = true;
      } else {
        this.$message.warning('请勾选要删除的暂存区线路')
      }
    },
    removeRow () {
      let routeIdArr = [];
      this.getDtlSelectedRow.forEach((item,index) => {
        routeIdArr.push(item.dtlId);
      });
      let ids = routeIdArr.join(',');
      let params = {
        tmpStorageRouteIds : ids
      }
      deleteTmpStorage(params).then(res => {
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
