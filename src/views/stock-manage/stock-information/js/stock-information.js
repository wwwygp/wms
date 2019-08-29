// @代表src,适用目录层级嵌套比较深的 浅的话就./或者../
import tableConfigure from '@/components/table/tableConfigure.vue'
import stockInventory from '@/views/stock-manage/stock-information/stock-inventory'
import stockPosition from '@/views/stock-manage/stock-information/stock-position'
import entrust from '@/views/stock-manage/stock-information/entrust'
import stockBatch from '@/views/stock-manage/stock-information/stock-batch'
// import queryStockInformation from '@/stock-information.scss'

export default {
  name: 'stock-information',
  components: {
    tableConfigure,
    stockInventory,//库存明细
    stockPosition,//按库位
    stockBatch,//按批次
    entrust//按委托业主
  },
  data() {
    return {
      activeName: 'inventory'//tab切换
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
