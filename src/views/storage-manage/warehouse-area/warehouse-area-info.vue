<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="库区" name="first">
      	<base-warehouse-area v-if="activeName == 'first'"></base-warehouse-area>
      </el-tab-pane>
      <el-tab-pane label="储区" name="second">
				<base-storage-area v-if="activeName == 'second'"></base-storage-area>
      </el-tab-pane>
      <el-tab-pane label="通道" name="third">
				<base-channel v-if="activeName == 'third'"></base-channel>
      </el-tab-pane>
      <el-tab-pane label="储位" name="fourth">
			  <base-space v-if="activeName == 'fourth'"></base-space>
     	</el-tab-pane>
    </el-tabs>
</template>
<!--// 样式多的话重新新建一个,少的话就直接在这里面写，-->
<!--// scoped,一定要加。-->

<script>
import baseWarehouseArea from '@/views/storage-manage/warehouse-area/warehouse-area';//库区
import baseStorageArea from '@/views/storage-manage/warehouse-area/storage-area';//储区
import baseChannel from '@/views/storage-manage/warehouse-area/channel';//通道
import baseSpace from '@/views/storage-manage/warehouse-area/space';//储位
export default {
  name: 'WarehouseAreaInfo',
  components: {
    baseWarehouseArea,
    baseStorageArea,
    baseChannel,
    baseSpace
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
