import request from '@/utils/request';
import base from '@/utils/api';
export function getSupplierSpace (query) {
  return request({
    url: base + '/rest/wms/stock/v1/supplier-space',
    method: 'get',
    params: query
  })
}
export function addSupplierSpace (query) {
  return request({
    url: base + '/rest/wms/stock/v1/supplier-space',
    method: 'post',
    data: query
  })
}
export function updateSupplierSpace (query) {
  return request({
    url: base + '/rest/wms/stock/v1/supplier-space',
    method: 'put',
    data: query
  })
}
export function delSupplierSpace (query) {
  return request({
    url: base + '/rest/wms/stock/v1/supplier-space',
    method: 'DELETE',
    params: query
  })
}

