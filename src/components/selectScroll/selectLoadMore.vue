<template>
  <!--<div id="selectMore">-->
  <!--:multiple="params.multiple"-->
  <!-- :disabled="params.disabled" :filterable="params.filterable" :remote="params.remote" :clearable="params.clearable" :multiple-limit="params.multipleLimit" placeholder="请选择" v-loadmore="loadMore" :remote-method= "remoteMethod"-->
    <!-- <el-select id="select-more" v-model="selectValue"   :disabled="params.disabled" :filterable="params.filterable"  :clearable="params.clearable"  placeholder="请选择" v-loadmore="loadMore"> -->
    <el-select id="select-more" :disabled="params.disabled" :filterable="params.filterable" :remote="params.remote" :clearable="params.clearable" :multiple-limit="params.multipleLimit" placeholder="请选择" v-loadmore="loadMore" :remote-method= "remoteMethod" v-model="selectValue">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'selectLoadMore',
    props: ["options","paramsOption",'parentData'],
    data () {
      return {
        selectValue: '',
        params: {

        }
      }
    },
    components: {
    },
    created () {

    },
    mounted () {
      // console.log(this.options,'123321')
      if(typeof(this.paramsOption) == "undefined") {
        this.params = {
          multiple: false,//是否多选
          disabled: false,//是否禁用
          filterable: false,//是否可搜索
          remote: false,//是否为远程搜索
          clearable:false,//单选时是否可以清空选项
          multipleLimit: 0//多选时用户最多可以选择的项目数，为 0 则不限制
        }
      }else {
        let temp = {
          multiple: this.paramsOption.multiple || false,
          disabled: this.paramsOption.disabled || false,
          filterable: this.paramsOption.filterable || false,
          remote: this.paramsOption.remote || false,
          clearable: this.paramsOption.clearable || false,
          multipleLimit: this.paramsOption.multipleLimit || 0
        }
        this.params = temp
      }
    },
    methods:{
      loadMore () {
        let that = this;
        that.$emit('loadMore');
      },
      remoteMethod(query) {
        let that = this
        that.$emit('remote-method', query);
      },
      resetData () {
        this.selectValue = ''; // 清空数据
      },
      initData () {
        this.selectValue = this.parentData;
      }
    },
    watch: {
      selectValue(curVal,oldVal) {
        let that = this
        that.$emit('on-change', curVal, oldVal);
      },
      'parentData' : 'initData'
    }
  }
</script>

<style scoped>
  .my-scrollbar{
    max-height: 200px;
  }

</style>
<style lang="scss">
  #selectMore{
    //.el-input__icon:after {
     // content: "\E605";
    //}
  }

</style>
