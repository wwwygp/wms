import ExportScheduling from '@/views/export-warehouse/export-schedule/export-schedule';
import SchedulLog from '@/views/export-warehouse/export-schedule/scheduling-log';
export default {
  name: 'export-schedul-main',
  components: {
    ExportScheduling,
    SchedulLog
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
        this.$refs.schedulingLog.clearTimer()
      }
    }
  }
}
