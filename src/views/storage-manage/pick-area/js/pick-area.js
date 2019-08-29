import tableConfigure from '@/components/table/tableConfigure.vue';
import tipsDialog from '@/components/dialog/tipsDialog'
import {
  warehouseAreaList,
  getAblePickStorageAreaList,
  getAblePickChannelList,
  pickUpStorageList,
  insertMainPickUpStorage,
  deleteMainPickUpStorage,
  pickUpStorageDetailsList,
  getDtlAblePickStorageAreaListAdd,
  getDtlAblePickChannelListAddDtl,
  insertDtlPickUpStorage,
  updateDtlPickUpStorage,
  deleteDtlPickUpStorage
} from '@/api/storage-manage/pick-area/pick-area';
import { ownersList } from '@/api/common/business.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType, codeCharCount } from '@/api/common/type.js';//字典返回值，编码规则
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'scheduling',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data(){
    return{
      formInline:{
        warehouseAreaId:'',//拣货库区
        storageAreaId:'',//拣货储区
        channelId:'',//拣货通道
      },
      storageArrPage: 1,
      storagePageData: { // 储区页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      channelArrPage: 1,
      channelPageData: { // 通道页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      storageAddArrPage: 1,
      storageAddPageData: { // 储区页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      channelAddArrPage: 1,
      channelAddPageData: { // 通道页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      storageArrDtlPage: 1,
      storagePageDtlData: { // 新增明细储区页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      channelArrDtlPage: 1,
      channelPageDtlData: { // 通道页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      getSelectedRow: [], // 用户选择的数据
      getSelectedDtlRow: [], // 用户选择的数据
      btnList: [],//主档按钮
      dtlBtnList: [],//主档按钮
      heightResize: true, //表格
      warehouseAreaData:[],//库区信息集合
      storageAreaData:[],//拣货储区集合
      channelData:[],//拣货通道集合
      //调度主表
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        pagerCount: 5,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_BASE_PICK_AREA"
        },
      },
      dataTableDetail:{
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio:false,//单选
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        start: 1,
        limit:10,
        total: 0,
        border: true,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_BASE_RESERVE_PICK_AREA_DTL"
        },
      },
      wareHouseTitle: '新增',
      updateDisabled: false,//修改是否可编辑
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      isSaveDialogDtl: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      form: {//弹窗表单
        warehouseAreaId:'',//拣货库区
        storageAreaId:'',//拣货储区
        channelId:'',//拣货通道
      },
      dialogVisible: false,
      dialogVisibleDtl : false,
      dialogVisibleDtlUpdate : false,
      pickStorageTitle: '主档新增',
      pickStorageDtlTitle:'明细新增',
      pickStorageDtlUpdateTitle : '明细修改',
      rulesForm: {
        warehouseAreaId: [{ required: true, message:'请选择拣货库区',trigger:'change'}],
        storageAreaId: [{ required: true, message: '请选择拣货储区', trigger: 'change' }],
        // channelId: [{ required: true, message: '请选择拣货通道', trigger: 'change' }],
      },
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      delDialogDtl: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      dtlForm : {
        warehouseAreaId:'',//保拣库区
        storageAreaId:'',//保拣储区
        channelId:'',//保拣通道
        priority:'',//优先级别
        warehouseAreaCode:'',//拣货库区
        storageAreaCode:'',//拣货储区
        channelCode:'',//拣货通道
        operationPermitId:'',//可作业标识
        pickAboveId:'',//拣货位上方货位标识
        pickAreaId:'',//拣货id
      },
      dtlRulesForm : {
        warehouseAreaId: [{ required: true, message:'请选择保拣库区',trigger:'change'}],
        storageAreaId: [{ required: true, message: '请选择保拣储区', trigger: 'change' }],
        priority:[{ required: true,pattern: /^(?!0)(?:[0-9]{1,3}|1000)$/, message: '请输入1-1000的数字', trigger: 'change' }],
        operationPermitId:[{ required: true, message: '请选择可作业标识', trigger: 'change' }],
        pickAboveId:[{ required: true, message: '请选择拣货位上方货位标识', trigger: 'change' }],
      },
      dtlUpdateForm:{
        warehouseAreaCodeMain:'',//保拣库区
        storageAreaCodeMain:'',//保拣储区
        channelCodeMain:'',//保拣通道
        warehouseAreaCode:'',//优先级别
        storageAreaCode:'',//拣货库区
        channelCode:'',//拣货储区
        priority:'',//拣货通道
        operationPermitId:'',//可作业标识
        pickAboveId:'',//拣货位上方货位标识

      },
      operationPermitData: [],
      pickAboveData: [],
      searchParam: {}
    }
  },

  created(){
    this.initBtn();
    this.getWarehouseList();

    this.initDictionary();

    // this.findAcceptanceNoteList(1); //首页列表
    // this.getOwnerList(false);
  },
  mounted() {
    this.tableHeight(); // 表格高度
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
    },
    dtlForm: {
      handler: function (newVal, oldVal) {
        for(let item in newVal) {
          if(newVal[item] != this.oldDtlForm[item]){//比较不同的数据返回true
            this.isSaveDtl = true
            return
          }
        };
      },
      deep: true
    },
    dtlUpdateForm: {
      handler: function (newVal, oldVal) {
        for(let item in newVal) {
          if(newVal[item] != this.oldDtlUpdateForm[item]){//比较不同的数据返回true
            this.isSaveDtlUpdate = true
            return
          }
        };
      },
      deep: true
    },
  },
  methods:{

    searchList() {
      this.searchParam = {
        warehouseAreaId: this.formInline.warehouseAreaId,
        storageAreaId: this.formInline.storageAreaId,
        channelId: this.formInline.channelId
      }
      //点击查询需要按照优先级排序，库区根据库区编码
      this.initPickUpStorageList(1);
    },
    removeDtlRow () {
      let dtlIdArr = [];
      this.getSelectedDtlRow.forEach((item, index) => {
        dtlIdArr.push(item.dtlId);
      });
      this.dtlIds = dtlIdArr.join(',');
      let params = {
        dtlIds: this.dtlIds
      }
      deleteDtlPickUpStorage(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialogDtl.modalShow = false;
          this.getPickUpStorageDetailsList(this.dataTableDetail.start);
        }
      })
    },
    delDtlList () {
      if (this.getSelectedDtlRow.length == 0) {
        return this.$message.warning("请选择需要删除的保拣储区关系明细信息");
      }
      this.delDialogDtl.modalShow = true;
    },
    updateDtlPickUpStorage () {
      let params = {
        dtlId : this.dtlUpdateForm.dtlId,
        operationPermitId : parseInt(this.dtlUpdateForm.operationPermitId),
        pickAboveId : parseInt(this.dtlUpdateForm.pickAboveId)
      }
      updateDtlPickUpStorage(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.$message.success("修改成功！");
          for (let item in this.dtlUpdateForm) {
            this.dtlUpdateForm[item] = '';
          };
          this.$refs['dtlUpdateForm'].resetFields();
          this.dialogVisibleDtlUpdate = false;
          this.getPickUpStorageDetailsList(this.dataTableDetail.start);
        };
      });
    },
    submitDtlUpdateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateDtlPickUpStorage();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      })
    },
    editDtlList () {
      if (this.getSelectedDtlRow.length == 0 ) {
        return this.$message.warning("请选择需要修改的保拣储区关系明细信息")
      }else if(this.getSelectedDtlRow.length > 1){
        return this.$message.warning("修改保拣储区关系明细信息不能大于一条")
      }
      this.isSaveDtlUpdate = false;
      this.dtlUpdateForm.warehouseAreaCodeMain = this.getSelectedRow[0].warehouseAreaName;
      this.dtlUpdateForm.storageAreaCodeMain = this.getSelectedRow[0].storageAreaName;
      this.dtlUpdateForm.channelCodeMain = this.getSelectedRow[0].channelName;
      this.dtlUpdateForm.warehouseAreaCode = this.getSelectedDtlRow[0].warehouseAreaName;
      this.dtlUpdateForm.storageAreaCode = this.getSelectedDtlRow[0].storageAreaName;
      this.dtlUpdateForm.channelCode = this.getSelectedDtlRow[0].channelName;
      this.dtlUpdateForm.priority = this.getSelectedDtlRow[0].priority;
      this.dtlUpdateForm.dtlId = this.getSelectedDtlRow[0].dtlId;
      this.dtlUpdateForm.operationPermitId = String(this.getSelectedDtlRow[0].operationPermitId);
      this.dtlUpdateForm.pickAboveId = String(this.getSelectedDtlRow[0].pickAboveId);
      this.dialogVisibleDtlUpdate = true;
      this.oldDtlUpdateForm = JSON.parse(JSON.stringify(this.dtlUpdateForm)); // 获取初始化的数据
    },
    insertDtlPickUpStorage () {
      let params = {
        warehouseAreaId : this.dtlForm.warehouseAreaId,
        storageAreaId : this.dtlForm.storageAreaId,
        channelId : this.dtlForm.channelId,
        priority : this.dtlForm.priority,
        operationPermitId : this.dtlForm.operationPermitId,
        pickAboveId : this.dtlForm.pickAboveId,
        pickAreaId: this.dtlForm.pickAreaId
      }
      insertDtlPickUpStorage(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.$message.success("新增成功！");
          for (let item in this.dtlForm) {
            this.dtlForm[item] = '';
          };
          this.$refs['dtlForm'].resetFields();
          this.dialogVisibleDtl = false;
          this.getPickUpStorageDetailsList(this.dataTableDetail.start);
        };
      });
    },
    submitDtlForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.insertDtlPickUpStorage();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      })
    },
    initDictionary(accumulation) {
      let params = {
        code: 'operation_permit_id'
      }
      dictionarysType(params).then(res => {
        this.operationPermitData = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'pick_above_id'
      }
      dictionarysType(params1).then(res => {
        this.pickAboveData = JSON.parse(JSON.stringify(res.data))
      })
    },
    getAblePickChannelListAddDtl (concatOldData) {
      if (this.dtlForm.storageAreaId == '') {
        this.channelPageDtlData.data = [];
        this.channelPageDtlData.start = 1;
        this.dtlForm.channelId = '';
        return;
      }
      let localArr = this.channelPageDtlData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.dtlForm.warehouseAreaId,
        storageAreaId : this.dtlForm.storageAreaId,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickChannelList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.channelArrDtlPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页储位数据下拉框
    loadMoreAddChannelDtlList() {
      let localArr = this.channelArrDtlPage;
      if (localArr.start == this.channelArrDtlPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.getAblePickChannelListAddDtl(true);
      }
    },
    getDtlAblePickStorageAreaListAdd (concatOldData) {
      if (this.dtlForm.warehouseAreaId == '') {
        this.storagePageDtlData.data = [];
        this.storagePageDtlData.start = 1;
        this.dtlForm.storageAreaId = '';
        this.channelPageDtlData.data = [];
        this.channelPageDtlData.start = 1;
        this.dtlForm.channelId = '';
        return;
      }
      let localArr = this.storagePageDtlData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.dtlForm.warehouseAreaId,
        // attributeTypeId : 2,
        // purposeId : 0,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickStorageAreaList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.storageArrDtlPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页储位数据下拉框
    loadMoreAddStorageDtlList() {
      let localArr = this.storagePageDtlData;
      if (localArr.start == this.storageArrDtlPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.getDtlAblePickStorageAreaListAdd(true);
      }
    },
    getPickUpStorageDetailsList(current){
      let pickAreaIdArr = [];
      // debugger
      this.getSelectedRow.forEach((item, index) => {
        pickAreaIdArr.push(item.pickAreaId);
      });
      this.pickAreaIds = pickAreaIdArr.join(',');
      let params = {
        pickAreaIds: this.pickAreaIds,
        start: current,
        limit: this.dataTableDetail.limit
      }
      pickUpStorageDetailsList(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTableDetail.data = JSON.parse(JSON.stringify(re.records));
        this.dataTableDetail.start = re.current;
        this.dataTableDetail.limit = re.size;
        this.dataTableDetail.total = re.total;
      })
    },
    delList() {
      // status
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的主档信息');
        return false
      }
      this.delDialog.modalShow = true;
    },
    removeRow() {
      let pickAreaIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        pickAreaIdArr.push(item.pickAreaId);
      });
      this.pickAreaIds = pickAreaIdArr.join(',');
      let params = {
        pickAreaIds: this.pickAreaIds
      }
      deleteMainPickUpStorage(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.initPickUpStorageList(1);
        }
      })
    },
    //获取可拣货通道信息集合（主档新增窗口）
    getAblePickChannelListAdd(concatOldData) {
      if (this.form.storageAreaId == '') {
        this.channelAddPageData.data = [];
        this.channelAddPageData.start = 1;
        this.form.channelId = '';
        return;
      }
      let localArr = this.channelAddPageData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.form.warehouseAreaId,
        storageAreaId : this.form.storageAreaId,
        whetherPickArea : 0,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickChannelList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.channelAddArrPage = data.pages; // 总页码
        };
      });
    },
    //主档新增页面获取可拣货储区信息集合（主档新增窗口）
    getAblePickStorageAreaListAdd(concatOldData) {
      if (this.form.warehouseAreaId == '') {
        this.storageAddPageData.data = [];
        this.storageAddPageData.start = 1;
        this.form.storageAreaId = '';
        this.channelAddPageData.data = [];
        this.channelAddPageData.start = 1;
        this.form.channelId = '';
        return;
      }
      this.form.storageAreaId = '';
      this.form.channelId = '';
      let localArr = this.storageAddPageData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.form.warehouseAreaId,
        whetherPickArea : 0,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickStorageAreaList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.storageAddArrPage = data.pages; // 总页码
        };
      });
    },
    closeDialogDtlUpdateForm () {
      this.resetDtlUpdateForm('dtlUpdateForm');
    },
    resetDtlUpdateForm(formName) { // 清空表单
      if (this.isSaveDtlUpdate) {
        this.isSaveDialog.modalShow = true
      }else{
        for (let item in this.dtlUpdateForm) {
          this.dtlUpdateForm[item] = '';
        };
        this.$refs[formName].resetFields();
        this.dialogVisibleDtlUpdate = false;
      }
      this.isSaveDtlUpdate = false;
    },
    closeDialogDtlForm () {
      this.resetDtlForm('dtlForm');
    },
    resetDtlForm(formName) { // 清空表单
      if (this.isSaveDtl) {
        this.isSaveDialog.modalShow = true
      }else{
        for (let item in this.dtlForm) {
          this.dtlForm[item] = '';
        };
        this.$refs[formName].resetFields();
        this.dialogVisibleDtl = false;
        this.isSaveDtl = false;
        this.clearAllData();
      }
    },
    clearAllData () {
      this.channelPageDtlData.data = [];
      this.channelPageDtlData.start = 1;
      this.channelPageDtlData.limit = 10;
      this.dtlForm.channelId = '';
      this.storagePageDtlData.data = [];
      this.storagePageDtlData.start = 1;
      this.storagePageDtlData.limit = 10;
      this.dtlForm.storageAreaId = '';

      this.channelAddPageData.data = [];
      this.channelAddPageData.start = 1;
      this.channelAddPageData.limit = 10;
      this.form.channelId = '';

      this.storageAddPageData.data = [];
      this.storageAddPageData.start = 1;
      this.storageAddPageData.limit = 10;
      this.form.storageAreaId = '';


    },
    closeDialog () {
      this.resetForm('form');
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
      this.isSave = false;
    },
    addList () {
      this.resetForm('form')
      this.dialogVisible = true;
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.isSave=false;
    },
    addDtlList(){
      if (this.getSelectedRow.length == 0 || this.getSelectedRow.length > 1) {
        this.$message.warning("请选择一条主档数据");
        return
      }
      this.$refs['dtlForm'].resetFields();

      this.isSaveDtl=false;
      this.dtlForm.warehouseAreaCode = this.getSelectedRow[0].warehouseAreaName;
      this.dtlForm.storageAreaCode = this.getSelectedRow[0].storageAreaName;
      this.dtlForm.channelCode = this.getSelectedRow[0].channelName;
      this.dtlForm.pickAreaId = this.getSelectedRow[0].pickAreaId;
      this.dialogVisibleDtl = true;
      this.oldDtlForm = JSON.parse(JSON.stringify(this.dtlForm)); // 获取初始化的数据
    },
    insertMainPickUpStorage () {
      let params = {
        warehouseAreaId : this.form.warehouseAreaId,
        storageAreaId : this.form.storageAreaId,
        channelId : this.form.channelId
      }
      insertMainPickUpStorage(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.$message.success("新增成功！");
          for (let item in this.form) {
            this.form[item] = '';
          };
          this.$refs['form'].resetFields();
          this.dialogVisible = false;
          this.isSave = false
          //清空右表数据
          this.initPickUpStorageList();
        };
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.insertMainPickUpStorage();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      })
    },
    // resetDtlForm(formName) { // 清空表单
    //   if(this.isSaveDtl){
    //     this.isSaveDialog.modalShow = true
    //   }else{
    //     for (let item in this.form) {
    //       this.form[item] = '';
    //     };
    //     this.$refs[formName].resetFields();
    //     this.dialogVisibleDtl = false;
    //   }
    // },
    //取消确认弹窗
    cancel(formName){
      for (let item in this.form) {
        this.form[item] = '';
      };
      for (let item in this.dtlForm) {
        this.form[item] = '';
      };
      for (let item in this.dtlUpdateForm) {
        this.form[item] = '';
      };
      this.$refs[formName].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.dialogVisibleDtl = false
      this.dialogVisibleDtlUpdate = false
      this.isSave = false
      this.isSaveDtl = false
      this.isSaveDtlUpdate = false
      this.clearAllData();

    },
    //执行主档列表查询接口
    initPickUpStorageList (current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      pickUpStorageList(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        this.dataTable.start = re.current;
        this.dataTable.limit = re.size;
        this.dataTable.total = re.total;
        //清空右表数据
        this.dataTableDetail.data = [];
        this.dataTableDetail.start = 1;
        this.dataTableDetail.limit = 10;
        this.dataTableDetail.total = 0;
        this.getSelectedRow = []
        this.$nextTick(function () {
            this.$refs.tableConfig.toggleRowSelection(this.dataTable.data[0],true)
        })
      })
    },
    selectWarehouseAreaCode (val) {
      this.getAblePickStorageAreaList();//获取储区编码
    },
    //获取可拣货通道信息集合
    getAblePickChannelList(concatOldData) {
      if (this.formInline.storageAreaId == '') {
        this.channelPageData.data = [];
        this.channelPageData.start = 1;
        this.formInline.channelId = '';
        return;
      }
      let localArr = this.channelPageData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.formInline.warehouseAreaId,
        storageAreaId : this.formInline.storageAreaId,
        whetherPickArea : 0,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickChannelList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.channelArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页通道数据下拉框
    loadMoreChannelList() {
      let localArr = this.channelPageData;
      if (localArr.start == this.channelArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.getAblePickChannelList(true);
      }
    },
    //获取可拣货储区信息集合
    getAblePickStorageAreaList(concatOldData) {
      if (this.formInline.warehouseAreaId == '') {
        this.storagePageData.data = [];
        this.storagePageData.start = 1;
        this.formInline.storageAreaId = '';
        this.channelPageData.data = [];
        this.channelPageData.start = 1;
        this.formInline.channelId = '';
        return;
      }
      let localArr = this.storagePageData;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        warehouseAreaId : this.formInline.warehouseAreaId,
        whetherPickArea : 0,
        start: localArr.start,
        limit: localArr.limit
      };
      getAblePickStorageAreaList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.storageArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页储位数据下拉框
    loadMoreStorageList() {
      let localArr = this.storagePageData;
      if (localArr.start == this.storageArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.getAblePickStorageAreaList(true);
      }
    },
    getWarehouseList() {
      warehouseAreaList().then(res => {
        this.warehouseAreaData = JSON.parse(JSON.stringify(res.data));
      })
    },
    tableHeight() {
      let formHeight = $(".automatic-form").height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height()  - formHeight - this.$store.state.basic.height - 25
      this.dataTableDetail.height = $(window).height() - formHeight - this.$store.state.basic.height - 25
    },

    initTable () { // 初始化表格
      // getAcceptanceNoteList(this.filteParams(this.formInline)).then(res => {
      //     this.dataTable.data = JSON.parse(JSON.stringify(data.records));
      // })
    },

    // 按钮加载函数
    initBtn () {
      let menusKey = 'WMS_PICK_AREA_RELATIONSHIP';
      loaddBtn(menusKey).then(res => {
        for (var i = 0 ; i < res.data.length ; i++) {
          if (res.data[i].menuKey == 'WMS_ABLE_PICK_STORAGE_ADD' || res.data[i].menuKey == 'WMS_ABLE_PICK_STORAGE_DEL') {
            this.btnList.push(res.data[i]);
          } else {
            this.dtlBtnList.push(res.data[i]);
          }
        }
        // this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },

    //调用一个对象的一个方法
    callFn(item) {
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

    // 表单重置
    reseltForm (formName) {
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
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
      this.initPickUpStorageList(1);
    },

    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if(item.prop == 'pickAboveName'){
          item.width = 150
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

    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initPickUpStorageList(this.dataTable.start);
    },
    handleCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initPickUpStorageList(this.dataTable.start);
    },

    handleDetailSizeChange (val) { // size选择
      this.dataTableDetail.start = 1;
      this.dataTableDetail.limit = val;
      // this.dataTable.loading = true;
      this.getPickUpStorageDetailsList(this.dataTableDetail.start);
    },
    handleDetailCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTableDetail.start = val;
      this.getPickUpStorageDetailsList(this.dataTableDetail.start);
    },

    onHandleSelectionChangeDtl(val) {
      this.getSelectedDtlRow = val;
    },
    //选中主表保存数据
    onHandleSelectionChange(val){
      let pickAreaIdArr = [];
      this.getSelectedRow = val;
      if (this.getSelectedRow.length == 0) {
        this.dataTableDetail.data = [];
        this.dataTableDetail.start = 1;
        this.dataTableDetail.limit = 10;
        this.dataTableDetail.total = 0;
        return
      }
      this.getSelectedRow.forEach((item, index) => {
        pickAreaIdArr.push(item.pickAreaId);
      });
      this.pickAreaIds = pickAreaIdArr.join(',');
      let params = {
        pickAreaIds: this.pickAreaIds,
        start: 1,
        limit: this.dataTable.limit
      }
      pickUpStorageDetailsList(params).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTableDetail.data = JSON.parse(JSON.stringify(re.records));
        this.dataTableDetail.start = re.current;
        this.dataTableDetail.limit = re.size;
        this.dataTableDetail.total = re.total;
      })
      // this.getSelectedRow = val;
    },



  }
}
