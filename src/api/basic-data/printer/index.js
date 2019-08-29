import request from '@/utils/request';
import base from '@/utils/api';
export function printerList (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer',
    method: 'get',
    params: query
  })
}
export function printerAdd (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer',
    method: 'post',
    data: query
  })
}
export function printerUpdate (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer',
    method: 'put',
    data: query
  })
}
export function printerDel (printerIds) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer?printerIds=' + printerIds,
    method: 'delete'
  })
}
export function printerGroup(query) {
  return request({
    url: base + '/rest/common/basematerial/v1/printer-group',
    method: 'get',
    params: query
  })
}
