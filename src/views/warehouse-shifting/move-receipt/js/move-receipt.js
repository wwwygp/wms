import tableConfigure from '@/components/table/tableConfigure.vue'
import tipsDialog from '@/components/dialog/tipsDialog';
import { dictionarysTypeNew } from '@/api/common/type.js'
import { ownersList } from '@/api/common/business.js'
import { moveNotePrint } from '@/api/common/print.js'
import { loaddBtn } from '@/api/common/load-btn.js'
import {print} from '@/api/common/print-api.js' // 调用打印机
import { getMoveNote, getMoveNoteDtl, reviseMoveNote, getMoveNoteCode, getMoveWaveCode } from '@/api/warehouse-shifting/move-receipt/move-receipt.js'
import { getSpaceInfoByCode, getLabelInfoByCode } from '@/api/warehousing-management/shelf-receipt/shelf-receipt.js'
import { userFromErp } from '@/api/common/common-info'
export default {
  components: {
    tableConfigure,
    tipsDialog
  },
  data(){
    return {
      formInline: {
        moveNoteCode: '',//移库单号
        moveWaveCode: '', //波次单号
        status: '',   //状态
      },
      getSelectedRow: [], // 用户选择的数据
      getSelectedSonRow: [], // 用户选择的子表数据
      templateId: '', //打印模板
      templateType: '', //打印模板
      btnList: [],//按钮集合
      statusList: [],//状态下拉框集合
      operatorList: [],//操作人
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
          tableCode: "WMS_MOVE_NOTE_INFO"
        },
      },
      formTable: {
        editorId: '',//上架人
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
          tableCode: "WMS_MOVE_NOTE_DTL_INFO"
        },
      },
      searchParam: {},
      waveArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      waveArrPage: 1,
      searchWaveCode: '',
      moveNoteArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 储位对象集合
      moveNoteArrPage: 1,
      searchMoveNoteCode: '',
      comfirmDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '当前移库数量为0，是否确认？'
      },
      comfirmType: '',//确认的类型
    }
  },

  created(){
    this.initBtn() //获取按钮
    this.initDictionary() //字典值
    this.getOperatorList() //操作人
  },
  mounted() {
    this.tableHeight() // 表格高度
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
          if(item.smallPackageUnitId != 10){
            if(!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))){
              return this.$message.warning('请输入整数')
            }
          }else{
            if(!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount))){
              return this.$message.warning('请输入整数')
            }
          }
          item.moveActulQuantity = item.actualBoxAmount * item.bigNum + item.actualCaseAmount * item.midNum + item.actualPieceAmount * item.smallNum
          //判断实际移库数量是否大于计划移库数量
          if((item.moveActulQuantity >= 0) && (item.moveActulQuantity <= item.movePlanQuantity)){
            //不做处理
          }else{
            this.$message.warning('实际移库数量不能大于计划移库数量！')
          }
        })  
　　　},
　　　deep: true
    }
  },
  methods:{
    //获取字典值
    initDictionary() {
      //获取状态字典值
      dictionarysTypeNew('WMS_MOVE_NOTE_STATUS_VALUE', this, 'statusList')
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_MOVE_NOTE_PAGE'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
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
        this.$message.warning('服务错误')
      });
    },
    //波次号
    initWaveCode (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.waveArr.data));
      let params = {
        moveWaveCode: this.searchWaveCode,
        start: this.waveArr.start,
        limit: this.waveArr.limit
      };
      getMoveWaveCode(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.waveArr.data = oldData.concat(data.records) : this.waveArr.data = JSON.parse(JSON.stringify(data.records));
          this.waveArrPage = data.pages // 总页码
        }
      })
    },
    waveCodeMore () {
      if ( this.waveArr.start == this.waveArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.waveArr.start = this.waveArr.start + 1
        this.initWaveCode(true);
      }
    },
    searchWave(val){
      this.searchWaveCode = val
      this.waveArr.data =[]
      this.waveArr.start = 1
      this.initWaveCode()
    },
    focusWaveCode(Event){
      // this.searchWaveCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchWaveCode = Event.srcElement.value
      }else{
        this.searchWaveCode = Event.target.value
      }
      this.waveArr.data =[]
      this.waveArr.start = 1
      this.initWaveCode()
    },
    changeWaveCode(val){
      this.searchWaveCode = val
    },
    clearWaveCode(){
      this.searchWaveCode = ''
    },
    //移库单号
    initMoveNoteCode (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.moveNoteArr.data));
      let params = {
        moveNoteCode: this.searchMoveNoteCode,
        start: this.moveNoteArr.start,
        limit: this.moveNoteArr.limit
      };
      getMoveNoteCode(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.moveNoteArr.data = oldData.concat(data.records) : this.moveNoteArr.data = JSON.parse(JSON.stringify(data.records));
          this.moveNoteArrPage = data.pages // 总页码
        }
      })
    },
    moveNoteCodeMore () {
      if ( this.moveNoteArr.start == this.moveNoteArrPage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.moveNoteArr.start = this.moveNoteArr.start + 1
        this.initMoveNoteCode(true);
      }
    },
    searchMoveNote(val){
      this.searchMoveNoteCode = val
      this.moveNoteArr.data =[]
      this.moveNoteArr.start = 1
      this.initMoveNoteCode()
    },
    focusMoveNoteCode(Event){
      // this.searchMoveNoteCode = Event.srcElement.value
      if(Event.srcElement){
        this.searchMoveNoteCode = Event.srcElement.value
      }else{
        this.searchMoveNoteCode = Event.target.value
      }
      this.moveNoteArr.data =[]
      this.moveNoteArr.start = 1
      this.initMoveNoteCode()
    },
    changeMoveNoteCode(val){
      this.searchMoveNoteCode = val
    },
    clearMoveNoteCode(){
      this.searchMoveNoteCode = ''
    },
    searchList(){
      this.searchParam = {
        moveNoteCode: this.formInline.moveNoteCode,//移库单号
        moveWaveCode: this.formInline.moveWaveCode, //波次单号
        status: this.formInline.status,   //状态
      }
      this.getMoveNoteList(1)
    },
    //查询主表
    getMoveNoteList(current){
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getMoveNote(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
          this.$message.warning(res.data.message)
        }else{

        }
        let data = res.data
        data.records.forEach((item,index) => {
          item.index = index
        })
        this.dataTable.data = JSON.parse(JSON.stringify(data.records))
        this.dataTable.radio = 0
        this.dataTable.start = data.current
        this.dataTable.limit = data.size
        this.dataTable.total = data.total
        //查询明细表数据
        if(this.dataTable.data.length > 0){
          this.getSelectedRow = [this.dataTable.data[0]]
          let params = {
            moveNoteId: this.dataTable.data[0].moveNoteId
          }
          getMoveNoteDtl(this.filteParams(params)).then(res => {
            let data = res.data
            if(data.status == 10001){
              this.dataTableDetail.data = []
              this.dataTableDetail.total= 0
            }else{
              data.forEach(item => {
                if(item.actualBoxAmount == null || item.actualBoxAmount == 0){
                  item.actualBoxAmount = 0
                } 
                if(item.bigNum == null || item.bigNum == 0){
                  item.bigNum = 0
                  item.disabledLargePackageNumber = true
                } 
                if(item.actualCaseAmount == null || item.actualCaseAmount == 0){
                  item.actualCaseAmount = 0
                } 
                if(item.bigNum == null || item.bigNum == 0){
                  item.bigNum = 0
                  item.disabledMediumPackageNumber = true
                } 
                if(item.actualPieceAmount == null || item.actualPieceAmount == 0){
                  item.actualPieceAmount = 0
                } 
                if(item.smallNum == null || item.smallNum == 0){
                  item.smallNum = 0
                  item.disabledSmallPackageNumber = true
                }
              })
              this.dataTableDetail.data = JSON.parse(JSON.stringify(data))
              this.dataTableDetail.total = this.dataTableDetail.data.total
            }  
          })
        }else{
          this.dataTableDetail.data = []
          this.dataTableDetail.total= 0
        }
      })
    },
    //查询子表
    getMoveDtlList(){
      if(this.getSelectedRow.length == 0){
        return
      }
      let params = {
        moveNoteId: this.getSelectedRow[0].moveNoteId
      }
      getMoveNoteDtl(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.dataTableDetail.data = []
          this.dataTableDetail.total= 0
        }else{
          this.dataTableDetail.data = JSON.parse(JSON.stringify(res.data))
          this.dataTableDetail.total = this.dataTableDetail.data.length
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
        let data = res.data
        if(data.spaceId == null){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'不存在')
        }else if(data.status == 1){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'为禁用状态')
        }else if(data.physicalInventoryStatus == 1){
          this.$message.warning('实际上架储位编码'+ val.actualSpaceCode +'为盘点状态')
        }else{
          val.actualSpaceId = data.spaceId
        }
      })
    },
    //失去焦点触发事件
    onLabelblur(val){
      if(val.dstLabelCode == ''){
        return this.$message.warning('实际上架容器编码不能为空')
      }
      let params = {
        labelCode: val.dstLabelCode
      }
      getLabelInfoByCode(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.labelId == null){
          this.$message.warning('实际上架容器编码'+ val.dstLabelCode +'不存在')
        }else{
          val.dstLabelId = data.labelId
        }
      })
    },
    //失去焦点触发事件
    // onNumblur(val){
    //   let patrn = /^[1-9]\d*$/
    //   if(!patrn.test(val.moveActulQuantity)){
    //     return this.$message.warning('实际上架数量必须为大于0的数字')
    //   }
    // },
    //移库完成按钮函数
    moveAccomplish(){
      this.comfirmType = 1
      if(this.getSelectedSonRow.length == 0){
        return this.$message.warning('请选择需要回单的明细商品！')
      }
      if(this.formTable.editorId == null || this.formTable.editorId == ''){
        return this.$message.warning('请选择实际移库人！')
      }
      let flag = true
      let flag1 = false
      let reg = /^(-|\+)?\d+$/
      for(let i=0; i<this.getSelectedSonRow.length; i++){
        if(this.getSelectedSonRow[i].moveActulQuantity == 0){
          flag1 = true
        }
        if(this.getSelectedSonRow[i].smallPackageUnitId != 10){
          if(!(reg.test(this.getSelectedSonRow[i].actualBoxAmount) && reg.test(this.getSelectedSonRow[i].actualCaseAmount) && reg.test(this.getSelectedSonRow[i].actualPieceAmount))){
            flag = false
            return this.$message.warning('请输入整数')
          }
        }else{
          if(!(reg.test(this.getSelectedSonRow[i].actualBoxAmount) && reg.test(this.getSelectedSonRow[i].actualCaseAmount))){
            flag = false
            return this.$message.warning('请输入整数')
          }
        }
        if(this.getSelectedSonRow[i].moveActulQuantity > this.getSelectedSonRow[i].movePlanQuantity){
          flag = false
          return this.$message.warning('实际移库数量不能大于计划移库数量！')
        }
        if(this.getSelectedSonRow[i].dstLabelCode == null || this.getSelectedSonRow[i].dstLabelCode == ''){
          flag = false
          return this.$message.warning('目标容器不能为空')
        }
      }
      if(flag1){
        this.comfirmDialog.modalShow = true
      }
      if(flag && !flag1){
        this.implementationCallBack()
      }
    },
    //整单完成按钮函数
    wholeListAccomplish(){
      this.comfirmType = 2
      if(this.dataTable.data.length == 0){
        return this.$message.warning('请选择需要回单的信息！')
      }
      if(this.formTable.editorId == null || this.formTable.editorId == ''){
        return this.$message.warning('请选择实际移库人！')
      }
      let flag = true
      let flag1 = false
      let reg = /^(-|\+)?\d+$/
      for(let i=0; i<this.dataTableDetail.data.length; i++){
        if(this.dataTableDetail.data[i].moveActulQuantity == 0){
          flag1 = true
        }
        if(this.dataTableDetail.data[i].smallPackageUnitId != 10){
          if(!(reg.test(this.dataTableDetail.data[i].actualBoxAmount) && reg.test(this.dataTableDetail.data[i].actualCaseAmount) && reg.test(this.dataTableDetail.data[i].actualPieceAmount))){
            flag = false
            return this.$message.warning('请输入整数')
          }
        }else{
          if(!(reg.test(this.dataTableDetail.data[i].actualBoxAmount) && reg.test(this.dataTableDetail.data[i].actualCaseAmount))){
            flag = false
            return this.$message.warning('请输入整数')
          }
        }
        if(this.dataTableDetail.data[i].moveActulQuantity > this.dataTableDetail.data[i].movePlanQuantity){
          flag = false
          return this.$message.warning('实际移库数量不能大于计划移库数量！')
        }
      }
      if(flag1){
        this.comfirmDialog.modalShow = true
      }
      if(flag && !flag1){
        this.implementationCallBack()
      }
    },
    comfirm(){
      this.implementationCallBack()
    },
    //移库完成/整单完成
    implementationCallBack(){
      let moveNoteArr = []
      let temp = []
      if(this.comfirmType == 1){
        temp = this.getSelectedSonRow
      }else if(this.comfirmType == 2){
        temp = this.dataTableDetail.data
      }
      for(let i=0; i<temp.length; i++){
        temp[i].moveActulId = this.formTable.editorId
        moveNoteArr.push(temp[i])
      }
      this.comfirmDialog.modalShow = false
      reviseMoveNote(moveNoteArr).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }else{
          if(this.comfirmType == 1){
            this.$message.success('移库完成！')
          }else if(this.comfirmType == 2){
            this.$message.success('整单完成！')
          }
          this.getMoveNoteList(1)
        }
      }).catch(error => {
        if(this.comfirmType == 1){
          this.$message.success('移库失败！')
        }else if(this.comfirmType == 2){
          this.$message.success('整单失败！')
        }
      })
    },
    //打印
    moveNotePrinter(){
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的移库单！')
      }
      if(this.getSelectedRow.length > 1){
        return this.$message.warning('只能选择一条移库单信息进行打印')
      }
      let params = {
        moveNoteId : this.getSelectedRow[0].moveNoteId
      }
      moveNotePrint(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message)
        }else{
          let printArray = res.data[0].template
          if(printArray.length == 0){
            return this.$message.warning('获取打印信息失败')
          }else{
            this.templateId = printArray[0].template_id
            this.templateType = printArray[0].template_type
          }
          this.printOk(res.data)
        }
      }).catch(error => {
        return this.$message.warning('获取打印信息失败')
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
        this.formInline[item] = ''
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = ''
      }
    },
    tableHeight() {
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = ($(window).height()  - this.$store.state.basic.height) / 3 + 20
      this.dataTableDetail.height = ($(window).height()  - this.$store.state.basic.height) / 2
    },
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      this.dataTable.radio = 0
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      this.$refs.tableConfig.domShow = false
      this.$nextTick(() => {
        this.$refs.tableConfig.domShow = true
        this.$refs.tableConfig.dialogVisible = false
      })
      this.getMoveNoteList(1)
    },
    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName //表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop == 'actualBoxAmount' || item.prop == 'actualCaseAmount' || item.prop == 'actualPieceAmount' || item.prop == 'dstLabelCode') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')) // 这里配置固定列的，false不固定，其他是左右固定
      })
      this.dataTableDetail.tr = JSON.parse(JSON.stringify(handleTableData))
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTableDetail.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTableDetail.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      this.$refs.dataTableConfig.domShow = false
      this.$nextTick(() => {
        this.$refs.dataTableConfig.domShow = true
        this.$refs.dataTableConfig.dialogVisible = false
      })
    },
    onRowClick (val) { // 表格行点击
      this.dataTable.radio = val.row.index
      this.getSelectedRow = [val.row]
      this.getSelectedSonRow = []
      this.dataTableDetail.data = []
      this.dataTableDetail.start = 1
      this.dataTableDetail.limit = 100
      this.dataTableDetail.total = 0
      this.getMoveDtlList()
    },
    onHandleSelectionSonChange(val){
      this.getSelectedSonRow = val
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      this.getMoveNoteList(this.dataTable.start)
    },
    handleCurrentChange (val) { // 页码选择
      this.dataTable.start = val
      this.getMoveNoteList(this.dataTable.start)
    },
  }
}
