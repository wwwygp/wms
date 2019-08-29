import request from '@/utils/request';
import base from '@/utils/api';
//根据通道获取储位信息
export function getSpaceListByChannel (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space-channel-id',
    method: 'get',
    params: query
  })
}
//储位信息
export function getSpaceList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space',
    method: 'get',
    params: query
  })
}
//库区信息
export function getWarehouseList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/all-base-warehouse-area',
    method: 'get',
    params: query
  })
}
//通道信息
export function getChannelList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel-storage-area',
    method: 'get',
    params: query
  })
}
//储区信息
export function getStorageList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-storage-area-warehouse-area',
    method: 'get',
    params: query
  })
}
//储区品项信息
export function getCommodityCountList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity-counts',
    method: 'get',
    params: query
  })
}
//储区品项信息
export function getBaseStorageByStorageId (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-storage-area-by-id',
    method: 'get',
    params: query
  })
}
