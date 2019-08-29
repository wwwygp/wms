import tableConfigure from '@/components/table/tableConfigure.vue';
import { dictionarysType, standardDic, standardDicPage, standardDicChild } from '@/api/common/type.js'
import { receiptPrint } from '@/api/common/print.js';
import {print} from '@/api/common/print-api.js'; // 调用打印机
import { userFromErp, shipmentDeliverDeficiency } from '@/api/common/common-info';
import { loaddBtn } from '@/api/common/load-btn.js';
import{ getRecipt, getReciptDetail, updateRecipt} from '@/api/export-warehouse/export-receipt/index'
import '../export-receipt.scss'
export default {
  name: 'receipt',
  components: {
    tableConfigure
  },
  data(){
    return {
      formInline: {
        waveCode: '',//波次号
        pickNoteCode:'',//下架单号
        isAsc: true,
        sortField: 'waveCode'
      },
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true, // 有无选中功能
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
          tableCode: "WMS_EXPORT_PICK_NOTE"
        },
      },//主表信息
      getSelectedRow: [], // 用户选择的数据
      heightResize:true,
      //副表格
      dataTableDetail:{
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        hasRadio: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:1000,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_EXPORT_PICK_NOTE_DTL"
        },
      },
      getSelectedDetailRow: [], // 用户选择的数据
      actualshipperId:"",//实际拣货人
      actualshipper:[],//实际拣货人集合
      btnList: [],
      waveCode : { // 出货单类型数据
        data: [],
        start : 1,
        limit: 10
      },
      waveCodePage: 1,//出货单类型页码
      searchWaveCode: '',//波次号的查询字段
      searchParam: {},
      isDeliverDeficiency: false//是否可超量收货
    }
  },
  created(){
    this.getStaffs()
    this.initBtn()
    // this.initWaveCodeList()
    this.getDeliverDeficiency()
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  watch:{
    'dataTableDetail.data':{
      handler(newValue, oldValue) {
        //actualBoxAmount//箱 actualCaseAmount//盒 actualPieceAmount//件
        newValue.forEach((item, index) => {
          let reg = /^(-|\+)?\d+$/
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))) {
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) )) {
              return this.$message.warning('请输入整数')
            }
          }
          item.actualPickAmount = parseFloat((item.actualBoxAmount* item.bigNum + item.actualCaseAmount* item.midNum + item.actualPieceAmount* item.smallNum).toFixed(6));
          if(this.isDeliverDeficiency){
            //实际总数量必须小于等于计划总数量
            if((0<item.actualPickAmount) && (item.actualPickAmount<=item.planPickAmount)){
              //不做处理
            }else{
              return this.$message.warning('实际总数量必须大于0并且小于等于计划总数量')
            }
          }else{
            if(item.actualPickAmount ==item.planPickAmount){
              //不做处理
            }else{
              return this.$message.warning('实际总数量必须等于计划总数量')
            }
          }
        })
      },
      deep: true
    }
  },
  methods:{
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
    getDeliverDeficiency(){
      let params = {
        settingDefCode: "WMS_SHIPMENT_DELIVER_DEFICIENCY",
        dimensionDefCode: "warehouse"
      }
      shipmentDeliverDeficiency(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].defaultValue == 1){
              if(data[i].settingParamValue == 1){
                this.isDeliverDeficiency = true
              }else if(data[i].settingParamValue == 2){
                this.isDeliverDeficiency = false
              }
            }
          }
        }
      })
    },
    initBtn() {
      let menusKey = 'WMS_EXPORT_OUT';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    // initWaveCodeList (accumulation) {
    //   let oldData = []; // 存放之前的数据
    //   oldData = JSON.parse(JSON.stringify(this.waveCode.data));
    //   let params = {
    //     start: this.waveCode.start,
    //     limit: this.waveCode.limit
    //   };
    //   getRecipt(params).then(res => {
    //     let data = res.data;
    //     if (data.status == 10001) {
    //       this.$message.warning(data.message);
    //     } else {
    //       accumulation ? this.waveCode.data = oldData.concat(data.records) : this.waveCode.data = JSON.parse(JSON.stringify(data.records));
    //       this.waveCodePage = data.pages; // 总页码
    //     };
    //   })
    // },
    // loadMoreWaveCode () {
    //   if ( this.waveCode.start == this.waveCodePage) {
    //     this.$message.warning('没有更多数据了');
    //   } else {
    //     this.waveCode.start = this.waveCode.start + 1;
    //     this.initWaveCodeList(true);
    //   }
    // },
    //波次号
    initWaveCode (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.waveCode.data));
      let params = {
        waveCode: this.searchWaveCode,
        start: this.waveCode.start,
        limit: this.waveCode.limit
      };
      getRecipt(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.waveCode.data = oldData.concat(data.records) : this.waveCode.data = JSON.parse(JSON.stringify(data.records));
          this.waveCodePage = data.pages // 总页码
        }
      })
    },
    waveCodeMore () {
      if ( this.waveCode.start == this.waveCodePage) {
        // this.$message.warning('没有更多数据了');
      } else {
        this.waveCode.start = this.waveCode.start + 1
        this.initWaveCode(true)
      }
    },
    searchWave(val){
      this.searchWaveCode = val
      this.waveCode.data =[]
      this.waveCode.start = 1
      this.initWaveCode()
    },
    focusWaveCode(Event){
      if(Event.srcElement){
        this.searchWaveCode = Event.srcElement.value
      }else{
        this.searchWaveCode = Event.target.value
      }
      this.waveCode.data =[]
      this.waveCode.start = 1
      this.initWaveCode()
    },
    changeWaveCode(val){
      this.searchWaveCode = val
    },
    clearWaveCode(){
      this.searchWaveCode = ''
    },
    //拣货完成
    actuallish(){
      if(this.getSelectedDetailRow.length == 0){
        return this.$message.warning('请选择需要拣货完成的明细数据！');
      }
      if(!this.actualshipperId){
        return this.$message.warning('请选择实际拣货人！');
      }
      let flag = true
      let reg = /^(-|\+)?\d+$/
      this.getSelectedDetailRow.forEach((item,index) => {
        item.takeDownOperaorId = this.actualshipperId;
        if(this.isDeliverDeficiency){
          //实际总数量必须小于等于计划总数量
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) )) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }
          if((0<=item.actualPickAmount) && (item.actualPickAmount<=item.planPickAmount)){
            //不做处理
          }else{
            flag = false
            return this.$message.warning('实际总数量必须大于0并且小于等于计划总数量')
          }
        }else{
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) )) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }
          if(item.actualPickAmount ==item.planPickAmount){
            //不做处理
          }else{
            flag = false
            return this.$message.warning('实际总数量必须等于计划总数量')
          }
        }
      })
      if(flag){
        updateRecipt(this.getSelectedDetailRow).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success('拣货完成!')
            setTimeout(() =>{
              this.initTable(1)

            }, 1000)
          }
        })
      }

    },
    //整单完成
    shipperreceipt(){
      if(!this.getSelectedRow || this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要整单完成的主档数据！');
      }
      if(!this.actualshipperId){
        return this.$message.warning('请选择实际拣货人！');
      }
      let flag = true
      let reg = /^(-|\+)?\d+$/
      this.dataTableDetail.data.forEach((item,index) => {
        item.takeDownOperaorId = this.actualshipperId;
        if(this.isDeliverDeficiency){
          //实际总数量必须小于等于计划总数量
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) )) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }
          if((0<item.actualPickAmount) && (item.actualPickAmount<=item.planPickAmount)){
            //不做处理
          }else{
            flag = false
            return this.$message.warning('实际总数量必须大于0并且小于等于计划总数量')
          }
        }else{
          if(item.smallPackageUnitId != 10) {
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) && reg.test(item.actualPieceAmount))) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }else{
            if (!(reg.test(item.actualBoxAmount) && reg.test(item.actualCaseAmount) )) {
              flag = false
              return this.$message.warning('请输入整数')
            }
          }
          if(item.actualPickAmount ==item.planPickAmount){
            //不做处理
          }else{
            flag = false
            return this.$message.warning('实际总数量必须等于计划总数量')
          }
        }
      })
      if(flag){
        updateRecipt(this.dataTableDetail.data).then(res => {
          let data = res.data
          if(data.status == 10001){
            this.$message.warning(data.message)
          }else{
            this.$message.success('整单完成成功!')
            setTimeout(() =>{
              this.initTable(1)

            }, 1000)
          }
        })
      }

    },
    //打印
    receiptPrinter(){
      if(!this.getSelectedRow || this.getSelectedRow.length == 0){
        return this.$message.warning('请选择需要打印的表单回单信息');
      }
      let params = {
        pickNoteId: this.getSelectedRow.pickNoteId
      }
      receiptPrint(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          let template = data[0].template
          let templateId = template[0].template_id
          let templateType = template[0].template_type
          console.log(templateId, templateType)
          this.printOk(templateId, templateType, data)
        }
      })

    },
    //调用ERP打印
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params);
    },
    searchList(){
      this.searchParam = {
        waveCode: this.formInline.waveCode,
        pickNoteCode: this.formInline.pickNoteCode,
        isAsc: this.formInline.isAsc,
        sortField: this.formInline.sortField
      }
      this.initTable(1)
    },
    // 表单重置
    reseltForm (formName) {
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.formInline.isAsc = true
      this.formInline.sortField = 'waveCode'
    },
    tableHeight() {
      // let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height ='250';
      this.dataTableDetail.height = $(window).height() - this.dataTable.height- this.$store.state.basic.height - 70;
      //
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
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      //设置单选默认值
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      this.$refs.tableConfig.domShow = false;
      this.$nextTick(() => {
        this.$refs.tableConfig.domShow = true;
        this.$refs.tableConfig.dialogVisible = false;
      });
      this.initTable(1)
    },
    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'actualBoxAmount') {
          item.hasCenterCol = true;
          item.show = 'actualBoxAmount'
        }
        if (item.prop == 'actualCaseAmount') {
          item.hasCenterCol = true;
          item.show = 'actualCaseAmount'
        }
        if (item.prop == 'actualPieceAmount') {
          item.hasCenterCol = true;
          item.show = 'actualPieceAmount'
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
      this.$refs.dataTableConfig.domShow = false;
      this.$nextTick(() => {
        this.$refs.dataTableConfig.domShow = true;
        this.$refs.dataTableConfig.dialogVisible = false;
      });
    },
    onRowClick (val) { // 表格行点击
      if(val){
        this.dataTable.radio = val.row.index
        this.getSelectedRow = val.row
        this.initDetailTable(1, val.row.pickNoteId)
      }
    },
    onHandleSelectionChange(val){
      // this.dataTable.radio = val[0].index
      // this.getSelectedRow = val
      // if(val[0]){
      //   this.initDetailTable(val[0].pickNoteId, 1)
      // }
    },
    onHandleDetailSelectionChange(val){
      this.getSelectedDetailRow = val
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      this.initTable(this.dataTable.start)
    },
    handleCurrentChange (val) { // 页码选择
      this.dataTable.start = val;
      this.initTable(this.dataTable.start)
    },
    resetDetailTable(){//重置明细表
      this.dataTableDetail.data = []
      this.dataTableDetail.start = 1
      this.dataTableDetail.limit = 1000
      this.dataTableDetail.total = 0
    },
    getStaffs(){//获取员工
      let params = {
        isOnWork: true
      }
      userFromErp(this.filteParams(params)).then(res => {
        let re = res.data
        if(re.length > 0){
          this.actualshipper = re
        }
      })
    },
    initTable(current){
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      this.resetDetailTable()//重置明细表格
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getRecipt(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001 || data.records.length == 0){
          if(data.status == 10001){
            this.$message.warning(data.message)
          }
          //查询失败重置表格数据
          this.dataTable.data = []
          this.dataTable.start = 1
          this.dataTable.limit = 10
          this.dataTable.total = 0
        }else{
          data.records.forEach((item,index) => {
            item.index = index;
            if(item.operationDate){
              item.operationDate = item.operationDate.split(/\s+/)[0]
            }
          });
          this.dataTable.radio = 0;
          this.getSelectedRow = data.records[0]
          this.dataTable.data = JSON.parse(JSON.stringify(data.records))
          this.dataTable.start = data.current
          this.dataTable.limit = data.size
          this.dataTable.total = data.total
          this.initDetailTable(1, this.dataTable.data[0].pickNoteId)
        }
      })
    },
    initDetailTable(current, pickNoteId){
      let params = {
        pickNoteId: pickNoteId,
        start: this.dataTableDetail.start,
        limit: this.dataTableDetail.limit
      }
      getReciptDetail(this.filteParams(params)).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
          //查询失败重置表格数据
        }else{
          data.records.forEach(item => {
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
            if(item.midNum == null || item.midNum == 0){
              item.midNum = 0
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
          this.dataTableDetail.data = JSON.parse(JSON.stringify(data.records))
          this.dataTableDetail.start = data.current
          this.dataTableDetail.limit = data.size
          this.dataTableDetail.total = data.total
        }
      })
    }
  }
}
