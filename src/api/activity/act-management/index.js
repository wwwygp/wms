import request from '@/utils/request';
import base from '@/utils/api';
export function getActivity(query) {//搜索
  return request({
    url:  base+'/rest/common/lottery/v1/activitymaintain/lottery-activity-dtl',
    method: 'Get',
    params: query
  })
}

export function upperShelfOnly(query) {//发布
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/upper-shelf-only',
    method: 'PUT',
    params: query
    
  })
}
export function lowerShel(query) {//下架
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/lower-shelf',
    method: 'PUT',
    params: query
    
  })
}
export function winnerPage(query) {//获奖名单
  return request({
    url:  base+'/rest/common/lottery/winning-record/v1/page',
    method: 'Get',
    params: query
  })
}
export function giveRecord(query) {//奖品统计
  return request({
    url:  base+'/rest/common/lottery/give-record/v1/page',
    method: 'Get',
    params: query
  })
}
export function giveWinningRecord(query) {//标记为已领取
  return request({
    url:  base + '/rest/common/lottery/winning-record/v1/give',
    method: 'PUT',
    data: query
    
  })
}
export function exportExcel (query) {
  return request({
    url: base+'/rest/common/lottery/winning-record/v1/data-to-excel',
    method: 'get',
    params: query
  })
}
