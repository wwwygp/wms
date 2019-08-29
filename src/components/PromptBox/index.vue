<template>
  <el-row>
    <!--v-if="isShowTip"-->
    <!--v-if="isShowDialog"-->
    <el-button @click="openTip" v-show="isShowTip">{{BtnName}}</el-button>
    <el-button @click="openDialog" v-show="isShowDialog">{{BtnName}}</el-button>
  </el-row>
</template>
<script>
  import { utility } from '../../utils/publicframe'
    export default {
        name: "index",
        props:["BtnName","BtnConte","isShowDialog","isShowTip"],
        data(){
          return{
            }
        },
        created(){
        },
        methods:{
          openTip(){
            utility.openTips(this.BtnConte);
          },
          openDialog(){
            utility.openDialogs(
              {
                type: this.BtnConte.type,
                title: this.BtnConte.title,
                closeBtn: this.BtnConte.closeBtn,
                shade: this.BtnConte.shade,
                area: this.BtnConte.area,
                skin: this.BtnConte.skin, //加上边框
                content:this.BtnConte.content,
                btn:  this.BtnConte.btn,
                shift: this.BtnConte.shift,
              }
            )
          }
      }
    }
</script>
<style scoped>
  .el-button.el-button--default{
    color:#333;
  }
</style>
