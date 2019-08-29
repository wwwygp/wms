<template>
  <el-card style="height: calc(100vh);overflow: auto">
    <el-form :inline="true" :model="configForm" class="form-config" :rules="rulesFormInline" id="config-form">
      <h3 class='config-title'>基本规则设置</h3>
      <div class='rule-set'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activityName">
              <el-input type="text" :placeholder="holder" size="large" v-model="configForm.activityName" maxlength="30"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动简要/标题" prop="activityTitle">
              <el-input placeholder="参与活动抽取奖品啦" size="large" v-model="configForm.activityTitle" maxlength="50"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动编号" prop="activityCode">
              <el-input placeholder="比如，MALL_ONLINE_ACTIVITY_20190611" size="large" v-model="configForm.activityCode" maxlength="50"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <span class='cofing-explain'>一般由活动页面所在的文件路径及编号组成</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="开启通道">
            <el-checkbox v-model="configForm.channelId" disabled>PC</el-checkbox>
            <el-checkbox v-model="configForm.channelId" disabled>APP</el-checkbox>
            <el-checkbox v-model="configForm.channelId" disabled>微信服务号</el-checkbox>
            <el-checkbox v-model="configForm.channelId" disabled>小程序</el-checkbox>
            <span class='cofing-explain'>*取消勾选后将前端功能关闭</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="起止时间" class='time-radio' prop="activityTimeType">
             <el-radio-group v-model="configForm.activityTimeType">
                <el-radio :label="0" class="time-pick">
                  <el-date-picker v-model="filters.column.create_start_date" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" placeholder="开始日期" @change="changeStartTime">
                  </el-date-picker>
                  <span>至</span>
                  <el-date-picker v-model="filters.column.create_end_date" type="date" format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter" placeholder="结束日期" @change="changeEndTime">
                  </el-date-picker>
                   <!-- <DatePick ref="dateComponents" :pickRange="true" :startParentTime='startParentTime' :endParentTime='endParentTime' @getStartTime="getStartTime" @getEndTime="getEndTime"> </DatePick> -->
                </el-radio>
                <el-radio :label="1">一直有效</el-radio>
              </el-radio-group>
            <span class='cofing-explain'>过期后，活动会自动停止隐藏</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="PC活动页地址">
            <el-input placeholder="https://xxxxx" size="large" v-model="configForm.pcUrl" maxlength="300"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="移动端活动页地址">
            <el-input placeholder="https://xxxxx" size="large" v-model="configForm.appUrl" maxlength="300"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="规则说明文案">
            <el-input type="textarea" size="large" placeholder="请输入内容" v-model="configForm.ruleRemark"
              maxlength="300" show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分享文案">
              <el-input placeholder="参与活动抽取奖品啦" size="large" v-model="configForm.shareRemark" maxlength="50"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="分享小图">
            <el-upload
                class="avatar-uploader uploadImg"
                :action="configForm.shareUrl"
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
          <el-col :span="24">
            <el-form-item label="状态">
              <span>{{configForm.ActiveStatus}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h3 class='config-title'>营销参数设置</h3>
      <div class='marketing-setup'>
        <el-row>
          <el-form-item label="参与人">
            <el-radio v-model="configForm.participateScopeId" label="0">所有人</el-radio>
            <el-radio v-model="configForm.participateScopeId" label="1" disabled>指定人（建设中）</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每人参与次数">
            <div>
              <el-radio v-model="configForm.participateLimitType" label="0">一天N次</el-radio>
              <p class='seat-place'>每人每天
                  <el-input placeholder="1" v-model="configForm.participateLimit">
                     <template slot="append">次</template>
                  </el-input>
              </p>
            </div>
            <div>
              <el-radio v-model="configForm.participateLimitType" label="6">一人N次</el-radio>
              <p class='seat-place'>最多
                <el-input placeholder="1" v-model="configForm.participateLimit">
                     <template slot="append">次</template>
                  </el-input>
              </p>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="分享获得机会">
            <el-checkbox v-model="configForm.shareWhetherId" disabled>每人每日成功分享1次额外增1次，最多增加不超过
              <el-input placeholder="1" v-model='configForm.shareLimit' disabled>
                     <template slot="append">次</template>
                  </el-input>
            </el-checkbox>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="抽奖消耗限制">
            <el-radio v-model="configForm.consumeTypeId" label="0">无限制抽奖</el-radio>
            <br>
            <el-radio v-model="configForm.consumeTypeId" label="1" disabled>积分抽奖，消耗
                 <el-input placeholder="1" v-model="configForm.drawLimiteTime" disabled>
                     <template slot="append">次</template>
                  </el-input>
            </el-radio>
          </el-form-item>
        </el-row>
      </div>
      <h3 class='config-title'>奖品设置</h3>
      <div class='set-winner'>
      <el-row>
        <el-form-item label="是否按商城分别设置">
          <el-col :span='24'>
            <el-radio v-model="configForm.setSeparately" label="" disabled>仅平台提供的奖品（用户仅能抽到平台提供的卡券+实物赠品）</el-radio>
          </el-col>
          <el-col :span='24'>
            <el-radio v-model="configForm.setSeparately" label="1" disabled>
              区分商城提供的奖品（用户只能抽到当前商城提供的奖品和平台提供的卡券，则需要将各个商城的奖品维护进来）
            </el-radio>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span='4'>
          <el-form-item label=" " class='addWinner'>
            <el-button type="text" size="small" @click='addSumbit' >+添加奖品</el-button>
          </el-form-item>
        </el-col>
        <el-col :span='4' v-if='!isPlatform'>
          <el-form-item label="" class='winner-select'>
            <el-select v-model="configForm.setSeparatelyarea" placeholder="请选择" filterable clearable @change='changeSeparatelyarea'>
               <el-option v-for="item in separatelyareas" :key="item.mallId" :label="item.mallName" :value="item.mallId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='8' v-if='!isPlatform'>
          <span class='cofing-explain'>选择对应的商城进行分别设置和过滤奖品列表</span>
        </el-col>
      </el-row>
      <el-row>
        <table-configure v-if="heightResize" ref="tableConfig" :data-table="dataTable" 
        :table-code="tableName"
          @onRowClick="onRowClick"  
          @onHandleSelectionChange="onHandleSelectionChange"
           @tableDataHandle="tableDataHandle">
          <template slot-scope="props" slot="operationCol">
            <el-button @click="editSumbit(props.obj.row)" type="text" size="small">编辑</el-button>
            <el-button  type="text" size="small" @click.stop.prevent="UpperShelFoperation(props.obj)">移除</el-button>
          </template>
        </table-configure>

      </el-row>
      <el-row>
      <el-col style='text-align: center;line-height:1;margin:10px 0;'>
        <p class='cofing-explain'>*注意，活动启动后，不能移除奖品，只能新增奖品或递增数量</p>
        <p class='cofing-explain'>双击表格可编辑中奖率、领取上限、数量</p>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
      <el-form-item label="设置中奖率">
                <el-radio v-model="configForm.probabilityCalculationType" label="1" disabled class='winning-rate'>
                  启用总中奖率
                  <el-input placeholder="1" v-model="configForm.winnerRateTime" disabled>
                  </el-input>
                    <span class='cofing-explain'>每个商城的中奖率都一致</span>
                  <p style='margin:10px 0'>
                    奖品数量越多，则该奖品的中奖率越高。计算中奖率时仅计算在该商城范围的商品数量。例如：总中奖率50%，平台奖品A 1个，平台奖品B 2个，苏州奖品C 3个，苏州奖品D 4个，杭州奖品E
                    5个，则奖品A的在苏州商城中的中奖概率为50%*1/(1+2+3+4)=5%，奖品A在杭州商城为50%*1/(1+2+5)=6.25%
                  </p>
                </el-radio> 
                <el-radio v-model="configForm.probabilityCalculationType" label="0">启用奖品中手动设置的中奖率（若总和为0则自动使用总中奖率）
                </el-radio>
                  <p>当前手动设置的总中奖率：<span style='color:red'>{{totalRate}}</span>%</p>
              </el-form-item>
              </el-col>
            </el-row>
            </div>
            <el-row>
              <el-button type='primary' class='setup-btn blue' v-if='hasSaveRelease' @click='saveActivity'>保存</el-button>
              <el-button type='primary' class='setup-btn blue' v-if='hasSaveRelease' @click='saveReleaseActivity'>保存&发布</el-button>
              <el-button type='primary' class='setup-btn blue' v-else @click='undercarriage'>下架</el-button>
              <el-button  class='setup-btn' @click='dissActivity'>取消</el-button>
            </el-row>
          </el-form>
          <self-dialog
            :visible.sync="dialogVisible"
            :title='dialogTitle'
            width="630px"
            custom-class="prizeDialog"
            :modal-append-to-body="false"
            :before-close="closeDialog"
            :close-on-click-modal="false"
          >
      <act-prize v-if='dialogVisible' :totalChildRate="totalRate" :dialogItem='dialogItem' @closeaddDialog='closeDialog' @sureAddDialog='sureAddDialog' @resetDialogList='resetDialogList'></act-prize>
    </self-dialog>
     <tips-dialog :parent-data="delDialog" @handleOkTip="removeRow">
    </tips-dialog>
  </el-card>
</template>

<script src="./js/act-configure.js"></script>

<style scoped>
  .form-config {
    margin: 0 auto;
    border: 1px solid #ddd;
    padding: 0 20px;
    max-width: 1200px
  }

</style>
