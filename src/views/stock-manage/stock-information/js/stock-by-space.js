// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import {loaddBtn} from '../../../../api/common/load-btn'
import tipsDialog from '@/components/dialog/tipsDialog';
import '../stock-information.scss'
import {
  queryStockInformation,stockExportToExcelBySpace,getCommodityInfoPageBySpace,getTestReportUrl
} from '@/api/stock-manage/stock-information/stock-information-api.js'
import {
  ownersList,
  brandList
} from '@/api/common/business.js'
import {
  dictionarysType,
  standardDic,
  standardDicPage,
  standardDicChild
} from '@/api/common/type.js'
import {
  spacePrinterList,
  baseSpaceDel,
  baseSpaceUpdate,
  baseSpaceAdd,
  sysCustomerParam
} from '@/api/storage-manage/warehouse-area/space'; // 储位查询

export default {
  name: 'stock-by-space',
  components: {
    tableConfigure,
    tipsDialog
  },
  data() {
    return {
      formInline: {
        ownerId: '', //委托业主
        spaceId: '', //储位编码
        commodityCode: '', //商品编码
        commodityName: '', //商品名称
        standardId: '', //标准
        brandId: '', //品牌
        textureId: '', //材质
        strengthId: '', //强度
        materialId: '', //材料
        toothTypeId: '', //牙型
        specification:'',//规格
        surfaceTreatmentId:'',//表色id
      },
      stockStatusList: [],
      checkStatusList: [],
      brandsList: [],
      textureList: [],
      strengthList: [],
      materialList: [],
      threadRotationParams: [],
      surfaceTreatmentList: [],
      testReportChooseList: [],
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
        tableCode: 'WMS_STOCK_INFORMATION_BY_SPACE'
      },
      getSelectedRow: [], // 用户选择的数据
      ownersArrPage: 1, //
      ownersArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchOwner: '',
      standardArrPage: 1,
      standardArr: {
        data: [],
        start: 1,
        limit: 10
      },
      textureArrPage: 1,
      textureArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchTexture: '',
      brandArrPage: 1,
      brandArr: {
        data: [],
        start: 1,
        limit: 10
      },
      spaceArrPage: 1,
      spaceArr: {
        data: [],
        start: 1,
        limit: 10
      },
      threadRotationList: [],
      searchParam: {},
      btnList: [],
      isReport: {
        modalClickShow: false,
        title: '提示',
        modalShow: false,
        text: '是否重新生成检报？'
      },
      searchStandard: '',
      searchBrand: '',
      materialArrPage: 1,
      materialArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchMaterial: '',
      strengthArrPage: 1,
      strengthArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchStrength: '',
      toothTypeArrPage: 1,
      toothTypeArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchToothType: '',
      surfaceTreatmentArrPage: 1,
      surfaceTreatmentArr: {
        data: [],
        start: 1,
        limit: 10
      },
      searchSurfaceTreatment: '',
    }
  },
  created() {
    this.initOwnerList(false);
    this.initStandardList(false);
    this.initBrandList(false);
    this.initSpaceList(false);
    this.initDictionaryPermit();
    this.initBtn();
    this.initStock(1)
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

    searchList(){
      this.searchParam = {
        distributionNoticeCode: this.formInline.distributionNoticeCode,
        deliveNoticeCode: this.formInline.deliveNoticeCode,
        ownerId: this.formInline.ownerId,
        status: this.formInline.status,
        startCreateTime: this.formInline.startCreateTime,
        endCreateTime: this.formInline.endCreateTime
      }
      this.initTable(1)
    },
    initBtn () {
      let menusKey = 'WMS_STOCK_COMMODITY';
      loaddBtn(menusKey).then(res => {
        // JSON.parse(JSON.stringify('这里放请求到的数据'))
        // 不直接写this.btnList = res.data为了防止数据没有完全赋值
        this.btnList = JSON.parse(JSON.stringify(res.data));
      })
    },
    handleClick(tab, event) {},
    //列表初始化
    initStock(current) {
      let params = {
        start: current,
        limit: this.dataTable.limit
      }
      //合并缓存查询条件
      this.extendJson(params, this.searchParam)
      getCommodityInfoPageBySpace(this.filteParams(params)).then(res => {
        let re = res.data;
        if (re.status == 10001) {
          this.$message.warning(re.message);
          return;
        }
        if (re.records) {
          this.dataTable.data = JSON.parse(JSON.stringify(re.records));
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        } else {
          this.dataTable.data = JSON.parse(JSON.stringify(re));
          this.dataTable.start = re.current;
          this.dataTable.limit = re.size;
          this.dataTable.total = re.total;
        }
      })
    },

    //委托业主下拉框
    searchFastenerOwner(val){
      this.searchOwner = val
      this.ownersArr.data =[]
      this.ownersArr.start = 1
      this.initOwnerList()
    },
    changeOwner(val){
      this.searchOwner = val
    },
    clearOwner(){
      this.searchOwner = ''
    },
    // 委托业主数据下拉框
    initOwnerList(concatOldData) {
      let localArr = this.ownersArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        // name: this.searchOwner,
        // code: 'standard_fastener_texture',
        start: localArr.start,
        limit: localArr.limit
      };
      ownersList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页委托业主数据下拉框
    loadMoreOwnerList() {
      let localArr = this.ownersArr;
      if (localArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initOwnerList(true);
      }
    },



    // 加载委托业主下拉框数据
    // initOwnerList(concatOldData) {
    //   // 原集合拷贝
    //   let oldData = JSON.parse(JSON.stringify(this.ownersArr.data));
    //   // 设置请求参数
    //   let params = {
    //     start: this.ownersArr.start,
    //     limit: this.ownersArr.limit
    //   };
    //   ownersList(params).then(res => {
    //     let data = res.data;
    //     if (data.status == 10001) {
    //       this.$message.warning(data.message);
    //     } else {
    //       this.ownersArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
    //       //concatOldData == true ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
    //       this.ownersArrPage = data.pages; // 总页码
    //     };
    //   })
    // },
    // 触底翻页
    // loadMoreOwnerList() {
    //   if (this.ownersArr.start == this.ownersArrPage) {
    //     this.$message.warning('没有更多数据了');
    //   } else {
    //     this.ownersArr.start = this.ownersArr.start + 1;
    //     this.initOwnersList(true);
    //   }
    // },
    //查询事件
    reSearch() {
      this.searchParam ={
        ownerId: String(this.formInline.ownerId),
        spaceId: String(this.formInline.spaceId),
        commodityCode: String(this.formInline.commodityCode),
        commodityName: String(this.formInline.commodityName),
        standardId: String(this.formInline.standardId),
        brandId: String(this.formInline.brandId),
        textureId: String(this.formInline.textureId),
        strengthId: String(this.formInline.strengthId),
        materialId: String(this.formInline.materialId),
        toothTypeId: String(this.formInline.toothTypeId),
        specification: String(this.formInline.specification),
        surfaceTreatmentId: String(this.formInline.surfaceTreatmentId),

      }
      this.initStock(1);
    },
    // 清空搜索框
    reseltForm(formName) {
      for (let item in this.formInline) {
        this.formInline[item] = '';
      }
      for(let obj in this.searchParam){
        this.searchParam[obj] = null;
      }
    },
    //导出excel
    exportStockBySpace(){
      let params = {
        ownerId: String(this.formInline.ownerId),
        spaceId: String(this.formInline.spaceId),
        commodityCode: String(this.formInline.commodityCode),
        commodityName: String(this.formInline.commodityName),
        standardId: String(this.formInline.standardId),
        brandId: String(this.formInline.brandId),
        textureId: String(this.formInline.textureId),
        strengthId: String(this.formInline.strengthId),
        materialId: String(this.formInline.materialId),
        toothTypeId: String(this.formInline.toothTypeId),
        specification: String(this.formInline.specification),
        surfaceTreatmentId: String(this.formInline.surfaceTreatmentId),
      }
      window.location.href = this.setQueryConfig("/apiz/rest/wms/stock/v1/export-stock-by-space?", params)
    },
    setQueryConfig (url, queryConfig){
      var _str = url;
      for(var o in queryConfig){
        if(queryConfig[o] != -1){
          _str += o + "=" + queryConfig[o] + "&";
        }
      }
      var _str = _str.substring(0, _str.length-1);
      return _str;
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
    searchFastenerStandard(val){
      this.searchStandard = val
      this.standardArr.data =[]
      this.standardArr.start = 1
      this.initStandardList()
    },
    changeStandard(val){
      this.searchStandard = val
    },
    clearStandard(){
      this.searchStandard = ''
    },
    // 标准数据下拉框
    initStandardList(concatOldData) {
      let localArr = this.standardArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchStandard,
        code: 'standard_fastener_standard',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.standardArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页标准数据下拉框
    loadMoreStandardList() {
      let localArr = this.standardArr;
      if (localArr.start == this.standardArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initStandardList(true);
      }
    },
    searchBrandList(val){
      this.searchBrand = val
      this.brandArr.data =[]
      this.brandArr.start = 1
      this.initBrandList()
    },
    changeBrand(val){
      this.searchBrand = val
    },
    clearBrand(){
      this.searchBrand = ''
    },
    // 品牌数据下拉框
    initBrandList(concatOldData) {
      let localArr = this.brandArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchBrand,
        start: localArr.start,
        limit: localArr.limit
      };
      brandList(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.brandArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页品牌数据下拉框
    loadMoreBrandList() {
      let localArr = this.brandArr;
      if (localArr.start == this.brandArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initBrandList(true);
      }
    },
    //储位数据下拉框输入值模糊搜索
    reloadSpaceData(val) {
      if (val != '') {
        this.formInline.spaceCode = val;
      }
      let localArr = this.spaceArr;
      localArr.start = 0;
      this.spaceArr.data = [];
      this.spaceArr.start = 1;
      this.initSpaceList(true);
    },
    // 储位数据下拉框
    initSpaceList(concatOldData) {
      let localArr = this.spaceArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        // spaceCode:this.formInline.spaceCode,
        start: localArr.start,
        limit: localArr.limit
      };
      if (this.formInline.spaceCode != '') {
        params.spaceCode = this.formInline.spaceCode;
      }
      spacePrinterList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.spaceArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页储位数据下拉框
    loadMoreSpaceList() {
      let localArr = this.spaceArr;
      if (localArr.start == this.spaceArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initSpaceList(true);
      }
    },
    // initMaterialDic() {
    //   let params = {
    //     code: 'standard_fastener_material_by_texture',
    //     parentId: this.formInline.textureId
    //   }
    //   standardDicChild(params).then(res => {
    //     this.materialList = JSON.parse(JSON.stringify(res.data))
    //   }).catch(error => {
    //     this.$message.error('加载材料数据失败')
    //   })
    // },

    //材质下拉框
    searchFastenerTexture(val){
      this.searchTexture = val
      this.textureArr.data =[]
      this.textureArr.start = 1
      this.initTextureList()
    },
    changeTexture(val){
      this.searchTexture = val
    },
    clearTexture(){
      this.searchTexture = ''
    },
    // 材质数据下拉框
    initTextureList(concatOldData) {
      let localArr = this.textureArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchTexture,
        code: 'standard_fastener_texture',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.textureArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页材质数据下拉框
    loadMoreTextureList() {
      let localArr = this.textureArr;
      if (localArr.start == this.textureArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initTextureList(true);
      }
    },
    //材料下拉框
    searchFastenerMaterial(val){
      this.searchMaterial = val
      this.materialArr.data =[]
      this.materialArr.start = 1
      this.initMaterialList()
    },
    changeMaterial(val){
      this.searchMaterial = val
    },
    clearMaterial(){
      this.searchMaterial = ''
    },
    // 材料数据下拉框
    initMaterialList(concatOldData) {
      let localArr = this.materialArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchMaterial,
        code: 'standard_fastener_material',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.materialArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页材料数据下拉框
    loadMoreMaterialList() {
      let localArr = this.materialArr;
      if (localArr.start == this.materialArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initMaterialList(true);
      }
    },

    //强度下拉框
    searchFastenerStrength(val){
      this.searchStrength = val
      this.strengthArr.data =[]
      this.strengthArr.start = 1
      this.initStrengthList()
    },
    changeStrength(val){
      this.searchStrength = val
    },
    clearStrength(){
      this.searchStrength = ''
    },
    // 强度数据下拉框
    initStrengthList(concatOldData) {
      let localArr = this.strengthArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchStrength,
        code: 'standard_fastener_strength',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.strengthArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页强度数据下拉框
    loadMoreStrengthList() {
      let localArr = this.strengthArr;
      if (localArr.start == this.strengthArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initStrengthList(true);
      }
    },
    //牙型下拉框
    // searchFastenerToothType(val){
    //   this.searchToothType = val
    //   this.toothTypeArr.data =[]
    //   this.toothTypeArr.start = 1
    //   this.initToothTypeList()
    // },
    // changeToothType(val){
    //   this.searchToothType = val
    // },
    // clearToothType(){
    //   this.searchToothType = ''
    // },
    // initToothTypeList(concatOldData) {
    //   let localArr = this.toothTypeArr;
    //   // 原集合拷贝
    //   let oldData = JSON.parse(JSON.stringify(localArr.data));
    //   // 设置请求参数
    //   let params = {
    //     name: this.searchToothType,
    //     code: 'standard_fastener_tooth_type',
    //     start: localArr.start,
    //     limit: localArr.limit
    //   };
    //   standardDicPage(this.filteParams(params)).then(res => {
    //     let data = res.data;
    //     if (data.status == 10001) {
    //       this.$message.warning(data.message);
    //     } else {
    //       localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
    //       this.toothTypeArrPage = data.pages; // 总页码
    //     };
    //   });
    // },
    // // 触底翻页牙型数据下拉框
    // loadMoreToothTypeList() {
    //   let localArr = this.toothTypeArr;
    //   if (localArr.start == this.toothTypeArrPage) {
    //     this.$message.warning('没有更多数据了');
    //   } else {
    //     localArr.start = localArr.start + 1;
    //     this.initToothTypeList(true);
    //   }
    // },
    //表色下拉框
    searchFastenerSurfaceTreatment(val){
      this.searchSurfaceTreatment = val
      this.surfaceTreatmentArr.data =[]
      this.surfaceTreatmentArr.start = 1
      this.initSurfaceTreatmentList()
    },
    changeSurfaceTreatment(val){
      this.searchSurfaceTreatment = val
    },
    clearSurfaceTreatment(){
      this.searchSurfaceTreatment = ''
    },
    initSurfaceTreatmentList(concatOldData) {
      let localArr = this.surfaceTreatmentArr;
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(localArr.data));
      // 设置请求参数
      let params = {
        name: this.searchSurfaceTreatment,
        code: 'standard_fastener_surface',
        start: localArr.start,
        limit: localArr.limit
      };
      standardDicPage(this.filteParams(params)).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          localArr.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.surfaceTreatmentArrPage = data.pages; // 总页码
        };
      });
    },
    // 触底翻页表色数据下拉框
    loadMoreSurfaceTreatmentList() {
      let localArr = this.surfaceTreatmentArr;
      if (localArr.start == this.surfaceTreatmentArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        localArr.start = localArr.start + 1;
        this.initSurfaceTreatmentList(true);
      }
    },
    initDictionaryPermit() {

      // 获取强度字典值
      // let strengthParams = {
      //   code: 'standard_fastener_strength'
      // }
      // standardDic(strengthParams).then(res => {
      //   this.strengthList = JSON.parse(JSON.stringify(res.data))
      // })

      // 获取材料字典值
      // let materialParams = {
      //   code: 'standard_fastener_material'
      // }
      // standardDic(materialParams).then(res => {
      //   this.materialList = JSON.parse(JSON.stringify(res.data))
      // })

      //获取材质字典值
      // let textureParams = {
      //   code: 'standard_fastener_texture'
      // }
      // standardDic(textureParams).then(res => {
      //   this.textureList = JSON.parse(JSON.stringify(res.data))
      // })

      //获取牙型字典值
      let threadRotationParams = {
        code: 'standard_fastener_tooth_type'
      }
      standardDic(threadRotationParams).then(res => {
        this.threadRotationList = JSON.parse(JSON.stringify(res.data))
      })

      // 获取库存状态字典值
      let stockStatusParams = {
        code: 'WMS_STOCK_STATUS_CKXX'
      }
      dictionarysType(stockStatusParams).then(res => {
        this.stockStatusList = JSON.parse(JSON.stringify(res.data))
      })

      // 获取盘点状态字典值
      let checkStatusParams = {
        code: 'WMS_INVENTORY_STATUS_CKXX'
      }
      dictionarysType(checkStatusParams).then(res => {
        this.checkStatusList = JSON.parse(JSON.stringify(res.data))
      })


      // 获取表色字典值
      // let surfaceTreatmentParams = {
      //   code: 'standard_fastener_surface'
      // }
      // standardDic(surfaceTreatmentParams).then(res => {
      //   this.surfaceTreatmentList = JSON.parse(JSON.stringify(res.data))
      // })

      // 获取检报筛选字典值
      let testReportChooseParams = {
        code: 'WMS_HAS_TEST_REPORT_NO_STOCK'
      }
      dictionarysType(testReportChooseParams).then(res => {
        this.testReportChooseList = JSON.parse(JSON.stringify(res.data))
      })
    },
    tableHeight() {
      let formHeight = $('.inventory-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 20
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
        if (item.prop == 'testReportNo') {
          item.hasCenterCol = true
          item.show = 'template'
        }
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
      this.initStock(1);
    },
    // 表格单页显示数量变更触发事件
    handleSizeChange(val) {
      this.dataTable.start = 1; // 重置起始页码为1
      this.dataTable.limit = val;
      this.initStock(this.dataTable.start);
    },
    // 页码选择触发事件，val为当前选择的页码数
    handleCurrentChange(val) {
      this.dataTable.start = val;
      this.initStock(this.dataTable.start);
    },
    //生成检报按钮
    createReport() {
      if (this.getSelectedRow.length == 0) {
        this.$message.warning('请选择需要生成检报的库存明细信息')
        return false
      } else if (this.getSelectedRow.length == 1) {
        if(this.getSelectedRow[0].testReportNo){
          // this.isReport.modalShow = true
          this.$message.warning('已存在检报编号')
        }else{
          this.isHasReportCode()
        }
      } else if (this.getSelectedRow.length > 1) {
        this.$message.warning('生成检报的验收单明细不能大于一条')
      }
    },
    isHasReportCode() {
      let url = '';
      let paramsOne = {
        tenantId: this.getSelectedRow[0].factoryId,
        brandProductId: this.getSelectedRow[0].brandProductID,
        appTypeId: 101,
        businessKey: 1+'|' + this.getSelectedRow[0].infoId + '|' + this.getSelectedRow[0].warehouseId  + '|' + this.getSelectedRow[0].commodityAttributeId
      }
      getTestReportUrl(paramsOne).then(res => {
        if (res.status == 10001) {
          this.$message.warning(res.message)
        } else {
          url = res.data
          //跳转到erp生成检报页面
          let params = '?TenantId=' + this.getSelectedRow[0].factoryId + '&BrandProductId=' + this.getSelectedRow[0].brandProductID + '&AppTypeId=101&BusinessKey=1|' + this.getSelectedRow[0].infoId + '|' + this.getSelectedRow[0].warehouseId + '|' + this.getSelectedRow[0].commodityAttributeId; //打包环境传参
          //https://internal-dev.51hgp.com/erp_development/TestReport/TestReport/Create?TenantId=95&BrandProductId=2815687&AppTypeId=101&BusinessKey=4220&warehouseId=87
          //testreport_testreport_goodsindex   生成检测报告   /erp_development/testreport/testreport/goodsindex
          // let reportUrl = staticConfiguration.uploadUrl + '/TestReport/TestReport/Create' + params
          let reportUrl = staticConfiguration.uploadUrl + url
          let tabId = this.replaceUrl(reportUrl)
          try {
            this.routeERP(tabId, '生成检测报告', staticConfiguration.uri + url) //其他环境跳转公用方法
          } catch (e) {
            window.location.href = reportUrl
          }
        }
      }).catch(error => {
        this.$message.error('获取检报url失败')
      })
    },
    routeERPReport(){
      this.isReport.modalShow = false
      this.isHasReportCode()
    },
    downloadPDF(url){
      window.open(url)
    }
  }
}
