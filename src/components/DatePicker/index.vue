<template>
  <div>
    <el-date-picker v-model="filters.column.create_start_date" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" placeholder="开始日期" @change="changeStartTime">
    </el-date-picker>
    <span>至</span>
    <el-date-picker v-model="filters.column.create_end_date" type="date" format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter" placeholder="结束日期" @change="changeEndTime">
    </el-date-picker>
  </div>

</template>

<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        filters: {
          column: {
            create_start_date: '',
            create_end_date: ''
          },
        },
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.filters.column.create_end_date;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.filters.column.create_start_date;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        }
      }
    },
    methods:{
      changeStartTime (val) {
        let startTime = ''
        if(val){
          startTime = moment(val).format("YYYY/MM/DD");
        }else{
          startTime = ''
        }
        this.$emit('getStartTime', startTime);
        // console.log('开始日期',)

      },
      changeEndTime (val) {
        let endTime = moment(val).format("YYYY/MM/DD");
        if(val){
          endTime = moment(val).format("YYYY/MM/DD");
        }else{
          endTime = ''
        }
        this.$emit('getEndTime', endTime);
      },
      resetTime () {
        this.filters.column.create_end_date = '';
        this.filters.column.create_start_date = '';
      }
    }
  }
</script>

<style scoped>

</style>
