// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import {GetAllWarehouseList, uploadfileShare} from '@/api/activity/act-configure/index';
import '../style/index.scss'
export default {
  name: 'act-prize',
  components: {
    
  },
 
  data() {
    return {
      isEntity:true,
      winnerForm:{
        prizeType:'0',//类型
        styleElect:'',
        prizeName:'',//奖品名称
        model:'',//型号
        prizeLevel:'',//奖品等级
        imageUrl:staticConfiguration.uploadUrl,//图片
        mallName:'',//提供方
        prizePrice:'',//单价（面值）
        prizeStockCount:1,//初始库存
        recieveMaxCount:1,//每人领取上限
        winningPercent:0,//中奖几率
        thresholdAmount:'',//门槛金额
        useRuleComment:'',//使用规则说明
      },
      mallNames:[],
      prizeLevels:[{id:1,name:'1'},
      {id:2,name:'2'},
      {id:3,name:'3'},
      {id:4,name:'4'},
      {id:5,name:'5'},
      {id:6,name:'6'},
      {id:7,name:'7'},
    ],
    rulesFormDialog:{
        prizeType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        prizeName: [{ required: true, message: '奖品名称不能为空', trigger: 'blur' }],
        prizeStockCount:[{ required: true, message: '初始库存不能为空', trigger: 'blur' }],
        winningPercent:[{ required: true, message: '中奖概率不能为空', trigger: 'blur' },
        { pattern: /^[0-9]{1,4}([.][0-9]{1,2})?$/, message: '小数点前至多四位数字' }],
      },
      ossKey: '',
      ossUrl: '',
      file: {},
      Maxvalue:false,
    }
  },
  props: {
    totalChildRate: {
      type: Number,
      required: true
    },
    dialogItem:{
      type:String,
      default: ''
    }
  },
  computed:{
    totalRate(){
      return this.totalChildRate
    },
  },
  created() {
    if(this.dialogItem==""){
      this.winnerForm={
        prizeType:'0',//类型
        styleElect:'',
        prizeName:'',//奖品名称
        model:'',//型号
        prizeLevel:'',//奖品等级
        imageUrl:staticConfiguration.uploadUrl,//图片
        mallName:'',//提供方
        prizePrice:'',//单价（面值）
        prizeStockCount:1,//初始库存
        recieveMaxCount:1,//每人领取上限
        winningPercent:0,//中奖几率
        thresholdAmount:'',//门槛金额
        useRuleComment:'',//使用规则说明
      }
    }else{
      this.winnerForm = this.dialogItem
    }

    GetAllWarehouseList().then(res => {
      this.mallNames=res.data
  })
  },
  watch: {
    winnerForm(){
      console.log(this.dialogItem,'this.dialogItem')
      return this.dialogItem
    },
    
  },
  methods: {
    beforeUpload(file, id){
      this.file = file
    },
    upload(){
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(this.file.type);
      const isLt1M = this.file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg|png|jpg 格式!');
      }else if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1M!');
      }else{
        let formData = new FormData()
        formData.append('picture', this.file)
        uploadfileShare(formData).then(res => {
          if(res.data.status==1001){
            this.$message.error(res.data.message)
          }else{
            let data = res.data
            this.ossKey = data.downCode
            this.ossUrl = data.downUrl
          }
          
        })
      }
    
    },
    changeStyle(value){
      if(value=='1'){
        this.isEntity=false;
      }else{
        this.isEntity=true;
      }
    },
     //按订单发货表单重置
     resetDialogList() {
      this.$emit('resetDialogList');
    },
    sureAddDialog(){
      var val=this.winnerForm
      this.$emit('sureAddDialog',val);
    },
    closeaddDialog(){
      this.$emit('closeaddDialog');
    },
  }
}
