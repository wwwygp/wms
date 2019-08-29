// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss'
import {
  addLottery,
  setLottery,
  upperShelfy,
  GetAllWarehouseList,
  editLottery,
  editupperShelfy,
  uploadfileShare,
  getProbability,
  lowerShel
} from '@/api/activity/act-configure/index';
import actPrize from '@/views/activity/act-configure/act-prize';
import tableConfigure from '@/components/table/tableConfigure.vue';
import DatePick from '@/components/DatePicker/index';
import moment from 'moment';
import tipsDialog from '@/components/dialog/tipsDialog';
export default {
  name: 'act-configure',
  components: {
    tableConfigure,
    selfDialog,
    DatePick,
    actPrize,
    tipsDialog
  },

  data() {
    var checkNumber = (rule,value,callback) => {
      var value = String(value);
      let reg = /^([A-Z])([0-9A-Z_]{1,})$/g
      if(value == ""){
        callback(new Error('活动编号不能为空'))
      }else if(value){
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('开头必须大写，由字母和数字，下划线组成.且不能输入小写'))
        }
      }else{
        callback()
      }
    }
    return {
      configForm: {
        activityName: '', //活动名称
        activityTitle: '', //活动简要/标题
        activityCode: '', //活动编号
        channelId: true,
        activityTimeType: 0, //起止时间
        startTime: '',
        endTime: '',
        pcUrl: '', //PC活动页地址
        appUrl: '', //app活动页地址
        ruleRemark: '', //规则说明文案
        shareRemark: '', //分享文案
        shareUrl: staticConfiguration.uploadUrl, //分享小图
        ActiveStatus: '', //状态
        participateScopeId: '0', //参与人
        participateLimitType: '0', //一天N次一人N次
        participateLimit: 1,
        shareWhetherId: true, //分享获得机会
        shareLimit: '1',
        consumeTypeId: '0', //抽奖消耗限制
        probabilityCalculationType: '0', //设置中奖率
        drawLimiteTime: '',
        winnerRateTime: '0~100',
        setSeparately: '1',
        setSeparatelyarea: '', //是否按商城分别设置

      },
      holder: '限商城百宝箱活动',
      file: {},
      heightResize: true,
      dataTable: { //tql
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
      },
      tableName: {
        tableCode: "INVOICE_PRIZE_SETTING_PAGE"
      }, // 表格ID ，就是表格自定义名称
      ossKey: '',
      ossUrl: '',
      getSelectedRow: [], // 用户选择的数据
      dialogVisible: false,
      dialogTitle: '',
      isPlatform: true,
      rulesFormInline: {
        activityName: [{
          required: true,
          message: '活动名称不能为空',
          trigger: 'blur'
        }],
        activityTitle: [{
          required: true,
          message: '活动简要/标题不能为空',
          trigger: 'blur'
        }],
        activityCode: [{ validator: checkNumber, trigger: 'blur',required: true,}],
        activityTimeType: [{
          required: true,
          message: '起止时间不能为空',
          trigger: 'blur'
        }],
      },
      totalRate: 0, //总中奖率
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除?'
      },
      delIndex: 0,
      dialogItem: '',
      hasSaveRelease: true, //判断是否发布
      separatelyareas: '',

      filters: {
        column: {
          create_start_date: '',
          create_end_date: ''
        },
      },
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.filters.column.create_end_date;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.filters.column.create_start_date;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      eddId:'',//判断是否新增
      itemStatus:'',
    }
  },
  created() {
    this.setInit()
  },
  computed: {

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

  },
  methods: {
    setInit() {
      var platStyle = JSON.parse(sessionStorage.getItem('activityType'));
      if (this.$route.query.activityId) {
        this.eddId = this.$route.query.activityId
        this.getTotalProbability()
        let params = {
          activityId: this.$route.query.activityId, //活动
          mallId: this.configForm.setSeparatelyarea,
          start: '',
          limit: '',
        }
        setLottery(params).then(res => {
          console.log(res.data)
          let re = res.data;
          this.configForm.activityName = re.activityName; //活动名称
          this.configForm.activityTitle = re.activityTitle; //活动简要/标题
          this.configForm.activityCode = re.activityCode; //活动编号
          this.configForm.activityTimeType = re.activityTimeType; //起止时间
          this.filters.column.create_start_date = re.startTime;
          this.filters.column.create_end_date = re.endTime;
          this.configForm.pcUrl = re.pcUrl; //PC活动页地址
          this.configForm.appUrl = re.appUrl; //app活动页地址
          this.configForm.ruleRemark = re.ruleRemark; //规则说明文案
          this.configForm.shareRemark = re.shareRemark; //分享文案
          this.configForm.shareUrl = re.shareUrl; //分享小图
          this.configForm.ActiveStatus = re.activeStatus; //状态
          this.itemStatus=re.status
          this.configForm.participateLimitType = re.participateLimitType; //一天N次一人N次
          this.configForm.participateLimit = re.participateLimit;
          this.dataTable.data = re.lotteryPrizelist
          this.isPlatform = false
        })
      }
      if (platStyle == 1) {
        this.isPlatform = true
      } else {
        this.isPlatform = false
        GetAllWarehouseList().then(res => {
          this.separatelyareas = res.data
        })
      }
      // sessionStorage.removeItem('activityType');
    },
    getTotalProbability() {
      let params = {
        activityId: this.$route.query.activityId,
      }
      getProbability(params).then(res => {
        this.totalRate = res.data
      })
    },
    beforeUpload(file, id) {
      this.file = file
    },
    upload() {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(this.file.type);
      const isLt1M = this.file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg|png|jpg 格式!');
      } else if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1M!');
      } else {
        let formData = new FormData()
        formData.append('picture', this.file)
        uploadfileShare(formData).then(res => {
          let data = res.data
          if (data.status == 1001) {
            this.$message.error(data.message)
          } else {
            this.ossKey = data.downCode
            this.ossUrl = data.downUrl
          }
        })
      }

    },


    getEndTime(val) { // 结束日期
      if (val) {
        this.configForm.endTime = val + ' 23:59:59';
      } else {
        this.configForm.endTime = val
      }
    },
    getStartTime(val) { // 开始日期
      if (val) {
        this.configForm.startTime = val + ' 00:00:00';
      } else {
        this.configForm.startTime = val
      }
    },

    initTable(current) { // 初始化表格
      let params = {
        start: current,
        limit: this.dataTable.limit,
        mallSelect: this.configForm.setSeparatelyarea
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)

    },
    onRowClick() { // 表格行点击
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    //tql
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.propName == 'operationCol') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        if (item.prop == 'winningPercent') {
          item.width = 120
        }

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
      this.initTable(1) // 主表格初始化
    },
    //表格高度
    tableHeight() {
      let formHeight = $(".rule-set").height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height
    },
    //选择商城
    changeSeparatelyarea() {
      this.setInit()
    },
    //增加奖品
    addSumbit() {
      this.dialogVisible = true;
      this.dialogTitle = '添加奖品'
      this.dialogItem = ''
    },
    //编辑奖品
    editSumbit(val) {
      this.dialogItem = val
      console.log(val, 'val')
      this.dialogVisible = true;
      this.dialogTitle = '编辑奖品'
    },
    //移除
    UpperShelFoperation(scope) {
      this.delIndex = scope.$index;
      this.delDialog.modalShow = true;
    },
    //刷新奖品
    resetDialogList() {},
    //添加奖品保存
    sureAddDialog(val) {
      if(val.prizeName==''){
          return this.$message.warning('请输入奖品名称')
      }
      if(val.prizeStockCount==''){
        return this.$message.warning('请输入初始库存')
      }
      if(val.winningPercent==''){
        return this.$message.warning('请输入中奖率')
      }
      var dataItem = {
        activityId: this.eddId, //活动id
        prizeId: val.prizeId, //奖品id
        prizeName: val.prizeName, //奖品名称
        prizeTypeName: val.prizeType == 0 ? '实物赠品' : '卡券', //类型
        prizeLevel: String(val.prizeLevel), //等级
        prizePrice: val.prizePrice, //面值
        useRuleComment: val.useRuleComment, //使用范围说明
        imageUrl: val.imageUrl, //图片（待建设）
        mallName: String(val.mallName), //提供方
        prizeStockCount: val.prizeStockCount, //数量
        hasGiveCount: 0, //已发放
        winningPercent: val.winningPercent, //手动设置的中
      }
      if (Number(this.totalRate)+Number(val.winningPercent)>100) {
        this.$message.warning('总中奖率设置区间为0~100')
        return
      } else {
        if(this.dialogTitle=='添加奖品'){
          this.dataTable.data.push(dataItem)
        }
      }
      // if (this.eddId =='') {
        var tableData = this.dataTable.data
        var totalData = 0
        tableData.map((item) => {
          totalData += Number(item.winningPercent)
        })
        this.totalRate = totalData;
      
      this.dialogVisible = false;
      this.dialogItem = {
        prizeType: '0', //类型
        styleElect: '',
        prizeName: '', //奖品名称
        model: '', //型号
        prizeLevel: '', //奖品等级
        imageUrl: staticConfiguration.uploadUrl, //图片
        mallName: '', //提供方
        prizePrice: '', //单价（面值）
        prizeStockCount: '', //初始库存
        recieveMaxCount: '', //每人领取上限
        winningPercent: '', //中奖几率
        thresholdAmount: '', //门槛金额
        useRuleComment: '', //使用规则说明``
      }
    },
    removeRow() {
      this.dataTable.data.splice(this.delIndex, 1)
      // if (this.eddId == '') {
        var totalData=0
        this.dataTable.data.map((item) => {totalData -= -(Number(item.winningPercent))})
        this.totalRate=totalData;
      this.delDialog.modalShow = false;
      this.$message.success('删除成功')
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    saveActivity() {
      console.log(this.$route.query.activityId, 's')
      console.log(this.$route.query.status, 's2')
      let reg = /^([A-Z])([0-9A-Z_]{1,})$/g
      
      if(!reg.test(this.configForm.activityCode)){
        this.$message.warning('请输入正确格式的编号')
        return
      }
      var platStyle = JSON.parse(sessionStorage.getItem('activityType'));
      var LotteryDatalist = this.dataTable.data
      let params = {
        activityId: this.$route.query.activityId,
        activityCode: this.configForm.activityCode, //活动编码
        activityName: this.configForm.activityName, //活动名称 
        activityTitle: this.configForm.activityTitle, //活动简要/标题
        activityVersion: this.configForm.activityVersion, //活动版本号
        activityTypeId: platStyle, //活动类型(1平台级，2商户级)
        channelId: this.configForm.channelId, //开启通道
        activityTimeType: this.configForm.activityTimeType, //活动时间类型(0:有起止时间1:一直有效)
        startTime: this.configForm.startTime, //活动开始时间
        endTime: this.configForm.endTime, //活动结束时间
        pcUrl: this.configForm.pcUrl, //pc活动页地址
        appUrl: this.configForm.appUrl, //移动端活动页地址
        ruleRemark: this.configForm.ruleRemark, //规则说明文案
        shareRemark: this.configForm.shareRemark, //分享文案
        shareUrl: this.configForm.shareUrl, //分享小图
        probabilityCalculationType: this.configForm.probabilityCalculationType,
        status: this.$route.query.status, //首页状态(1.未启动2.已启用)
        participateScopeId: this.configForm.participateScopeId, //参与人范围(0所有人,1指定人)
        consumeTypeId: this.configForm.consumeTypeId, //活动消耗类型(0无限制,1积分抽)
        participateLimitType: this.configForm.participateLimitType, //参与次数类型(0:每人每天n次，1：最多n次)
        participateLimit: this.configForm.participateLimit, //参与次数限制
        LotteryPrizelist: LotteryDatalist, //奖品voList
        ActiveStatus: this.configForm.ActiveStatus, //活动状态名称
      }
      let axiosApi

      this.$route.query.activityId ? axiosApi = editLottery(params) : axiosApi = addLottery(params)
      axiosApi.then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          this.$route.query.activityId ? this.$message.success('修改活动规则保存成功') : this.$message.success('新增活动规则保存成功')
          this.dialogVisible = false
          this.initTable(1) //刷新表格
        }
      })
    },
    //保存&发布
    saveReleaseActivity() {
      this.configForm.startTime
      var platStyle = JSON.parse(sessionStorage.getItem('activityType'));
      var LotteryDatalist = this.dataTable.data
      var params = {
        activityId: this.$route.query.activityId,
        activityCode: this.configForm.activityCode, //活动编码
        activityName: this.configForm.activityName, //活动名称 
        activityTitle: this.configForm.activityTitle, //活动简要/标题
        activityVersion: this.configForm.activityVersion, //活动版本号
        activityTypeId: platStyle, //活动类型(1平台级，2商户级)
        channelId: this.configForm.channelId, //开启通道
        activityTimeType: this.configForm.activityTimeType, //活动时间类型(0:有起止时间1:一直有效)
        startTime: this.configForm.startTime, //活动开始时间
        endTime: this.configForm.endTime, //活动结束时间
        pcUrl: this.configForm.pcUrl, //pc活动页地址
        appUrl: this.configForm.appUrl, //移动端活动页地址
        ruleRemark: this.configForm.ruleRemark, //规则说明文案
        shareRemark: this.configForm.shareRemark, //分享文案
        shareUrl: this.configForm.shareUrl, //分享小图
        probabilityCalculationType: this.configForm.probabilityCalculationType,
        status: this.$route.query.status, //首页状态(1.未启动2.已启用)
        participateScopeId: this.configForm.participateScopeId, //参与人范围(0所有人,1指定人)
        consumeTypeId: this.configForm.consumeTypeId, //活动消耗类型(0无限制,1积分抽)
        participateLimitType: this.configForm.participateLimitType, //参与次数类型(0:每人每天n次，1：最多n次)
        participateLimit: this.configForm.participateLimit, //参与次数限制
        LotteryPrizelist: LotteryDatalist, //奖品voList
        ActiveStatus: this.configForm.ActiveStatus, //活动状态名称
      }

      let axiosApi
      this.$route.query.activityId ? axiosApi = editupperShelfy(params) : axiosApi = upperShelfy(params)
      axiosApi.then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          this.$route.query.activityId ? this.$message.success('修改并发布成功') : this.$message.success('新增并发布成功')
          this.hasSaveRelease=false
        }
      })
    },
    changeStartTime(val) {
      let startTime = ''
      if (val) {
        startTime = moment(val).format("YYYY/MM/DD");
      } else {
        startTime = ''
      }
      this.getStartTime(startTime)
    },
    changeEndTime(val) {
      let endTime = moment(val).format("YYYY/MM/DD");
      if (val) {
        endTime = moment(val).format("YYYY/MM/DD");
      } else {
        endTime = ''
      }
      this.getEndTime(endTime)
    },
    resetTime() {
      this.filters.column.create_end_date = '';
      this.filters.column.create_start_date = '';
    },
    //下架
    undercarriage() {
      let params = {
        activityId: String(this.$route.query.activityId),
        status: String(this.itemStatus)
      }
   lowerShel(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message)
        } else {
          this.$message.success('下架成功')
          this.hasSaveRelease=true
        }
      })
    },
    //取消
    dissActivity() {
      try {
        this.routeERP("WMS_DELIVE_NOTICE", '', '/iwms/#//act-configure')
      } catch (e) {
        this.$router.go(-1)
      }
    },
  }
}
