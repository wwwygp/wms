<template>
  <div class="page-set-table-header">
    <el-dialog
    title="自定义列表字段显示"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose">
      <el-col :span="12" class="select-box" >
        <div class="system-head">
          <span>所有字段（至少选择一个）</span>
        </div>
        <div class="checkbox-ul">
          <div v-for="item in tableFields" :key="item.id">
            <el-checkbox @change="changeCheck" v-model="item.isView">{{item.fieldName}}</el-checkbox>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="adjustment-box">
        <div class="system-head">
          <span>选中的字段</span>
          <span class="fix-position">固定位置</span>
        </div>
        <draggable v-model="selectListData" class="draggable-box">
          <div v-for="(item,index) in selectListData" class="dragg-div">
            <img src="../../images/hgp-list.png"/>
            <span>{{item.fieldName}}</span>
            <el-tooltip class="item" effect="dark" content="是否需要固定列" placement="left">
              <el-switch
              style="float: right"
              :width="42"
              v-model="item.fixedShow"
              active-color="#3c8dbc"
              inactive-color="#BFBFBF"
              active-icon-class="el-icon-check"
              inactive-icon-class="el-icon-close"
              @change="switchChange">
              </el-switch>
            </el-tooltip>
          </div>
        </draggable>
      </el-col>
      <div slot="footer" class="dialog-footer custom">
        <div style="float: left;">
          <el-button class="white left" @click="handleReset" size="mini" type="primary">重 置</el-button>
        </div>
        <div>
          <el-button class="blue" type="primary" @click="handleComfirm" size="mini">保 存</el-button>
          <el-button class="white" @click="dialogVisible = false" size="mini" type="primary">取 消</el-button>
        </div> 
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components:{
    draggable
  },
  data() {
    return {
      dialogVisible: false,
      tableFields: [],
      selectListData: [], // 这个是右侧选中的列表字段
      noSelectListData: [], // 用户没选中的
    }
  },
  props: {
    tableField: {
      type: Array,
      default: function() {
        return []
      }
    },
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  watch: {
    'tableField': 'initField',
  },
  methods: {
    initField() {
      let _temp = JSON.parse(JSON.stringify(this.tableField))
      this.tableFields = JSON.parse(JSON.stringify(_temp))
      this.handleListData()
    },
    handleShowDialog() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    switchChange(val) { // switch选择事件，确认表头是不是固定
      this.selectListData.forEach((item, index) => {
        if (!item.fixedShow) {
          item.isFixed = '0' // 不固定
        }
      });
      this.selectListData = JSON.parse(JSON.stringify(this.selectListData))
    },
    changeCheck(val) { // 选择框的选择事件
      this.handleListData()
    },
    handleListData() { // 列表数据处理
      this.selectListData = []; // 用户选中的
      this.noSelectListData = []; // 用户没选中的
      this.tableFields.forEach((item, index) => {
        if (item.isView) { // 是否用户选择了
          item.isFixed == '0' ? item.fixedShow = false : item.fixedShow = true;
          this.selectListData.push(item);
        } else {
          this.noSelectListData.push(item);
        }
      });
    },
    handleComfirm() {
      if(this.selectListData.length<1){
        this.$message.warning('至少选择一个字段!');
        return       
      }
      let falseArr = [],
        trueArr = [],
        listData; // 存放false的数组和true的数组, 定义公共数据
      this.selectListData.forEach((item, index) => {
        !item.fixedShow ? falseArr.push(index) : trueArr.push(index);
      });
      let newData = JSON.parse(JSON.stringify(this.selectListData));
      if (falseArr[0] == 0) {
        listData = trueArr[0]
      } else if (trueArr.length == newData.length) { // 用户全选固定定位了。不全选就不管
        newData.forEach(item => {
          item.isFixed = '1';
        })
      } else {
        listData = trueArr[falseArr[0]];
      }
      for (let i = 0; i < falseArr[0]; i++) { // 都是左固定
        newData[i].isFixed = '1'
      };
      for (let i = listData; i < newData.length; i++) {
        if (newData[i].fixedShow) { // 满足的
          newData[i].isFixed = '2'; // 右固定
        } else { // 用户选择不满足
          this.$message.warning('固定字段位置需要首尾连续')
          return false;
        }
      };
      let newArr = newData.concat(this.noSelectListData);
      for(var i=0; i<newArr.length; i++){
        newArr[i].sort = i
      }
      this.selectListData = JSON.parse(JSON.stringify(newData));
      this.$emit('handleComfirm', newArr);
    },
    handleReset() {
      this.$emit('handleReset')
    }
  }
}
</script>
<style lang="scss">
  $blueColor: #3c8dbc !important;
  $deepBlueColor: #444A63 !important;
  .page-set-table-header {
    ul, ol {
      margin-bottom: 0px;
    }
    .el-dialog__body {
      padding: 20px;
      height: 80%;
      background-color: #F3F4F6;
    }
    .el-dialog__header {
      padding-top: 20px;
      padding-left: 21px;
      padding-bottom: 18px;
      padding-right: 515px;
      background-color: $blueColor;
    }
    .el-dialog__title {
      font-size: 16px;
      color: #ffffff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #ffffff;
    }
    .system-head {
      background-color: #E8EBF1;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 20px;
    }
    .select-box {
      padding-right: 10px;
      height: 95%;
      .checkbox-ul {
        padding-left: 0px;
        overflow: auto;
        height: 100%;
        div {
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          border-bottom: 1px solid #F3F4F6;
          background-color: #ffffff;
          .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #000000;
          }
          .el-checkbox__label {
            color: #000000;
            font-size: 13px;
            padding-left: 23px;
          }
        }
      }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner
    {
      background-color: $blueColor;
      border-color: $blueColor;
    }
    .is-disabled {
      .el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #B8B8B8 !important;;
        border-color: #B8B8B8 !important;;
      }
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
      border-color: #fff;
    }
    .adjustment-box {
      padding-left: 10px;
      .draggable-box {
        height: 95%;
        padding-left: 0px;        
        overflow: auto;
        .dragg-div {
          height: 40px;
          line-height: 40px;
          font-size: 13px;
          padding-left: 20px;
          background-color: #F9FCFE;
          border-bottom: 1px solid #F3F4F6;
          img {
            width: 13px;
            height: 11px;
          }
          span {
            padding-left: 23px;
            color: #000000;
          }
          .el-switch__core {
            margin-top: 20px;
            margin-right: 20px;
          }
          .el-switch__label * {
            font-size: 9px;
          }
          .el-switch__label--left{
            position: absolute;
            left: 0px;
            color: #ffffff;
            margin-top: 9px;
            z-index: -1111;
          }
          .el-switch__label--left.is-active{
            left: 5px;
            color: #ffffff;
            margin-top: 9px;
            z-index: 2500;
          }
          .el-switch__label--right{
            position: absolute;
            right: 45px;
            color: #ffffff;
            z-index: -1111;
          }
          .el-switch__label--right.is-active{
            z-index: 2500;
            color: #ffffff !important;
            margin-top: 9px;
            margin-left: 8px;
          }
        }
      }
      .system-head {
        padding-right: 0px;
        .fix-position {
          float:right;
          padding-right: 35px;
        }
      }
    }
    .el-dialog__footer{
      background-color: #F3F4F6;
      padding: 0px;
    }
    .dialog-footer.custom button {
      width: 90px;
      height: 40px;
      font-size: 16px !important;
    }
    .dialog-footer {
      padding: 20px;
    }
  }
  .page-set-table-header{
    .checkbox-ul{
      label{
        margin-bottom: 0;
      }
    }
  }

 @media screen and (max-width:1024px){
   .page-set-table-header{
      .el-dialog{
        width: 700px;
        height: 530px;
      }
      .select-box {
        .checkbox-ul {
          height: 320px;
        }
      }
      .adjustment-box {
        .draggable-box{
          height: 320px;
        }
      }
   }    
 }
 @media screen and (min-width:1023px){
      .page-set-table-header{
      .el-dialog{
        width: 70%;
        height: 70%;
      }   
      .select-box {
        .checkbox-ul {
         // max-height: 320px;
        }
      }
      .adjustment-box {
        .draggable-box{
         // max-height: 320px;
        }
      }       
   } 
 }
 @media screen and (max-width:1024px)and (max-height: 768px){
   .page-set-table-header{
      .el-dialog{
        width: 700px;
        height: 530px;
      }    
      .select-box {
        .checkbox-ul {
          height: 320px;
        }
      }
      .adjustment-box {
        .draggable-box{
          height: 320px;
        }
      }
   }    
 }
 @media screen and (min-width:1023px) and (min-height: 767px){
      .page-set-table-header{
      .el-dialog{
        width: 70%;
        height: 70%;
      }
      .select-box {
        .checkbox-ul {
        //  min-height: 320px;
        }
      }
      .adjustment-box {
        .draggable-box{
         // min-height: 320px;
        }
      }       
   } 
 }
</style>
