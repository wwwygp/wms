// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import {
	loaddBtn
} from '@/api/common/load-btn.js'
import {
	dictionarysType
} from '@/api/common/type.js' //字典返回值，编码规则
import {
	queryStockMovement
} from '@/api/stock-manage/stock-changerecord/stock-changerecord-api.js'
import {
	extendJson
} from '@/views/stock-manage/stock-changerecord/js/stock-util-extend.js'
import {
	ownersList,
	brandList
} from '@/api/common/business.js'
import tipsDialog from '@/components/dialog/tipsDialog'
import selfDialog from '@/components/selfDialog/selfDialog'
import DatePick from '@/components/DatePicker/index';

export default {
	name: 'stock-changerecord',
	components: {
		tableConfigure,
		tipsDialog,
		selfDialog,
		DatePick
	},
	data() {
		return {
			heightResize: true,
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
				tableCode: 'WMS_STOCK_CHANGERECORD'
			},
			getSelectedRow: [], // 用户选择的数据
			selectCommodityQuality: [],
			selectCommodityType: [],
			btnList: [],
			sortString: 'editorDate',
			searchForm: {
				ownerId: null,
				invoiceCode: null,
				commodityName: null,
				srcSpaceCode: null,
				srcLabelCode: null,
				dstSpaceCode: null,
        commodityCode: null,
        createTimeStart: null,
        createTimeEnd: null,
				dstLabelCode: null
			},
			searchParamCache: {}, // 搜索条件缓存
			resetGrid: false, // 重置按钮是否重置数据表格
			hasChange: false,
			ownersArrPage: 1, //
			ownersArr: {
				data: [],
				start: 1,
				limit: 10
			}
		}
	},
	created() {
		this.queryStockChangeRecord();
		this.initOwnerList(false);
	},
	mounted() {
		this.tableHeight();
		window.onresize = () => {
			return (() => {
				this.tableHeight();
			})();
		}
	},
	methods: {
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
		tableHeight() {
			let formHeight = $('#top-form').height()
			// 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
			this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - '60'
		},
		// 查询按钮触发事件
		queryStorkChangeRecordBySearch() {
			// 初始化页码
			this.dataTable.start = 1;
			// 初始化查询条件
			this.searchParamCache = {
				ownerId: this.searchForm.ownerId,
				invoiceCode: this.searchForm.invoiceCode,
				commodityName: this.searchForm.commodityName,
				srcSpaceCode: this.searchForm.srcSpaceCode,
				srcLabelCode: this.searchForm.srcLabelCode,
				dstSpaceCode: this.searchForm.dstSpaceCode,
        commodityCode: this.searchForm.commodityCode,
        createTimeStart : this.searchForm.createTimeStart,
        createTimeEnd : this.searchForm.createTimeEnd,
				dstLabelCode: this.searchForm.dstLabelCode
			}
			this.queryStockChangeRecord();
		},
		// 查询主列表数据
		queryStockChangeRecord() {
			// 序列化查询条件
			let params = {
				start: this.dataTable.start,
				limit: this.dataTable.limit,
				sort: this.sortString,
				isAsc: false
			}
			//合并缓存查询条件
			extendJson(params, this.searchParamCache);
			//执行查询
			queryStockMovement(this.filteParams(params)).then(res => {
				let data = res.data
				if(data.status == 10001){
					this.dataTable.data = []
				}else{
					this.dataTable.data = JSON.parse(JSON.stringify(data.records))
					this.dataTable.start = data.current
					this.dataTable.limit = data.size
					this.dataTable.total = data.total
				}
			}).catch(error => {
				this.$message.error('库存异动信息加载失败')
			})
		},
		loadMoreOwnerList() {
			if (this.ownersArr.start == this.ownersArrPage) {
				this.$message.warning('没有更多数据了');
			} else {
				this.ownersArr.start = this.ownersArr.start + 1;
				this.initOwnersList(true);
			}
		},
		// 加载委托业主下拉框数据
		initOwnerList(concatOldData) {
			// 原集合拷贝
			let oldData = JSON.parse(JSON.stringify(this.ownersArr.data));

			// 设置请求参数
			let params = {
				start: this.ownersArr.start,
				limit: this.ownersArr.limit
			};
			ownersList(params).then(res => {
				let data = res.data;
				if (data.status == 10001) {
					this.$message.warning(data.message);
				} else {
					this.ownersArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
					//concatOldData == true ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
					this.ownersArrPage = data.pages; // 总页码
				};
			})
		},
		onRowClick(row) {

		},
		onHandleSelectionChange(val) {
			this.getSelectedRow = val
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
			// this.tablelist();
			// 数据copy表头数据不用管

			this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
			// this.dataTable.hasSelect = false; // 是否多选
			// this.dataTable.hasExpand = false; // 是否展开
			// ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
			// this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
			this.dataTable.tableStyle = { // 表格的样式
				textAlign: 'center',
				width: '100%'
			}
			this.dataTable.headerCellStyle = { // 表头文字的样式
				textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
			}
			// this.domShow = false; // 为了让组件重新渲染更新
			this.$refs.tableConfig.domShow = false
			this.$nextTick(() => {
				// this.domShow = true;
				this.$refs.tableConfig.domShow = true
				// this.dataTable.loading = false; // loading事件取消
				this.$refs.tableConfig.dialogVisible = false
				// this.dialogVisible = false; // 表格配置弹出框隐藏
			})
		},
		// 表格单页显示数量变更触发事件
		handleSizeChange(val) {
			this.dataTable.start = 1; // 重置起始页码为1
			this.dataTable.limit = val;
			this.queryStockChangeRecord();
		},
		// 页码选择触发事件，val为当前选择的页码数
		handleCurrentChange(val) {
			this.dataTable.start = val;
			this.queryStockChangeRecord();
		},
    getEndTime (val) { // 生产日期开始
      if(val){
        this.searchForm.createTimeEnd = val + " 23:59:59";
      }else{
        this.searchForm.createTimeEnd = '';
      }
    },
    getStartTime (val) { // 生产日期结束
      if(val){
        this.searchForm.createTimeStart = val + " 00:00:00";
      }else{
        this.searchForm.createTimeStart = '';
      }
    },
		// 重置搜索框
		resetStockChangeRecord() {
			// 清空搜索框
			for (let obj in this.searchForm) {
				this.searchForm[obj] = null;
			}
			// 重置数据表
			if(this.resetGrid == true){
				for (let key in this.searchParamCache) {
					this.searchParamCache[key] = null;
				}
				this.queryStorkChangeRecordBySearch();
			}
      this.$refs.createTime.resetTime()
		}
	}
}
