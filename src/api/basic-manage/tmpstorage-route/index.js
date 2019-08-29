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
export function getTmpStorage(query) {
  return request({
    url: base + '/rest/wms/stock/v1/tmp-storage',
    method: 'get',
    params: query
  })
}
export function insertTmpStorage(query) {
  return request({
    url: base + '/rest/wms/stock/v1/tmp-storage',
    method: 'post',
    data: query
  })
}
export function deleteTmpStorage(query) {
  return request({
    url: base + '/rest/wms/stock/v1/tmp-storage',
    method: 'delete',
    params: query
  })
}
