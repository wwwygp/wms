// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { storageList, storageUpdate, storageDel, storageAdd, allStorageArea,storageListById} from '@/api/storage-manage/warehouse-area/storage';
import { allBaseWareHouseArea } from '@/api/storage-manage/warehouse-area/warehouse-area';
import { channelAdd, allChannel } from '@/api/storage-manage/warehouse-area/channel';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog';
import {getPrint,getSpacePrint} from '@/api/common/print.js'; // 打印功能
import {getUserInfo} from '@/api/login.js'; // 用户信息
import {spacePrinterList,baseSpaceDel,baseSpaceUpdate,baseSpaceAdd,sysCustomerParam,useSpace,disabledSpace,getStockCommodityInfoBySpaceIds} from '@/api/storage-manage/warehouse-area/space'; // 储位查询
import {print} from '@/api/common/print-api.js'; // 调用打印机
import selfDialog from '@/components/selfDialog/selfDialog';

// getUserInfo @/api/login.js
import '../style/index.scss';
export default {
  name: 'space',
  components: {
    // tableConfigure: {
    //   template: '<el-button v-for="item in centerSlot"><slot name="item"></slot></el-button>'
    // },
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    var validatecolumnSpace = (rule,value,callback) => {
      var value = String(value);
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (value == '') {
        callback(new Error('储格位不能为空'));
      } else if (!reg.test(value)){
        callback(new Error('请输入'+ this.positionMaxLength+'位正整数'))
      } else if (value.length !=this.positionMaxLength) {
        callback(new Error('请输入'+ this.positionMaxLength+'位字符'))
      } else {
        callback();
      }
    }
    var validateStorageColumn = (rule,value,callback) => {
      var value = String(value);
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (value == '') {
        callback(new Error('储格列不能为空'));
      } else if (!reg.test(value)){
        callback(new Error('请输入'+ this.columnMaxLength+'位正整数'))
      } else if (value.length !=this.columnMaxLength) {
        callback(new Error('请输入'+ this.columnMaxLength+'位字符'))
      } else {
        callback();
      }
    }
    var validateStorageRow = (rule,value,callback) => {
      var value = String(value);
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (value == '') {
        callback(new Error('储格层不能为空'));
      } else if (!reg.test(value)){
        callback(new Error('请输入'+ this.layerMaxLength+'位正整数'))
      } else if (value.length !=this.layerMaxLength) {
        callback(new Error('请输入'+ this.layerMaxLength+'位字符'))
      } else {
        callback();
      }
    }
    return {
      centerSlot: [], // 存放单独处理的dom结构
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      storageAreaTitle: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的储位信息?'
      },
      useStatusDialog: {
        modalClickShow: false,
        title: '启用',
        modalShow: false,
        text: '是否确定启用勾选的储位信息?'
      },
      disabledStatusDialog: {
        modalClickShow: false,
        title: '禁用',
        modalShow: false,
        text: '是否确定禁用勾选的储位信息?'
      },
      saveDialog: {
        modalClickShow: false,
        title: '提示',
        modalShow: false,
        text: '该数据未保存，是否放弃编辑?'
      },
      dialogVisible: false,
      formInline: {//主页表单
        warehouseAreaCode: '',//库存编码
        storageAreaCode: '',//储区编码
        spaceCode: '', // 储位编码
        channel: '', // 通道
        warehouseAreaId: '',
        storageCodeId: '', // 储区ID
        channelName: '',//通道全称
        storageRowCode: '', // 储格层
        storageColumnCode: '', // 储格列
        columnSpaceCode: '', // 储格位
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
        },
        // hasOperation: true,
        operation: {             // 操作功能
          label: '操作',                // 操作列的行首文字
          width: '200',                // 操作列的宽度
          className: '',               // 操作列的class名
          data: [                      // 操作列数据
            {
                label: '修改',                // 按钮文字
                Fun: 'updateSumbit',         // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '1',                     // 按钮循环组件的key值
                classname: 'blue'            // 按钮的类名
            }
          ]
        },
      },
      tableName: {
        tableCode: "WMS_SPACE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      isSave: false, // 是否用户有输入过
      form: {//弹窗表单
        warehouseId: '',//所属仓库id 必填
        warehouseAreaId: '',//库区id 必填
        storageAreaCode: '',//储区编码
        storageAreaId: '', // 储区ID
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
        atypeStorageSpace:'',//是否A类储区 必填
        pickPermit: '',//允许拣货标识 必填
        floor: '',//楼层
        palletPercentage: '',//板出比率 必填
        // palletIntoPercentage: '',//板入比率
        limitTypeId: '',//入库类型限制id 必填
        limitValue: '',//:限制值 必填
        volumeEstimateId: '',//容器试算标识 必填
        hasChannel: '',//是否已生成通道
        remark: '',//备注
        channel: '', // 通道编码
        channelId: '',// 通道ID
        channelName: '', // 通道全称
        storageColumnCode: '', // 所在列
        columnSpaceCode: '', // 所在位
        storageRowCode: '', // 所在层
        weightMaximum: '', // 最大存储重量
        volumeMaximum: '', // 最大存储体积
        physicalInventoryStatus: '', // 盘点状态
        spaceCode: '', // 储位编码
        status: '', // 储位状态

      },
      rulesForm: {
        volumeMaximum: [
          { required: true, message: '存储体积不能为空', trigger: 'change'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
        ],// 存储体积 必填
        weightMaximum: [
          { required: true, message: '存储重量不能为空', trigger: 'change'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
        ],// 存储重量 必填
        caseMaximum: [
          { required: true, message: '存储箱数不能为空', trigger: 'change'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
        ],// 存储箱数 必填
        palletMaximum: [
          { required: true, message: '存储板数不能为空', trigger: 'change'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
        ],// 存储板数 必填
        status: [{ required: true, message: '储位状态不能为空', trigger: 'change'}],// 储位状态 必填
        physicalInventoryStatus: [{ required: true, message: '盘点状态不能为空', trigger: 'change'}],// 盘点状态 必填
        storageColumnCode: [
          // { required: true, message: '储格列不能为空', trigger: 'change'},
          // { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'},
          {validator:validateStorageColumn, trigger: 'blur'}
          ],// 所在列 必填
        columnSpaceCode: [
          // { required: true, message: '储格位不能为空', trigger: 'change'},
          // { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'},
          { validator: validatecolumnSpace, trigger: 'blur' }
        ],// 所在位 必填
        storageRowCode: [
          // { required: true, message: '储格层不能为空', trigger: 'change'},
          // { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
          { validator: validateStorageRow, trigger: 'blur' }
        ],// 所在层 必填
        //warehouseId: [{ required: true, message: '不能为空', trigger: 'change'}],//所属仓库id 必填
        warehouseAreaId: [{ required: true, message: '库区编码不能为空', trigger: 'change'}],//库区id 必填
        storageAreaCode: [{ required: true, message: '储区编码不能为空', trigger: 'change'}], //储区编码 必填
        channel: [{ required: true, message: '通道编码不能为空', trigger: 'change'}], // 通道编码 必填
        typeId: [{ required: true, message: '储区类型不能为空', trigger: 'change'}],//储区类型id   必填
        purposeId: [{ required: true, message: '储区用途不能为空', trigger: 'change'}],//储区用途id 必填
        qualityId: [{ required: true, message: '储区品质不能为空', trigger: 'change'}],//储区品质id 必填
        attributeId: [{ required: true, message: '储区属性不能为空', trigger: 'change'}],//储区属性id  必填
        commodityMixtureId: [{ required: true, message: '混载标识不能为空', trigger: 'change'}],//混载标识id 必填
        atypeStorageSpace: [{ required: true, message: 'A类储位不能为空', trigger: 'change'}],//A类储位 必填
        supplierMixtureId: [{ required: true, message: '供应商混载标识不能为空', trigger: 'change'}],//供应商混载标识id 必填
        attributeTypeId: [{ required: true, message: '属性类型不能为空', trigger: 'change'}],//属性类型id 必填
        operationTypeId: [{ required: true, message: '作业类型不能为空', trigger: 'change'}],//作业类型id 必填
        channelAmount: [{ required: true, message: '通道数不能为空', trigger: 'change'}],//通道数 必填
        whetherPickArea: [{ required: true, message: '是否拣货区不能为空', trigger: 'change'}],//是否拣货区 必填
        atypeStorageChannel:[{ required: true, message: '是否A类储区不能为空', trigger: 'change'}],//是否A类储区 必填
        pickPermit: [{ required: true, message: '允许拣货标识不能为空', trigger: 'change'}],//允许拣货标识 必填
        palletPercentage: [{ required: true, message: '板出比率不能为空', trigger: 'change'}],//板出比率 必填
        // palletIntoPercentage: [{ required: true, message: '库区编码不能为空', trigger: 'change'}],//板入比率
        limitTypeId: [{ required: true, message: '入库类型限制不能为空', trigger: 'change'}],//入库类型限制id 必填
        limitValue: [
          { required: true, message: '限制值不能为空', trigger: 'change'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message:'请输入正整数',trigger:'change'}
        ],//限制值 必填
        volumeEstimateId: [{ required: true, message: '容器试算标识不能为空', trigger: 'change'}],//容器试算标识 必填
      },
      storageAreaIds: '',//删除的储区id
      updateDisabled: false,
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
      isShow:false,//是否显示,
      channelData: [], // 通道数据
      channelTableData: {// 通道下拉表格数据
        start : 1,
        limit: 10
      },
      channelPage: 1,//通道页面
      printDialogVisible: false, // 显示打印还是什么
      parintData: '', // 打印机选择的类型
      parintType: [], // 打印机类型
      statusType: [], // 储位状态
      physicalInventoryStatusType: [], // 盘点状态
      printTypeData: [],
      spacePrintData: '', // 打印类型数据
      getSpacePrintTypeId: '', // 打印模板ID
      spaceIds: '', // 库位ID

      printShow: true,
      userInfoWarehouseId: '', // 仓库ID
      layerMaxLength: 1, // 储格层长度限制
      columnMaxLength:1, // 列限制
      positionMaxLength: 1, // 位限制
      sortString: '',//根据优先级排序
      searchParam: {}
    }
  },
  created() {
    this.sortString = 'spaceCode'//根据优先级排序
    this.initBtn();
    this.initDictionary();//从字典中获取配置参数
    this.getAllBaseWareHouseArea();//获取库区编码
    this.initUserInfo(); // 用户信息
    // this.getAllChannel(); // 获取通道
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
    'form.storageAreaCode': 'handleChannelName',
    'form.channelName': 'handleSpaceCode',
    // 'form.storageRow': 'handleSpaceCode',
    // 'form.columnSpace': 'handleSpaceCode',
    // 'form.storageColumn': 'handleSpaceCode'
    // 'form.channel': 'handleChannelName'
  },
  methods: {
    disabledStatus() {
      if (this.getSelectedRow.length == 0) {
        this.$message.warning("请选择需要禁用的储位！")
        return
      }
      for (var i = 0 ; i < this.getSelectedRow.length ; i++){
        if (this.getSelectedRow[i].status == 1) {
          this.$message.warning("已经禁用的储位不能再次禁用！")
          return;
        }
      }
      this.disabledStatusDialog.modalShow = true;
    },
    disabledStatusSure () {
      let spaceIds = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++){
        spaceIds = spaceIds + this.getSelectedRow[i].spaceId + ","
      }
      let param = {
        spaceIds : spaceIds
      }
      getStockCommodityInfoBySpaceIds(param).then(res => {
        if (res.data.status == 10001){
          this.$message.warning(res.data.message);
          this.disabledStatusDialog.modalShow = false;
        } else if (res.data != null && res.data.length > 0){
          let spaceCodes = '';
          for (var i = 0 ; i < this.getSelectedRow.length ; i++) {
            for (var j = 0 ; j < res.data.length ; j++){
              if (this.getSelectedRow[i].spaceId == res.data[j].spaceId){
                if (i == this.getSelectedRow.length - 1){
                  spaceCodes = spaceCodes + this.getSelectedRow[i].spaceCode
                } else {
                  spaceCodes = spaceCodes + this.getSelectedRow[i].spaceCode + ","
                }
                break
              }
            }
          }
          this.$message.warning("储位编码:"+spaceCodes+"下存在库存，不允许禁用！");
          this.disabledStatusDialog.modalShow = false;
        } else {
          disabledSpace(param).then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message);
              this.disabledStatusDialog.modalShow = false;
            } else {
              this.disabledStatusDialog.modalShow = false;
              this.$message.success("禁用成功！")
              this.initWarehouseArea();
            }
          })
        }
      })
    },
    useStatus (){
      if (this.getSelectedRow.length == 0) {
        this.$message.warning("请选择需要启用的储位信息！")
        return
      }
      for (var i = 0 ; i < this.getSelectedRow.length ; i++){
        if (this.getSelectedRow[i].status == 0) {
          this.$message.warning("只有禁用的储位才能启用！")
          return;
        }
      }
      this.useStatusDialog.modalShow = true;
    },
    useStatusSure(){
      let spaceIds = '';
      for (var i = 0 ; i < this.getSelectedRow.length ; i++){
        spaceIds = spaceIds + this.getSelectedRow[i].spaceId + ","
      }
      let param = {
        spaceIds : spaceIds
      }
      useSpace(param).then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message);
          this.useStatusDialog.modalShow = false;
        } else {
          this.useStatusDialog.modalShow = false;
          this.$message.success("启用成功！")
          this.initWarehouseArea();
        }
      })
    },
    handleCode () {
      this.handleSpaceCode();
    },
    handleSpaceCode () { // 储位编码处理
      let that = this;
      // let rowLen = this.form.storageRow.length;
      // let columnLen = this.form.columnSpace.length;
      // let storageLen = this.form.storageColumn.length;
      // if (rowLen != 0 && columnLen !=0 && storageLen !=0) { // 都不等于0在处理
      //   if (rowLen < this.layerMaxLength) { // 小于的话就自己补
      //     let len = Number(this.layerMaxLength) - Number(rowLen);
      //     for (let i = 0; i < len; i++) { // 少多少补多少
      //       this.form.storageRow = '0'+ this.form.storageRow;
      //     }
      //   }
      //   if (columnLen < this.positionMaxLength) { // 小于的话就自己补
      //     let len = Number(this.positionMaxLength) - Number(columnLen);
      //     for (let i = 0; i < len; i++) { // 少多少补多少
      //       this.form.columnSpace = '0'+ this.form.columnSpace;
      //     }
      //   }
      //   if (storageLen < this.columnMaxLength) { // 小于的话就自己补
      //     let len = Number(this.columnMaxLength) - Number(storageLen);
      //     for (let i = 0; i < len; i++) { // 少多少补多少
      //       this.form.storageColumn = '0'+this.form.storageColumn;
      //     }
      //   };
      //   
        this.form.spaceCode = this.form.channelName + this.form.storageColumnCode + this.form.columnSpaceCode+ this.form.storageRowCode
      // }
    },
    updateSumbit (a,b) {
    },
    //处理通道全程
    handleChannelName () {
      //根据库区id获取库区编码
      if(this.storageAreaTitle == '新增'){
        this.form.channelName = ''
      }
    },
    closeDialog () {
      this.resetForm('form');
    },
    selectStorageAreaCode (val) {
      this.storageAreaCode.forEach(item => {
        if (item.storageAreaId == val) {
          this.form.storageAreaName = item.storageAreaName;
          this.form.storageAreaId = val;
          //选择储区编码后将通道置空
          this.form.channel = '';
        }
      });
      //选择新的储区编码后将通道编码数据清空
      this.channelData = []
      this.getAllChannel(val,false);
      this.getInitDefault(val)
    },
    getInitDefault (val) { // 获取新增带出的默认数据
      let params = {
        storageAreaId: val
      };
      storageListById(params).then(res => {
        let data = res.data;
        this.form.commodityMixtureId = String(data.commodityMixtureId); // 混载标识
        this.form.supplierMixtureId = String(data.supplierMixtureId); // 供应商混载标识
        this.form.volumeEstimateId = String(data.volumeEstimateId); // 容器试算标识
        this.form.pickPermit = String(data.pickPermit); // 允许拣货标识
        // this.form.atypeStorageSpace = String(data.atypeStorageSpace); // 是否A类储位
        // this.form.status = String(data.status); // 储位状态
        // this.form.physicalInventoryStatus = String(data.physicalInventoryStatus); // 盘点状态
      })
    },
    selectChannelCode (val) {
      this.channelData.forEach(item => {
        if (item.channelId == val) {
          this.form.channel = item.channelCode;
          this.form.channelId = val;

          this.form.channelName = item.channelName;
        }
      });
    },
    //主页表单 选择储区数据 formInline
    selectStorageCode (val) {
      let key = this.storageAreaCode.findIndex(item => item.storageAreaId == val)
      let storageAreaCode = ''
      if(key != -1){
        storageAreaCode = this.storageAreaCode[key].storageAreaCode
      }
      // this.formInline.storageCodeId = val;
      this.formInline.storageAreaCode = storageAreaCode
      this.getAllChannel(val)
    },
    //formInline
    selectChannel(val) {
      let key = this.channelData.findIndex(item => item.channelId == val)
      let channelName = ''
      if(key != -1){
        channelName = this.channelData[key].channelName
      }
      // this.formInline.storageCodeId = val;
      this.formInline.channelName = channelName
    },
    //formInline
    selectWarehouseAreaCode (val) {
      this.storageAreaCode = []
      this.formInline.storageAreaCode = ''
      this.formInline.channel = '';
      this.formInline.warehouseAreaCode = val;
      this.getAllStorageArea();//获取储区编码
    },
    changeWareHouse (val) {
        this.warehouseAreaCode.forEach(item => {
          if (item.warehouseAreaId == val) {
            this.form.warehouseAreaName = item.warehouseAreaName;
            this.form.warehouseId = val;
          }
        });
        //选择库区后，并储区和通道置空
        this.form.storageAreaCode = ''
        this.form.channel = ''
        this.getdiallogAllStorageArea();
    },
    printOk () { // 确定打印
      let params = {
        dataSource: JSON.stringify(this.spacePrintData),
        templateId:this.getSpacePrintTypeId,
        templateType: 49
      };
      print(params);
      this.parintData = '';
      this.printDialogVisible = false;
    },
    canelPrint () { // 打印取消
      this.parintData = '';
      this.printDialogVisible = false;
    },
    getSpacePrintType (val) { // 获取储位打印类型
      // let params = {
      //   printingTypeId: 2
      // };
      let params;
      if(this.getSelectedRow.length > 0){
        let spaceIds = [];
        for(let space of this.getSelectedRow){
          spaceIds.push(space.spaceId);
        }
        params = {
          spaceIds: spaceIds.join(",")
        }
      }else{
        params = {
          printingTypeId: 2,
          warehouseAreaId: this.formInline.warehouseAreaId,
          storageAreaId: this.formInline.storageCodeId,
          channelId: this.formInline.channel,
          spaceCode: this.formInline.spaceCode,
        };
      }

      // let params = Object.assign({},this.formInline,{printingTypeId: 2})
      this.getSpacePrintTypeId = val;
      getSpacePrint(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message);
          this.printShow = true;
        } else {
          this.printShow = false;
          this.spacePrintData = res.data.date;
        }
      })
    },
    printDialog () { // 打印

      this.printDialogVisible = true;
      this.printTypeApi();
    },
    printTypeApi () {
      this.printTypeData = []; // 置空
      let params = {
        userId: ''
      };
      getUserInfo().then(res => {
        res.data.userId ? params.userId =res.data.userId : params.userId = res.data.UserId;
        getPrint(params).then(re => {
          let data = re.data;
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else {
            this.printTypeData = JSON.parse(JSON.stringify(data)); // 目前只取第二种
          }
        })
      })




    },
    loadMoreChannel () {
      if (this.channelTableData.start == this.channelPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.channelTableData.start = this.channelTableData.start + 1;
        let accumulationData = true;
        let key = this.storageAreaCode.findIndex(item => item.storageAreaCode == this.formInline.storageAreaCode)
        let storageAreaId = ''
        if(key != -1){
          storageAreaId = this.storageAreaCode[key].storageAreaId
        }
        this.getAllChannel(storageAreaId, accumulationData);
      }
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
    getAllBaseWareHouseArea (accumulation) { // 获取码头
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.warehouseAreaCode));
      let params = JSON.parse(JSON.stringify(this.warehouseAreaData));
      allBaseWareHouseArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // if (this.dialogVisible) { // 如果是有弹窗显示
          //   this.dialogWarehouseAreaCode
          // }
          // accumulation // 需要累加
          accumulation ? this.warehouseAreaCode = oldData.concat(res.data): this.warehouseAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    getdiallogAllStorageArea(accumulation){
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.storageAreaCode))
      let params = JSON.parse(JSON.stringify(this.storageAreaData))
      //根据库区编码获取库区id
      // let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaCode == this.form.warehouseAreaCode)
      // let warehouseAreaId = '';
      // if(key != -1){
      //   warehouseAreaId = this.warehouseAreaCode[key].warehouseAreaId
      // };
      params.warehouseAreaId = this.form.warehouseAreaId;
      allStorageArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.storageAreaCode = oldData.concat(res.data): this.storageAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      });
    },
    getAllStorageArea(accumulation){
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.storageAreaCode))
      let params = JSON.parse(JSON.stringify(this.storageAreaData))
      //根据库区编码获取库区id
      let key = this.warehouseAreaCode.findIndex(item => item.warehouseAreaCode == this.formInline.warehouseAreaCode)
      let warehouseAreaId = '';
      if(key != -1){
        warehouseAreaId = this.warehouseAreaCode[key].warehouseAreaId
      };
      params.warehouseAreaId = warehouseAreaId;
      this.formInline.warehouseAreaId = warehouseAreaId;
      allStorageArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.storageAreaCode = oldData.concat(res.data): this.storageAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      });
    },
    getAllChannel (storageAreaId,accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.channelData))
      let params = {
        storageAreaId: storageAreaId
      };
      allChannel(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // accumulation // 需要累加
          accumulation ? this.channelData = oldData.concat(res.data): this.channelData = JSON.parse(JSON.stringify(res.data));
        }
      })
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
        code: 'atype_storage_space'
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
      });
      let params13 = {
        code: 'space_status'
      };
      dictionarysType(params13).then(res => {
        this.statusType = JSON.parse(JSON.stringify(res.data));
      });
      let params14 = {
        code: 'physical_inventory_status'
      };
      dictionarysType(params14).then(res => {
        this.physicalInventoryStatusType = JSON.parse(JSON.stringify(res.data));
      });
    },
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '40';
    },
    saveSpaceData () { // 是否保存
      this.saveDialog.modalShow = false;
      this.$refs['form'].resetFields();
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.dialogVisible = false;
    },
    resetForm(formName) { // 清空表单
      if (this.isSave) { // 用户有动数据给提示
        this.saveDialog.modalShow = true;
      } else {
        this.saveDialog.modalShow = false;
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
          for (let item in this.form) {
            this.form[item] = JSON.parse(JSON.stringify(''));
          };
          this.oldForm = JSON.parse(JSON.stringify(this.form)); // 初始化
          this.dialogVisible = false;
        })


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
      let menusKey = 'WMS_SPACE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initWarehouseArea(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      spacePrinterList(this.filteParams(params)).then(res => {
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
      this.sortString = 'spaceCode'//根据优先级排序
      //根据库区编码获取库区id
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
      this.searchParam = {
        warehouseAreaId: warehouseAreaId,
        storageAreaCode: this.formInline.storageAreaCode,
        storageAreaName: storageAreaName,
        storageAreaId: this.formInline.storageCodeId, // 储区id
        channelId: this.formInline.channel, // 通道ID
        spaceCode: this.formInline.spaceCode, // 储位编码
        storageColumnCode: this.formInline.storageColumnCode,
        columnSpaceCode: this.formInline.columnSpaceCode,
        storageRowCode: this.formInline.storageRowCode,
        sort: this.sortString,
        isAsc: true,//升序
      }
      this.initWarehouseArea(1)
    },
    resetList() {
      for (let item in this.formInline) {
        this.formInline[item] = '';
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.storageCodeId = '';
      this.storageAreaCode = [];
      this.channelData = [];
      // warehouseAreaCode: '',//库存编码
      //   storageAreaCode: '',//储区编码
      //   spaceCode: '', // 储位编码
      //   channel: '' // 通道
      // this.dataTable.start = 1
      // this.initWarehouseArea()
    },
    addList() {
      this.storageAreaTitle = '新增';
      for (let item in this.form) {
        this.form[item] = JSON.parse(JSON.stringify(''));
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
        this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
        this.isSave = false; // 初始化
        // this.form = JSON.parse(JSON.stringify(this.oldForm))
        this.updateDisabled= false;
        this.storageAreaCode = [];
        this.channelData = [];
      });

      // this.isShow = false //新增不显示按钮
    },
    updateList () {
      this.storageAreaTitle = '修改';
      this.isSave = false;
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的储位信息')
      } else if (len > 1){
        this.$message.warning('修改储位信息不能大于一条')
      } else {
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        this.isShow = true //修改显示按钮
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
        newForm.atypeStorageSpace = String(newForm.atypeStorageSpace)
        newForm.pickPermit = String(newForm.pickPermit)
        newForm.volumeEstimateId = String(newForm.volumeEstimateId)
        newForm.channel = newForm.channelCode;
        newForm.physicalInventoryStatus = String(newForm.physicalInventoryStatus)
        newForm.status = String(newForm.status);
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(this.form));
      }
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let axiosApi;
          this.storageAreaTitle == '修改' ? axiosApi = baseSpaceUpdate(this.form) : axiosApi = baseSpaceAdd(this.form);
          axiosApi.then(res => {
            if(res.data.status == 10001){
              this.$message.warning(res.data.message);
            }else{
              this.storageAreaTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
              this.dialogVisible = false;
              this.sortString = ''
              this.resetList();
              this.searchList();
            }
          })
        } else {
          return false;
        }
      })

    },
    delList() {
      // status
      // let notDel = this.getSelectedRow.every((item,index) => {
      //   return item.status != 1 // 1为启用
      // });
      // if (!notDel) {
      //   this.$message.warning('启用状态下的库区信息不能删除');
      //   return false;
      // }
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要删除的储位信息');
      } else {
        this.delDialog.modalShow = true;
      }
    },
    handleNoTip () {
      this.dialogVisible = true;
    },
    removeRow() {
      let spaceIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        spaceIdArr.push(item.spaceId);
      });
      this.spaceIds = spaceIdArr.join(',');
      baseSpaceDel(this.spaceIds).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
          this.delDialog.modalShow = false;
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.resetList();
          this.dataTable.start = 1
          this.sortString = ''
          this.initWarehouseArea(1)
        }
      })
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      let centerSlot = []; // 存放需要单独处理结构的
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        // if (item.prop == 'remark') {
        //   centerSlot.push(item.prop);
        //   item.hasCenterCol = true; // 中间是否需要
        // } else {
        //   item.hasCenterCol = false; // 中间是否需要
        // };
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.centerSlot = JSON.parse(JSON.stringify(centerSlot));
      // this.tablelist();
      // 数据copy表头数据不用管

      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        // width: '100%'
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
      this.initWarehouseArea(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initWarehouseArea(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initWarehouseArea(this.dataTable.start);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    createChannel() {
      //生成通道
      let form = this.form
      form.storageAreaId = this.getSelectedRow[0].storageAreaId
      channelAdd([form]).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('生成通道成功')
          //has_channel是否已生成通道  0 已生成  1 未生成
          this.form.hasChannel = 0
          // this.delDialog.modalShow = false;
          // this.resetList();
        }
      })
    },
    initParam (code,type) { // code是储格这些code,type是类型0是列，1是格，2是层
      let params = {
        dimensionId: this.userInfoWarehouseId,
        settingDefCode: code,
        dimensionDefCode: 'warehouse' // 先写死
      };
      sysCustomerParam(params).then(res => {
        if (type == 0) {
          this.columnMaxLength = res.data[0].settingParamName;
        } else if (type == 1) {
          this.positionMaxLength = res.data[0].settingParamName;
        } else if (type == 2) {
          this.layerMaxLength = res.data[0].settingParamName;
        }
      })
    },
    initUserInfo () {
      getUserInfo().then(res => {
        if (res.data) {
          if (res.data.warehouseId) {
            this.userInfoWarehouseId = res.data.warehouseId; // 仓库ID
          } else {
            this.userInfoWarehouseId = res.data.WarehouseId; // 仓库ID
          }
        } else {
          if (res.data.warehouseId) {
            this.userInfoWarehouseId = res.data.warehouseId; // 仓库ID
          } else {
            this.userInfoWarehouseId = res.data.WarehouseId; // 仓库ID
          }
        }
        this.initParam('WMS_RESERVOIR_COLUMN_LENGTH', 0); // 储格 列
        this.initParam('WMS_RESERVOIR_POSITION_LENGTH', 1); // 储格 位
        this.initParam('WMS_RESERVOIR_LAYER_LENGTH', 2); // 储格 层
      })
    }
  }
}
