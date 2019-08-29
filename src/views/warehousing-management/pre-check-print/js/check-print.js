import { dictionarysType,standardDic } from '@/api/common/type.js';//启用和禁用,标准字典
import {suppliersList,ownersList} from '@/api/common/business.js'; // 供应商
import tableConfigure from '@/components/table/tableConfigure.vue';
import {getReceiveNoteList, receiveNote, receiveNoteConfirm, getReceiveNoteDetail, delReceiveNoteDetail, isComplete} from '@/api/warehousing-management/receive-node/receive-node';
import { loaddBtn } from '@/api/common/load-btn.js';
import {prePrintInfo, previousPrintStatus} from '@/api/warehousing-management/pre-check-print/check-print';
import {previousPrintLabel, previousPrint} from '@/api/common/print.js'
import {print} from '@/api/common/print-api.js'; // 调用打印机
export default {
  name: 'check-print',
  components: {
    tableConfigure
  },
  data() {
    return{
      formInline: {
        receiveNoteCode: '', // 收货单号
        arrivalNoticeTypeId: '', // 预到货单类型
        ownerId: '', // 委托业主ID
        supplierId: '', // 供应商ID
        statuses: '5,11'
      },
      selectNoticeType: [], // 预到货单类型
      getSelectedRow: [], // 用户多选框选中的数据
      supplierArr: {
        data: [],
        start: 1,
        limit: 10
      }, // 供应商对象集合
      supplierArrPage: 1, // 判断是否需要数据累加
      ownersArrPage: 1, //
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      heightResizeLeft: true,
      dataTableLeft: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: true,
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        radio: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableNameLeft: {
        tableCode: 'WMS_PRE_CHECK_PRINT_LEFT_TABLE'
      },
      dataTableRight: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableNameRight: {
        tableCode: 'WMS_PRE_DELIVERY_RIGHT_TABLE'
      },
      heightResizeRight: true,
      dataTableDetail: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: false,
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      },
      tableNameDetail: {
        tableCode: 'WMS_PRE_CHECK_DETAIL_TABLE'
      },
      heightResizeDetail: true,
      radio: '1',
      getSelectedRowDetail: [], // 用户选择明细
      btnList: [],
      standardTypeArr: [],
      searchParam: {}
    }
  },
  created () {
    this.initSupplier(false); // 供应商 // 给false是初始化的时候不需要累加
    this.initOwnersList(false); // 委托书
    this.initBtn(); // 初始化按钮
    this.initType(); //
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
    initType () {
      let params = {
        code: 'WMS_IMPORT_ARRIVAL_NOTICE_CHECK_TYPE'
      };
      dictionarysType(params).then(res => {
        this.standardTypeArr = JSON.parse(JSON.stringify(res.data));
      })
    },
    initBtn() {
      let menusKey = 'WMS_PRE_CHECK_PRINT';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
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
    radioClick (val) {
      this.getSelectedRow = [val.row]
      this.dataTableLeft.radio = val.row.index;
      this.initPrintInfo() 
      this.printGetReceiveNoteDetail(this.getSelectedRow)
    },
    onHandleSelectionChange(val) { // 用户的选择框事件
      // this.getSelectedRow = val;
      // if(val[0]){
      //   this.initPrintInfo() 
      //   this.printGetReceiveNoteDetail(val)
      // }
    },
    onHandleSelectionChangeRight (val) {
      this.getSelectedRowDetail = val
    },
    tableDataHandleLeft(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'checkTypeName' || item.prop=='checkValue') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTableLeft.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTableLeft.radio = 0;
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTableLeft.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableLeft.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfigLeft.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfigLeft.domShow = true;
        // this.dataTableLeft.loading = false; // loading事件取消
        this.$refs.tableConfigLeft.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
      this.initTable(1) // 主表格初始化
    },
    tableDataHandleRight(data) { // table数据处理函数
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
      this.dataTableRight.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTableRight.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableRight.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfigRight.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfigRight.domShow = true;
        // this.dataTableLeft.loading = false; // loading事件取消
        this.$refs.tableConfigRight.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    tableDataHandleDetail(data) { // table数据处理函数
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
      this.dataTableDetail.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTableDetail.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.dataTableDetail.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfigDetail.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfigDetail.domShow = true;
        // this.dataTableLeft.loading = false; // loading事件取消
        this.$refs.tableConfigDetail.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTableLeft.height = ($(window).height() - formHeight - this.$store.state.basic.height)/2 - 30;
      this.dataTableRight.height = ($(window).height() - formHeight - this.$store.state.basic.height)/2 - 30;
      this.dataTableDetail.height = this.dataTableLeft.height;
    },
    initNoticeType () { // 预到货单类型
      let params = {
        code: 'WMS_IMPORT_ARRIVAL_MOTICE_TYPE'
      };
      dictionarysType(params).then(res => {
        this.selectNoticeType = JSON.parse(JSON.stringify(res.data));
      });
    },
    initSupplier (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.supplierArr.data));
      let params = {
        start: this.supplierArr.start,
        limit: this.supplierArr.limit
      };
      suppliersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.supplierArr.data = oldData.concat(data.records) : this.supplierArr.data = JSON.parse(JSON.stringify(data.records));
          this.supplierArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    supplierMore () {
      if ( this.supplierArr.start == this.supplierArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.supplierArr.start = this.supplierArr.start + 1;
        this.initSupplier(true);
      }
    },
    initOwnersList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.ownersArr.data));
      let params = {
        start: this.ownersArr.start,
        limit: this.ownersArr.limit
      };
      ownersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    ownersMore () {
      if ( this.ownersArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersArr.start = this.ownersArr.start + 1;
        this.initOwnersList(true);
      }
    },
    searchList() { // 查询
      //将副表置空
      this.dataTableRight = {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:10,
        total: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      }
      this.dataTableDetail = {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        hasRadio: false,
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit:100,
        total: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        }
      }
      // this.tableConfigLeft.radio = 0
      //通过表单数据获取表格
      this.searchParam = {
        receiveNoteCode: this.formInline.receiveNoteCode, // 收货单号
        arrivalNoticeTypeId: this.formInline.arrivalNoticeTypeId, // 预到货单类型
        ownerId: this.formInline.ownerId, // 委托业主ID
        supplierId: this.formInline.supplierId, // 供应商ID
        statuses: '5,11'
      }
      this.initTable(1)
    },
    resetList () { // 重置
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.formInline.statuses = '5,11'
      this.searchParam.statuses = '5,11'
    },
    handleCurrentChange (val) { // 分页页码
      this.dataTableLeft.start = val;
      this.initTable(this.dataTableLeft.start)
    },
    handleSizeChange (val) { // 分页每页展示的数量
      this.dataTableLeft.start = 1;
      this.dataTableLeft.limit = val;
      this.initTable(1)
    },
    handleCurrentChangeDetail (val) { // 分页页码
      this.dataTableDetail.start = val;
      this.printGetReceiveNoteDetail(this.getSelectedRow);
    },
    handleSizeChangeDetail (val) { // 分页每页展示的数量
      this.dataTableDetail.start = 1;
      this.dataTableDetail.limit = val;
      this.printGetReceiveNoteDetail(this.getSelectedRow);
    },
    initTable (current) { // 初始化表格
      let params = {
        start: current,
        limit: this.dataTableLeft.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getReceiveNoteList(this.filteParams(params)).then(res => {
        let re = res.data
        if(re.records.length > 0){
          re.records.forEach((item,index) => {
            item.index = index;
          });
          for(let i=0; i<re.records.length; i++){
            re.records[i].checkTypeId = String(re.records[i].checkTypeId)
            if(!re.records[i].checkValue){
              re.records[i].checkValue = 0
            }
          }

          this.dataTableLeft.data = JSON.parse(JSON.stringify(re.records));
          this.$refs.tableConfigLeft.setCurrentRow();
          this.dataTableLeft.radio = 0;
          this.getSelectedRow = [this.dataTableLeft.data[0]]
          this.initPrintInfo() 
          this.printGetReceiveNoteDetail([this.dataTableLeft.data[0]])
          this.dataTableLeft.start = re.current;
          this.dataTableLeft.limit = re.size;
          this.dataTableLeft.total = re.total;
        }else{
          this.dataTableLeft.data = [];
          this.$refs.tableConfigLeft.setCurrentRow();
          this.dataTableLeft.start = 1;
          this.dataTableLeft.limit = 10;
          this.dataTableLeft.total = 0;
        }
      });
    },
    debounce(fn, delay) {
      // 维护一个 timer
      let timer = null;
      return function() {
        // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
        let context = this;
        let args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      }
    },
    printGetReceiveNoteDetail (val) {
      let params = {
          limit: this.dataTableDetail.limit,
          start: this.dataTableDetail.start
        }
      getReceiveNoteDetail(val[0].receiveNoteId, params).then(res => {
        let data = res.data
        if(data.status == 10001){
          this.$message.warning(data.message)
        }else{
          this.dataTableDetail.data = JSON.parse(JSON.stringify(data.records));
          this.$refs.tableConfigRight.toggleRowSelection(this.dataTableRight.data[0], true)
          this.dataTableDetail.start = data.current;
          this.dataTableDetail.limit = data.size;
          this.dataTableDetail.total = data.total;
        }
      })
    },
    
    initPrintInfo () {
      // let params = {
      //   status: '5'
      // }
      if(this.getSelectedRow.length > 0){
        let id = this.getSelectedRow[0].receiveNoteId || ''
        prePrintInfo(id).then(res => {
          if (res.data.status == 10001) {
            this.$message.error(res.data.message);
          } else {
            this.dataTableRight.data = JSON.parse(JSON.stringify(res.data));
          }
        })
      }
    },
    checkPrint() {
      if(this.getSelectedRowDetail.length < 1){
        this.$message.warning('请选择预验收打印的预到货单号！')
        return false
      }
      let receiveNoteId = this.getSelectedRow[0].receiveNoteId || ''
      let checkTypeId = this.getSelectedRow[0].checkTypeId
      let checkValue = this.getSelectedRow[0].checkValue
      let arrivalNoticeCodeArr = []
        this.getSelectedRowDetail.forEach((item, index) => {
          arrivalNoticeCodeArr.push(item.arrivalNoticeCode)
        });
      let params = {
        "receiveNoteId": receiveNoteId,
        "checkTypeId": checkTypeId,
        "checkValue": checkValue,
        "acceptanceTypeId": this.radio,
        "arrivalNoticeCodes": arrivalNoticeCodeArr
      }
      previousPrintStatus(params).then(res => {
        if (res.data.status == 10001) {
          this.$message.error(res.data.message);
        } else {//状态修改成功后调用发音接口
          if (this.radio == 1){//标签打印
            let arrivalNoticeIdArr = []
            this.getSelectedRowDetail.forEach((item, index) => {
              arrivalNoticeIdArr.push(item.arrivalNoticeId)
            });
            let arrivalNoticeIds = arrivalNoticeIdArr.join(',')
            let params = {
              arrivalNoticeIds: arrivalNoticeIds
            }
            previousPrintLabel(receiveNoteId, params).then(res => {
              let data = res.data;
              if (data.status == 10001) {
                this.$message.warning(data.message);
              } else {
                let template = data[0].template
                let templateId = template[0].template_id
                let templateType = template[0].template_type
                this.printOk(templateId, templateType, data)
              };
            })
          } else if(this.radio == 2){//验收单打印
            let arrivalNoticeCodeArr = []
            this.getSelectedRowDetail.forEach((item, index) => {
              arrivalNoticeCodeArr.push(item.arrivalNoticeCode)
            });
            let arrivalNoticeCodes = arrivalNoticeCodeArr.join(',')
            let params = {
              arrivalNoticeCodes: arrivalNoticeCodes
            }
            previousPrint(receiveNoteId, params).then(res => {
              let data = res.data;
              if (data.status == 10001) {
                this.$message.warning(data.message);
              } else {
                let template = data[0].template
                let templateId = template[0].template_id
                let templateType = template[0].template_type
                this.printOk(templateId, templateType, data)
              }
              //打印成功  刷新页面
              // this.dataTableLeft.radio = 0
              this.initTable(1) // 主表格初始化
            })
          }
        }
      })
    },
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params)
    }
  }
}
