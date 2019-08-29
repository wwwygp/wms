import request from '@/utils/request';
import base from '@/utils/api';
/**
 * @Author    chenyinhuan
 * @DateTime  2019-04-15
 * @license   获取入库加工计划单主档列表[license]
 * @param     {[type]}   processPlanCode: '', // 加工单号ownerId: '', // 委托业主id status: '', // 状态 params [description]
 * @return    {[type]}    reslove  reject      [description]
 */
export function getProcessPlanList(params) {
  return request({
    url:  base + '/rest/wms/access/process-plan/v1/page',
    method: 'get',
    params: params
  })
}

