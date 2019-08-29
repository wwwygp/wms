<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole"/>-->
    <!--<Promb :BtnName="Btnname" :isShowDialog="true" :BtnConte="Btnmessage"></Promb>-->
    <!--<DatePick></DatePick>-->
    <h3>日期</h3>
    <DatePick :pickRange="true"></DatePick>
    <h3>提示框&弹窗</h3>
    <Promb :BtnName="Btnname"  :BtnConte="Btnname"  :is-show-tip="true"></Promb>
    <!--:is-show-tip="true"-->
    <!--<Promb :BtnName="Btnname"  :BtnConte="Btnmessage" ></Promb>-->
    <!--:isShowDialog="true"-->
    <!--<el-form>-->
      <!--<el-row>-->
        <!--<el-col :lg="6" :md="8" :xs="12" :sm="12">-->
          <!--<el-form-item label="生产日期" prop="produceDate">-->
            <!--&lt;!&ndash;<el-col :span="8">&ndash;&gt;-->
            <!--<el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd"-->
                            <!--v-model="produceDate" :picker-options="pickerOptions0"></el-date-picker>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :lg="6" :md="8" :xs="12" :sm="12">-->
          <!--<el-form-item label="工单交期" prop="deliveryDate">-->
            <!--&lt;!&ndash;<el-col :span="8">&ndash;&gt;-->
            <!--<el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd"-->
                            <!--v-model="deliveryDate" :picker-options="pickerOptions1"></el-date-picker>-->
            <!--&lt;!&ndash;:picker-options="endDateOpt"&ndash;&gt;-->
            <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-form>-->

    <el-button type="primary" class="blue" @click="tipsData.modalShow = true">弹出框</el-button>
    <tips-dialog :parent-data="tipsData" @handleOkTip="handleOkTip"></tips-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
import Promb from '../../components/PromptBox/index'
import DatePick from '../../components/DatePicker/index'
import tipsDialog from '../../components/dialog/tipsDialog';


export default {
  name: 'Dashboard',
  components:{Promb,DatePick,tipsDialog},
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
      Btnname:'删除',
      Btnmessage:{
        type: 1,
        title: "物流信息修改",
        closeBtn: 0,
        shade: [0.2],
        area: ['400px', '200px'],
        skin: 'layui-layer-lan', //加上边框
        content: 'sw',
        btn: ['确 定', '关 闭'],
        shift: 0,
        yes: function (index, layero) {
          SaveLogistics();
        }
      },
      deliveryDate: '',
      produceDate: '',
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.deliveryDate) {
            return time.getTime() > this.deliveryDate;
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.produceDate ;
        }
      },
      tipsData: {
        modalClickShow: false, // 点击其他地方是否可关闭
        title: '这里是父传过来的参数',
        modalShow:false,
        text: '这里是要显示的内容',
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    handleOkTip () {
      this.$message.success('子组件点了确定');
    }
  }
}
</script>
