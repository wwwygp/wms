/** When your routing table is too long, you can split it into small modules**/
import actManagement from '@/views/activity/act-management/act-management'//活动管理
import actConfigure from '@/views/activity/act-configure/act-configure'//管理配置

const arr = [
	{
		path: '/act-management',
		component: actManagement,
		name: 'activity/act-management',
		meta: {
			title: '活动管理'
		}
	},
	{
		path: '/act-configure',
		component: actConfigure,
		name: 'activity/act-configure',
		meta: {
			title: '活动配置'
		}
	}
];

export default arr
