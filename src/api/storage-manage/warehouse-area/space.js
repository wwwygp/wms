import request from '@/utils/request';
import base from '@/utils/api';
export function printerList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-warehouse-area',
    method: 'get',
    params: query
  })
}
export function baseSpaceAdd (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space',
    method: 'post',
    data: [query]
  })
}
export function baseSpaceUpdate (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space-change',
    method: 'post',
    data: [query]
  })
}
export function baseSpaceDel (spaceIds) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space?spaceId=' + spaceIds,
    method: 'patch'
  })
}
export function printerGroup(query) {
  return request({
    url: base + '/rest/common/basematerial/v1/printer-group',
    method: 'get',
    params: query
  })
}
export function spacePrinterList(query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-space',
    method: 'get',
    params: query
  })
}
// /rest/common/customize/v1/sys_configuration/sys_customer_param
export function sysCustomerParam(query) { // 储位格，列，层
  return request({
    url:base+'/rest/common/customize/v1/sys_configuration/sys_customer_param',
    method: 'get',
    params: query
  })
}
//启用储位
export function useSpace(query) {
  return request({
    url:base+'/rest/wms/stock/v1/base-space-status-use',
    method: 'put',
    params: query
  })
}
//禁用储位
export function disabledSpace(query) {
  return request({
    url:base+'/rest/wms/stock/v1/base-space-status-disabled',
    method: 'put',
    params: query
  })
}

export function getStockCommodityInfoBySpaceIds(query) {
  return request({
    url: base + '/rest/wms/stock/v1/commodity-info-space',
    method: 'get',
    params: query
  })
}
