import request from '@/utils/request';
import base from '@/utils/api';
//获取上架历史记录
export function getScheduleHistory (query) {
  return request({
    url: base+'/rest/wms/access/schedule-history/v1/query-schedule-history-list',
    method: 'get',
    params: query
  })
}
