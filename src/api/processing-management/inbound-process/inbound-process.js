import request from '@/utils/request';
import base from '@/utils/api';
/**
 * @Author    chenyinhuan
 * @DateTime  2019-04-15
 * @license   获取入库加工单主档列表[license]
 * @param     {[type]}   processNote_code: '', // 加工单号ownerId: '', // 委托业主idstatus: '', // 状态 params [description]
 * @return    {[type]}    reslove  reject      [description]
 */
export function getProcessNote(params) {
  return request({
    url:  base + '/rest/wms/access/process-note/v1/page',
    method: 'get',
    params: params
  })
}

/**
 * @Author    chenyinhuan
 * @DateTime  2019-04-15
 * @license   获取入库加工单明细列表[license]
 * @param     {[type]}    params [description]
 * @return    {[type]}          [description]
 */
export function getProcessNoteDetail(params) {
  return request({
    url:  base + '/rest/wms/access/process-note-dtl/v1/page',
    method: 'get',
    params: params
  })
}
