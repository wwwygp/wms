import request from '@/utils/request';
import base from '@/utils/api';
export function importPutawayTaskList (query) {
  return request({
    url: base+'/rest/wms/access/v1/import-putawaytask-return',
    method: 'get',
    params: query
  })
}

export function importPutawayTaskDtlList (query) {
  return request({
    url: base+'/rest/wms/access/v1/import-putawaytask-return/info',
    method: 'get',
    params: query
  })
}
//上架完成/整单完成
export function implementationNotes (query) {
  return request({
    url: base+'/rest/wms/access/v1/import-putawaytask-return/updateDtl',
    method: 'put',
    data: query
  })
}
// 获取操作人列表
export function getStaffsByFactory (query) {
  return request({
    url: base+'/rest/common/basematerial/v1/staff-teams/staffsFromErp',
    method: 'get',
    params: query
  })
}
// 通过储位编码精确查询储位信息
export function getSpaceInfoByCode (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-space-info-code',
    method: 'get',
    params: query
  })
}
// 通过标签编码精确查询标签信息
export function getLabelInfoByCode (query) {
  return request({
    url: base+'/rest/wms/stock/v1/stock-label/labelCode',
    method: 'get',
    params: query
  })
}
