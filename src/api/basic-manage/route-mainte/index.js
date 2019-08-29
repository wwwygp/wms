import request from '@/utils/request';
import base from '@/utils/api';
export function mainteList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/route/base_route',
    method: 'get',
    params: query
  })
}
export function mainteAdd (query) {
  return request({
    url: base+'/rest/wms/stock/v1/route/base_route',
    method: 'post',
    data: query
  })
}
export function mainteUpdate (query) {
  return request({
    url: base+'/rest/wms/stock/v1/route/base_route',
    method: 'put',
    data: query
  })
}
export function mainteDel (routeIds) {
  return request({
    url: base+'/rest/wms/stock/v1/route/base_route/' + routeIds,
    method: 'delete'
  })
}
export function mainteenter(routeIds) {
  return request({
    url: base + '/rest/wms/stock/v1/route/base_route/' + routeIds,
    method: 'get',
  })
}

export function getlinename_sec() {
  return request({
    url: base + '/rest/wms/stock/v1/route/base_route/select_info' ,
    method: 'get',
  })
}
