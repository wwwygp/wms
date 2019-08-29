import request from '@/utils/request';
import base from '@/utils/api';
export function getPrint(query) {
  return request({
    url:base+ '/rest/wms/stock/v1/base-space/space-printing-template',
    method: 'get',
    params: query
  })
}
export function getSpacePrint(query) {
  return request({
    url:base+ '/rest/wms/stock/v1/base-space/space-printing',
    method: 'get',
    params: query
  })
}
//收货单打印

export function printerReceiveNode(query) {
  return request({
    url:  base + '/rest/wms/access/v1/receive_node/printing',
    method: 'get',
    params: query
  })
}
//预到货单打印
export function printerNotice(query) {
  return request({
    url:  base + '/rest/wms/access/v1/arrival-notice/printing',
    method: 'get',
    params: query
  })
}

//预验收单标签打印
export function previousPrintLabel(receiveNoteId, query) {
  return request({
    url:  base + '/rest/wms/access/v1/previous_print/label-printing/' + receiveNoteId,
    method: 'get',
    params: query
  })
}

//预验收单打印
export function previousPrint(receiveNoteId, query) {
  return request({
    url:  base + '/rest/wms/access/v1/previous_print/printing/' + receiveNoteId,
    method: 'get',
    params: query
  })
}

//验收单新取托盘号
export function acceptNoteLablePrint(query) {
  return request({
    url:  base + '/rest/wms/access/v1/acceptance_note/label-printing',
    method: 'get',
    params: query
  })
}
//上架回单打印
export function printerputawaytask(query) {
  return request({
    url:  base + '/rest/wms/access/v1/import-putawaytask-return/printing',
    method: 'get',
    params: query
  })
}

//出货通知单
export function receiptPrint(query) {
  return request({
    url:  base + '/rest/wms/access/v1/pick_note/printing',
    method: 'get',
    params: query
  })
}
//标签批量打印
export function stockLabelPrint(query) {
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/batch-printing',
    method: 'get',
    params: query
  })
}

//标签打印
export function stockLabelPagePrint(query) {
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/page-printing',
    method: 'post',
    data: query
  })
}
//移库单打印
export function moveNotePrint(query) {
  return request({
    url:  base + '/rest/wms/access/v1/movenote/printing',
    method: 'get',
    params: query
  })
}
//打印箱标签
export function printStockCaseLable(param) {
  return request({
    url:  base + '/rest/wms/stock/v1/commodity-property/printing',
    method: 'post',
    data: param
  })
}
