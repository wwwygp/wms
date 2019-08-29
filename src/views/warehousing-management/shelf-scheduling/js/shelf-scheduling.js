import schedulingAppoint from '@/views/warehousing-management/shelf-scheduling/scheduling-appoint';
import schedulingAutomatic from '@/views/warehousing-management/shelf-scheduling/scheduling-automatic';
import SchedulingLog from '@/views/warehousing-management/shelf-scheduling/scheduling-log';
export default {
  name: 'scheduling',
  components: {
    schedulingAutomatic,
    schedulingAppoint,
    SchedulingLog
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
      if(oldActiveName == 'third'){
        this.$refs.schedulingLog.clearTimer()
      }
    }
  }
}
