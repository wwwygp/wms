// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import {stockLabelPrint} from '@/api/common/print.js'
import {ownersList} from '@/api/common/business.js'; // 供应商
import {takeLableNumber, limitLableNumber} from '@/api/printer-center/lable-number/index';
import {print} from '@/api/common/print-api.js'; // 调用打印机
import { loaddBtn } from '@/api/common/load-btn.js'
import { dictionarysType } from '@/api/common/type.js'//启用和禁用
import tipsDialog from '@/components/dialog/tipsDialog'
import '../style/index.scss'
export default {
  name: 'lable-number',
  components: {
    tipsDialog
  },
  data() {
    var validateNumber = (rule,value,callback) => {
      var value = String(value);
      let reg = /^[0-9]*[1-9][0-9]*$/
      if(!value){
        callback(new Error('标签数量不能为空'))
      }else if(!(value<= this.limitLableNumber)){
        callback(new Error('标签数量大于系统配置最大数量'))
      }else if(!value.match(reg)){
        callback(new Error('请输入正整数'))
      }else{
        callback()
      }
    }
    return {
      radio2: '',
      textarea: '',
      btnList: [],
      mainForm: {//主页表单
        ownerId: '',
        containerTypeId: '',
        entityId: '',
        containerPurposeId: '',
        takeNumber: ''
      },
      rulesForm: {
        ownerId: [{ required: true, message: '请选择委托业主', trigger: 'change' }],
        containerTypeId: [{ required: true, message: '请选择容器类型', trigger: 'change' }],
        entityId: [{ required: true, message: '请选择容器标识', trigger: 'change' }],
        containerPurposeId: [{ required: true, message: '请选择容器用途', trigger: 'change' }],
        takeNumber: [{ required: true, validator: validateNumber, trigger: 'change' }]
      },
      ownersArrPage: 1, 
      ownersArr: {
        data: [],
        start: 1,
        limit: 100
      },
      containerType:[],
      containerPurpose: [],
      entity: [],
      limitLableNumber: '',
      lableList: ''
    }
  },
  created() {
    this.initBtn()
    this.initOwnersList()//委托业主
    this.initDictionary()
    this.limitNumber()
  },
  methods: {
    initDictionary() {
      let params = {
        code: 'container_type'
      }
      dictionarysType(params).then(res => {
        this.containerType = JSON.parse(JSON.stringify(res.data))
        this.mainForm.containerTypeId = this.containerType[0].dictDtlValue
      })
      let params1 = {
        code: 'container_purpose'
      }
      dictionarysType(params1).then(res => {
        this.containerPurpose = JSON.parse(JSON.stringify(res.data))
        this.mainForm.containerPurposeId = this.containerPurpose[0].dictDtlValue
      })
      let params2 = {
        code: 'entityId'
      }
      dictionarysType(params2).then(res => {
        this.entity = JSON.parse(JSON.stringify(res.data))
        this.mainForm.entityId = this.entity[0].dictDtlValue
      })

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
    initBtn() {
      let menusKey = 'WMS_LABLE_NUMBER'
      loaddBtn(menusKey).then(res => {
        this.btnList = JSON.parse(JSON.stringify(res.data))
      })
    },
    initOwnersList (accumulation) {
      let oldData = []; // 存放之前的数据
      oldData = JSON.parse(JSON.stringify(this.ownersArr.data));
      let params = {
        start: this.ownersArr.start,
        limit: this.ownersArr.limit
      };
      ownersList(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          accumulation ? this.ownersArr.data = oldData.concat(data.records) : this.ownersArr.data = JSON.parse(JSON.stringify(data.records));
          this.ownersArrPage = data.pages; // 总页码
        };
        // this.
      })
    },
    ownersMore () {
      if ( this.ownersArr.start == this.ownersArrPage) {
        this.$message.warning('没有更多数据了');
      } else {
        this.ownersArr.start = this.ownersArr.start + 1;
        this.initOwnersList(true);
      }
    },
    takeNumber(){
      this.lableList = ''
      this.textarea = ''
      this.$refs['mainForm'].validate((valid) => {
        if (valid) {
          let params ={
            containerTypeId: this.mainForm.containerTypeId,
            entityId: this.mainForm.entityId,
            containerPurposeId: this.mainForm.containerPurposeId,
            takeNumber: this.mainForm.takeNumber,
            ownerId: this.mainForm.ownerId
          }
          takeLableNumber(this.filteParams(params)).then(res => {
            let data = res.data
            if (data.status == 10001) {
              this.$message.warning(data.message);
            } else {
              data.forEach((item)=>{
                this.textarea += item.labelCode + '\n'
                this.lableList += item.labelId + ','
              })
            }
          })
        } else {
          return false
        }
      })
    },
    limitNumber(){
      let params ={

      }
      limitLableNumber(this.filteParams(params)).then(res => {
        let data = res.data
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          this.limitLableNumber = data.limitNumber
        }
      })
    },
    printerLable(){
      let params ={
        containerTypeId: this.mainForm.containerTypeId,
        entityId: this.mainForm.entityId,
        labelIds: this.lableList
      }
      stockLabelPrint(params).then(res => {
        let data = res.data;
        if (data.status == 10001) {
          this.$message.warning(data.message);
        } else {
          if(data[0].template.length > 0){
            let template = data[0].template
            let templateId = template[0].template_id
            let templateType = template[0].template_type
            this.printOk(templateId, templateType, data)
          }else{
            this.$message.warning('打印模板为空')
          }
        }
      })
    },
    //调用ERP打印
    printOk(templateId, templateType, data){
      let params = {
        dataSource: JSON.stringify(data),
        templateId: templateId,
        templateType: templateType
      }
      print(params)
    },
  }
}
