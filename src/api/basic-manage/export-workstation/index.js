import request from '@/utils/request'
import base from '@/utils/api'

export function searchWorkStationInfo(query) {
  return request({
    url: base + '/rest/wms/stock/v1/workstation/work-station-list',
    method: 'get',
    params: query
  })
}
export function workStationAdd (query) {
  // query = JSON.stringify(query)
  return request({
    url: base + '/rest/wms/stock/v1/workstation/work-station-list',
    method: 'post',
    data: query
  })
}
export function workStationUpdate (query) {
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf',
    method: 'put',
    data: query
  })
}
export function workStationDel (query) {
  return request({
    url: base + '/rest/wms/stock/v1/workstation/work-station-list',
    method: 'PATCH',
    params: query
  })
}

export function selectWharf (query) {
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf/select_info',
    method: 'GET',
    params: query
  })
}
