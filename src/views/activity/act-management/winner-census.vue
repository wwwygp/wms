<template>
  <div>
    <!--// 表格控件-->
    <table-configure
        v-if="heightResize"
        ref="tableConfig"
        :data-table="winnersDataTable"
        :table-code="winnersTableName"
        @onRowClick="onRowClick"
        @onHandleSelectionChange="onHandleSelectionWinnersChange"
        @tableDataHandle="tableDataWinnersHandle"
        @handleSizeChange="handleSizeWinnersChange"
        @handleCurrentChange="handleWinnersCurrentChange">
    </table-configure>
  </div>
</template>

<script src="./js/winner-census.js"></script>

<style>
 
</style>
