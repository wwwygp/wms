<template>
  <el-form :inline="true" :model="winnerForm" id="config-form" class='set-prizeDialog' :rules="rulesFormDialog">
        <el-row>
          <el-col>
             <el-form-item label="类型" class='' prop='prizeType'>
               <el-radio-group v-model="winnerForm.prizeType" @change="changeStyle" >
   <el-radio label="0">实物赠品</el-radio>
            <el-radio label="2" disabled>积分</el-radio>
            <el-radio label="1">卡券</el-radio>
  </el-radio-group>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="奖品名称" prop='prizeName'>
              <el-input placeholder="华为P10" size="large" v-model="winnerForm.prizeName" >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col>
            <el-form-item label="型号" v-if='isEntity'>
              <el-input placeholder="xxx" size="large" v-model="winnerForm.model">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
              <el-col>
                 <el-form-item label="奖品等级">
         <el-select v-model="winnerForm.prizeLevel" placeholder="等级1为最高，依次降低" clearable>
                     <el-option v-for="item in prizeLevels" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
                 </el-form-item>
                     </el-col>
        </el-row>
        <el-row class='prize-dialog'>
          <el-form-item label="图片" v-if='isEntity'>
             <el-upload
                class="avatar-uploader uploadImg"
                :action="winnerForm.imageUrl"
                :http-request='upload'
                :show-file-list="false"
                with-credentials
                :before-upload="beforeUpload"
                >
                <img v-if="ossUrl" :src="ossUrl" class="avatar">
                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span slot="tip" class="el-upload__tip cofing-explain">建议小于1M，尺寸96x96像素，支持JPG、PNG、JPEG等图片格式</span>
           </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
              <el-col>
                 <el-form-item label="提供方" v-if='isEntity'>
         <el-select v-model="winnerForm.mallName" placeholder="请选择" filterable clearable>
                <el-option v-for="item in mallNames" :key="item.mallId" :label="item.mallName" :value="item.mallName"></el-option>
                </el-select>
                 </el-form-item>
                     </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="单价（面值）">
              <el-input placeholder="0" size="large" v-model="winnerForm.prizePrice">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="门槛金额" v-if='!isEntity'>
              <el-input placeholder="0" size="large" v-model="winnerForm.thresholdAmount">
              </el-input>
               <span class='cofing-explain'>
                0表示无门槛
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="使用规则说明" v-if='!isEntity'>
              <el-input size="large" v-model="winnerForm.useRuleComment">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="初始库存" prop='prizeStockCount'>
              <el-input placeholder="1" size="large" v-model="winnerForm.prizeStockCount" >
              </el-input>
              <span class='cofing-explain'>
                数量不能超过实际库存数
              </span>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col>
            <el-form-item label="每人领取上限">
              <el-input placeholder="1" size="large" v-model="winnerForm.recieveMaxCount">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="中奖几率" prop='winningPercent'>
              <el-input placeholder="1" size="large" v-model="winnerForm.winningPercent">
              </el-input>
              <span class='cofing-explain'>
               %
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" ">
              <span>当前手动设置的总中奖率：<span style='color:red'>{{totalRate}}</span>%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
                <el-button  type='primary' size="small" class='blue' @click='sureAddDialog'>确定</el-button>
                <el-button  type='primary'  size="small" class='blue' @click='closeaddDialog'>取消</el-button>
          </el-col>
        </el-row>
  </el-form>
</template>

<script src="./js/act-prize.js"></script>

<style scoped>
  .form-config {
    margin: 0 auto;
    border: 1px solid #ddd;
    padding: 0 20px;
    max-width: 1200px
  }

</style>
