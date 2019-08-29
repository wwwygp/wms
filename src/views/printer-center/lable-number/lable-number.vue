<template>
  <el-card style="height: calc(100vh);overflow: auto" id="lable">
    <el-form :inline="true" :model="mainForm" ref="mainForm" :rules='rulesForm' id="form">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-row>
            <el-form-item label="委托业主" prop='ownerId'>
              <el-select v-model="mainForm.ownerId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable>
                <el-option v-for="item in ownersArr.data" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="标签用途">
              <el-select v-model="mainForm.ownerId" placeholder="请选择" v-loadmore="ownersMore" filterable clearable>
                <el-option v-for="item in ownersArr.data" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="容器类型" prop='containerTypeId'>
              <el-radio-group v-model="mainForm.containerTypeId">
                <el-radio :label="item.dictDtlValue" v-for='item in containerType' :key="item.dictDtlName">{{item.dictDtlName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="容器用途" prop='containerPurposeId'>
              <el-radio-group v-model="mainForm.containerPurposeId">
                <el-radio :label="item.dictDtlValue" v-for='item in containerPurpose' :key="item.dictDtlName">{{item.dictDtlName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="容器标识" prop='entityId'>
              <el-radio-group v-model="mainForm.entityId">
                <el-radio :label="item.dictDtlValue" v-for='item in entity' :key="item.dictDtlName">{{item.dictDtlName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="取号数量" prop='takeNumber'>
              <el-input v-model="mainForm.takeNumber"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <div class="btn-box" style="text-align: left;margin-left: 40px;">
              <el-button
                v-db-click
                v-for="(v,index) in btnList"
                :class="v.className"
                :key="index" @click="callFn(v)"
                :type="filteType(v.className)">
                {{v.name}}
              </el-button>
            </div>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-input type="textarea" placeholder="" v-model="textarea">
          </el-input>
        </el-col>
      </el-row>
    </el-form>
    
  </el-card>
</template>
<script src="./js/index.js"></script>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->
<style lang="scss" scoped>
</style>
<style lang="scss">
#lable {
  .el-form-item__content .el-input--mini .el-input__inner {
    width: calc(25vh);
  }
  .is-required .el-select .el-input {
    width: calc(25vh);
  }
  .el-textarea__inner{
    height: calc(90vh);
  }
}

</style>
