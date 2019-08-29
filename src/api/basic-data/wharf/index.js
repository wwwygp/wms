import request from '@/utils/request';
import base from '@/utils/api';
export function wharfList (query) {
  let url = base + '/rest/wms/stock/v1/wharf/base_wharf'
  let options = {
    url: url,
    method: 'get',
    params: query
  }
  // if(query.wharfIds){
  //   url = base + '/rest/common/basematerial/v1/wharf/base_wharf/' + query.wharfIds
  //   options = {
  //     url: url,
  //     method: 'get'
  //   }
  // }
  return request(options)
}
export function wharfAdd (query) {
  // query = JSON.stringify(query)
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf',
    method: 'post',
    data: query
  })
}
export function wharfUpdate (query) {
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf',
    method: 'put',
    data: query
  })
}
export function wharfDel (wharfIds) {
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf/' + wharfIds,
    method: 'delete'
  })
}

export function selectWharf (query) {
  return request({
    url: base + '/rest/wms/stock/v1/wharf/base_wharf/select_info',
    method: 'GET',
    params: query
  })
}

