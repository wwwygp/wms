// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { wareHouseAreaList, wareHouseAreaUpdate, wareHouseAreaDel, wareHouseAreaAdd, allBaseWareHouseArea } from '@/api/storage-manage/warehouse-area/warehouse-area';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType, codeCharCount } from '@/api/common/type.js';//字典返回值，编码规则
import tipsDialog from '@/components/dialog/tipsDialog';
import selfDialog from '@/components/selfDialog/selfDialog'
import '../style/index.scss';
export default {
  name: 'BaseWarehouseArea',
  components: {
    tableConfigure,
    tipsDialog,
    selfDialog
  },
  data() {
    return {
      oldForm: {}, // 初始化的form数据
      tableShow: true,
      wareHouseTitle: '新增',
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确认删除？'
      },
      dialogVisible: false,
      formInline: {//主页表单
        warehouseAreaCode: ''
      },
      warehouseAreaCode: [],
      warehouseAreaPage: 1,//库区编码
      warehouseAreaData : { // 库区编码页码数据
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
        }
      },
      tableName: {
        tableCode: "WMS_BASICDATA_WAREHOUSEAREA_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {//弹窗表单
        warehouseAreaCode: '',//库区编码
        warehouseAreaName: '',//库区名称
        remark: '',//备注
      },
      rulesForm: {
        warehouseAreaCode: [{ pattern: /^[0-9a-zA-Z]+$/, message:'请输入数字或者字母',trigger:'change'}],
        warehouseAreaName: [{ required: true, message: '请输入库区名称', trigger: 'change' }],
        // remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
      },
      warehouseIds: '',//删除的库存信息
      updateDisabled: false,//修改是否可编辑
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      codeSize: 0,//编码位数
      sortString: '',//根据优先级排序
      searchParam: {}
    }
  },
  created() {
    this.sortString = 'warehouseAreaCode'
    // this.initWarehouseArea(1);
    this.initBtn();
    this.initDictionary();//从字典中获取配置参数
    this.getAllBaseWareHouseArea();//获取所有库区列表
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
  methods: {
    closeDialog () {
      this.resetForm('form');
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
        let wharfAccumulationData = true;
        this.getAllBaseWareHouseArea(wharfAccumulationData);
      }
    },
    getAllBaseWareHouseArea (wharfAccumulation) { // 获取码头
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.warehouseAreaCode));
      let params = JSON.parse(JSON.stringify(this.warehouseAreaData))
      allBaseWareHouseArea(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          // wharfAccumulation // 需要累加
          wharfAccumulation ? this.warehouseAreaCode = oldData.concat(res.data): this.warehouseAreaCode = JSON.parse(JSON.stringify(res.data));
        }
      })
    },
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
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '40';
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
    },
    //取消确认弹窗
    cancel(formName){
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.$refs[formName].resetFields();
      this.isSaveDialog.modalShow = false
      this.dialogVisible = false
      this.isSave = false
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
      let menusKey = 'WMS_WAREHOUSE_AERA';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initWarehouseArea(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      wareHouseAreaList(params).then(res => {
        let re = res.data;
        if(re.status == 10001) {
          this.dataTable.data = [];
          this.dataTable.start = 1;
          this.dataTable.limit = 10;
          this.dataTable.total = 0;
        }else{
          this.dataTable.data = JSON.parse(JSON.stringify(re.records));
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
      //点击查询需要按照优先级排序，库区根据库区编码
      this.sortString = 'warehouseAreaCode'
      this.searchParam ={
        warehouseAreaCode: this.formInline.warehouseAreaCode,
        sort: this.sortString,
        isAsc: true//升序
      }
      this.initWarehouseArea(1);
    },
    resetList() {//清空查询栏信息,下拉框默认“请选择”，下方表格不刷新
      this.formInline.warehouseAreaCode = '';
      for (let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      // this.dataTable.start = 1;
      // this.initWarehouseArea();
    },
    initTable() {//清空查询栏信息,下拉框默认“请选择”，下方表格不刷新
      this.formInline.warehouseAreaCode = '';
      this.dataTable.start = 1;
      this.initWarehouseArea(this.dataTable.start);
    },
    addList() {
      this.isSave = false; // 初始化
      this.wareHouseTitle = '新增';
      for (let item in this.form) {
        this.form[item] = '';
      };
      this.oldForm = JSON.parse(JSON.stringify(this.form)); // 获取初始化的数据
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.updateDisabled= false
      let params = {
        codeName: "WMS_WAREHOUSE_AREA_CODE_KQ"
      }
      codeCharCount(params).then(res => {
        this.codeSize = JSON.parse(JSON.stringify(res.data.codeSize))
      })
    },
    updateList () {
      this.isSave = false;
      this.wareHouseTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len == 0) {
        this.$message.warning('请选择需要修改的库区信息');
        return false
      } else if(len > 1){
        this.$message.warning('修改库区信息不能大于一条');
        return false
      }else{
        this.dialogVisible = true;
        this.updateDisabled= true; // 可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        this.form = JSON.parse(JSON.stringify(newForm));
        this.oldForm = JSON.parse(JSON.stringify(newForm));
      }
    },
    updateForm() {
      let axiosApi;
      this.wareHouseTitle == '修改' ? axiosApi = wareHouseAreaUpdate(this.form) : axiosApi = wareHouseAreaAdd(this.form);
      axiosApi.then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message);
        }else{
          this.wareHouseTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功');
          this.dialogVisible = false;
          this.sortString = ''
          this.initTable();
          // this.getAllBaseWareHouseArea();//获取所有库区列表
        }
      })
    },
    delList() {
      // status
      if(this.getSelectedRow.length == 0){
        this.$message.warning('请选择需要删除的库区信息');
        return false
      }
      this.delDialog.modalShow = true;
    },
    removeRow() {
      let warehouseAreaIdArr = [];
      this.getSelectedRow.forEach((item, index) => {
        warehouseAreaIdArr.push(item.warehouseAreaId);
      });
      this.warehouseAreaIds = warehouseAreaIdArr.join(',');
      let params = {
        warehouseAreaId: this.warehouseAreaIds
      }
      wareHouseAreaDel(params).then(res => {
        if(res.data.status == 10001){
          this.$message.warning(res.data.message)
        }else{
          this.$message.success('删除成功')
          this.delDialog.modalShow = false;
          this.initTable();
          this.getAllBaseWareHouseArea();//获取所有库区列表
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
      // this.tableShow = false
      this.$nextTick(() => {
        // this.tableShow = true
        this.$refs.tableConfig.domShow = true;
        this.$refs.tableConfig.dialogVisible = false;
      });
      //获取表格数据
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
          this.updateForm();
        } else {
          // this.$message.warning('表单填写不完整')
          return false;
        }
      })
    }
  }
}
