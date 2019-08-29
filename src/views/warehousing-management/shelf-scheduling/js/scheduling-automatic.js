import tableConfigure from '@/components/table/tableConfigure.vue';
import {getAcceptanceNoteList} from '@/api/warehousing-management/accepttance-note/accepttance-note';
import { ownersList } from '@/api/common/business.js';
import { loaddBtn } from '@/api/common/load-btn.js';
import { limportAccptanceNoteList, importScheduleList, importSchedule } from '@/api/warehousing-management/shelf-scheduling/shelf-scheduling.js';

export default {
  name: 'scheduling',
  components: {tableConfigure},
  data(){
    return{
      formInline:{
        ownerId:'',//委托业主
        acceptanceNoteCode:'',//来源单号
      },
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      getSelectedRow: [], // 用户选择的数据
      btnList: [],//按钮
      heightResize: true, //表格
      //调度主表
      dataTable: {
        tr: [], // 表头数据
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
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_RECEIVE_NOTE_TABLE"
        },
      },
      dataTableDetail:{
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        start: 1,
        limit:100,
        total: 0,
        border: true,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        // 表格ID ，就是表格自定义名称
        tableName: {
          tableCode: "WMS_SCHEDULE_TABLE"
        },
      },
      searchParam: {}
    }
  },

  created(){
    this.initBtn();
    this.getOwnerList(false);
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
      this.dataTable.height = $(window).height()  - this.$store.state.basic.height - 85
      this.dataTableDetail.height = this.dataTable.height;
    },

    initTable () { // 初始化表格
      // getAcceptanceNoteList(this.filteParams(this.formInline)).then(res => {
      //     this.dataTable.data = JSON.parse(JSON.stringify(data.records));
      // })
    },

    // 按钮加载函数
    initBtn () {
      let menusKey = 'WMS_IMPORTSCHEDULE_TABLE';
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
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

    //副表格数据
    dataTableDetailDataHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'nameAndAsst') {
          item.hasCenterCol = true;
          item.show = 'template'
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
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.dataTableConfig.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.dataTableConfig.domShow = true;
        // this.dataTable.loading = false; // loading事件取消
        this.$refs.dataTableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
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

    handleDetailSizeChange (val) { // size选择
      this.dataTableDetail.start = 1;
      this.dataTableDetail.limit = val;
      // this.dataTable.loading = true;
      this.getImportSchedule(this.dataTableDetail.start);
    },
    handleDetailCurrentChange (val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTableDetail.start = val;
      this.getImportSchedule(this.dataTableDetail.start);
    },

    onRowClick (row) {
    },

    //选中主表保存数据
    onHandleSelectionChange(val){
      this.getSelectedRow = val;
      this.dataTableDetail.data = [];
      this.dataTableDetail.start = 1;
      this.dataTableDetail.limit = 100;
      this.dataTableDetail.total = 0;
      this.getImportSchedule(1);
    },

    //委托业主下拉框
    loadMoreOwnerList() {
      if (this.ownersPageDate.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersPageDate.start = this.ownersPageDate.start + 1;
        this.getOwnerList(true);
      }
    },
    //委托业主下拉框
    getOwnerList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.ownersPageDate.data));
      let params = {
        start: this.ownersPageDate.start,
        limit: this.ownersPageDate.limit
      }
      ownersList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.ownersPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
      })
    },
    // 表单重置
    reseltForm (formName) {
      for(let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let item in this.searchParam) {
        this.searchParam[item] = '';
      }
    },
    searchList(){
      this.searchParam = {
        acceptanceNoteCode: this.formInline.acceptanceNoteCode,
        ownerId: this.formInline.ownerId
      }
      this.initTable(1)
    },
    //左表格查询
    initTable(current){
      let params = {
        start: current,
        limit: this.dataTable.limit,
        status: 8
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      limportAccptanceNoteList(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTable.data = JSON.parse(JSON.stringify(re.records));
        this.$nextTick(function () {
          this.dataTable.data.forEach((item, index)=>{
            this.$refs.tableConfig.toggleRowSelection(this.dataTable.data[0],true)
          })
        })
        this.dataTable.start = re.current;
        this.dataTable.limit = re.size;
        this.dataTable.total = re.total;
        //清空右表数据
        this.dataTableDetail.data = [];
        this.dataTableDetail.start = 1;
        this.dataTableDetail.limit = 100;
        this.dataTableDetail.total = 0;
        if(this.dataTable.data.length > 0){
          this.getImportSchedule(1);
        }
      })
    },

    //右表格查询
    getImportSchedule(current){
      let acceptanceIdArray = [];
      let acceptanceIds = '';
      if(this.getSelectedRow.length == 0){
        return;
      }else{
        for(let i=0;i<this.getSelectedRow.length;i++){
          acceptanceIdArray.push(this.getSelectedRow[i].acceptanceNoteId);
        }
        acceptanceIds = acceptanceIdArray.join(",");
      }
      let params = {
        acceptanceNoteIds: acceptanceIds,
        start: current,
        limit: this.dataTableDetail.limit
      }
      importScheduleList(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        let re = res.data;
        this.dataTableDetail.data = JSON.parse(JSON.stringify(re.records));
        this.dataTableDetail.start = re.current;
        this.dataTableDetail.limit = re.size;
        this.dataTableDetail.total = re.total;
      })
    },

    importScheduleCon(){
      let acceptanceIdArray = [];
      let acceptanceIds = '';
      if(this.getSelectedRow.length == 0){
        return this.$message.warning('请选择要调度的数据');
      }else{
        for(let i=0;i<this.getSelectedRow.length;i++){
          acceptanceIdArray.push(this.getSelectedRow[i].acceptanceNoteId);
        }
        acceptanceIds = acceptanceIdArray.join(",");
      }
      let params = {
        acceptanceNoteIds: acceptanceIds,
      }
      importSchedule(this.filteParams(params)).then(res => {
        if (res.data.status == 10001) {
          return this.$message.warning(res.data.message);
        }
        this.$message.warning('调度中')
        let _self = this
        setTimeout(function(){
          _self.$message.close()
          _self.$emit('changeTab', 'third')
        }, 2000)
        // if (res.data.status == 10001) {
        //   return this.$message.warning(res.data.message);
        // }else{
        //   this.reseltForm('formInline');
        //   this.initTable(1);
        //   return this.$message.success('调度成功')
        // }
      }).catch(error => {
        this.$emit('changeTab', 'third')
        //this.$message.error('调度失败！')
      })
    }
  }
}
