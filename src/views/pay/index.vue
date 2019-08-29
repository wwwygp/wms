<template>
  <div class="pay-container">
    <el-row style="text-align: center;margin-top: 10%">
      <el-button type="primary" @click="pay(1)">微信支付按钮1</el-button>
      <el-button type="primary" @click="pay(2)">支付按钮2</el-button>
      <input v-model="wxurl"/>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Pay',
  data() {
    return {
      wxurl : ''
    }
  },
  watch: {

  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    pay(type) {
      let domain = window.location.host
      let url = window.location.href
      if(type == 1){
        // this.$message.success(domain)
        window.location.href = this.wxurl;
      }else{
        this.$message.success(url)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
