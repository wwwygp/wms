/** When your routing table is too long, you can split it into small modules**/
import Index from '@/views/processing-management/index'
import InboundProcessPlan from '@/views/processing-management/inbound-process-plan/index'//加工入库计划单
import InboundProcessPlanDetail from '@/views/processing-management/inbound-process-plan/inbound-process-plan-detail'
import InboundProcess from '@/views/processing-management/inbound-process/inbound-process'//加工入库单

const arr = [
	{
		path: '/processing_management',
		component: Index,
		name: 'processing_management',
		meta: {
			title: '加工管理'
		}
	},
	{
		path: '/inbound_process_plan',
		component: InboundProcessPlan,
		name: 'processing_management/inbound_process_plan',
		meta: {
			title: '入库加工计划单'
		}
	},
	{
		path: '/inbound_process_plan_detail',
		component: InboundProcessPlanDetail,
		name: 'processing_management/inbound_process_plan_detail',
		meta: {
			title: '入库加工计划明细单'
		}
	},
	{
		path: '/inbound_process',
		component: InboundProcess,
		name: 'processing_management/inbound_process',
		meta: {
			title: '入库加工单'
		}
	}
];

export default arr
