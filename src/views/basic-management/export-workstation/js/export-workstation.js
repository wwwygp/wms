// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { searchWorkStationInfo, wharfUpdate, workStationDel, workStationAdd, selectWharf } from '@/api/basic-manage/export-workstation/index.js';
import { printerGroup } from '@/api/basic-data/printer/index.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import { getSpaceList, getSpaceListByChannel, getWarehouseList, getChannelList, getStorageList, getCommodityCountList } from '@/api/common/warehouse-dic.js';
export default {
  name: 'export-workstation',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog,
    selfDialog
  },
  data() {
    return {
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      wharfTitle: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除?'
      },
      dialogVisible: false,
      formInline: {//主页表单
        wharfId: '',
        takeDownTypeId:'',
        warehouseAreaId:'',
        storageAreaId:'',
        channelId:'',
        tmpStorageCode:''
      },
      wharfNames: [],
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
        tableCode: "WMS_BASE_WORKSTATION_STORAGE_DTL"
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
      	wharfId: '',
        takeDownTypeId:'',
        hasLiftingBoard: "0",//是否有调节板,默认否
        remark: '',//备注
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
        tmpStorageCode: '',  //暂存区编码
      },
      warehouseCode: '',//库区编码
      storageCode: '',//储区编码
      channelCode: '',//通道编码
      takeDownTypeName: [],//下架类型名称
      takeDownTypeWay: '',//下架类型
      warehouseList: [],//库区下拉框集合
      insWarehouseList: [],//库区下拉框集合
      storageAreaList:[],//储区下拉框集合
      insStorageAreaList:[],//储区下拉框集合
      channelCodeList:[],//通道下拉框集合
      insChannelCodeList:[],//通道下拉框集合
      wharfStatus:[],//码头状态
      liftingBoard: [],//调节板
      wharf: [],//码头名称
      wharfData : { // 码头数据
        start : 1,
        limit: 10
      },
      wharfPage: 1,//码头页码
      printerGroup: [],//打印机组
      groupData : { // 打印机组数据
        start : 1,
        limit: 10
      },
      groupPage: 1, // 打印机组页码
      wharfType: [],//码头类型
      wharfTypeData : { // 码头类型数据
        start : 1,
        limit: 10
      },
      rulesForm: {
        wharfId: [{ required: true, message: '工作站不能为空', trigger: 'change' }],
        takeDownTypeId: [{ required: true, message: '下架类型不能为空', trigger: 'change' }],
        warehouseAreaId: [{ required: true, message: '库区编码不能为空', trigger: 'change' }],
        storageAreaId: [{ required: true, message: '储区编码不能为空', trigger: 'change' }],
        channelId: [{ required: true, message: '通道编码不能为空', trigger: 'change' }],
        tmpStorageCode: [{ required: true, message: '暂存区编码不能为空', trigger: 'change' }],
      },
      wharfTypePage: 1,//码头类型页码
      wharfId: '',//删除的码头id
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {}
    }
  },
  created() {
    this.initBtn();
    this.getWharf();//获取工作站名称
    this.initTakeDownType();//获取下架类型
    this.getWarehouseListByPage();
  },
  mounted() {
    this.tableHeight();
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
    closeDialog () {
      this.resetForm('form');
    },
    //下拉选择框
    loadMoreWharf() {
      //如果当前页面小于总页数则获取其他数据
      if (this.wharfData.start == this.wharfPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.wharfData.start = this.wharfData.start + 1;
        let wharfAccumulationData = true;
        this.getWharf(wharfAccumulationData);
      }
    },
    getWharf (wharfAccumulation) { // 获取码头
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.wharf));
      let params = JSON.parse(JSON.stringify(this.wharfData))
      selectWharf(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // wharfAccumulation // 需要累加
          wharfAccumulation ? this.wharf = oldData.concat(res.data): this.wharf = JSON.parse(JSON.stringify(res.data));
        }
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
        this.form = {
              	wharfId: '',
        takeDownTypeId:'',
        hasLiftingBoard: "0",//是否有调节板,默认否
        remark: '',//备注
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
        tmpStorageCode: '',  //暂存区编码
        }
        this.form = JSON.parse(JSON.stringify(this.form));
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
      }
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
      let menusKey = 'WMS_EXPORT_WORKSTATION';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initWorkStation(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      searchWorkStationInfo(this.filteParams(params)).then(res => {
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
      this.searchParam = {
        wharfId: this.formInline.wharfId,
        takeDownTypeId:this.formInline.takeDownTypeId,
        warehouseAreaId:this.formInline.warehouseAreaId,
        storageAreaId:this.formInline.storageAreaId,
        channelId:this.formInline.channelId,
        tmpStorageCode:this.formInline.tmpStorageCode,
      }
      this.initWorkStation(1);
    },
    resetList() {
      this.formInline.wharfId = '';
      this.formInline.takeDownTypeId = '';
      this.formInline.warehouseAreaId = '';
      this.formInline.storageAreaId = '';
      this.formInline.channelId = '';
      this.formInline.tmpStorageCode = '';
      this.dataTable.start = 1;
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
      // this.initWorkStation();
    },
    addList() {
      this.isSave = false; // 初始化
      this.wharfTitle = '新增';
      this.form = {//弹窗表单
             	wharfId: '',
        takeDownTypeId:'',
        hasLiftingBoard: "0",//是否有调节板,默认否
        remark: '',//备注
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
        tmpStorageCode: '',  //暂存区编码
      }
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.updateDisabled= false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateForm();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      });
    },
    updateForm() {
      let axiosApi;
      this.wharfTitle == '修改' ? axiosApi = workStationUpdate(this.form) : axiosApi = workStationAdd(this.form);
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.wharfTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.resetList();
          this.initWorkStation(1);//刷新表格
          this.getWharf();//获取工作站名称
        }
      })
    },
    delList() {
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要删除的出库工作站与储区关系信息')
        return false
      }else {
        this.delDialog.modalShow = true;
      }
      
    },
    removeRow() {
      let dtlIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        dtlIdArr.push(item.dtlId);
      });
      let params = {
        dtlId: dtlIdArr.join(','),
      };
      workStationDel(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.resetList();
          this.initWorkStation(1);//刷新表格
          this.getWharf();//获取工作站名称
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
      this.initWorkStation(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initWorkStation(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initWorkStation(this.dataTable.start);
    },
    //取消确认弹窗
    cancel(formName){
      this.form = {
            	wharfId: '',
        takeDownTypeId:'',
        hasLiftingBoard: "0",//是否有调节板,默认否
        remark: '',//备注
        warehouseAreaId: '',//库区编码
        storageAreaId: '',   //储区编码
        channelId: '',   //通道编码
        spaceId: '',  //储位编码
        tmpStorageCode: '',  //暂存区编码
      }
      this.$refs[formName].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.isSave = false
    },
     //下架类型
    initTakeDownType() {
      let params = {
        code: 'take_down_type_id'
      }
      dictionarysType(params).then(res => {
        this.takeDownTypeWay = JSON.parse(JSON.stringify(res.data))
        this.takeDownTypeWay.forEach((item, index) => {
          this.takeDownTypeName.push(item.dictDtlName)
        })
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
        attributeTypeId: 2,
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
        attributeTypeId: 2,
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
      this.form.spaceId = '';
      for(let i=0;i<this.insChannelCodeList.length;i++){
        if(this.insChannelCodeList[i].channelId == this.form.channelId){
          this.channelCode = this.insChannelCodeList[i].channelCode;
          this.form.tmpStorageCode = this.warehouseCode + this.storageCode + this.channelCode;
        }
      }
    },
  }
}
