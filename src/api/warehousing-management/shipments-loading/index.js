import request from '@/utils/request';
import base from '@/utils/api';
//发货装车主档表格
export function getDistributionNotice (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/',
    method: 'get',
    params: query
  })
}
//发货装车明细表格
export function getDistributionNoticeDtl (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/' + query,
    method: 'get'
  })
}
//按订单发货表格
export function getDeliveNotice (query) {
  return request({
    url: base+'/rest/wms/access/v1/export-review/info',
    method: 'get',
    params: query
  })
}
//按订单发货
export function shipmentsDeliveNotice (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/',
    method: 'post',
    data: query
  })
}
//发货确认
export function confirmDeliveNotice (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/confirm/' + query,
    method: 'put'
  })
}
//明细取消
export function cancelDeliveNoticeDtl (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/' + query,
    method: 'put'
  })
}
//整单取消
export function cancelDeliveNotice (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/cancel/' + query,
    method: 'put'
  })
}
//获取打印信息
export function getShipmentPrint (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/printing',
    method: 'get',
    params: query
  })
}
//保存物流信息
export function shipmentsLogistics (query) {
  return request({
    url: base+'/rest/wms/access/v1/distribution/logistics',
    method: 'post',
    data: query
  })
}
