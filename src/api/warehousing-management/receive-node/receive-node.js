import request from '@/utils/request';
import base from '@/utils/api';
export function getReceiveNoteList(query) {//查询
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/',
    method: 'get',
    params: query
  })
}
export function receiveNote(query) {//收货入库
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/',
    method: 'post',
    data: query
  })
}

export function receiveNoteConfirm(receiveNoteId) {//收货确认
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/' + receiveNoteId,
    method: 'PUT'
  })
}
export function getReceiveNoteDetail(receiveNoteId,query) {//通过收货单唯一码获取对应详细信息
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/' + receiveNoteId,
    method: 'get',
    params: query
  })
}
export function delReceiveNoteDetail(receiveNoteDtlIds) {//删除收货单明细
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/' + receiveNoteDtlIds,
    method: 'DELETE'
  })
}
export function isComplete(receiveNoteId) {//预到货通知单是否全部完成
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/isComplete/' + receiveNoteId,
    method: 'get'
  })
}
//收货单查询预到货通知单明细列表
export function getArrivalDtl(query) {//预到货通知单是否全部完成
  return request({
    url:  base + '/rest/wms/access/v1/arrival-notice/arrival-dtl',
    method: 'get',
    params: query
  })
}

//整单取消
export function allCancel(receiveNoteId) {//预到货通知单是否全部完成
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/allcancel/' + receiveNoteId,
    method: 'DELETE'
  })
}
