import request from '@/utils/request';
import base from '@/utils/api';
export function wareHouseAreaList (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-warehouse-area',
    method: 'get',
    params: query
  })
}
export function wareHouseAreaAdd (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-warehouse-area',
    method: 'post',
    //data: query
    params: query
  })
}
export function wareHouseAreaUpdate (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-warehouse-area',
    method: 'patch',
    params: query
  })
}
export function wareHouseAreaDel (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-warehouse-area-delstatus',
    method: 'patch',
    params: query
  })
}
export function allBaseWareHouseArea(query) {
  return request({
    url: base + '/rest/wms/stock/v1/all-base-warehouse-area',
    method: 'get',
    params: query
  })
}

