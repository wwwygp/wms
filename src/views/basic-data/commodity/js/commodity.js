import tableConfigure from '@/components/table/tableConfigure.vue'
import { commodityList, updatecommodity } from '@/api/basic-data/commodity/index.js'
import { ownersList, brandList } from '@/api/common/business.js'
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType, standardDic, standardDicPage, standardDicChild } from '@/api/common/type.js'
import selectScroll from '@/components/selectScroll/selectLoadMore.vue'
import tipsDialog from '@/components/dialog/tipsDialog'
import '../style/commodity.scss'

export default {
  name: 'commodity-mainte',
  components: {
    tableConfigure,
    selectScroll,
    tipsDialog // 弹窗
  },
  data() {
    return {
      list: [],
      options: [],
      states: [],
      paramsOption: {
        multiple: true,//是否多选
        disabled: false,//是否禁用
        filterable: true,//是否可搜索
        remote: true,//是否为远程搜索
        clearable: true,//单选时是否可以清空选项
        multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制
      },
      heightResize: true,
      commodityTitle: '',
      dialogVisible: false,
      conveyorPermitList: [],
      editBtn: [],//修改按钮
      selectBtn: [],//查询重置按钮
      ownersArrPage: 1,
      ownersPageDate: { // 委托业主页码数据
        data:[],
        start: 1,
        limit: 10,
      },
      brandsArrPage: 1,
      brandPageDate: { // 品牌页码数据
        data: [],
        start: 1,
        limit: 10,
      },
      standardArrPage: 1,
      standardPageDate: { // 标准页码数据
        data: [],
        start: 1,
        limit: 10,
      },
      nominalSizeArrPage: 1,
      nominalSizePageDate: { // 直径页码数据
        data: [],
        start: 1,
        limit: 10,
      },
      commodityTypeList: [],//商品类型下拉框集合
      colorList: [],//表色下拉框集合
      statusList: [],//状态下拉框集合
      strengthList: [],//强度下拉框集合
      materialList: [],//材料下拉框集合
      threadRotationList: [],//牙型下拉框集合
      textureList: [],//材质下拉框集合
      abcTypeNameList: [],//ABC分类下拉框集合
      measureList: [],//计量方式下拉框集合
      exportPermitList: [],//出货标记下拉框集合
      regularCommidityList: [],//是否规则商品下拉框集合
      needCheckList: [],//质检标识下拉框集合
      needWeightList: [],//称重标识下拉框集合
      factoryTableSignList: [],//出厂表色标识下拉框集合
      storageConditionList: [],//存储条件下拉框集合
      virtualTypeList: [],//虚拟商品标识下拉框集合
      multiCheckPermitList: [],//多人验收标识下拉框集合
      scanTypeList: [],//扫描标识下拉框集合
      formInline: {
        companyName: '',
        name: '',
        commodityCode: '',
        categoryTopID: '',
        enabled: '',
        brandID: '',
        standardId: '',
        surfaceTreatmentName: '',
        strengthId: '',
        materialId: '',
        toothTypeID: '',
        textureId: '',
        specification: '',
        nominalSize: '',
        length: ''
      },
      rulesFormInline: {
        companyName: [{ required: true, message: '委托业主不能为空', trigger: 'change' }],
        length: [
          { pattern: /^[0-9]{1,13}([.][0-9]{1,2})?$/, message: '小数点后至多十三位数字', trigger: 'change' }
        ]
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
        tableCode: 'WMS_COMMODITY_TABLE'
      }, // 表格ID ，就是表格自定义名称
      getSelectedRow: [], // 用户选择的数据
      btnList: [],
      form: {
        companyCode: '', //委托业主编码
        companyName: '', //委托业主名称
        companyCommodityCode: '', //委托业主商品编码
        commodityCode: '', //商品编码
        name: '', //商品名称
        englishName: '', //商品英文名称
        productName: '', //商品简称
        enabledStatus: '', //状态
        categoryTopName: '', //商品类别
        materialTypeName: '', //商品属性
        barCodeSignName: '', //商品识别码
        standardName: '', //标准
        specification: '', //规格
        nominalSize: '', //直径
        length: '', //长度
        surfaceTreatmentName: '', //表色
        textureName: '', //材质
        strengthName: '', //强度
        materialName: '', //材料
        toothTypeNames: '', //牙型
        smallPackageUnitName: '', //包装单位
        smallPackageQt: '', //最小包装数量
        minBuyQty: '', //最小销售包装
        expirationDate: '', //保质期
        abcTypeId: '', //ABC分类
        volume: '', //单位材积
        unitWeight: '', //单位重量
        measureTypeId: '', //计量方式
        exportPermitId: '', //出货标记
        regularCommidityStatus: '', //是否规则商品
        needCheckId: '', //质检标识
        needWeightId: '', //称重标识
        brandCompanyName: '', //生产厂家
        brandName: '', //品牌
        thousandWeight: '', //千支重(kg)
        basePrice: '', //销售价格
        factoryTableSign: '', //出厂表色标识
        importBeyondPercent: '', //进货验收超量
        returnBeyondPercent: '', //退仓验收超量
        pickBeyondPercent: '', //拣货超量
        dispatchBeyondPercent: '', //分播超量
        fromErpName: '', //是否ERP下传
        storageConditionId: '', //存储条件
        virtualTypeId: '', //虚拟商品标识
        year: '', //年份
        code: '', //原商品编码
        amountCheckPercent: '', //数量抽检标识
        weightCheckPercent: '', //重量抽检标识
        multiCheckPermitId: '', //多人验收标识
        scanTypeId: '', //扫描标识
        remark: '',//备注
        baseUnitName:''//商品单位
      },
      rulesForm: {
        expirationDate: [
          { required: true, message: '保质期不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        abcTypeId: [{ required: true, message: 'ABC分类不能为空', trigger: 'change' }],
        exportPermitId: [{ required: true, message: '出货标记不能为空', trigger: 'change' }],
        regularCommidityStatus: [{ required: true, message: '是否规则商品不能为空', trigger: 'change' }],
        needCheckId: [{ required: true, message: '质检标识不能为空', trigger: 'change' }],
        needWeightId: [{ required: true, message: '称重标识不能为空', trigger: 'change' }],
        factoryTableSign: [{ required: true, message: '出厂表色标识不能为空', trigger: 'change' }],
        importBeyondPercent: [
          { required: true, message: '进货验收超量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        returnBeyondPercent: [
          { required: true, message: '退仓验收超量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        pickBeyondPercent: [
          { required: true, message: '拣货超量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        dispatchBeyondPercent: [
          { required: true, message: '分播超量不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数数字' }
        ],
        storageConditionId: [{ required: true, message: '存储条件不能为空', trigger: 'change' }],
        virtualTypeId: [{ required: true, message: '虚拟商品标识不能为空', trigger: 'change' }],
        year: [{ required: true, message: '年份不能为空', trigger: 'blur' }],
        amountCheckPercent: [{ required: true, message: '数量抽检标识不能为空', trigger: 'change' }],
        weightCheckPercent: [{ required: true, message: '重量抽检标识不能为空', trigger: 'change' }],
        multiCheckPermitId: [{ required: true, message: '多人验收标识不能为空', trigger: 'change' }]
      },
      count: 0,
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        age: ''
      },
      oldForm: {}, // 初始化的form数据
      isSave: false,//若有数据新增，未点击保存
      isSaveDialog: {
        modalClickShow: false,
        title: '确认',
        modalShow: false,
        text: '该数据未保存，确定放弃编辑?'
      },//确认是否保存
      searchParam: {},
      ownerId: '',
      hgpForm: {}
    }
  },
  created() {
    this.initBtn();
    this.initDictionaryPermit();
    this.getOwnerList(false);
    this.getBrandList(false);
    this.getStandardList(false);
    this.getNominalSizeList(false);
  },
  watch: {
    form: {
      handler: function(newVal, oldVal) {
        for (let item in newVal) {
          if (newVal[item] != this.oldForm[item]) {//比较不同的数据返回true
            this.isSave = true
            return
          }
        }

      },
      deep: true
    }
  },
  mounted() {
    this.tableHeight()
    window.onresize = () => {
      return (() => {
        this.tableHeight()
      })()
    }
    this.list = this.states.map(item => {
      return { value: item, label: item }
    })
    this.options = this.list
    this.initForm();
  },
  methods: {
    initForm(){
      this.hgpForm = new HgpFormV2({
        trigger: '#top-form'
      });
    },
    tableHeight() {
      let formHeight = $('#top-form').height()
      // 只要减了头部自己写的form或者其他的高度就可以了。其他的我已经统一减了。方便嵌入erp之后不用一个一个修改高度
      this.dataTable.height = $(window).height() - formHeight - this.$store.state.basic.height - 30
    },
    callFn(item) { //调用一个对象的一个方法
      const reg1 = /^\w+/g
      const reg2 = /\(([^)]+)\)/
      if (reg2.test(item.methodName)) {
        let methodName = item.methodName.match(reg1)
        let args = item.methodName.match(reg2)
        this[methodName[0]].apply(this, args[1].split(','))
      } else {
        this[item.methodName].apply(this)
      }
    },
    initBtn() { // 按钮加载函数
      let menusKey = 'WMS_COMMODITY'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.btnList.length; i++) {
          if (this.btnList[i].menuKey == 'WMS_COMMODITY_EDIT') {
            this.editBtn.push(this.btnList[i])
            continue
          }
        }
      })
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
        }
        if (this.ownersPageDate.data != null && this.ownersPageDate.data.length > 0) {
          if(this.formInline.companyName == ''){
            this.ownerId = this.ownersPageDate.data[0].id
            this.formInline.companyName = this.ownersPageDate.data[0].id
            this.searchCommodity(1);
          }
        }
      })
    },
    //品牌下拉框
    loadMoreBrandsList() {
      if (this.brandPageDate.start == this.brandsArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.brandPageDate.start = this.brandPageDate.start + 1;
        this.getBrandList(true);
      }
    },
    //品牌下拉框
    getBrandList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.brandPageDate.data));
      let params = {
        start: this.brandPageDate.start,
        limit: this.brandPageDate.limit
      }
      brandList(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.brandPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.brandsArrPage = data.pages; // 总页码
        }
      })
    },
    //标准下拉框
    loadMoreStandardList() {
      if (this.standardPageDate.start == this.standardArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.standardPageDate.start = this.standardPageDate.start + 1;
        this.getStandardList(true);
      }
    },
    //标准下拉框
    getStandardList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.standardPageDate.data));
      let params = {
        code: 'standard_fastener_standard',
        start: this.standardPageDate.start,
        limit: this.standardPageDate.limit
      }
      standardDicPage(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.standardPageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.standardArrPage = data.pages; // 总页码
        }
      })
    },
    //直径下拉框
    loadMoreNominalSizeList() {
      if (this.nominalSizePageDate.start == this.nominalSizeArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.nominalSizePageDate.start = this.nominalSizePageDate.start + 1;
        this.getNominalSizeList(true);
      }
    },
    //直径下拉框
    getNominalSizeList(concatOldData) {
      // 原集合拷贝
      let oldData = JSON.parse(JSON.stringify(this.nominalSizePageDate.data));
      let params = {
        code: 'standard_fastener_boltnominal',
        start: this.nominalSizePageDate.start,
        limit: this.nominalSizePageDate.limit
      }
      standardDicPage(params).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.nominalSizePageDate.data = concatOldData == true ? oldData.concat(data.records) : JSON.parse(JSON.stringify(data.records));
          this.nominalSizeArrPage = data.pages; // 总页码
        }
      })
    },
    getMaterialDic() {
      let params = {
        code: 'standard_fastener_material_by_texture',
        parentId: this.formInline.textureId
      }
      standardDicChild(params).then(res => {
        this.materialList = JSON.parse(JSON.stringify(res.data))
      })
    },
    onClearTexture() {
      this.formInline.textureId = ''
      this.formInline.materialId = ''
    },
    searchCommodity(current) {
      this.$refs['formInline'].validate((valid) => {
        let params = {
          stId: this.ownerId,
          start: current,
          limit: this.dataTable.limit
        }
        //合并缓存查询条件
        this.extendJson(params, this.searchParam)
        // filteParams 这个是全局过滤参数，会过滤掉错误的key，防止传入api
        commodityList(this.filteParams(params)).then(res => {
          let re = res.data
          this.dataTable.data = JSON.parse(JSON.stringify(re.records))
          this.dataTable.start = re.current
          this.dataTable.limit = re.size
          this.dataTable.total = re.total
        })
      })
    },
    onRowClick(row) {
    },
    onHandleSelectionChange(val) {
      this.getSelectedRow = val
    },
    searchList(){
      this.ownerId = this.formInline.companyName
      this.searchParam = {
        name: this.formInline.name,
        commodityCode: this.formInline.commodityCode,
        codeExactQuery: true,
        categoryTopId: this.formInline.categoryTopID,
        enabled: this.formInline.enabled,
        brandId: this.formInline.brandID,
        standardId: this.formInline.standardId,
        surfaceTreatmentId: this.formInline.surfaceTreatmentName,
        strengthId: this.formInline.strengthId,
        materialId: this.formInline.materialId,
        toothTypeID: this.formInline.toothTypeID,
        textureId: this.formInline.textureId,
        specification: this.formInline.specification,
        nominalId: this.formInline.nominalSize,
        length: this.formInline.length,
        abcTypeId: this.formInline.abcTypeName,
      }
      this.searchCommodity(1)
    },
    resetCommodity() {
      this.formInline.companyName = this.ownersPageDate.data[0].id
      this.formInline.name = ''
      this.formInline.commodityCode = ''
      this.formInline.categoryTopID = ''
      this.formInline.enabled = ''
      this.formInline.brandID = ''
      this.formInline.standardId = ''
      this.formInline.surfaceTreatmentName = ''
      this.formInline.strengthId = ''
      this.formInline.materialId = ''
      this.formInline.toothTypeID = ''
      this.formInline.textureId = ''
      this.formInline.specification = ''
      this.formInline.nominalSize = ''
      this.formInline.length = ''
      this.formInline.abcTypeName = ''
      this.dataTable.start = 1
      // 重置数据表
      for (let key in this.searchParam) {
        this.searchParam[key] = '';
      }
    },
    editCommodity() {
      this.isSave = false
      this.commodityTitle = '修改'
      let len = this.getSelectedRow.length
      if (len == 0) {
        this.$message.warning('请选择需要要修改的商品信息')
        return false
      } else if (len > 1) {
        this.$message.warning('修改商品信息不能大于一条')
        return false
      } else {
        this.dialogVisible = true
        let newForm = Object.assign({}, this.form, this.getSelectedRow[0])
        newForm.abcTypeId = String(newForm.abcTypeId)
        newForm.measureTypeId = String(newForm.measureTypeId)
        newForm.exportPermitId = String(newForm.exportPermitId)
        newForm.regularCommidityStatus = String(newForm.regularCommidityStatus)
        newForm.needCheckId = String(newForm.needCheckId)
        newForm.needWeightId = String(newForm.needWeightId)
        newForm.factoryTableSign = String(newForm.factoryTableSign)
        newForm.storageConditionId = String(newForm.storageConditionId)
        newForm.virtualTypeId = String(newForm.virtualTypeId)
        newForm.multiCheckPermitId = String(newForm.multiCheckPermitId)
        newForm.scanTypeId = String(newForm.scanTypeId)
        this.form = JSON.parse(JSON.stringify(newForm))
        this.oldForm = JSON.parse(JSON.stringify(newForm))
      }
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let axiosApi
          this.commodityTitle == '修改' ? axiosApi = updatecommodity(this.form) : null
          axiosApi.then(res => {
            if (res.data.status == 10001) {
              this.$message.warning(res.data.message)
            } else {
              this.commodityTitle == '修改' ? this.$message.success('修改成功') : this.$message.success('新增成功')
              // this.resetForm('form')//方法有冲突所以先直接置空
              this.$refs['form'].resetFields()
              for (let item in this.form) {
                if (item == 'status') {
                } else {
                  this.form[item] = ''
                }
              }
              this.dialogVisible = false;
              this.resetCommodity();
              this.searchCommodity(1);
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm() { // 清空表单
      if (this.isSave) {
        this.isSaveDialog.modalShow = true
      } else {
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })

        for (let item in this.form) {
          if (item == 'status') {
          } else {
            this.form[item] = ''
          }
        }
        this.dialogVisible = false
      }
    },
    //取消确认弹窗
    cancel(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })

      for (let item in this.form) {
        if (item == 'status') {
        } else {
          this.form[item] = ''
        }
      }
      this.dialogVisible = false
      this.isSaveDialog.modalShow = false
      this.isSave = false//是否保存置为默认值
    },
    initDictionaryPermit() {
      //获取商品类型字典值
      let commodityTypeParams = {
        code: 'standard_fastener_category_top'
      }
      standardDic(commodityTypeParams).then(res => {
        this.commodityTypeList = JSON.parse(JSON.stringify(res.data))
      })
      //获取状态字典值
      let statusParams = {
        code: 'WMS_MIX_BRAND_PRODUCT_SKU_ENABLED'
      }
      dictionarysType(statusParams).then(res => {
        this.statusList = JSON.parse(JSON.stringify(res.data))
      })
      //获取表色字典值
      let colorParams = {
        code: 'standard_fastener_surface'
      }
      standardDic(colorParams).then(res => {
        this.colorList = JSON.parse(JSON.stringify(res.data))
      })
      //获取强度字典值
      let strengthParams = {
        code: 'standard_fastener_strength'
      }
      standardDic(strengthParams).then(res => {
        this.strengthList = JSON.parse(JSON.stringify(res.data))
      })
      //获取牙型字典值
      let threadRotationParams = {
        code: 'standard_fastener_tooth_type'
      }
      standardDic(threadRotationParams).then(res => {
        this.threadRotationList = JSON.parse(JSON.stringify(res.data))
      })
      //获取材质字典值
      let textureParams = {
        code: 'standard_fastener_texture'
      }
      standardDic(textureParams).then(res => {
        this.textureList = JSON.parse(JSON.stringify(res.data))
      })
      //获取ABC分类字典值
      let abcTypeNameParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_ABC'
      }
      dictionarysType(abcTypeNameParams).then(res => {
        this.abcTypeNameList = JSON.parse(JSON.stringify(res.data))
      })
      //获取计量方式字典值
      let measureParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_MEASURE'
      }
      dictionarysType(measureParams).then(res => {
        this.measureList = JSON.parse(JSON.stringify(res.data))
      })
      //获取出货标记字典值
      let exportPermitParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_EXPORT'
      }
      dictionarysType(exportPermitParams).then(res => {
        this.exportPermitList = JSON.parse(JSON.stringify(res.data))
      })
      //是否规则商品字典值
      let regularCommidityParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_REGULAR'
      }
      dictionarysType(regularCommidityParams).then(res => {
        this.regularCommidityList = JSON.parse(JSON.stringify(res.data))
      })
      //质检标识字典值
      let needCheckParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_CHECK'
      }
      dictionarysType(needCheckParams).then(res => {
        this.needCheckList = JSON.parse(JSON.stringify(res.data))
      })
      //称重标识字典值
      let needWeightParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_WEIGHT'
      }
      dictionarysType(needWeightParams).then(res => {
        this.needWeightList = JSON.parse(JSON.stringify(res.data))
      })
      //出厂表色标识字典值
      let factoryTableSignParams = {
        code: 'yes_or_no'
      }
      dictionarysType(factoryTableSignParams).then(res => {
        this.factoryTableSignList = JSON.parse(JSON.stringify(res.data))
      })
      //存储条件字典值
      let storageConditionParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_STORAGE'
      }
      dictionarysType(storageConditionParams).then(res => {
        this.storageConditionList = JSON.parse(JSON.stringify(res.data))
      })
      //存储条件字典值
      let virtualTypeParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_VIRTUAL'
      }
      dictionarysType(virtualTypeParams).then(res => {
        this.virtualTypeList = JSON.parse(JSON.stringify(res.data))
      })
      //多人验收标识字典值
      let multiCheckPermitParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_MULTI_CHECK'
      }
      dictionarysType(multiCheckPermitParams).then(res => {
        this.multiCheckPermitList = JSON.parse(JSON.stringify(res.data))
      })
      //扫描标识字典值
      let scanTypeParams = {
        code: 'WMS_BASE_COMMODITY_EXTEND_SCAN'
      }
      dictionarysType(scanTypeParams).then(res => {
        this.scanTypeList = JSON.parse(JSON.stringify(res.data))
      })
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
    handleSizeChange(val) { // size选择
      this.dataTable.start = 1
      this.dataTable.limit = val
      // this.dataTable.loading = true;
      this.searchCommodity(this.dataTable.start)
    },
    handleCurrentChange(val) { // 页码选择
      // this.dataTable.loading = true;
      this.dataTable.start = val
      this.searchCommodity(this.dataTable.start)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    }
  }
}
