<template>
  <el-pagination
    background
    v-if="parentPagination.show"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="parentPagination.start"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="parentPagination.limit"
    prev-text="上一页"
    next-text="下一页"
    layout="total, sizes, prev, pager, next, jumper"
    :total="parentPagination.total">
  </el-pagination>
</template>

<script>
  export default {
    name: 'tablePagination',
    props:[ 'parentPagination'],
    methods: {
      handleSizeChange (val) {
        this.$emit('handleSizeChange',val);
      },
      handleCurrentChange (val) {
        console.log(val)
        this.$emit('handleCurrentChange',val);
      }
    }
  }
</script>

<style scoped>

</style>
