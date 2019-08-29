// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import { loaddBtn } from '@/api/common/load-btn.js';
import tableConfigure from '@/components/table/tableConfigure.vue';
import { mainteAdd, mainteList, mainteUpdate, mainteDel, mainteenter, getlinename_sec } from '@/api/basic-manage/route-mainte/index.js';
import { dictionarysType } from '@/api/common/type.js'; //字典接口
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog'
import '../style/index.scss'
export default {
  name: 'mainte',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog // 弹窗
  },
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('编码不能为空'));
      } else {
        var temp = this.codeArr;
        var a = temp.indexOf(value);
        if (a > -1 && this.mainteTitle == '新增') {
          callback(new Error('当前线路编码' + value + '已存在！'));
        }
        callback();
      }
    };
    return {
      rulesForm: {
        routeCode: [{ required: true, validator: validateCode, trigger: 'change' }],
        routeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        routeNames: [{ required: true, message: '全称称不能为空', trigger: 'change' }],
        deliveryTypeId: [{ required: true, message: '请选择配送', trigger: 'change' }],
        transportTypeId: [{ required: true, message: '请选择运送', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        age: ''
      },
      btnList: [],
      mainteTitle: '新增',
      dialogVisible: false,
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
      formInline: {
        routeId: '',
        warehouseCode: '',
        warehouseName: '',
        routeCode: '',
        routeName: '',
        routeNames: '',
        deliveryTypeId: '',
        transportTypeId: '',
        status: '',
        remark: ''
      },
      getSelectedRow: [], // 用户选择的数据
      tableName: {
        tableCode: "WMS_BASICDATA_ROUTE_TABLE"
      }, // 表格ID ，就是表格自定义名称
      heightResize: true,
      addForm: {
        routeId: '',
        warehouseCode: '',
        warehouseName: '',
        routeCode: '',
        routeName: '',
        routeNames: '',
        deliveryTypeId: '',
        transportTypeId: '',
        status: '',
        remark: ''
      },
      dataChange: false, //是否有数据被修改
      deliveryWay: '',
      transportWay: '',
      dictDtlstatus: '',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除?'
      },
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      codeArr: [],
      updateDisabled: true, //部分字段是否可编辑
      routeIds: '',
      mainteName: '',
      maintetransport: '',
      maintestate: '',
      locations: '',
      weekse: "",
      oldForm: {
        routeId: '',
        warehouseCode: '',
        warehouseName: '',
        routeCode: '',
        routeName: '',
        routeNames: '',
        deliveryTypeId: '',
        transportTypeId: '',
        status: '',
        remark: ''
      },
      isSave: false,
      searchParam: {}
    }
  },
  created() {
    this.initBtn();
    this.initDictionarysType();
    this.initDictionarysway();
    this.initDictionaryStatus();
    this.initDictionarylinename();
  },
  mounted() {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  computed: {
    routeName() {
      return this.addForm.routeName
    },
    deliveryTypeId() {
      return this.addForm.deliveryTypeId
    },
    transportTypeId() {
      return this.addForm.transportTypeId
    }
  },
  watch: {
    routeName(newValue, oldValue) {
      this.queryTrendData()
    },

    deliveryTypeId(newValue, oldValue) {
      this.queryTrendData()
    },
    transportTypeId(newValue, oldValue) {
      this.queryTrendData()
    },
    addForm: {
      handler: function (newVal, oldVal) {
        for(let item in newVal) {
          if(newVal[item] != this.oldForm[item]){//比较不同的数据返回true
            this.isSave = true
            return
          }
        }
      },
      deep: true
    }
  },
  methods: {
    tableHeight() {
      let formHeight = $("#route-mainte").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 80
    },
    queryTrendData() {
      let key = this.deliveryWay.findIndex(item => item.dictDtlValue == this.addForm.deliveryTypeId)
      let key2 = this.transportWay.findIndex(item => item.dictDtlValue == this.addForm.transportTypeId)
      let deliveryType = '',
        transport = ''
      if (key != -1) {
        deliveryType = this.deliveryWay[key].dictDtlName
      }
      if (key2 != -1) {
        transport = this.transportWay[key2].dictDtlName
      }
      this.addForm.routeNames = this.addForm.routeName + deliveryType + transport
      this.oldForm.routeNames = this.addForm.routeName + deliveryType + transport
    },
    handleClose() {
      if (this.isSave) {
          this.isSaveDialog.modalShow = true
      } else {
        this.resetForm()
      }
    },
    onRowClick(row) {},
    initBtn() {
      let menusKey = 'WMS_ROUTE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    searchList() {
      this.searchParam = {
        routeId: String(this.formInline.routeCode),
        deliveryTypeId: this.formInline.deliveryTypeId,
        transportTypeId: this.formInline.transportTypeId,
        status: this.formInline.status,
      }
      this.initMainte(1);
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
    addList() {
      this.dataChange = false
      this.mainteTitle = '新增';
      this.dialogVisible = true;
      this.updateDisabled = false;
      this.addForm.status = String(this.dictDtlstatus[0].status)
      this.addForm.deliveryTypeId = String(this.deliveryWay[0].dictDtlValue)
      this.addForm.transportTypeId = String(this.transportWay[0].dictDtlValue)
      this.oldForm.status = String(this.dictDtlstatus[0].status)
      this.oldForm.deliveryTypeId = String(this.deliveryWay[0].dictDtlValue)
      this.oldForm.transportTypeId = String(this.transportWay[0].dictDtlValue)
    },
    resetList() {
      this.formInline.routeCode = '';
      this.formInline.routeName = '';
      this.formInline.deliveryTypeId = '';
      this.formInline.transportTypeId = '';
      this.formInline.status = '';
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    delList() {
      // status
      let notDel = this.getSelectedRow.every((item, index) => {
        return item.status != 1 // 1为启用
      });
      let len = this.getSelectedRow.length;
      let touteRelation = false;
      if (!notDel) {
        this.$message.warning('已启用线路不能删除');
        return false;
      } else if (len < 1) {
        this.$message.warning('请选择需要删除的线路信息')
      } else {
        this.delDialog.modalShow = true;
      }
    },
    updateList() {
      this.dataChange = false
      this.mainteTitle = '修改';
      this.updateDisabled = true;
      let len = this.getSelectedRow.length;
      if (len == 0) {
        this.$message.warning('请选择需要修改的线路信息')
      } else if(len > 1){
        this.$message.warning('修改线路信息不能大于一条')
      } else {
        this.dialogVisible = true;
        this.updateDisabled = true; // 是否可编辑
        this.addForm.warehouseCode = this.getSelectedRow[0].warehouseCode
        this.addForm.routeCode = this.getSelectedRow[0].routeCode
        this.addForm.routeId = this.getSelectedRow[0].routeId
        this.addForm.routeName = this.getSelectedRow[0].routeName
        this.addForm.routeNames = this.getSelectedRow[0].routeNames
        this.addForm.deliveryTypeId = String(this.getSelectedRow[0].deliveryTypeId)
        this.addForm.transportTypeId = String(this.getSelectedRow[0].transportTypeId)
        this.addForm.status = String(this.getSelectedRow[0].status)
        this.addForm.remark = this.getSelectedRow[0].remark
        //oldform
        this.oldForm.warehouseCode = this.getSelectedRow[0].warehouseCode
        this.oldForm.routeCode = this.getSelectedRow[0].routeCode
        this.oldForm.routeId = this.getSelectedRow[0].routeId
        this.oldForm.routeName = this.getSelectedRow[0].routeName
        this.oldForm.routeNames = this.getSelectedRow[0].routeNames
        this.oldForm.deliveryTypeId = String(this.getSelectedRow[0].deliveryTypeId)
        this.oldForm.transportTypeId = String(this.getSelectedRow[0].transportTypeId)
        this.oldForm.status = String(this.getSelectedRow[0].status)
        this.oldForm.remark = this.getSelectedRow[0].remark
      }
    },
    initMainte(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam);
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      mainteList(this.filteParams(params)).then(res => {
        let re = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        this.dataTable.start = re.current;
        this.dataTable.limit = re.size;
        this.dataTable.total = re.total;
        this.dataTable.data.forEach(item => {
          this.codeArr.push(item.routeCode)
        })
      })
    },
    //删除
    removeRow() {
      let routeIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        routeIdArr.push(item.routeId);
      });
      this.routeIds = routeIdArr.join(',');
      mainteDel(this.routeIds).then(res => {
        if (res.data.status == 10001) {
          this.$message.warning(res.data.message);
        } else {
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.resetList();
          this.initMainte(1);
        }
      })
    },
    //取消确认弹窗-确认退出
    cancelExit() {
      this.delDialog.modalShow = false
    },

    remoteMethod(formInline) {
      if (formInline !== '') {
        setTimeout(() => {
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(formInline.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = this.list;
      }

    },
    //表格
    onHandleSelectionChange(val) {
      this.getSelectedRow = val;
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
        width: '100%',
        className: ''
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
      this.initMainte(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      this.initMainte(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      this.dataTable.start = val;
      this.initMainte(this.dataTable.start);
    },

    //下拉框字典
    //配送方式
    initDictionarysType() {
      let params = {
        code: 'delivery_type'
      };
      dictionarysType(params).then(res => {
        this.deliveryWay = JSON.parse(JSON.stringify(res.data));
      })
    },
    //运送方式
    initDictionarysway() {
      let params = {
        code: 'transport_type'
      };
      dictionarysType(params).then(res => {
        this.transportWay = JSON.parse(JSON.stringify(res.data));
      })
    },
    //状态
    initDictionaryStatus() {
      let params = {
        code: 'wharf_status'
      }
      dictionarysType(params).then(res => {
        this.dictDtlstatus = JSON.parse(JSON.stringify(res.data))
      })
    },
    initDictionarylinename() {
      getlinename_sec().then(res => {
        this.mainteName = JSON.parse(JSON.stringify(res.data))
      })
    },

    resetForm() { // 清空表单
      this.isSaveDialog.modalShow = false
      this.isSave = false
      this.dialogVisible = false
      this.addForm =  {
        routeId: '',
        warehouseCode: '',
        warehouseName: '',
        routeCode: '',
        routeName: '',
        routeNames: '',
        deliveryTypeId: '',
        transportTypeId: '',
        status: '',
        remark: ''
      }
      this.oldForm =  {
        routeId: '',
        warehouseCode: '',
        warehouseName: '',
        routeCode: '',
        routeName: '',
        routeNames: '',
        deliveryTypeId: '',
        transportTypeId: '',
        status: '',
        remark: ''
      }
      this.$refs['addForm'].resetFields();
      this.updateDisabled = true
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.mainteTitle == '修改') {
            mainteUpdate(this.addForm).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('修改成功')
                this.resetForm()
                this.dialogVisible = false
                this.resetList();
                this.initMainte(1);
              }
            })
          } else {
            mainteAdd(this.addForm).then(res => {
              if (res.data.status == 10001) {
                this.$message.warning(res.data.message)
              } else {
                this.$message.success('新增成功')
                this.resetForm()
                this.dialogVisible = false
                this.resetList()
                this.initMainte(1);
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
