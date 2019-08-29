import request from '@/utils/request';
import base from '@/utils/api';
export function getCommodityStorage (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/base-commodity-channel',
    method: 'get',
    params: query
  })
}
export function addCommodityStorage (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/base-commodity-channel',
    method: 'post',
    data: query
  })
}
export function editCommodityStorage (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/base-commodity-channel',
    method: 'put',
    data: query
  })
}
export function delCommodityStorage (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/base-commodity-channel',
    method: 'delete',
    params: query
  })
}


export function exportCommoditySpaceRelationList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/date-to-excel',
    method: 'get',
    params: query
  })
}


export function importCommodityChannel (query) {
  return request({
    url: base+'/rest/wms/stock/v1/commodity_storage/in-data',
    method: 'post',
    data: query
  })
}
