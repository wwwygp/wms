// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue';
import {
  winnerPage,giveWinningRecord
  } from '@/api/activity/act-management/index';
  
export default {
  name: 'winner-list',
  components: {
    tableConfigure,
  },
  props: {
    // activityId: {
    //   type: Number,
    // },
    activityId:{
      type:String,
      required: true
    }
  },
  data() {
    return {
      formInline:{
        searchNum:''
      },
      mainteTitle: '',
      heightResize: true,
      getSelectedRow: [], // 用户选择的数据
      winnersDataTable: {//tql
        tr: [], // 表头数据
        data: [], // 表格内容数据
        hasSelect: true, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        start: 1,
        limit: 10,
        total: 0,
        pageSizes: [10, 20, 30, 50,100],
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        hasOperation: false,
      },
      winnersTableName: {
        tableCode: "LOTTERY_WINNING_RECORD_PAGE"
      }, // 获奖名单table tql
      searchNums:[],
    }
  },
  created() {
    this.initWinnersTable(1) 
  },
  mounted() {
    this.tableWinnerHeight()
  },
  watch: {
  
  }, 
  methods: {
    handleWinnersCurrentChange (val) { // 分页页码
      this.winnersDataTable.start = val
      this.initWinnersTable(this.winnersDataTable.start)
    },
    handleSizeWinnersChange (val) { // 分页每页展示的数量
      this.winnersDataTable.start = 1
      this.winnersDataTable.limit = val
      this.initWinnersTable(this.winnersDataTable.start)
    },
    onRowClick () { // 表格行点击
    },
    onHandleSelectionWinnersChange(val) { // 用户的选择框事件
      this.getSelectedRow = val;
    },
    //tql
    tableDataWinnersHandle(data) { // table数据处理函数
      let handleTableData = JSON.parse(JSON.stringify(data));
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; //表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (item.prop == 'operationCol') {
          item.hasCenterCol = true;
          item.show = 'template'
        }
        
        item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left' : 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      this.winnersDataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      this.winnersDataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      };
      this.winnersDataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      };
      // this.domShow = false; // 为了让组件重新渲染更新
      this.$refs.tableConfig.domShow = false;
      this.$nextTick(() => {
        // this.domShow = true;
        this.$refs.tableConfig.domShow = true;
        this.$refs.tableConfig.dialogVisible = false;
        // this.dialogVisible = false; // 表格配置弹出框隐藏
      });
    },
    //表格高度
    tableWinnerHeight() {
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      // 放两个表格。所以高度除以2
      this.winnersDataTable.height = $(window).height() - 300 - this.$store.state.basic.height
    },
    initWinnersTable(current) {
      let params = {
        activityId:String(this.activityId),
        phoneNumber:this.formInline.searchNum,
        start: current,
        limit: this.winnersDataTable.limit,
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      winnerPage(this.filteParams(params)).then(res => {
        let re = res.data
        this.winnersDataTable.data = JSON.parse(JSON.stringify(re.records))
        this.winnersDataTable.start = re.current
        this.winnersDataTable.limit = re.size
        this.winnersDataTable.total = re.total
        re.records.forEach(item=>{
          let itemIndex={
            phoneNumber:item.phoneNumber,
            prizeId:item.prizeId,
          }
          this.searchNums.push(itemIndex)
                    
        })
      })
    },
    searchNumChange(){
      this.initWinnersTable(1);
    },
    //标记领取
    updateSumbit(val){
    
      let params = []
      var paramsRow={}
      if(val){
        if(val.hasGive== 1){
          return this.$message.warning("奖品已领取，请勿重复领取")
        }
        paramsRow = {
          "prizeId": val.prizeId,//
          "prizeCount": val.prizeCount,//
          'activityId':String(this.activityId),
        }
        params.push(paramsRow)
      }else{
        if(this.getSelectedRow.length== 0){
          return this.$message.warning("请选择需要设置的数据")
        }
          for (var i = this.getSelectedRow.length - 1; i >= 0; i--) {
            if(this.getSelectedRow[i].hasGive== 1){
              return this.$message.warning("奖品已领取，请勿重复领取")
            }
          let item = {
            "prizeId": this.getSelectedRow[i].prizeId,//
            "prizeCount": this.getSelectedRow[i].prizeCount,//
            'activityId':String(this.activityId),
          }
          params.push(item)
        }
      }
     
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
      giveWinningRecord(this.filteParams(params)).then(res => {
        let re = res.data
        this.initWinnersTable(1)
      })
    },
    closeDialog(){
      // this.resetForm('form');
      this.dialogVisible = false;
    },
     //导出excel
     exportWinnerList(){
      let params = {
        activityId:String(this.activityId),
        phoneNumber:this.formInline.searchNum,
      }
      window.location.href = this.setQueryConfig("/apiz/rest/common/lottery/winning-record/v1/data-to-excel?", params)
    },
    setQueryConfig (url, queryConfig){
      var _str = url; 
     for(var o in queryConfig){ 
     if(queryConfig[o] != -1){ 
        _str += o + "=" + queryConfig[o] + "&"; 
       } 
     } 
     var _str = _str.substring(0, _str.length-1); 
     console.log(_str)
     return _str;
    },
  }
}
