import request from '@/utils/request';
import base from '@/utils/api';
//移库单主档
export function getMoveNote (query) {
  return request({
    url: base+'/rest/wms/access/v1/movenote',
    method: 'get',
    params: query
  })
}
//移库单明细
export function getMoveNoteDtl (query) {
  return request({
    url: base+'/rest/wms/access/v1/movenote/info',
    method: 'get',
    params: query
  })
}
//上架完成/整单完成
export function reviseMoveNote (query) {
  return request({
    url: base+'/rest/wms/access/v1/movenote/revise',
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

// 获取移库单号
export function getMoveNoteCode (query) {
  return request({
    url: base + '/rest/wms/access/v1/movenote/moveNoteCode',
    method: 'get',
    params: query
  })
}

// 获取移库波次号
export function getMoveWaveCode (query) {
  return request({
    url: base + '/rest/wms/access/v1/move_plan/query_move_wave_code',
    method: 'get',
    params: query
  })
}