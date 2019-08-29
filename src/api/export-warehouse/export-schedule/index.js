import request from '@/utils/request'
import base from '@/utils/api'
//出库调度主档
export function getDeliveNotice(query) {
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice',
    method: 'get',
    params: query
  })
}
//出库调度明细
export function getDeliveNoticeDtl (query) {
  return request({
    url: base+'/rest/wms/access/v1/export-dtl/delive-notice-out-dtl',
    method: 'get',
    params: query
  })
}
//出货调度
export function exportSchedule (query) {
  return request({
    url: base+'/rest/wms/access/v1/delive-notice-out-dispatch',
    method: 'post',
    params: query
  })
}


