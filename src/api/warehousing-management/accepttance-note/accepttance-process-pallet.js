import request from '@/utils/request';
import base from '@/utils/api';
export function getAcceptancePalletList(acceptanceNoteId, query) {//获取验收板明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/pallet/' + acceptanceNoteId,
    method: 'get',
    params: query
  })
}

export function getAcceptanceNoteDetailList(acceptanceNoteId, query) {//获取验收板明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/workable/' + acceptanceNoteId,
    method: 'get',
    params: query
  })
}
/**新增包装规格
 * @Author    chenyinhuan
 * @DateTime  2019-04-28
 * @copyright [copyright]
 * @license   [license]
 * @version   [version]
 * @param     {[type]}    query            [description]
 * @return    {[type]}                     [description]
 */
export function addPackingSize(query) {//获取验收板明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/process/newsku',
    method: 'post',
    data: query
  })
}


