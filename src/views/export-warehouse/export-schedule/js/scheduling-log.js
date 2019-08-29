import tableConfigure from '@/components/table/tableConfigure.vue';
import DatePick from '@/components/DatePicker/index';
import {getAcceptanceNoteList} from '@/api/warehousing-management/accepttance-note/accepttance-note';
import { userFromErp } from '@/api/common/common-info';
import { dictionarysTypeNew } from '@/api/common/type.js'
import { getScheduleHistory } from '@/api/warehousing-management/shelf-scheduling/shelf-log.js';

export default {
  name: 'scheduling-log',
  components: {
    tableConfigure,
    DatePick
  },
  data(){
    return{
      formInline:{
        noteCode:'',//调度单号
        status:'',//调度状态
        scheduleTypeId: '2',//调度类型
        userId: '',//调度人
        startTime: '',//调度开始时间
        endTime: ''//调度结束时间
      },
      getSelectedRow: [], // 用户选择的数据
      heightResize: true, //表格
      //调度主表
      dataTable: {
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
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
          tableCode: "SCHEDULE_HISTORY"
        },
      },
      searchParam: {
        scheduleTypeId: '2'//调度类型
      },
      staffs: [],
      scheduleStatus: [],
      timer: '',
      isShowLoading: true
    }
  },

  created(){
    this.getStaffs()
    //获取调度状态字典值
    dictionarysTypeNew('WMS_SCHEDULE_HISTORY_STATUS', this, 'scheduleStatus')
  },
  mounted() {
    this.tableHeight(); // 表格高度
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
  },
  methods:{
    tableHeight() {
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height()  - this.$store.state.basic.height - 95
    },
    //调用一个对象的一个方法
    callFn(item) {
      const reg1 = /^\w+/g;
      const reg2 = /\(([^)]+)\)/;
      if(reg2.test(item.methodName)){
        let methodName = item.methodName.match(reg1);
        let args = item.methodName.match(reg2);
        this[methodName[0]].apply(this,args[1].split(','));
      }else{
        this[item.methodName].apply(this);
      }
    },
    //主表格数据
    tableDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
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
      this.initTable(1); //首页列表
    },
    handleSizeChange (val) { // size选择
      this.dataTable.start = 1;
      this.dataTable.limit = val;
      // this.dataTable.loading = true;
      this.initTable(this.dataTable.start);
    },
    handleCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val;
      this.initTable(this.dataTable.start);
    },
    getStaffs() {
      let params = {
        isOnWork: true
      }
      userFromErp(this.filteParams(params)).then(res => {
        let data = res.data
        if (data.length > 0) {
          this.staffs = data
        }
      })
    },
    // 表单重置
    resetForm (formName) {
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = '';
      }
      this.searchParam.scheduleTypeId = 2
    },
    searchList(){
      this.isShowLoading = true
      this.searchParam = {
        noteCode: this.formInline.noteCode,//调度单号
        status: this.formInline.status,//调度状态
        scheduleTypeId: '2',//调度类型
        userId:  this.formInline.userId,//调度人
        startTime:  this.formInline.startTime,//调度开始时间
        endTime:  this.formInline.endTime//调度结束时间
      }
      this.initTable(1)
    },
    initTable(current){
      if(this.timer){
        window.clearTimeout(this.timer)
      }
      let layerIndex = ''
      if(this.isShowLoading){
        layerIndex = layer.load(1, {
          shade: [0.5,'#fff']
        });
      }
      let params = {
        start: current,
        limit: this.dataTable.limit,
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getScheduleHistory(this.filteParams(params)).then(res => {
        if(this.isShowLoading){
          layer.close(layerIndex)
          this.isShowLoading = false
        }
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let data = res.data
        let _self = this
        let flag = false
        flag = this.getFlag(data)
        if(flag){
          _self.timer = setTimeout(function () {
            _self.initTable(1)
          },3000)
        }
        this.dataTable.data = JSON.parse(JSON.stringify(data.records))
        this.dataTable.start = data.current;
        this.dataTable.limit = data.size;
        this.dataTable.total = data.total;
      }).catch(error=>{
        if(this.isShowLoading){
          this.$message.error('服务错误')
          layer.close(layerIndex)
          this.isShowLoading = false
        }
      })
    },
    getFlag(data){
      for (var i = 0; i < data.records.length; i++) {
        if(data.records[i].status == 1){
          return true
        }
      }
    },
    getEndTime (val) { // 结束日期
      if(val){
        this.formInline.endTime = val + ' 23:59:59';
      }else{
        this.formInline.endTime = val
      }
    },
    getStartTime (val) { // 开始日期
      if(val){
        this.formInline.startTime = val + ' 00:00:00';
      }else{
        this.formInline.startTime = val
      }
    },
    clearTimer(){
      window.clearTimeout(this.timer)
    }
  }
}
