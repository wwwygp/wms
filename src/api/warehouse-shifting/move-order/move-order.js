import request from '@/utils/request';
import base from '@/utils/api';
//左上方查询
export function getMoveOrderList(query) {
  return request({
    url:  base + '/rest/wms/access/v1/be_move_note/query_wave_data',
    method: 'get',
    params: query
  })
}

//右上方查询
export function getMoveOrderStorageList(query) {
  return request({
    url:  base + '/rest/wms/access/v1/be_move_note/query_storage_area',
    method: 'get',
    params: query
  })
}

//明细
export function getMoveOrderDtl(query) {
  return request({
    url:  base + '/rest/wms/access/v1/be_move_note/dtl',
    method: 'get',
    params: query
  })
}

//移库成单
export function MoveOrder(query) {
  return request({
    url:  base + '/rest/wms/access/v1/be_move_note',
    method: 'POST',
    data: query
  })
}

export function selectWave(query) {
  return request({
    url:  base + '/rest/wms/access/v1/be_move_note',
    method: 'POST',
    data: query
  })
}