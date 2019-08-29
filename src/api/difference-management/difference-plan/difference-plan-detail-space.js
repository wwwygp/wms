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
