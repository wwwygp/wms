import request from '@/utils/request';
import base from '@/utils/api';
export function commodityList (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/commodity-extend/list',
    method: 'get',
    params: query
  })
}
export function updatecommodity (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/commodity-extend',
    method: 'put',
    data: query
  })
}
export function getCommodityById (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/commodity-extend/ids-list',
    method: 'get',
    params: query
  })
}
export function getCommodityByCode (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/commodity-extend/erp',
    method: 'get',
    params: query
  })
}
