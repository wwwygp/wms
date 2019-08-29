import request from '@/utils/request';
import base from '@/utils/api';
export function getAcceptanceNoteList(query) {//查询
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/',
    method: 'get',
    params: query
  })
}
export function confirmAcceptanceNote(acceptanceNoteId) {//验收完成
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/confirm/' + acceptanceNoteId,
    method: 'PUT'
  })
}

export function cancelAcceptanceNote(acceptanceNoteId, query) {//整单取消
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/cancel/' + acceptanceNoteId,
    method: 'PUT',
    params: query
  })
}
export function overAcceptanceNote(acceptanceNoteId) {//结案
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/over/' + acceptanceNoteId,
    method: 'PUT'
  })
}
export function printerAcceptanceNote(query) {//打印
  return request({
    url:  base + '/rest/wms/access/v1/',
    method: 'post',
    data: query
  })
}

