/** When your routing table is too long, you can split it into small modules**/
import Index from '@/views/difference-management/index'
import differencePlan from '@/views/difference-management/difference-plan/difference-plan'//盘点计划单
import differencePlanDetailCommodity from '@/views/difference-management/difference-plan/difference-plan-detail-commodity'//盘点计划-按商品
import differencePlanDetailSpace from '@/views/difference-management/difference-plan/difference-plan-detail-space'//盘点计划-按储位
import difference from '@/views/difference-management/difference/difference'//盘点单

const arr = [
	{
		path: '/difference_management',
		component: Index,
		name: 'difference_management',
		meta: {
			title: '盘点管理'
		}
	},
	{
		path: '/difference_plan',
		component: differencePlan,
		name: 'difference_management/difference_plan',
		meta: {
			title: '盘点计划单'
		}
	},
	{
		path: '/difference_plan_detail_commodity',
		component: differencePlanDetailCommodity,
		name: 'difference_management/difference_plan_detail_commodity',
		meta: {
			title: '盘点计划单明细（按商品）'
		}
	},
	{
		path: '/difference_plan_detail_space',
		component: differencePlanDetailSpace,
		name: 'difference_management/difference_plan_detail_space',
		meta: {
			title: '盘点计划单明细（按储位）'
		}
	},
	{
		path: '/difference',
		component: difference,
		name: 'difference_management/difference',
		meta: {
			title: '盘点单'
		}
	}
];

export default arr
