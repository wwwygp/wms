import request from '@/utils/request';
import base from '@/utils/api';
export function storageList (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area',
    method: 'get',
    params: query
  })
}
export function storageAdd (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area',
    method: 'post',
    data: query
  })
}
export function storageUpdate (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area-change',
    method: 'POST',
    data: query
  })
}
export function storageDel (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area-delstatus',
    method: 'patch',
    params: query
  })
}
export function allStorageArea(query) {
  return request({
    url: base + '/rest/wms/stock/v1/all-base-storage-area',
    method: 'get',
    params: query
  })
}
export function storageListById(query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area-by-id',
    method: 'get',
    params: query
  })
}

export function selectStorageArea(query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area',
    method: 'get',
    params: query
  })
}





