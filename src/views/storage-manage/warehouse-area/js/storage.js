// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { allBaseWareHouseArea } from '@/api/storage-manage/warehouse-area/warehouse-area';
import { storageList, storageUpdate, storageDel, storageAdd, allStorageArea} from '@/api/storage-manage/warehouse-area/storage';
import { channelAdd } from '@/api/storage-manage/warehouse-area/channel';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType, codeCharCount } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'BaseStorageArea',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    return {
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      storageAreaTitle: '新增',
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
      storageAreaFormCode: [],
      storageAreaFormPage: 1,//储区编码
      storageAreaFormData : { // 储区编码页码数据
        start : 1,
        limit: 10
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
        tableCode: "WMS_BASICDATA_STORAGE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        warehouseId: '',//所属仓库id 必填
        warehouseAreaId: '',//库区id 必填
        storageAreaCode: '',//储区编码
        storageAreaName: '',//储区名称 必填
        typeId: '',//储区类型id   必填
        purposeId: '',//储区用途id 必填
        qualityId: '',//储区品质id 必填
        attributeId: '',//储区属性id  必填
        commodityMixtureId: '',//混载标识id 必填
        supplierMixtureId: '',//供应商混载标识id 必填
        attributeTypeId: '',//属性类型id 必填
        operationTypeId: '',//作业类型id 必填
        palletMaximum: '',//最大存储托盘数
        caseMaximum: '',//最大存储箱数
        channelAmount: '',//通道数 必填
        whetherPickArea: '',//是否拣货区 必填
        atypeStorageArea:'',//是否A类储区 必填
        pickPermit: '',//允许拣货标识 必填
        floor: '',//楼层
        palletPercentage: '',//板出比率 必填
        // palletIntoPercentage: '',//板入比率
        limitTypeId: '',//入库类型限制id 必填
        limitValue: '',//:限制值 必填
        volumeEstimateId: '',//容器试算标识 必填
        hasChannel: '',//是否已生成通道
        remark: '',//备注
      },
      rulesForm: {
        //warehouseId: [{ required: true, message: '', trigger: 'blur'}],//所属仓库id 必填
        warehouseAreaId: [{ required: true, message: '请输入库区编码', trigger: 'change'}],//库区id 必填
        storageAreaCode: [{ pattern: /^[0-9a-zA-Z]+$/, message:'请输入数字或者字母',trigger:'change'}],
        storageAreaName: [{ required: true, message: '请输入储区编码', trigger: 'change'}],//储区名称 必填
        typeId: [{ required: true, message: '请输入储区类型', trigger: 'change'}],//储区类型id   必填
        purposeId: [{ required: true, message: '请输入储区用途', trigger: 'change'}],//储区用途id 必填
        qualityId: [{ required: true, message: '请输入储区品质', trigger: 'change'}],//储区品质id 必填
        attributeId: [{ required: true, message: '请输入储区属性', trigger: 'change'}],//储区属性id  必填
        commodityMixtureId: [{ required: true, message: '请输入混载标识', trigger: 'change'}],//混载标识id 必填
        supplierMixtureId: [{ required: true, message: '请输入供应商混载标识', trigger: 'change'}],//供应商混载标识id 必填
        attributeTypeId: [{ required: true, message: '请输入属性类型', trigger: 'change'}],//属性类型id 必填
        operationTypeId: [{ required: true, message: '请输入作业类型', trigger: 'change'}],//作业类型id 必填
        channelAmount: [{ required: true, message: '请输入通道数', trigger: 'change'},{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//通道数 必填
        whetherPickArea: [{ required: true, message: '请输入是否拣货区', trigger: 'change'}],//是否拣货区 必填
        atypeStorageArea:[{ required: true, message: '请输入是否A类储区', trigger: 'change'}],//是否A类储区 必填
        pickPermit: [{ required: true, message: '请输入允许拣货标识', trigger: 'change'}],//允许拣货标识 必填
        palletPercentage: [{ required: true, message: '请输入板出比率', trigger: 'change'},{ pattern: /^(0)$|^100$|^[1-9][0-9]?$/, message:'请输入0-100',trigger:'change'}],//板出比率 必填
        // palletIntoPercentage: [{ required: true, message: '请输入库区编码', trigger: 'blur'}],//板入比率
        limitTypeId: [{ required: true, message: '请输入入库类型限制', trigger: 'change'}],//入库类型限制id 必填
        limitValue: [{ required: true, message: '请输入限制值', trigger: 'blur'},{ pattern:  /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//限制值 必填
        volumeEstimateId: [{ required: true, message: '请输入容器试算标识', trigger: 'change'}],//容器试算标识 必填
        palletMaximum: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储托盘数
        caseMaximum: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储箱数
        floor: [{ pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}],//最大存储箱数
      },
      storageAreaIds: '',//删除的储区id
      updateDisabled: false,//编辑时是否可编辑
      addDisables:false,//新增时是否可编辑
      //储区
      storageAreaPurpose:[],//储区用途
      storageAreaType: [],//储区类型
      storageAreaQuality: [],//储区品质
      storageAreaAttribute: [],//储区属性
      commodityMixture: [],//混载标识
      supplierMixture: [],//供应商混载标识
      attributeType: [],//属性类型
      operationType: [],//作业类型
      whetherPickArea: [],//是否拣货区
      atypeStorage: [],//是否A类储区
      pickPermit: [],//允许拣货标识
      limitType: [],//入库类型限制
      volumeEstimate: [],//容器试算标识
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
        text: '该数据未保存，确定保存并生成通道?'
      },
      sortString: '',//根据优先级排序
      searchParam: {}
    }
  },
  created() {
    this.sortString = 'warehouseAreaCode,storageAreaCode'
    this.initBtn();
    this.initDictionary();//从字典中获取配置参数
    this.getAllBaseWareHouseArea();//获取库区编码
  },
  mounted() {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
    // layui.use('laydate', function(){
    //   var laydate = layui.laydate;
    //   //执行一个laydate实例
    //   laydate.render({
    //     elem: '#test1' //指定元素
    //   });
    // });
  },
  watch: {
  //   "formInline.warehouseAreaCode"(newValue, oldValue) {
  //     if(newValue){
  //       this.storageAreaCode = []
  //       this.formInline.storageAreaCode = ''
  // 　　  this.getAllStorageArea();//获取储区编码
  //     }
  //   },
    form: {
      handler: function (newVal, oldVal) {
        //排除是否生成通道按钮
        for(let item in newVal) {
          if(item == 'hasChannel'){
            //不比较是否生成通道字段，以后做其他处理
          }else{
            if(newVal[item] != this.oldForm[item]){//比较不同的数据返回true
              this.isSave = true
              return
            }
          }
        };
      },
      deep: true
    }
  },
  methods: {
    selectWarehouseAreaCode (val) {
      console.log(val)
      this.getAllStorageArea();//获取储区编码
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
    getAllBaseWareHouseArea (accumulation) { // 获取码头
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
    selectFormWarehouseAreaCode(val){
      //给库区名称赋值
      //获取储区信息
      let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaId == this.form.warehouseAreaId)
      let warehouseAreaName = ''
      if(key != -1){
        warehouseAreaName = this.warehouseAreaCode[key].warehouseAreaName
      }
      this.form.warehouseAreaName = warehouseAreaName
    },
    initDictionary(accumulation) {
      let params = {
        code: 'storage_area_type_id'
      }
      dictionarysType(params).then(res => {
        this.storageAreaType = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'purpose_id'
      };
      dictionarysType(params1).then(res => {
        this.storageAreaPurpose = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'quality_id'
      };
      dictionarysType(params2).then(res => {
        this.storageAreaQuality = JSON.parse(JSON.stringify(res.data))
      })
      let params3 = {
        code: 'attribute_id'
      };
      dictionarysType(params3).then(res => {
        this.storageAreaAttribute = JSON.parse(JSON.stringify(res.data))
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
        code: 'attribute_type_id'
      };
      dictionarysType(params6).then(res => {
        this.attributeType = JSON.parse(JSON.stringify(res.data))
      })
      let params7 = {
        code: 'operation_type_id'
      };
      dictionarysType(params7).then(res => {
        this.operationType = JSON.parse(JSON.stringify(res.data))
      })
      let params8 = {
        code: 'whether_pick_area'
      };
      dictionarysType(params8).then(res => {
        this.whetherPickArea = JSON.parse(JSON.stringify(res.data))
      })
      let params9 = {
        code: 'atype_storage_area'
      };
      dictionarysType(params9).then(res => {
        this.atypeStorage = JSON.parse(JSON.stringify(res.data))
      })
      let params10 = {
        code: 'pick_permit'
      };
      dictionarysType(params10).then(res => {
        this.pickPermit = JSON.parse(JSON.stringify(res.data))
      })
      let params11 = {
        code: 'limit_type_id'
      };
      dictionarysType(params11).then(res => {
        this.limitType = JSON.parse(JSON.stringify(res.data))
      })
      let params12 = {
        code: 'volume_estimate_id'
      };
      dictionarysType(params12).then(res => {
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
    initStorageArea(current) {
      //根据库区编码获取库区id
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      storageList(this.filteParams(params)).then(res => {
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
      this.sortString = 'warehouseAreaCode,storageAreaCode'
      let warehouseAreaId = ''
      let storageAreaName = ''
      if(this.warehouseAreaCode.length > 0){
        let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaCode == this.formInline.warehouseAreaCode)
        if(key != -1){
          warehouseAreaId = this.warehouseAreaCode[key].warehouseAreaId
        }
      }
      if(this.storageAreaCode.length > 0){
        let key1 = this.storageAreaCode.findIndex(item => item.storageAreaCode == this.formInline.storageAreaCode)
        if(key1 != -1){
          storageAreaName = this.storageAreaCode[key1].storageAreaName
        }
      }
      this.searchParam ={
        warehouseAreaId: warehouseAreaId,
        storageAreaCode: this.formInline.storageAreaCode,
        storageAreaName: storageAreaName,
        sort: this.sortString,
        isAsc: true,//升序
      }
      this.initStorageArea(1);
    },
    closeDialog () { // dialog关闭事件
      this.resetForm('form');
    },
    resetList() {
      this.formInline.warehouseAreaCode = ''
      this.formInline.storageAreaCode = ''
      this.storageAreaCode = []
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      // this.dataTable.start = 1
      // this.initStorageArea()
    },
    initTable() {//清空查询栏信息,下拉框默认“请选择”，下方表格不刷新
      this.formInline.warehouseAreaCode = ''
      this.formInline.storageAreaCode = ''
      this.dataTable.start = 1;
      this.initStorageArea(this.dataTable.start);
    },
    addList() {

      this.storageAreaTitle = '新增';
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;//表格
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });

      this.updateDisabled= false//是否可编辑
      this.addDisables = false //新增不可编辑
      let params = {
        codeName: "WMS_STORAGE_AREA_CODE_CQ"
      }
      codeCharCount(params).then(res => {
        this.codeSize = JSON.parse(JSON.stringify(res.data.codeSize))
        this.isSave = false; // 初始化
      })
    },
    updateList () {
      this.storageAreaTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的储区信息')
        return false
      } else if(len > 1){
        this.$message.warning('修改储区信息不能大于一条');
        return false
      }else{
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        this.addDisables = true //修改显示按钮
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.typeId = String(newForm.typeId)
        newForm.purposeId = String(newForm.purposeId)
        newForm.qualityId = String(newForm.qualityId)
        newForm.attributeId = String(newForm.attributeId)
        newForm.commodityMixtureId = String(newForm.commodityMixtureId)
        newForm.supplierMixtureId = String(newForm.supplierMixtureId)
        newForm.attributeTypeId = String(newForm.attributeTypeId)
        newForm.operationTypeId = String(newForm.operationTypeId)
        newForm.whetherPickArea = String(newForm.whetherPickArea)
        newForm.atypeStorageArea = String(newForm.atypeStorageArea)
        newForm.pickPermit = String(newForm.pickPermit)
        newForm.volumeEstimateId = String(newForm.volumeEstimateId)
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
        // this.$nextTick(() => {
          this.isSave = false;
        // })

      }
    },
    updateForm() {
      let axiosApi;
      let tempForm = this.form
      //获取库区编码
      let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaId == this.form.warehouseAreaId)
      let warehouseAreaCode = ''
      if(key != -1){
        warehouseAreaCode = this.warehouseAreaCode[key].warehouseAreaCode
      }
      tempForm.warehouseAreaCode = warehouseAreaCode//新增时增加库区编码字段
      
      this.storageAreaTitle == '修改' ? axiosApi = storageUpdate(this.form) : axiosApi = storageAdd(this.form);
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.storageAreaTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.sortString = ''
          this.initTable();
        }
      })
    },
    delList() {
      // status
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的储区信息');
        return false
      }
      this.delDialog.modalShow = true;
    },
    removeRow() {
      let storageAreaIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        storageAreaIdArr.push(item.storageAreaId);
      });
      this.storageAreaIds = storageAreaIdArr.join(',');
      let params = {
        storageAreaId: this.storageAreaIds
      }
      storageDel(params).then(res => {
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
      this.initStorageArea(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initStorageArea(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initStorageArea(this.dataTable.start);
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
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     return false;
      //   }
      // });
    },
    //确定保存并生成通道
    createChannelDialog(formName){
      //先调用修改接口，再调用生成通道接口
      let form = this.form
      storageUpdate(form).then(res => {
        if(res.data.status == 10001){
          this.$message.warning('保存失败，无法生成通道！');
        }else{
          this.channelAdd(form)
        }
      })
    },
    createChannel() {
      //生成通道
      let form = this.form
      form.storageAreaId = this.getSelectedRow[0].storageAreaId
      if(this.isSave){
        //有未保存的先提示
        this.isCreateDialog.modalShow = true
      }else{
        this.channelAdd(form)
      }
    },
    channelAdd (form){
      channelAdd([form]).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('生成通道成功')
          //has_channel是否已生成通道  0 已生成  1 未生成
          this.form.hasChannel = 0 
          //弹窗消失
          this.isCreateDialog.modalShow = false
          this.cancel('form');
          this.initTable();
        }
      })
    }
  }
}
