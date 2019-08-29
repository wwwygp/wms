import InboundProcessPlanLog from '@/views/processing-management/inbound-process-plan/inbound-process-log';
import InboundProcessPlan from '@/views/processing-management/inbound-process-plan/inbound-process-plan';
export default {
  name: 'processPlan',
  components: {
    InboundProcessPlanLog,
    InboundProcessPlan
  },
  data(){
    return{
      activeName: 'first',//tab切换
    }
  },
  methods:{
    changeTab(val) {
      this.activeName = val
    },
    beforeChange(activeName, oldActiveName){
      if(oldActiveName == 'second'){
        this.$refs.inboundProcessPlanLog.clearTimer()
      }
    }
  }
}
