<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="字典配置" name="first">
      <base-warehouse-area v-if="activeName == 'first'"></base-warehouse-area>
    </el-tab-pane>
    <el-tab-pane label="字典修改记录" name="second">
      <base-storage-area v-if="activeName == 'second'"></base-storage-area>
    </el-tab-pane>
  </el-tabs>
</template>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->

<script>
  import baseWarehouseArea from '@/views/dic-config/dic-setting/dic-setting';//字典配置
  import baseStorageArea from '@/views/dic-config/dic-setting/dic-setting-record';//字典修改记录
  export default {
    name: 'WarehouseAreaInfo',
    components: {
      baseWarehouseArea,
      baseStorageArea,
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
