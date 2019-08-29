import DatePick from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfigure.vue'
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'
import { uploadfile } from '@/api/common/upload.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
import { ownersList, getStaffsFromErp, getCustomerFromErp, getRouteFromErp, getCarrier } from '@/api/common/business.js'
import {
  getDistributionNotice,
  getDistributionNoticeDtl,
  getDeliveNotice,
  shipmentsDeliveNotice,
  confirmDeliveNotice,
  cancelDeliveNoticeDtl,
  cancelDeliveNotice,
  getShipmentPrint,
  shipmentsLogistics
} from '@/api/warehousing-management/shipments-loading/index.js'
import '../style/shipments.scss'
import moment from 'moment'
export default {
  name: 'receipt',
  components: {
    DatePick,
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    let date = new Date()
    let defaultDate = moment(date).format("YYYY/MM/DD HH:mm:ss")
    return {
      formInline: {
        distributionNoticeCode: '',//配送单号
        deliveNoticeCode: '', //出货单号
        ownerId: '',//委托业主
        status: '',   //状态
        startCreateTime: '',   //创建时间开始
        endCreateTime: ''  //创建时间结束
      },
      form: {
        routeId: '',
        deliveNoticeCode: '',
        customerId: '',
        carCode: '',
        driverId: ''
      },
      dialogShipmentsVisible: false,
      //确认是否保存
      isSaveShipmentsDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      updateDisabled: false, //司机下拉框禁止修改
      newOrderStatus: 1, //建单状态ID
      btnList: [], //按钮集合
      driverIdList: [],//司机集合
      routeList: [],//线路集合
      customerIdList: [],//客户集合
      getSelectedRow: [], // 用户选择的数据
      getDetailSelectedRow: [], // 用户选择的数据
      getDialogSelectedRow: [], // 用户选择的数据
      templateId: '', //打印模板
      templateType: '', //打印模板
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data: [],
        start: 1,
        limit: 10
      },
      statusList: [],//状态下拉框集合
      heightResize: true,
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 单选功能
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
      // 表格ID ，就是表格自定义名称
      tableName: {
        tableCode: 'WMS_ACCEPTAN_NOTE_TEBEL'
      },
      //明细表
      detailDataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false,
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      // 表格ID ，就是表格自定义名称
      detailTableName: {
        tableCode: 'WMS_ACCEPTAN_NOTE_DTL_TEBEL'
      },
      //将需要比较的数组存起来
      oldForm: {
        carCode: '',
        driverId: ''
      },
      shipmentsTitle: '按订单发货',
      isSave: false,//若有数据新增，未点击保存
      //按订单发货表格
      dialogDataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      dialogTableName: {
        tableCode: 'WMS_EXPORT_REVIEW_PICK_NOTE_DTL'
      },
      searchParam: {},
      //物流相关
      dialogLogisticsVisible: false,
      //确认是否保存
      isSaveLogisticsDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },
      logisticsForm: {},
      logisticsEditForm: {
        carrierId: '',//承运商ID
        deliveryTypeId: '',//配送方式
        logisticsCode: '',//物流单号
        distributionTime: defaultDate,//发货时间
        logisticsCost: '',//物流费用
        logisticsRemark: ''
      },
      logisticsOldEditForm: {
        carrierId: '',//承运商ID
        deliveryTypeId: '',//配送方式
        logisticsCode: '',//物流单号
        distributionTime: defaultDate,//发货时间
        logisticsCost: '',//物流费用
        logisticsRemark: ''
      },
      rulesLogisticsForm: {
        carrierId: [{ required: true, message: '请选择承运商', trigger: 'change' }],
        deliveryTypeId: [{ required: true, message: '请选择配送方式', trigger: 'change' }],
        logisticsCode: [{ required: true, message: '请输入物流单号', trigger: 'change' }],
        logisticsCost: [{ required: true, message: '请输入物流费用'},{ type: 'number', message: '必须为数字值'}]
      },
      file: {},
      activeName: 'first',
      uploadUrl: staticConfiguration.uploadUrl,
      uploadData: {},
      carrierArrPage: 1,
      carrierPageDate: { // 委托业主页码数据
        data: [],
        start: 0,
        limit: 10
      },
      deliveryType: [],
      ossKey: '',
      ossUrl: '',
      defaultDate: defaultDate
    }
  },
  created() {
    this.initDictionaryPermit();
    this.getOwnerList(false);
    this.initBtn();
    this.getDriverIdList();
    this.getRouteIdList();
    this.getcustomerIdList();
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods: {
    getEndTime(val) { // 结束日期
      if (val) {
        this.formInline.endCreateTime = val + ' 23:59:59'
      } else {
        this.formInline.endCreateTime = val
      }
    },
    getStartTime(val) { // 开始日期
      if (val) {
        this.formInline.startCreateTime = val + ' 00:00:00'
      } else {
        this.formInline.startCreateTime = val
      }
    },
    //获取字典值
    initDictionaryPermit() {
      //获取状态字典值
      let statusParams = {
        code: 'WMS_EXPORT_DISTRIBUTION_STATUS'
      }
      dictionarysType(statusParams).then(res => {
        this.statusList = JSON.parse(JSON.stringify(res.data))
      })
    },
    //委托业主下拉框
    loadMoreOwnerList() {
      if (this.ownersPageDate.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了')
      } else {
        this.ownersPageDate.start = this.ownersPageDate.start + 1
        this.getOwnerList(true)
      }
    },
    //委托业主下拉框
    getOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownersPageDate.data))
      let params = {
        start: this.ownersPageDate.start,
        limit: this.ownersPageDate.limit
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message)
        } else {
          this.ownersPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records))
          this.ownersArrPage = data.pages // 总页码
        }

      })
    },
    //获取司机集合
    getDriverIdList() {
      let params = {
        isOnWork: true,
        staffTypeId: 9
      }
      getStaffsFromErp(params).then(res => {
        this.driverIdList = JSON.parse(JSON.stringify(res.data))
      }).catch(error => {
        this.$message.warning('服务错误')
      })
    },
    //获取线路集合
    getRouteIdList() {
      getRouteFromErp().then(res => {
        this.routeList = JSON.parse(JSON.stringify(res.data))
      }).catch(error => {
        this.$message.warning('服务错误')
      })
    },
    //获取客户集合
    getcustomerIdList() {
      let params = {
        limit: 100
      }
      getCustomerFromErp(params).then(res => {
        this.customerIdList = JSON.parse(JSON.stringify(res.data.records))
      }).catch(error => {
        this.$message.warning('服务错误')
      })
    },
    // 按钮加载函数
    initBtn() {
      let menusKey = 'WMS_SHIPMENTS_LOADING_TABEL'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    //调用一个对象的一个方法
    callFn(item) {
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
    //点击弹窗的X/取消
    closeShipmentsDialog() {
      this.resetShipmentsForm()
    },
    //按订单发货表单取消
    resetShipmentsForm() {
      if (this.oldForm.carCode != this.form.carCode || this.oldForm.driverId != this.form.driverId) {
        this.isSave = true
      }else{
        this.isSave = false
      }
      for (let item in this.logisticsEditForm) {
        if(this.logisticsEditForm[item] != this.logisticsOldEditForm[item]){
          this.isSave = true
        }
      }
      //重置数据
      if (this.isSave) {
        this.isSaveShipmentsDialog.modalShow = true
      } else {
        this.cancel()
      }
    },
    cancel() {
      this.dialogDataTable.data = []
      this.oldDialogDataTable = []
      this.carrierPageDate.data = []
      this.carrierArrPage = 1
      let form = {
        routeId: '', //线路
        deliveNoticeCode: '', //出货单号
        customerId: '', //客户
        carCode: '', //车牌号
        driverId: '' //司机
      }
      this.form = JSON.parse(JSON.stringify(form))
      if(this.shipmentsTitle == '按订单发货-物流'){
        for (let item in this.logisticsEditForm) {
          this.logisticsEditForm[item] = ''
        }
        this.$refs['logisticsEditForm'].resetFields()
        this.logisticsEditForm.distributionTime = this.defaultDate
        this.ossKey = ''
        this.ossUrl = ''
      }
      this.activeName = 'first'
      this.dialogShipmentsVisible = false
      this.isSaveShipmentsDialog.modalShow = false
      this.isSave = false
    },
    searchList(){
      this.searchParam = {
        distributionNoticeCode: this.formInline.distributionNoticeCode,
        deliveNoticeCode: this.formInline.deliveNoticeCode,
        ownerId: this.formInline.ownerId,
        status: this.formInline.status,
        startCreateTime: this.formInline.startCreateTime,
        endCreateTime: this.formInline.endCreateTime
      }
      this.initTable(1)
    },
    // 表单重置
    reseltForm(formName) {
      for (let item in this.formInline) {
        this.formInline[item] = ''
      }
      for (let item in this.searchParam) {
        this.searchParam[item] = ''
      }
      this.$refs.dateComponents.resetTime()
    },
    //按订单发货表单重置
    resetShipmentsList() {
      this.form.routeId = '',
      this.form.deliveNoticeCode = '',
      this.form.customerId = ''
    },
    //获取首页列表
    initTable(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getDistributionNotice(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        let re = res.data
        if (re.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(re.records))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(re))
          this.$refs.tableConfig.getCurrentRow(0)
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        }
        //获取明细
        if (this.getSelectedRow.length > 0) {
          this.searchDtlTabelList()
        }else{
          this.detailDataTable.data = [];
          this.detailDataTable.start = 1;
          this.detailDataTable.limit = 10;
          this.detailDataTable.total = 0;
        }
      })
    },
    //获取首页明细列表
    searchDtlTabelList() {
      let noticeIdArray = []
      let params = ''
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        noticeIdArray.push(this.getSelectedRow[i].distributionNoticeId)
      }
      params = noticeIdArray.join(',')
      getDistributionNoticeDtl(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        for (var i = data.length - 1; i >= 0; i--) {
          if(data[i]['ossUrl']){
            let key = data[i]['ossUrl'].indexOf('https')
            if(key == -1){
              data[i]['ossUrl'] = data[i]['ossUrl'].slice(0, 4) + 's' + data[i]['ossUrl'].slice(4)
            }
          }
        }
        this.detailDataTable.data = JSON.parse(JSON.stringify(data))
      })
    },
    //按订单发货按钮
    orderShipments() {
      if (this.getSelectedRow.length > 1) {
        return this.$message.warning('按订单发货的配送单信息不能大于一条')
      }
      if (this.getSelectedRow.length > 0) {
        this.form.carCode = this.getSelectedRow[0].carCode
        this.oldForm.carCode = this.getSelectedRow[0].carCode
        this.form.driverId = this.getSelectedRow[0].driverId
        this.oldForm.driverId = this.getSelectedRow[0].driverId
        this.updateDisabled = true;
      } else {
        this.updateDisabled = false;
        this.oldForm = {
          carCode: '',
          driverId: ''
        }
      }
      this.shipmentsTitle = '按订单发货'
      this.isSave = false
      this.getShipmentsList()
      this.dialogShipmentsVisible = true
    },
    //委托业主下拉框
    loadMoreCarrierList() {
      if (this.carrierPageDate.start == this.carrierArrPage) {
        this.$message.warning('没有更多数据了')
      } else {
        this.carrierPageDate.start = this.carrierPageDate.start + 1
        this.getOwnerList(true)
      }
    },
    //委托业主下拉框
    getCarrierList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.carrierPageDate.data))
      let params = {
        start: this.carrierPageDate.start,
        limit: this.carrierPageDate.limit
      }
      getCarrier(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message)
        } else {
          this.carrierPageDate.data = concatOldData == true ? oldData.concat(data.data) : JSON.parse(JSON.stringify(data.data))
          this.ownersArrPage = data.pages // 总页码
        }

      })
    },
    //按容器发货
    orderContainerShipments(){
      if (this.getSelectedRow.length > 1) {
        return this.$message.warning('按订单发货的配送单信息不能大于一条')
      }
      if (this.getSelectedRow.length > 0) {
        this.form.carCode = this.getSelectedRow[0].carCode
        this.oldForm.carCode = this.getSelectedRow[0].carCode
        this.form.driverId = this.getSelectedRow[0].driverId
        this.oldForm.driverId = this.getSelectedRow[0].driverId
        this.updateDisabled = true;
      } else {
        this.updateDisabled = false;
        this.oldForm = {
          carCode: '',
          driverId: ''
        }
      }
      this.shipmentsTitle = '按容器发货'
      this.isSave = false
      this.getShipmentsList()
      this.dialogShipmentsVisible = true
    },
    //按订单发货-物流
    orderLogisticsShipments(){
      if (this.getSelectedRow.length > 1) {
        return this.$message.warning('按订单发货的配送单信息不能大于一条')
      }
      if (this.getSelectedRow.length > 0) {
        this.form.carCode = this.getSelectedRow[0].carCode
        this.oldForm.carCode = this.getSelectedRow[0].carCode
        this.form.driverId = this.getSelectedRow[0].driverId
        this.oldForm.driverId = this.getSelectedRow[0].driverId
        this.updateDisabled = true;
      } else {
        this.updateDisabled = false;
        this.oldForm = {
          carCode: '',
          driverId: ''
        }
      }
      this.shipmentsTitle = '按订单发货-物流'
      this.isSave = false
      this.getShipmentsList()
      this.dialogShipmentsVisible = true
      this.getCarrierList()
      this.initDeliveryType()
    },
    //获取字典值
    initDeliveryType() {
      //获取状态字典值
      let statusParams = {
        code: 'WMS_LOGISTICS_DELIVERY_TYPE'
      }
      dictionarysType(statusParams).then(res => {
        this.deliveryType = JSON.parse(JSON.stringify(res.data))
      })
    },
    //获取按订单发货列表
    getShipmentsList() {
      let needLogisticsId = ''
      if(this.shipmentsTitle == '按订单发货-物流'){
        needLogisticsId = '1'
      }else {
        needLogisticsId = '0'
      }
      let params = {
        routeId: this.form.routeId,
        deliveNoticeCode: this.form.deliveNoticeCode,
        customerId: this.form.customerId,
        needLogisticsId: needLogisticsId
      }
      getDeliveNotice(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.dialogDataTable.data = JSON.parse(JSON.stringify(res.data))
      })
    },
    //按订单发货保存按钮
    saveShipmentsBtn() {
      if (this.getDialogSelectedRow.length < 1) {
        return this.$message.warning('请选择要发货的出货通知单！')
      }
      if (this.form.carCode == '' && this.form.driverId == '') {
        return this.$message.warning('车牌号和司机不能为空')
      } else if (this.form.carCode == '') {
        return this.$message.warning('车牌号不能为空')
      } else if (this.form.driverId == '') {
        return this.$message.warning('司机不能为空')
      }
      if(this.shipmentsTitle == '按订单发货'){
        this.saveShipments()
      }else if(this.shipmentsTitle == '按容器发货'){
        this.saveShipmentsByContainer()
      }else if(this.shipmentsTitle == '按订单发货-物流'){
        if (this.logisticsEditForm.carrierId == '') {
          return this.$message.warning('请选择承运商')
        } else if (this.logisticsEditForm.deliveryTypeId == '') {
          return this.$message.warning('请选择配送方式')
        } else if (this.logisticsEditForm.logisticsCode == '') {
          return this.$message.warning('请输入物流单号')
        }else if(this.logisticsEditForm.logisticsCost == ''){
          return this.$message.warning('请输入物流费用')
        }else if(this.logisticsEditForm.logisticsCost){
          let reg = /(^[0-9]{1,8}$)|(^[0-9]{1,8}[\.]{1}[0-9]{1,2}$)/
          if(!(reg.test(this.logisticsEditForm.logisticsCost))){
            return this.$message.warning('物流费用只能输8位整数，两位小数')
          }
        }
        this.saveShipmentsByLogistics()
      }
    },
    //按订单发货
    saveShipments() {
      let dataArray = {}
      let deliveNoticeIds = []
      let distributionNoticeId = ''
      if (this.getSelectedRow.length > 0) {
        distributionNoticeId = this.getSelectedRow[0].distributionNoticeId
      }
      for (let i = 0; i < this.getDialogSelectedRow.length; i++) {
        deliveNoticeIds.push(this.getDialogSelectedRow[i].deliveNoticeId)
      }
      dataArray.distributionNoticeId = distributionNoticeId
      dataArray.deliveNoticeIds = deliveNoticeIds
      dataArray.carCode = this.form.carCode
      dataArray.driverId = this.form.driverId
      shipmentsDeliveNotice(this.filteParams(dataArray)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.dialogShipmentsVisible = false;
        this.cancel()
        this.getShipmentsList()
        this.initTable(1)
        return this.$message.success('按订单发货成功！')
      }).catch(error => {
        this.$message.error('按订单发货失败!')
      })
    },
    //按容器发货
    saveShipmentsByContainer(){
      console.log('按容器发货')
    },
    resetShipmentsByLogistics(){
      this.dialogDataTable.data = []
      this.oldDialogDataTable = []
      this.carrierPageDate.data = []
      this.carrierArrPage = 1
      let form = {
        routeId: '', //线路
        deliveNoticeCode: '', //出货单号
        customerId: '', //客户
        carCode: '', //车牌号
        driverId: '' //司机
      }
      this.form = JSON.parse(JSON.stringify(form))
      if(this.shipmentsTitle == '按订单发货-物流'){
        for (let item in this.logisticsEditForm) {
          this.logisticsEditForm[item] = ''
        }
        this.$refs['logisticsEditForm'].resetFields()
      }
      this.logisticsEditForm.distributionTime = this.defaultDate
      this.activeName = 'first'
      this.ossKey = ''
      this.ossUrl = ''
      this.isSave = false
    },
    //按订单发货-物流
    saveShipmentsByLogistics(){
      this.$refs['logisticsEditForm'].validate((valid) => {
        // this.getDialogSelectedRow.push([])
        if(this.getDialogSelectedRow.length <= 0){
          this.$message.warning('请选择一条发货单数据')
        }
        let params = {
          deliveNoticeIds: [this.getDialogSelectedRow[0].deliveNoticeId],
          carCode: this.form.carCode,
          distributionNoticeId: this.getDialogSelectedRow[0].distributionNoticeId,
          driverId: this.form.driverId,
          carrierId: this.logisticsEditForm.carrierId,
          deliveryTypeId: this.logisticsEditForm.deliveryTypeId,
          logisticsCode: this.logisticsEditForm.logisticsCode,
          distributionTime: this.logisticsEditForm.distributionTime,
          logisticsCost: this.logisticsEditForm.logisticsCost,
          ossKey: this.ossKey,
          ossUrl: this.ossUrl,
          logisticsRemark: this.logisticsEditForm.logisticsRemark
        }
        shipmentsLogistics(params).then(res => {
          if (res.data.status == 10001) {
            return this.$message.warning(res.data.message)
          }
          this.dialogShipmentsVisible = false;
          this.resetShipmentsByLogistics()
          this.getShipmentsList()
          this.initTable(1)
          return this.$message.success('按订单发货--物流成功！')
        }).catch(error => {
          this.$message.error('按订单发货失败!')
        })
      })
    },
    //发货确认按钮
    affirmShipmentsBtn() {
      if (this.getSelectedRow.length < 1) {
        return this.$message.warning('请选择要发货确认的配送单!')
      }
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        if (this.getSelectedRow[i].status != this.newOrderStatus) {
          return this.$message.warning('配送单状态为' + this.getSelectedRow[i].statusName + '，不允许发货确认！')
        }
      }
      this.affirmShipments()
    },
    //发货确认
    affirmShipments() {
      let distributionNoticeId = this.getSelectedRow[0].distributionNoticeId
      confirmDeliveNotice(distributionNoticeId).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.reseltForm('formInline')
        this.initTable(1)
        return this.$message.success('发货确认成功！')
      }).catch(error => {
        this.$message.error('发货确认失败!')
      })
    },
    //明细取消按钮
    cancelDetailShipmentsBtn() {
      if (this.getDetailSelectedRow.length < 1) {
        return this.$message.warning('请选择要明细取消的配送单!')
      }
      for (let i = 0; i < this.getDetailSelectedRow.length; i++) {
        if (this.getDetailSelectedRow[i].status != this.newOrderStatus) {
          return this.$message.warning('只有建单状态的配送单允许明细取消！')
        }
      }
      this.cancelDetailShipments()
    },
    //明细取消
    cancelDetailShipments() {
      let dtlIdArray = []
      let dtlIds = ''
      for (let i = 0; i < this.getDetailSelectedRow.length; i++) {
        dtlIdArray.push(this.getDetailSelectedRow[i].distributionNoticeDtlId)
      }
      dtlIds = dtlIdArray.join(',')
      cancelDeliveNoticeDtl(dtlIds).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        if(this.getDetailSelectedRow.length == this.detailDataTable.data.length){
          this.initTable(1);
        }else{
          this.searchDtlTabelList()
        }
        return this.$message.success('明细取消成功！')
      }).catch(error => {
        this.$message.error('明细取消失败!')
      })
    },
    //整单取消按钮
    cancelShipmentsBtn() {
      if (this.getSelectedRow.length < 1) {
        return this.$message.warning('请选择要整单取消的配送单!')
      }
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        if (this.getSelectedRow[i].status != this.newOrderStatus) {
          return this.$message.warning('只有建单状态的配送单允许整单取消！')
        }
      }
      this.cancelShipments()
    },
    //整单取消
    cancelShipments() {
      let idArray = []
      let ids = ''
      idArray.push(this.getSelectedRow[0].distributionNoticeId)
      ids = idArray.join(',')
      cancelDeliveNotice(ids).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }
        this.reseltForm('formInline')
        this.initTable(1)
        return this.$message.success('整单取消成功！')
      }).catch(error => {
        this.$message.error('整单取消失败!')
      })
    },
    //打印
    printShipments(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的发货装车信息');
      }
      let noticeIdArray = []
      let ids = ''
      for (let i = 0; i < this.getSelectedRow.length; i++) {
        noticeIdArray.push(this.getSelectedRow[i].distributionNoticeId)
      }
      ids = noticeIdArray.join(',')
      let params = {
        distributionNoticeIds : ids
      }
      getShipmentPrint(this.filteParams(params)).then(res => {
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
    //表格高度
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = ($(window).height()  - this.$store.state.basic.height - 120)/2;
      this.detailDataTable.height = ($(window).height()  - this.$store.state.basic.height - 90)/2;
      this.dialogDataTable.height = ($(window).height())/3;
    },
    // table数据处理函数
    tableDataHandle(data) {
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'logisticsCode') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      })
      this.initTable(1);
    },
    // table数据处理函数
    detailTableDataHandle(data) {
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'testReportNo') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.detailDataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.detailDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.detailDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.tableConfig.dialogVisible = false
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      })
    },
    // table数据处理函数
    dialogTableDataHandle(data) {
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dialogDataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dialogDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dialogDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      this.$refs.dialogTableConfig.domShow = false
      this.$nextTick(() => {
        this.$refs.dialogTableConfig.domShow = true
        this.$refs.dialogTableConfig.dialogVisible = false
      })
    },
    // 表格行点击
    onRowClick(val) {
    },
    // 表格行点击
    onDetailRowClick(val) {
    },
    // 表格行点击
    onShipmentsRowClick(val) {
    },
    // 分页页码
    handleCurrentChange(val) {
      this.dataTable.start = val
      this.initTable(this.dataTable.start)
    },
    // 分页每页展示的数量
    handleSizeChange(val) {
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.initTable(this.dataTable.start)
    },
    // 用户的选择框事件
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
      if (this.getSelectedRow.length > 0) {
        this.searchDtlTabelList()
      } else {
        this.detailDataTable.data = []
        this.detailDataTable.start = 1
        this.detailDataTable.limit = 10
        this.detailDataTable.total = 0
      }
    },
    // 用户的选择框事件
    onDetailHandleSelectionChange(val) {
      this.getDetailSelectedRow = val
      if (this.getDetailSelectedRow.length > 0) {
        if (this.getDetailSelectedRow[0] == null) {
          this.getDetailSelectedRow = []
        }
      }
    },
    // 用户的选择框事件
    onHandleDialogSelectionChange(val) {
      if(this.shipmentsTitle == '按订单发货-物流'){
        if(val.length > 1){
          this.$message.warning('按订单发货-物流只能选择一条发货信息')
        }
      }
      this.getDialogSelectedRow = val
    },
    cellClick(data){
      this.logisticsForm = data.row
    },
    //添加物流信息
    addLogistics(){
      this.dialogLogisticsVisible = true
    },
    closeLogisticsDialog(){
      this.dialogLogisticsVisible = false
    },
    upload(){
      if(this.shipmentsTitle == '按订单发货-物流'){
        if(this.getDialogSelectedRow.length <= 0){
          return this.$message.warning('请选择一条发货单数据')
        }
      }
      let formData = new FormData()
      formData.append('objectID', this.getDialogSelectedRow[0].orderId)
      formData.append('billType', 3)
      formData.append('fileDatas', this.file)
      uploadfile(formData).then(res => {
        let data = res.data
        if (data.Status == 1) {
          this.$message.success(data.Content)
          this.ossKey = data.OSS_Key
          this.ossUrl = data.OSS_URL
        } else {
          this.$message.warning(data.Content)
        }
      })
    },
    beforeUpload(file, id){
      this.file = file
    },
    downloadPDF(url){
      window.open(url)
    }
  }
}
