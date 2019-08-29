import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import ProcessManagement from './processing-management'//加工管理
import DifferenceManagement from './difference-management'//盘点管理
import ActivityManagement from './activity-management'//活动管理
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [{
    path: '',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/pay/index'),
    hidden: true,
    meta: { title: '支付页'}
  },
  {
    path: '/basic-data',
    component: Layout,
    alwaysShow: true,
    name: 'basicData',
    meta: {
      title: '基础物料',
      icon: 'lock'
    },
    children: [{
        path: 'customer',
        component: () => import('@/views/basic-data/customer/customer-mainte'),
        name: 'customer',
        meta: {
          title: '客户主档维护'
        }
      },
      {
        path: 'printer',
        component: () => import('@/views/basic-data/printer/maintenance'),
        name: 'printer',
        meta: {
          title: '打印机维护'
        }
      },
      {
        path: 'printer-maintenance',
        component: () => import('@/views/basic-data/printer/crew-maintenance'),
        name: 'maintenance',
        meta: {
          title: '打印机组维护'
        }
      },
      {
        path: 'wharf-data-maintenance',
        component: () => import('@/views/basic-data/wharf/wharf-data-maintenance'),
        name: 'wharf-data-maintenance',
        meta: {
          title: '码头资料维护'
        }
      },
      {
        path: 'commodity-package',
        component: () => import('@/views/basic-data/package/package-maintenance'),
        name: 'commodity-package',
        meta: {
          title: '商品包装维护'
        }
      },
      {
        path: 'commodity',
        component: () => import('@/views/basic-data/commodity/commodity-mainte'),
        name: 'commodity',
        meta: {
          title: '商品信息维护'
        }
      },
      {
        path: 'commodity-barcode',
        component: () => import('@/views/basic-data/commodity-barcode/commodity-barcode'),
        name: 'commodity-barcode',
        meta: {
          title: '商品条码维护'
        }
      },
      {
        path: 'commodity-storage',
        component: () => import('@/views/basic-data/commodity-storage/commodity-storage'),
        name: 'commodity-storage',
        meta: {
          title: '商品储位关系'
        }
      }
    ]
  },
  {
    path: '/basic-management',
    component: Layout,
    alwaysShow: true,
    name: 'basic-management',
    meta: {
      title: '基础设置管理',
      icon: 'lock'
    },
    children: [{
      path: 'route-mainte',
      component: () => import('@/views/basic-management/route-mainte/mainte'),
      name: 'route-mainte',
      meta: {
        title: '线路维护'
      }
    },
    {
      path: 'tmp-route',
      component: () => import('@/views/basic-management/tmpstorage-route/tmpstorage-route'),
      name: 'tmp-route',
      meta: {
        title: '暂存区线路维护',
      }
    },
      {
        path: 'shipment-configuration',
        component: () => import('@/views/basic-management/shipment-configuration/shipment-configuration'),
        name: 'shipment-configuration',
        meta: {
          title: '出货成单配置',
          // icon: 'lock'
        }
      },
      {
        path: 'export-workstation',
        component: () => import('@/views/basic-management/export-workstation/export-workstation'),
        name: 'export-workstation',
        meta: {
          title: '出库工作站与储区关系',
          // icon: 'lock'
        }
      },
      {
        path: 'customer-route',
        component: () => import('@/views/basic-management/customer-route/customer-route'),
        name: 'customer-route',
        meta: {
          title: '客户线路维护',
        }
      },
      {
        path: 'container-rule',
        component: () => import('@/views/basic-management/container-rule/container-rule'),
        name: 'container-rule',
        meta: {
          title: '容器规则设置',
        }
      }
    ]
  },
  {
    name: 'warehousing-management',
    component: Layout,
    path: '/warehousing-management',
    alwaysShow: true,
    meta: {
      title: '入库管理',
      icon: 'lock'
    },
    children: [{
        path: 'preview-notice',
        component: () => import('@/views/warehousing-management/preview-notice/notice'),
        name: 'preview-notice',
        meta: {
          title: '预到货通知单',
          // icon: 'lock'
        }
      },
      {
        path: 'notice-detail',
        component: () => import('@/views/warehousing-management/preview-notice/notice-detail'),
        name: 'notice-detail',
        meta: {
          title: '预到货通知单明细',
          // icon: 'lock'
        }
      },
      {
        path: 'receive-node',
        component: () => import('@/views/warehousing-management/receive-node/receive-node'),
        name: 'receive-node',
        meta: {
          title: '收货单',
        }
      },
      {
        path: 'check-print',
        component: () => import('@/views/warehousing-management/pre-check-print/check-print'),
        name: 'check-print',
        meta: {
          title: '预验收打印'
        }
      },
      {
        path: 'acceptance-note',
        component: () => import('@/views/warehousing-management/acceptance-note/acceptance-note'),
        name: 'acceptance-note',
        meta: {
          title: '验收单',
        }
      },
      {
        path: 'shelf-scheduling',
        component: () => import('@/views/warehousing-management/shelf-scheduling/shelf-scheduling'),
        name: 'shelf-scheduling',
        meta: {
          title: '上架调度',
        }
      },
      {
        path: 'shelf-receipt',
        component: () => import('@/views/warehousing-management/shelf-receipt/shelf-receipt'),
        name: 'shelf-receipt',
        meta: {
          title: '上架回单',
        }
      },
      {
        path: 'shipments-loading',
        component: () => import('@/views/warehousing-management/shipments-loading/shipments-loading'),
        name: 'shipments-loading',
        meta: {
          title: '发货装车',
        }
      }
    ]
  },
  {
    name: 'storage-manage',
    component: Layout,
    path: '/storage-manage',
    alwaysShow: true,
    meta: {
      title: '仓储储位管理',
      icon: 'lock'
    },
    children: [{
        path: 'warehouse-area',
        component: () => import('@/views/storage-manage/warehouse-area/warehouse-area-info'),
        name: 'baseWarehouseArea',
        meta: {
          title: '库区信息维护'
        }
      },
      {
        path: 'supplier-space',
        component: () => import('@/views/storage-manage/supplier-space/supplier-space'),
        name: 'supplier-space',
        meta: {
          title: '供应商储位关系'
        }
      },
      {
        path: 'pick-area',
        component: () => import('@/views/storage-manage/pick-area/pick-area'),
        name: 'pick-area',
        meta: {
          title: '保拣储区关系'
        }
      }
    ]
  },
  {
    name: 'stock-manage',
    component: Layout,
    path: '/stock-manage',
    alwaysShow: true,
    meta: {
      title: '库存标签管理',
      icon: 'lock'
    },
    children: [{
        path: 'stock-information',
        component: () => import('@/views/stock-manage/stock-information/stock-information'),
        name: 'stock-information',
        meta: {
          title: '库存信息'
        }
      },
      {
        path: 'commondity-property',
        component: () => import('@/views/stock-manage/commondity-property/commondity-property'),
        name: 'commondity-property',
        meta: {
          title: '库存商品属性'
        }
      },
      {
        path: 'stock-changerecord',
        component: () => import('@/views/stock-manage/stock-changerecord/stock-changerecord'),
        name: 'stock-changerecord',
        meta: {
          title: '库存异动信息'
        }
      },
      {
        path: 'label-info',
        component: () => import('@/views/stock-manage/label-info/labelInfo'),
        name: 'label-info',
        meta: {
          title: '标签信息'
        }
      },
      {
        path: 'label-dtl-info',
        component: () => import('@/views/stock-manage/label-info/labelDtlInfo'),
        name: 'label-dtl-info',
        meta: {
          title: '标签明细信息'
        }
      }
    ]
  },
  {
    name: 'export-warehouse',
    component: Layout,
    path: '/export-warehouse',
    alwaysShow: true,
    meta: {
      title: '出库管理',
      icon: 'lock'
    },
    children: [{
        path: 'delive-notice',
        component: () => import('@/views/export-warehouse/delive-notice/delive-notice'),
        name: 'delive-notice',
        meta: {
          title: '出货通知单',
          // icon: 'lock'
        }
      },
      {
        path: 'delive-notice-detail',
        component: () => import('@/views/export-warehouse/delive-notice/delive-notice-detail'),
        name: 'delive-notice-detail',
        meta: {
          title: '出货通知单明细',
          // icon: 'lock'
        }
      },
      {
        path: 'export-receipt',
        component: () => import('@/views/export-warehouse/export-receipt/export-receipt'),
        name: 'export-receipt',
        meta: {
          title: '表单回单',
          // icon: 'lock'
        }
      },
      {
        path: 'export-review',
        component: () => import('@/views/export-warehouse/export-review/export-review'),
        name: 'export-review',
        meta: {
          title: '拣货复核',
          // icon: 'lock'
        }
      },
      {
        path: 'delive-order',
        component: () => import('@/views/export-warehouse/delive-order/delive-order'),
        name: 'delive-order',
        meta: {
          title: '出货成单',
          // icon: 'lock'
        }
      },
        {
        path: 'export-schedule',
        component: () => import('@/views/export-warehouse/export-schedule/export-schedule-main'),
        name: 'export-schedule',
        meta: {
          title: '出货调度',
        }
      }
    ]
  },
  {
    name: 'printer-center',
    component: Layout,
    path: '/printer-center',
    alwaysShow: true,
    meta: {
      title: '打印中心'
    },
    children: [{
        path: 'lable-number',
        component: () => import('@/views/printer-center/lable-number/lable-number'),
        name: 'lable-number',
        meta: {
          title: '标签取号'
        }
      }
    ]
  },
  {
    name: 'dic-config',
    component: Layout,
    path: '/dic-config',
    alwaysShow: true,
    meta: {
      title: '字典配置'
    },
    children: [{
      path: 'dic-setting',
      component: () => import('@/views/dic-config/dic-setting/dic-setting-info'),
      name: 'dic-setting',
      meta: {
        title: '字典配置'
      }
    },
      {
        path: 'dic-setting-detail',
        component: () => import('@/views/dic-config/dic-setting/dic-setting-detail'),
        name: 'dic-setting-detail',
        meta: {
          title: '字典配置明细',
          // icon: 'lock'
        }
      },
      {
        path: 'sys-menu',
        component: () => import('@/views/dic-config/sys-menu/sys-menu'),
        name: 'sys-menu',
        meta: {
          title: '接口权限配置',
          // icon: 'lock'
        }
      },
      {
        path: 'table-config',
        component: () => import('@/views/table-config/table-setting/table-setting'),
        name: 'table-config',
        meta: {
          title: '表头个性化配置',
          // icon: 'lock'
        }
      },
      {
        path: 'table-config-detail',
        component: () => import('@/views/table-config/table-setting/table-setting-detail'),
        name: 'table-config-detail',
        meta: {
          title: '表头个性化明细配置',
          // icon: 'lock'
        }
      },
    ]
  },
  {
    name: 'warehouse-shifting',
    component: Layout,
    path: '/warehouse-shifting',
    alwaysShow: true,
    meta: {
      title: '移库计划单'
    },
    children: [
      {
        path: 'move-plan',
        component: () => import('@/views/warehouse-shifting/move-plan/move'),
        name: 'move-plan',
        meta: {
          title: '移库计划'
        }
      },
      {
        path: 'move-plan-detail',
        component: () => import('@/views/warehouse-shifting/move-plan/move-plan-detail'),
        name: 'move-plan-detail',
        meta: {
          title: '移库计划明细'
        }
      },
      {
        path: 'move-order',
        component: () => import('@/views/warehouse-shifting/move-order/move-order'),
        name: 'move-order',
        meta: {
          title: '移库成单'
        }
      },
      {
        path: 'move-receipt',
        component: () => import('@/views/warehouse-shifting/move-receipt/move-receipt'),
        name: 'move-receipt',
        meta: {
          title: '移库回单'
        }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRouterMap, ...ProcessManagement, ...DifferenceManagement, ...ActivityManagement]
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
