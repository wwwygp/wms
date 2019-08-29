import request from '@/utils/request';
import base from '@/utils/api';
let uploadUrl = staticConfiguration.uploadUrl
export function addLottery(query) {//新增保存
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity',
    method: 'POST',
    data: query
  })
}
export function setLottery(query) {//活动设置
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity',
    method: 'get',
    params: query
    
  })
}

export function GetAllWarehouseList(query) {//商城下拉框值
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/mall',
    method: 'get',
    params: query
    
  })
}
export function upperShelfy(query) {//新增保存发布
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/increase-and-upper-shelf',
    method: 'PUT',
    data: query
    
  })
}
export function editLottery(query) {//修改保存
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity',
    method: 'PUT',
    data: query
  })
}
export function editupperShelfy(query) {//修改保存发布
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/change-and-upper-shelf',
    method: 'PUT',
    data: query
    
  })
}

export function uploadfileShare(query) { // 上传文件
  return request({
    url: base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/pic-url',
    method: 'post',
    data: query
  })
}
export function getProbability(query) {//总中奖率
  return request({
    url:  base + '/rest/common/lottery/v1/activitymaintain/lottery-activity/winning-probability',
    method: 'get',
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