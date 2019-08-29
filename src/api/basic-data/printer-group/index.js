import request from '@/utils/request';
import base from '@/utils/api';
export function printerGroupAdd (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer-group',
    method: 'post',
    data: query
  })
}
export function printerGroupUpdate (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer-group',
    method: 'put',
    data: query
  })
}
export function printerGroupDel (printerGroupIds) {
  return request({
    url: base+'/rest/common/basematerial/v1/printer-group?printerGroupIds=' + printerGroupIds,
    method: 'delete'
  })
}
