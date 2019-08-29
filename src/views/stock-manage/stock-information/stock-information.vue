 <template>
 <el-card style="overflow: auto">
   <el-tabs v-model="activeName" type="card" id='stock-tab' @tab-click="handleClick">
     <el-tab-pane label="库存明细" name="inventory">
       <stock-inventory ref='stockInventory' v-if="activeName == 'inventory'"></stock-inventory>
     </el-tab-pane>
     <el-tab-pane label="按库位" name="stockSpace">
       <stockSpace ref='stockSpace' v-if="activeName == 'stockSpace'"></stockSpace>
     </el-tab-pane>
     <el-tab-pane label="按批次" name="stockBatch">
       <stockBatch ref='stockBatch' v-if="activeName == 'stockBatch'"></stockBatch>
     </el-tab-pane>
     <el-tab-pane label="按委托业主" name="entrust">
       <entrust ref='entrust' v-if="activeName == 'entrust'"></entrust>
     </el-tab-pane>
   </el-tabs>
  </el-card>
</template>
<!--<script src="./js/stock-information.js">-->
<!--</script>-->
 <script>
   import tableConfigure from '@/components/table/tableConfigure.vue'
   import stockInventory from '@/views/stock-manage/stock-information/stock-inventory'
   import stockSpace from '@/views/stock-manage/stock-information/stock-by-space'
   import entrust from '@/views/stock-manage/stock-information/entrust'
   import stockBatch from '@/views/stock-manage/stock-information/stock-batch'
   export default {
     name: 'stock-information',
     components: {
       tableConfigure,
       stockInventory,//库存明细
       stockSpace,//按库位
       stockBatch,//按批次
       entrust//按委托业主
     },
     data() {
       return {
         activeName: 'inventory'
       }
     },
     created() {

     },
     mounted() {

     },
     methods: {
       handleClick(tab, event) {
       }
     }
   }
 </script>
 <style lang="scss" scoped>

 </style>

<!--<style scoped>-->
  <!--a:hover{-->
    <!--cursor: pointer;-->
  <!--}-->
<!--</style>-->
