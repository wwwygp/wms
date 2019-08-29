// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { wharfList, wharfUpdate, wharfDel, wharfAdd, selectWharf } from '@/api/basic-data/wharf/index.js';
import { printerGroup } from '@/api/basic-data/printer/index.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';//启用和禁用
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'wharf',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog,
    selfDialog
  },
  data() {
    return {
      oldForm: {}, // 初始化的form数据
      heightResize: true,
      wharfTitle: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的码头资料?'
      },
      dialogVisible: false,
      formInline: {//主页表单
        wharfIds: ''
      },
      wharfNames: [],
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
        tableCode: "WMS_BASICDATA_WHARF_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        // baseWharfDto: '',//码头实体接收类
        // warehouseId: '',//仓库名称
        wharfCode: '',//码头编码
        wharfName: '',//码头名称
        wharfType: '',//码头类型名称
        hasLiftingBoard: "0",//是否有调节板,默认否
        status: "1",//状态，默认启用
        remark: '',//备注
        printerGroupId: '0'
      },
      rulesForm: {
        wharfCode: [{ required: true, message: '码头编码不能为空', trigger: 'change' }],
        wharfName: [{ required: true, message: '码头名称不能为空', trigger: 'change' }],
        wharfType: [{ required: true, message: '码头类型不能为空', trigger: 'change' }],
        hasLiftingBoard: [{ required: true, message: '请选择是否有调节板', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        printerGroupId: [{required: true,message: '请选择打印机组', trigger: 'change'}]
      },
      wharfStatus:[],//码头状态
      liftingBoard: [],//调节板
      wharf: [],//码头名称
      wharfData : { // 码头数据
        start : 1,
        limit: 10
      },
      wharfPage: 1,//码头页码
      printerGroup: [],//打印机组
      groupData : { // 打印机组数据
        start : 1,
        limit: 10
      },
      groupPage: 1, // 打印机组页码
      wharfType: [],//码头类型
      wharfTypeData : { // 码头类型数据
        start : 1,
        limit: 10
      },
      wharfTypePage: 1,//码头类型页码
      wharfIds: '',//删除的码头id
      updateDisabled: false,
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {}
    }
  },
  created() {
    this.initBtn();
    this.initDictionary();//从字典中获取配置参数
    this.getWharf();//获取码头名称
    // this.getPrinterGroup();//获取打印机组数据
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
    }
  },
  methods: {
    closeDialog () {
      this.resetForm('form');
    },
    //下拉选择框
    loadMoreWharf() {
      //如果当前页面小于总页数则获取其他数据
      if (this.wharfData.start == this.wharfPage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.wharfData.start = this.wharfData.start + 1;
        let wharfAccumulationData = true;
        this.getWharf(wharfAccumulationData);
      }
    },
    loadMorePrinterGroup() {
      // //如果当前页面小于总页数则获取其他数据
      // if (this.groupData.start == this.groupPage) { // 页码相同就不用累加了
      //   this.$message.warning('没有更多数据了')
      // } else {
      //   this.groupData.start = this.groupData.start + 1;
      //   let accumulation = true;
      //   this.getPrinterGroup(accumulation);
      // }
    },
    loadMoreWharfType() {
      //如果当前页面小于总页数则获取其他数据
      if (this.wharfTypeData.start == this.wharfTypePage) { // 页码相同就不用累加了
        this.$message.warning('没有更多数据了')
      } else {
        this.wharfTypeData.start = this.wharfTypeData.start + 1;
        let accumulation = true;
        let params = {
          code: 'wharf_type'
        }
        dictionarysType(params).then(res => {
          this.wharfType = JSON.parse(JSON.stringify(res.data))
          this.wharfTypePage = res.data.pages;
            // accumulation // 需要累加
            accumulation ? this.printerGroup = oldData.concat(res.data): this.printerGroup = JSON.parse(JSON.stringify(res.data));
        })
      }
    },
    selectChangeWharfType(curVal, oldVal) {
      this.form.wharfType = curVal;
    },
    //远程搜索可用
    remoteMethodWharfType(query) {
      //模糊搜素
    },
    getWharf (wharfAccumulation) { // 获取码头
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.wharf));
      let params = JSON.parse(JSON.stringify(this.wharfData))
      selectWharf(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // wharfAccumulation // 需要累加
          wharfAccumulation ? this.wharf = oldData.concat(res.data): this.wharf = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
    // getPrinterGroup (accumulation) { // 获取打印机组信息
    //   let oldData = []; // 存放之前的数据
    //   oldData = JSON.parse(JSON.stringify(this.printerGroup));
    //   let params = JSON.parse(JSON.stringify(this.groupData))
    //   printerGroup(params).then(res => {
    //     if(res.data.status == 10001){
    //       this.$message.warning(res.data.message)
    //     }else{
    //       this.groupPage = res.data.pages;
    //       // accumulation // 需要累加
    //       accumulation ? this.printerGroup = oldData.concat(res.data.records): this.printerGroup = JSON.parse(JSON.stringify(res.data.records));
    //       //默认选项
    //       let key = this.printerGroup.findIndex(item => item.printerGroupId == 0)
    //       if(key == -1){
    //         let defaultPrinterGroup = {
    //           "createTime": "2018-10-16 14:14:37",
    //           "createrId": 10086,
    //           "createrName": "",
    //           "deleteStatus": 0,
    //           "editTime": "2018-10-16 14:16:24",
    //           "editorId": 10086,
    //           "editorName": "",
    //           "printerGroupCode": "0",
    //           "printerGroupId": '0',
    //           "printerGroupName": "无",
    //           "remark": "无",
    //           "warehouseCode": "",
    //           "warehouseId": 164,
    //           "warehouseName": ""
    //         }
    //         this.printerGroup.splice(0,0,defaultPrinterGroup)
    //       }
    //     }
    //   })
    // },
    initDictionary(accumulation) {
      let params = {
        code: 'wharf_type'
      }
      dictionarysType(params).then(res => {
        this.wharfType = JSON.parse(JSON.stringify(res.data))
      })
      let params1 = {
        code: 'wharf_status'
      };
      dictionarysType(params1).then(res => {
        this.wharfStatus = JSON.parse(JSON.stringify(res.data))
      })
      let params2 = {
        code: 'yes_or_no'
      };
      dictionarysType(params2).then(res => {
        this.liftingBoard = JSON.parse(JSON.stringify(res.data))
      })
    },
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height;
    },
    resetForm(formName) { // 清空表单
      if(this.isSave){
        this.isSaveDialog.modalShow = true
      }else{
        this.form = {
          wharfCode: '',//码头编码
          wharfName: '',//码头名称
          wharfType: '',//码头类型名称
          hasLiftingBoard: "0",//是否有调节板,默认否
          status: "1",//状态，默认启用
          remark: '',//备注
          printerGroupId: '0'
        }
        this.form = JSON.parse(JSON.stringify(this.form));
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
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
      let menusKey = 'WMS_WHARF';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initWharf(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      wharfList(this.filteParams(params)).then(res => {
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
      this.searchParam = {
        wharfId: this.formInline.wharfIds
      }
      this.initWharf(1)
    },
    resetList() {
      this.formInline.wharfIds = ''
      this.searchParam.wharfIds = ''
    },
    addList() {
      this.isSave = false; // 初始化
      this.wharfTitle = '新增';
      this.form = {
        wharfCode: '',//码头编码
        wharfName: '',//码头名称
        wharfType: '',//码头类型名称
        hasLiftingBoard: "0",//是否有调节板,默认否
        status: "1",//状态，默认启用
        remark: '',//备注
        printerGroupId: '0'
      }
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.updateDisabled= false
    },
    updateList () {
      this.isSave = false;
      this.wharfTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的码头信息')
        return false
      }else if(len > 1){
        this.$message.warning('修改码头信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.status = String(newForm.status)
        newForm.hasLiftingBoard = String(newForm.hasLiftingBoard)
        newForm.wharfType = String(newForm.wharfType)
        newForm.printerGroupId = parseInt(newForm.printerGroupId)//下拉加载数据，会有回填问题
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
      }
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
    },
    updateForm() {
      let axiosApi;
      this.wharfTitle == '修改' ? axiosApi = wharfUpdate(this.form) : axiosApi = wharfAdd(this.form);
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.wharfTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.resetList();
          this.initWharf(1);//刷新表格
          this.getWharf();//获取码头名称
        }
      })
    },
    delList() {
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要删除的码头信息')
        return false
      }else {
        this.delDialog.modalShow = true;
      }
      
    },
    removeRow() {
      //
      let wharfIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        wharfIdArr.push(item.wharfId);
      });
      this.wharfIds = wharfIdArr.join(',');
      wharfDel(this.wharfIds).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.resetList();
          this.initWharf(1);//刷新表格
          this.getWharf();//获取码头名称
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
      this.initWharf(1);
    },
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initWharf(this.dataTable.start);
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initWharf(this.dataTable.start);
    },
    //取消确认弹窗
    cancel(formName){
      this.form = {
        wharfCode: '',//码头编码
        wharfName: '',//码头名称
        wharfType: '',//码头类型名称
        hasLiftingBoard: "0",//是否有调节板,默认否
        status: "1",//状态，默认启用
        remark: '',//备注
        printerGroupId: '0'
      }
      this.$refs[formName].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.isSave = false
    },
  }
}
