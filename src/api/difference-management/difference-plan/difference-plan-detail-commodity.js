import request from '@/utils/request';
import base from '@/utils/api';

/**
 * @Author    chenyinhuan
 * @DateTime  2019-04-15
 * @license   获取入库加工单明细列表[license]
 * @param     {[type]}    params [description]
 * @return    {[type]}          [description]
 */
export function getProcessPlanDetail(params) {
  return request({
    url:  base + '/rest/wms/access/process-plan-dtl/v1/page',
    method: 'get',
    params: params
  })
}

/**
 * @Author    chenyinhuan
 * @DateTime  2019-05-09
 * @copyright [copyright]  盘点明细页面获取可盘点商品信息
 * @license   [license] 
 * @version   [version]
 * @param     {[type]}    query [description]
 * @return    {[type]}          [description]
 */
export function getCommoditDetail(query) {
  return request({
    url:  base + '/rest/wms/stock/v1/move-stock-commodity-page',
    method: 'GET',
    params: query
  })
}
