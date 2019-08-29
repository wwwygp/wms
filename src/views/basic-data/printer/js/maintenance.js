// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import { printerList, printerUpdate,printerDel, printerAdd, printerGroup } from '@/api/basic-data/printer/index.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { dictionarysType } from '@/api/common/type.js';
import selectScroll from '@/components/selectScroll/selectLoadMore.vue';
import tipsDialog from '@/components/dialog/tipsDialog';
import '../style/index.scss';
export default {
  name: 'maintenance',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog // 弹窗
  },
  data() {
    return{
      list: [],
      options: [],
      states: [],
      paramsOption:{
        multiple: true,//是否多选
        disabled: false,//是否禁用
        filterable: true,//是否可搜索
        remote: true,//是否为远程搜索
        clearable:true,//单选时是否可以清空选项
        multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制
      },
      heightResize: true,
      printerTitle: '新增',
      delVisible: false,
      dialogVisible: false,
      formInline: {
        printerName: '',
        printerCode: '',
      },
      delDialog: {
        modalClickShow: false,
        title: '删除',
        modalShow: false,
        text: '是否确定删除勾选的打印机?'
      },
      printerNames: [],

      dataTable: {
        tr: [
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
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
        }
      },
      tableName: {
        tableCode: "WMS_BASICDATA_PRINTER_TABLE"
      }, // 表格ID ，就是表格自定义名称
      // tableName: [],
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form:{
        remark: '',
        printerCode: '',
        printerName: '',
        printerTypeId: '',
        driverName: '',
        printerPort: '',
        status: '0',
        printerGroupId: '' // 打印机组名称
      },
      rulesForm: {
        printerCode: [{required: true,message: '编码不能为空',trigger: 'blur'}],
        printerName: [{required: true, message: '名称不能为空',trigger: 'blur'}],
        printerTypeId: [{required: true, message: '请选择类型',trigger: 'change'}],
        status: [{required: true, message: '请选择状态',trigger: 'change'}],
        printerGroupId: [{required: true,message: '请选择打印机组', trigger: 'change'}]
      },
      printerStatus: [],
      printerType: [],
      printerIds: '',
      count: 0,
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        age: ''
      },
      groupData : { // 打印机组数据
        start : 1,
        limit: 10
      },
      groupPage: 1, // 打印机组总页码
      accumulationData: true, // 是否需要加载更多
      updateDisabled: false,
      searchParam: {}
    }
  },
  created () {
    this.initBtn();
    this.initDictionaryStatus();
    this.initDictionarysType();
    this.getPrinterGroup();
  },
  mounted () {
    this.tableHeight();
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
    this.options = this.list;
    console.log(this.options)
    // layui.use('laydate', function(){
    //   var laydate = layui.laydate;
    //   //执行一个laydate实例
    //   laydate.render({
    //     elem: '#test1' //指定元素
    //   });
    // });
  },
  methods: {
    getPrinterGroup (accumulation) { // 获取打印机组信息
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.options));
      let params = JSON.parse(JSON.stringify(this.groupData))
      printerGroup(params).then(res => {
        this.groupPage = res.data.pages;
        res.data.records.map(item => {
          item.value = item.printerGroupId,
            item.label = item.printerGroupName
        });
        // accumulation // 需要累加
        accumulation ? this.options = oldData.concat(res.data.records): this.options = JSON.parse(JSON.stringify(res.data.records));
      })
    },
    loadMore() {
      if (this.accumulationData) {
        if (this.groupData.start == this.groupPage) { // 页码相同就不用累加了
          // this.options.push({value: '00',label: '没有更多数据了'});
          this.$message.warning('没有更多数据了')
          this.accumulationData = false; // 是否需要触发
        } else {
          this.groupData.start = this.groupData.start + 1;
          let accumulation = true;
          this.getPrinterGroup(accumulation);
        }
      }
    },
    selectChange(curVal,oldVal) {
      console.log(curVal,oldVal)
      this.form.printerGroupId = curVal;
    },
    remoteMethod(query) {
      if (query !== '') {
        setTimeout(() => {
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = this.list;
      }

    },
    tableHeight() {
      let formHeight = $("#top-form").height();
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height()-formHeight -this.$store.state.basic.height;
    },
    resetForm (formName) { // 清空表单
      this.$refs[formName].resetFields();
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      //   // this.dialogVisible = false;
      // })
      for(let item in this.form){
        if (item == 'status') {

        } else {
          this.form[item] = '';
        }

      }
      // this.form.remark = '';
      this.dialogVisible = false;

    },
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g;
      const reg2 = /\(([^)]+)\)/;
      if(reg2.test(item.methodName)){
        let methodName = item.methodName.match(reg1);
        console.log(methodName);
        let args = item.methodName.match(reg2);
        console.log(args[1]);
        this[methodName[0]].apply(this,args[1].split(','));
      }else{
        this[item.methodName].apply(this);
      }
    },
    initBtn () { // 按钮加载函数
      let menusKey = 'WMS_PRINTER';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    initPrinter (current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      };
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      printerList(this.filteParams(params)).then(res => {
        // this.dataTable.loading = false;
        let re = res.data;
        this.printerNames = [];
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        this.dataTable.start = re.current;
        this.dataTable.limit = re.size;
        this.dataTable.total = re.total;
        this.dataTable.data.forEach(item => {
          this.printerNames.push({
            name: item.printerName,
            value:item.printerCode
          })
        })
      })
    },
    onRowClick (row) {

    },
    onHandleSelectionChange(val){
      this.getSelectedRow = val;
    },
    searchList () {
      this.searchParam = {
        printerName: this.formInline.printerName,
        printerCode: this.formInline.printerCode
      }
      this.initPrinter(1);
    },
    resetList () {
      this.formInline.printerName = '';
      this.formInline.printerCode = '';
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
      this.dataTable.start = 1;
    },
    addList () {
      this.printerTitle = '新增';
      this.dialogVisible = true;
      this.updateDisabled= false;
      // printerAdd(this.form).then(res => {
      //   this.resetList();
      // })
    },
    updateList () {
      this.printerTitle = '修改';
      let len = this.getSelectedRow.length;
      if ( len != 1) {
        this.$message.warning('请选择一行要修改的数据')
      } else {
        // if (this.getSelectedRow[0].status == 0) {
        //   this.$message.warning('只有禁用状态的数据允许修改');
        //   return false;
        // }
        this.dialogVisible = true;
        this.updateDisabled= true; // 是否可编辑
        let newForm = Object.assign({},this.form,this.getSelectedRow[0]);
        newForm.printerTypeId = String(newForm.printerTypeId);
        newForm.status = String(newForm.status)
        this.form = JSON.parse(JSON.stringify(newForm));
        console.log(this.form)
      }
    },
    updateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let axiosApi;
          this.printerTitle == '修改' ? axiosApi = printerUpdate(this.form): axiosApi = printerAdd(this.form);
          axiosApi.then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message);
            } else {
              this.printerTitle == '修改' ? this.$message.success('修改成功'): this.$message.success('新增成功');
              this.resetForm('form');
              this.searchList();
            }

          })
        } else {
          return false;
        }
      })

      // } else {
      //   .then(res => {
      //
      //     this.resetList();
      //   })
      // }

    },
    delList () {
      // status
      if (this.getSelectedRow.length != 0) {
        let notDel = this.getSelectedRow.every((item,index) => {
          return item.status != 0 // 0为启用
        });
        if (!notDel) {
          this.$message.warning('启用状态下的打印机不能删除');
          return false;
        }
        this.delDialog.modalShow = true;
      } else {
        this.$message.warning('请勾选要删除的数据')
      }

      // this.$refs.tipsDialog.
      // this.
    },
    removeRow () {
      let printerIdArr = [];
      this.getSelectedRow.forEach((item,index) => {
        printerIdArr.push(item.printerId);
      });
      this.printerIds = printerIdArr.join(',');
      printerDel(this.printerIds).then(res => {
        this.$message.success('删除成功')
        this.delDialog.modalShow = false;
        this.searchList();
      })
    },
    changePrinter (val) {

    },
    initDictionarysType () {
      let params = {
        code: 'WMS_PRINTER_TYPE_ID_DYJ'
      };
      dictionarysType(params).then(res => {
        this.printerType = JSON.parse(JSON.stringify(res.data));
      })
    },
    initDictionaryStatus () {
      let params = {
        code: 'WMS_STATUS_DYJ'
      };
      dictionarysType(params).then(res => {
        this.printerStatus = JSON.parse(JSON.stringify(res.data));
      })
    },
    tableDataHandle (data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item,index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left': 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign:'center',
        width: '100%'
      };
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign:'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
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
      this.initPrinter(1)
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initPrinter(this.dataTable.start);
    },
    handleCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initPrinter(this.dataTable.start);
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
  }
}
