import request from '@/utils/request'
import base from '@/utils/api'

export function customerList(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customers',
    method: 'get',
    params: query
  })
}

export function customerEdit(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customers',
    method: 'put',
    data: query
  })
}

export function customerAdd(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customers',
    method: 'post',
    data: query
  })
}

export function customerDel(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customers',
    method: 'delete',
    params: query
  })
}
