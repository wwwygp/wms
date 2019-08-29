import request from '@/utils/request';
import base from '@/utils/api';
export function arrivalNoticeList(query) {
  return request({
    url:  base+'/rest/wms/access/v1/arrival-notice',
    method: 'get',
    params: query
  })
}
// /rest/wms/access/v1/arrival-notice/status
export function noticeExamine(query) {
  return request({
    url:  base+'/rest/wms/access/v1/arrival-notice/status',
    method: 'put',
    params: query
  })
}
export function noticeFinish(query) { // 结案
  return request({
    url:  base+'/rest/wms/access/v1/arrival-notice/finish',
    method: 'put',
    params: query
  })
}
