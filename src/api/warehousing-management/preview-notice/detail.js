import request from '@/utils/request';
import base from '@/utils/api';
export function noticeDetailList(query) {
  return request({
    url:  base+'/rest/wms/access/v1/arrival-notice/detail',
    method: 'get',
    params: query
  })
}


