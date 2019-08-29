import DatePick from '@/components/DatePicker/index';
import tableConfigure from '@/components/table/tableConfigure.vue';
import { dictionarysType, standardDic, standardDicPage, standardDicChild } from '@/api/common/type.js'
import { ownersList } from '@/api/common/business.js';
import { printerputawaytask } from '@/api/common/print.js';
import { loaddBtn } from '@/api/common/load-btn.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
import { importPutawayTaskList, importPutawayTaskDtlList, implementationNotes,
  getSpaceInfoByCode, getLabelInfoByCode } from '@/api/warehousing-management/shelf-receipt/shelf-receipt.js';
import { userFromErp } from '@/api/common/common-info';
import '../shelf-receipt.scss'
import moment from 'moment';
export default {
  name: 'receipt',
  components: {
    DatePick,tableConfigure
  },
  data(){
    let date = new Date()
    let defaultDate = moment(date).format("YYYY/MM/DD HH:mm:ss")
    return {
      formInline: {
        putawayTaskCode: '',//上架单号
        operationTypeId: '', //作业类型
        ownerId: '',//委托业主
        status: '',   //状态
        createTimeStart: '',   //创建时间开始
        createTimeEnd: '',  //创建时间结束
      },
      getSelectedRow: [], // 用户选择的数据
      getSelectedSonRow: [], // 用户选择的子表数据
      isWholeList: '',
      spaceList: [], //储位信息
      labelList: [], //标签信息
      templateId: '', //打印模板
      templateType: '', //打印模板
      btnList: [],//按钮集合
      putawayBtn: [],//回单按钮
      printerBtn: [], //打印按钮
      operationTypeList: [], //作业类型下拉框集合
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      statusList: [],//状态下拉框集合
      shelfNames: [],//上架人
      operatorList: [],//操作人
      heightResize:true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        hasRadio: true, // 单选功能
        border: true,
        start: 1,
        limit:10,
        total: 0,
        radio: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_IMPORT_PUTAWAY_TASK_RETURN_TABLE"
        },
      },
      formTable: {
        createName:"",//制单人
        createTime:'',//制单时间
        editorId: '',//上架人
        editTime:defaultDate,//上架时间
      },
      //副表格
      dataTableDetail:{
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_IMPORT_PUTAWAY_TASK_RETURN_DTL_TABLE"
        },
      },
      pickerBeginDate: {
        disabledDate: (time) => {
          let beginDateVal = new Date();
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      defaultDate: defaultDate,
      searchParam: {}
    }
  },

  created(){
    this.initBtn(); //获取按钮
    this.initDictionaryPermit(); //字典值
    this.getOperatorList(); //操作人
    this.getOwnerList(false);
  },
  mounted() {
    this.tableHeight(); // 表格高度
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch:{
    'dataTableDetail.data':{
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualLargePackageNumber) && reg.test(item.actualMediumPackageNumber) && reg.test(item.actualSmallPackageNumber))) {
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualLargePackageNumber) && reg.test(item.actualMediumPackageNumber) )) {
              return this.$message.warning('请输入整数')
            }
          }
          item.actualCommodityAmount = parseFloat((item.actualLargePackageNumber * item.largePackageCount + item.actualMediumPackageNumber * item.mediumPackageCount + item.actualSmallPackageNumber * item.smallPackageCount).toFixed(6));
          //实际总数量必须小于等于计划总数量
          if((0<item.actualCommodityAmount) && (item.actualCommodityAmount<=item.planCommodityAmount)){
            //不做处理
          }else{
            this.$message.warning('实际上架数量不大于0且小于预上架数量')
          }
        })
　　　},
　　　deep: true
    }
  },
  methods:{
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.createTimeEnd = val + ' 23:59:59';
      }else{
        this.formInline.createTimeEnd = val;
      }
    },
    getStartTime (val) { // 开始日期
      if(val){
        this.formInline.createTimeStart = val + ' 00:00:00';
      }else{
        this.formInline.createTimeStart = val;
      }
    },
    //获取字典值
    initDictionaryPermit() {
      //获取作业类型字典值
      let operationTypeParams = {
        code: 'WMS_OPERATION_TYPE_ID_OTID'
      }
      dictionarysType(operationTypeParams).then(res => {
        this.operationTypeList = JSON.parse(JSON.stringify(res.data))
      })
      //获取状态字典值
      let statusParams = {
        code: 'WMS_IMPORT_PUTAWAY_TASK_STATUSNAME'
      }
      dictionarysType(statusParams).then(res => {
        this.statusList = JSON.parse(JSON.stringify(res.data))
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
        };
      })
    },
    //获取操作人集合
    getOperatorList() {
      let params = {
        isOnWork : true
      }
      userFromErp(params).then(res => {
        this.operatorList = JSON.parse(JSON.stringify(res.data))
      }).catch(error=>{
        this.$message.warning('服务错误');
      });
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_IMPORT_PUTAWAYSTASK_TABLE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.btnList.length; i++) {
          if (this.btnList[i].menuKey == 'WMS_IMPORT_PUTAWAYSTASK_CALL_BACK') {
            this.putawayBtn.push(this.btnList[i])
            continue
          }
          if (this.btnList[i].menuKey == 'WMS_IMPORT_PUTAWAYSTASK_ALL_CALL_BACK') {
            this.putawayBtn.push(this.btnList[i])
            continue
          }
          if (this.btnList[i].menuKey == 'WMS_IMPORT_PUTAWAYSTASK_PRINTER') {
            this.printerBtn.push(this.btnList[i])
            continue
          }
        }
      })
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
    searchList(){
      this.searchParam = {
        putawayTaskCode: this.formInline.putawayTaskCode,
        operationTypeId: this.formInline.operationTypeId,
        ownerId: this.formInline.ownerId,
        status: this.formInline.status,
        createTimeStart: this.formInline.createTimeStart,
        createTimeEnd: this.formInline.createTimeEnd
      }
      this.getImportPutawayTaskList(1)
    },
    //查询主表
    getImportPutawayTaskList(current){
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      importPutawayTaskList(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        if(re.records){
          re.records.forEach((item,index) => {
            item.index = index;
          });
          this.dataTable.data = JSON.parse(JSON.stringify(re.records));
          this.$refs.tableConfig.setCurrentRow();
          this.dataTable.radio = 0
          if(this.dataTable.data.length > 0){
            this.getSelectedRow = [this.dataTable.data[0]]
            this.formTable.createName = this.dataTable.data[0].createName
            this.formTable.createTime = this.dataTable.data[0].createTime
          }
          //查询明细表数据
          if(this.dataTable.data.length > 0){
            let params = {
              putawayTaskId: this.dataTable.data[0].putawayTaskId
            }
            importPutawayTaskDtlList(this.filteParams(params)).then(res => {
              let data = res.data
              if(data.status == 10001){
                this.dataTableDetail.data = []
                this.dataTableDetail.total= 0
              }else{
                data.forEach(item => {
                  if(item.actualLargePackageNumber == null || item.actualLargePackageNumber == 0){
                    item.actualLargePackageNumber = 0
                  }
                  if(item.largePackageCount == null || item.largePackageCount == 0){
                    item.largePackageCount = 0
                    item.disabledLargePackageNumber = true
                  }
                  if(item.actualMediumPackageNumber == null || item.actualMediumPackageNumber == 0){
                    item.actualMediumPackageNumber = 0
                  }
                  if(item.mediumPackageCount == null || item.mediumPackageCount == 0){
                    item.mediumPackageCount = 0
                    item.disabledMediumPackageNumber = true
                  }
                  if(item.actualSmallPackageNumber == null || item.actualSmallPackageNumber == 0){
                    item.actualSmallPackageNumber = 0
                  }
                  if(item.smallPackageCount == null || item.smallPackageCount == 0){
                    item.smallPackageCount = 0
                    item.disabledSmallPackageNumber = true
                  }
                })
                this.dataTableDetail.data = JSON.parse(JSON.stringify(data));
                this.dataTableDetail.total = this.dataTableDetail.data.total;
              }
            })
          }else{
            this.dataTableDetail.data = []
            this.dataTableDetail.total= 0
          }
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        }else{
          re.forEach((item,index) => {
            item.index = index;
          });
          this.dataTable.data = JSON.parse(JSON.stringify(re));
          this.$refs.tableConfig.setCurrentRow();
          this.dataTable.radio = 0
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        }
      })
    },
    //查询子表
    getImportPutawayTaskDtlList(){
      if(this.getSelectedRow.length == 0){
        return;
      }
      let params = {
        putawayTaskId: this.getSelectedRow[0].putawayTaskId
      }
      importPutawayTaskDtlList(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTableDetail.data = [];
          this.dataTableDetail.total= 0;
        }else{
          this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data));
          this.dataTableDetail.total = this.dataTableDetail.data.total;
        }
      })
    },
    //失去焦点触发事件
    onSpaceblur(val){
      if(val.actualSpaceCode == ''){
        return this.$message.warning('实际上架储位编码不能为空')
      }
      let params = {
        spaceCode: val.actualSpaceCode
      }
      getSpaceInfoByCode(this.filteParams(params)).then(res => {
        this.spaceList = JSON.parse(JSON.stringify(res.data));
        if(this.spaceList.spaceId == null){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'不存在')
        }else if(this.spaceList.status == 1){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'为禁用状态')
        }else if(this.spaceList.physicalInventoryStatus == 1){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'为盘点状态')
        }else{
          val.actualSpaceId = this.spaceList.spaceId;
        }
      })
    },
    //失去焦点触发事件
    onLabelblur(val){
      if(val.actualPalletLabelCode == ''){
        return this.$message.warning('实际上架容器编码不能为空')
      }
      let params = {
        labelCode: val.actualPalletLabelCode
      }
      getLabelInfoByCode(this.filteParams(params)).then(res => {
        this.labelList = JSON.parse(JSON.stringify(res.data));
        if(this.labelList.labelId == null){
          this.$message.warning('实际上架容器编码'+ val.actualPalletLabelCode +'不存在')
        }else{
          val.actualPalletLabelId = this.labelList.labelId;
        }
      })
    },
    //失去焦点触发事件
    onNumblur(val){
      let patrn = /^[1-9]\d*$/;
      if(!patrn.test(val.actualCommodityAmount)){
        return this.$message.warning('实际上架数量必须为大于0的数字')
      }
    },
    //上架完成按钮函数
    putawayAccomplish(){
      this.isWholeList = false;
      this.implementationCallBack(this.isWholeList);
    },
    //整单完成按钮函数
    wholeListAccomplish(){
      this.isWholeList = true;
      this.implementationCallBack(this.isWholeList);
    },
    //上架完成/整单完成
    implementationCallBack(val){
      let implementationArray = [];
      if(val){
        if(this.getSelectedRow.length == 0){
          return this.$message.warning('请选择需要整单完成的数据');
        }
        if(this.getSelectedRow.length > 1){
          return this.$message.warning('只能选择一条数据进行整单完成');
        }
        if(this.formTable.editorId == null || this.formTable.editorId == ''){
          return this.$message.warning('上架人不能为空');
        }
        if(this.formTable.editTime == null || this.formTable.editTime == ''){
          return this.$message.warning('上架时间不能为空');
        }
        let detailArray = this.dataTableDetail.data;
        for(let i=0;i<detailArray.length;i++){
          if(detailArray[i].actualSpaceCode == null || detailArray[i].actualSpaceCode == ''){
            return this.$message.warning('实际上架储位编码不能为空');
          }
          if(detailArray[i].actualCommodityAmount == null || detailArray[i].actualCommodityAmount == ''){
            return this.$message.warning('实际上架数量不能为空');
          }
          if(detailArray[i].actualCommodityAmount > detailArray[i].planCommodityAmount){
            return this.$message.warning('实际上架数量不能大于预上架数量')
          }
          if(detailArray[i].actualPalletLabelCode == null || detailArray[i].actualPalletLabelCode == ''){
            return this.$message.warning('实际容器编码不能为空');
          }
          detailArray[i].putawayOperatorId = this.formTable.editorId;
          detailArray[i].putawayTime = this.formTable.editTime;
          // let dataArray = {};
          // dataArray.planSpaceId = detailArray[i].planSpaceId;
          // dataArray.planCommodityAmount = detailArray[i].planCommodityAmount;
          // dataArray.putawayTaskDtlId = detailArray[i].putawayTaskDtlId;
          // dataArray.srcSpaceId = detailArray[i].srcSpaceId;
          // dataArray.putawayTaskId = detailArray[i].putawayTaskId;
          // dataArray.locateDataId = detailArray[i].locateDataId;
          // dataArray.actualCommodityAmount = detailArray[i].actualCommodityAmount;
          // dataArray.actualPalletLabelCode = detailArray[i].actualPalletLabelCode;
          // dataArray.actualPalletLabelId = detailArray[i].actualPalletLabelId;
          // dataArray.actualSpaceCode = detailArray[i].actualSpaceCode;
          // dataArray.actualSpaceId = detailArray[i].actualSpaceId;
          // dataArray.warehouseId = detailArray[i].warehouseId;
          // dataArray.commodityAttributeId = detailArray[i].commodityAttributeId;
          // dataArray.putawayOperatorId = this.formTable.editorId;
          // dataArray.putawayTime = this.formTable.editTime;
          // dataArray.commodityId = detailArray[i].commodityId;
          implementationArray.push(detailArray[i]);
        }
      } else{
        if(this.getSelectedSonRow.length == 0){
          return this.$message.warning('请选择需要上架完成的数据');
        }
        if(this.formTable.editorId == null || this.formTable.editorId == ''){
          return this.$message.warning('上架人不能为空');
        }
        if(this.formTable.editTime == null || this.formTable.editTime == ''){
          return this.$message.warning('上架时间不能为空');
        }
        let temp = this.getSelectedSonRow
        for(let i=0;i<this.getSelectedSonRow.length;i++){
          if(this.getSelectedSonRow[i].actualSpaceCode == null || this.getSelectedSonRow[i].actualSpaceCode == ''){
            return this.$message.warning('实际上架储位编码不能为空');
          }
          if(this.getSelectedSonRow[i].actualCommodityAmount == null || this.getSelectedSonRow[i].actualCommodityAmount == ''){
            return this.$message.warning('实际上架数量不能为空');
          }
          if(this.getSelectedSonRow[i].actualCommodityAmount > this.getSelectedSonRow[i].planCommodityAmount){
            return this.$message.warning('实际上架数量不能大于预上架数量')
          }
          if(this.getSelectedSonRow[i].actualPalletLabelCode == null || this.getSelectedSonRow[i].actualPalletLabelCode == ''){
            return this.$message.warning('实际容器编码不能为空');
          }
          temp[i].putawayOperatorId = this.formTable.editorId;
          temp[i].putawayTime = this.formTable.editTime;
          // let dataArray = {};
          // dataArray.planSpaceId = this.getSelectedSonRow[i].planSpaceId;
          // dataArray.planCommodityAmount = this.getSelectedSonRow[i].planCommodityAmount;
          // dataArray.putawayTaskDtlId = this.getSelectedSonRow[i].putawayTaskDtlId;
          // dataArray.srcSpaceId = this.getSelectedSonRow[i].srcSpaceId;
          // dataArray.putawayTaskId = this.getSelectedSonRow[i].putawayTaskId;
          // dataArray.locateDataId = this.getSelectedSonRow[i].locateDataId;
          // dataArray.actualCommodityAmount = this.getSelectedSonRow[i].actualCommodityAmount;
          // dataArray.actualPalletLabelCode = this.getSelectedSonRow[i].actualPalletLabelCode;
          // dataArray.actualPalletLabelId = this.getSelectedSonRow[i].actualPalletLabelId;
          // dataArray.actualSpaceCode = this.getSelectedSonRow[i].actualSpaceCode;
          // dataArray.actualSpaceId = this.getSelectedSonRow[i].actualSpaceId;
          // dataArray.warehouseId = this.getSelectedSonRow[i].warehouseId;
          // dataArray.commodityAttributeId = this.getSelectedSonRow[i].commodityAttributeId;
          // dataArray.putawayOperatorId = this.formTable.editorId;
          // dataArray.putawayTime = this.formTable.editTime;
          // dataArray.commodityId = this.getSelectedSonRow[i].commodityId;
          implementationArray.push(temp[i]);
        }
      }

      console.log(implementationArray)
      implementationNotes(implementationArray).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }else{
          if(val){
            this.$message.success('整单完成成功!')
            return this.getImportPutawayTaskList(1);
          }else{
            this.$message.success('上架完成成功!')
              return this.getImportPutawayTaskList(1);
          }
        }
      }).catch(error => {
        if(val){
          this.$message.error('整单失败!')
        }else{
          this.$message.error('上架完成失败!')
        }
      })
    },
    //打印
    putawaystaskPrinter(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的上架回单信息');
      }
      if(this.getSelectedRow.length > 1){
        return this.$message.warning('只能选择一条上架回单信息进行打印');
      }
      let params = {
        putawayTaskId : this.getSelectedRow[0].putawayTaskId
      }
      printerputawaytask(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }else{
          let printArray = res.data[0].template;
          if(printArray.length == 0){
            return this.$message.warning('获取打印信息失败');
          }else{
            this.templateId = printArray[0].template_id;
            this.templateType = printArray[0].template_type;
          }
          this.printOk(res.data)
        }
      }).catch(error => {
          this.$message.error('打印失败!')
      })
    },
    //调用ERP打印
    printOk(data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: this.templateId,
        templateType: this.templateType
      }
      print(params);
    },
    // 表单重置
    reseltForm (formName) {
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.$refs.dateComponents.resetTime();
    },
    tableHeight() {
      // let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = ($(window).height()  - this.$store.state.basic.height)/3;
      this.dataTableDetail.height = ($(window).height()  - this.$store.state.basic.height)/2;
    },
    // tableDataHandle(data) { // table数据处理函数
    //   let handleTableData = JSON.parse(JSON.stringify(data));
    //   handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
    //     item.label = item.fieldName; //表头名称
    //     item.id = item.fieldId; // 表头ID
    //     item.sortable = false; // 是否要排序
    //     item.prop = item.propName; // 这个是相应的显示字段
    //     item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
    //   });
    //   this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
    //   this.dataTableLeft.radio = 0;
    //   // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
    //   this.dataTable.tableStyle = { // 表格的样式
    //     textAlign: 'center',
    //     width: '100%'
    //   };
    //   this.dataTable.headerCellStyle = { // 表头文字的样式
    //     textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
    //   };
    //   // this.domShow = false; // 为了让组件重新渲染更新
    //   this.$refs.tableConfig.domShow = false;
    //   this.$nextTick(() => {
    //     // this.domShow = true;
    //     this.$refs.tableConfig.domShow = true;
    //     // this.dataTable.loading = false; // loading事件取消
    //     this.$refs.tableConfig.dialogVisible = false;
    //     // this.dialogVisible = false; // 表格配置弹出框隐藏
    //   });
    // },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        // if (item.prop == 'arrivalNoticeCode') {
        //   item.hasCenterCol = true;
        //   item.show = 'template'
        // }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      this.dataTable.radio = 0;
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
        // this.dataTableLeft.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      this.getImportPutawayTaskList(1);
    },
    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'actualLargePackageNumber' || item.prop == 'actualMediumPackageNumber' || item.prop == 'actualSmallPackageNumber' ||item.prop=='actualSpaceCode'||item.prop=='actualPalletLabelCode') {
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
    onRowClick (val) { // 表格行点击
      this.dataTable.radio = val.row.index;
      this.getSelectedRow = [val.row];
      this.getSelectedSonRow = [];
      this.dataTableDetail.data = [];
      this.dataTableDetail.start = 1;
      this.dataTableDetail.limit = 100;
      this.dataTableDetail.total = 0;
      let params = {
        putawayTaskId: val.row.putawayTaskId
      }
      this.formTable.createName = val.row.createName;
      this.formTable.createTime = val.row.createTime;
      this.getImportPutawayTaskDtlList();
      // importPutawayTaskDtlList(this.filteParams(params)).then(res => {
      //   let data = res.data
      //   if(data.status == 10001){
      //     this.dataTableDetail.data = [];
      //     this.dataTableDetail.total= 0;
      //   }else{
      //     this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data));
      //     this.dataTableDetail.total = this.dataTableDetail.data.total;
      //   }
      // })
    },
    onHandleSelectionChange(val){
      // console.log(val)
      // this.getSelectedRow = val;
      // this.getSelectedSonRow = [];
      // this.dataTableDetail.data = [];
      // this.dataTableDetail.start = 1;
      // this.dataTableDetail.limit = 100;
      // this.dataTableDetail.total = 0;
      // if(this.getSelectedRow.length == 0){
      //   this.formTable.createName = '';
      //   this.formTable.createTime = '';
      // }else{
      //   if(this.getSelectedRow[0]){
      //     this.formTable.createName = this.getSelectedRow[0].createName;
      //     this.formTable.createTime = this.getSelectedRow[0].createTime;
      //     this.getImportPutawayTaskDtlList();
      //   }
      // }
      // console.log(this.formTable)
    },
    onHandleSelectionSonChange(val){
      this.getSelectedSonRow = val;
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.getImportPutawayTaskList(this.dataTable.start);
    },
    handleCurrentChange (val) { // 页码选择
      this.dataTable.start = val;
      this.getImportPutawayTaskList(this.dataTable.start);
    },
  }
}
