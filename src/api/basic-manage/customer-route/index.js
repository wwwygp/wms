import request from '@/utils/request'
import base from '@/utils/api'

export function searchRouteTable(query) {
  return request({
    url: base + '/rest/wms/stock/v1/route/base_route',
    method: 'get',
    params: query
  })
}
export function getRouteList(query) {
  return request({
    url: base + '/rest/wms/stock/v1/route/base_route/select_info',
    method: 'get',
    params: query
  })
}
export function getCustomerRoute(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customer-route',
    method: 'get',
    params: query
  })
}
export function insertCustomerRoute(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customer-route',
    method: 'post',
    data: query
  })
}
export function deleteCustomerRoute(query) {
  return request({
    url: base + '/rest/wms/stock/v1/customer-route',
    method: 'delete',
    params: query
  })
}
export function UpdateCustomerRoute (query) {
  return request({
    url: base+'/rest/wms/stock/v1/customer-route',
    method: 'put',
    data: query
  })
}
