import movePlanLog from '@/views/warehouse-shifting/move-plan/move-log';
import movePlan from '@/views/warehouse-shifting/move-plan/move-plan';
export default {
  name: 'scheduling',
  components: {
    movePlanLog,
    movePlan
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
        this.$refs.moveStart.clearTimer()
      }
    }
  }
}
