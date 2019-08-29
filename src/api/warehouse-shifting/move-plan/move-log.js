import request from '@/utils/request';
import base from '@/utils/api';
//获取移库发起计划记录
export function getMoveHistory (query) {
  return request({
    url: base + '/rest/wms/access/v1/move_plan/query_move_record',
    method: 'get',
    params: query
  })
}

export function getMoveHistoryDtl (query) {
  return request({
    url: base + '/rest/wms/access/v1/move_plan/query_move_record_dtl',
    method: 'get',
    params: query
  })
}