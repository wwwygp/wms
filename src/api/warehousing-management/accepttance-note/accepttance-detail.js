import request from '@/utils/request';
import base from '@/utils/api';
export function getAcceptanceNoteDetailList(acceptanceNoteId ,query) {//获取验收单明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/' + acceptanceNoteId,
    method: 'get',
    params: query
  })
}
export function checkCommodity(query) {//商品验收
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/',
    method: 'POST',
    data: query
  })
}
export function delAcceptanceNoteDetail(acceptanceNoteDtlIds) {//删除验收单明细
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/' + acceptanceNoteDtlIds,
    method: 'DELETE'
  })
}

export function cancelAcceptanceNoteDetail(acceptanceNoteDtlIds) {//单品取消
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/' + acceptanceNoteDtlIds,
    method: 'PUT'
  })
}
export function addCommodity(query) {//新增品项
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/commodity',
    method: 'POST',
    data: query
  })
}
export function getReceiveDtl(query) {//新增品项
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/receiveDtl/',
    method: 'GET',
    params: query
  })
}

export function getTestReportUrl(query) {//获取检报url
  return request({
    url:  base + '/rest/wms/access/v1/test-report/url',
    method: 'GET',
    params: query
  })
}


