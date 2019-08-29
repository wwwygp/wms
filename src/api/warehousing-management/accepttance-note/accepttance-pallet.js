import request from '@/utils/request';
import base from '@/utils/api';
export function getAcceptancePalletList(acceptanceNoteId, query) {//获取验收板明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/pallet/' + acceptanceNoteId,
    method: 'get',
    params: query
  })
}
export function acceptanceByCommodity(query) {//按商品验收组板
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/pallet',
    method: 'POST',
    data: query
  })
}
export function acceptanceByCase(query) {//按箱验收组板
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/',
    method: 'POST',
    data: query
  })
}
export function updateAcceptancePallet(query) {//修改验收组板
  return request({
    url:  base + '',
    method: 'PUT',
    data: query
  })
}
export function delAcceptancePallet(palletDtlIds) {//删除验收组板
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/pallet/' + palletDtlIds,
    method: 'DELETE'
  })
}
export function getContainerList(query) {//获取板托盘号
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/pallet-label',
    method: 'get',
    params: query
  })
}
export function checkLabelNumber(query) {//验收组板标签号校验
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/check-labelNumber',
    method: 'get',
    params: query
  })
}

export function getSpaceList(query) {//获取储位
  return request({
    url:  base + '/rest/wms/stock/v1/base-space-params',
    method: 'get',
    params: query
  })
}

