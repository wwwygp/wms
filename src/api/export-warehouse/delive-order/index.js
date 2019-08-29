import request from '@/utils/request';
import base from '@/utils/api';
export function getWaveDataOfWave(query) {//获取波次未成单列表
  return request({
    url:  base + '/rest/wms/access/v1/wave_data/wave-data-query-wave',
    method: 'Get',
    params: query
  })
}

export function selectWaveDataOfWave(query) {//模糊查询波次未成单列表
  return request({
    url:  base + '/rest/wms/access/v1/wave_data/wave-data-query-wave',
    method: 'Get',
    params: query
  })
}
export function getWaveDataOfOperation(query) {//获取区域客户列表
  return request({
    url:  base + '/rest/wms/access/v1/wave_data/wave-data-query-operation',
    method: 'Get',
    params: query
  })
}
export function getWaveDataOfDetail(query) {//获取波次详细列表
  return request({
    url:  base + '/rest/wms/access/v1/wave_data/wave-data-query-detail',
    method: 'Get',
    params: query
  })
}
export function pickNoteInsert(query) { //生成拣货单
  return request({
    url:  base + '/rest/wms/access/v1/pick_note/pick-note-insert',
    method: 'Post',
    params: query
  })
}
