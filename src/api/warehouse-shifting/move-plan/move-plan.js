import request from '@/utils/request';
import base from '@/utils/api';
//查询
export function getMovePlanList(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan',
    method: 'get',
    params: query
  })
}

//审核
export function approveMovePlan(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/approve/' + query,
    method: 'PUT'
    // params: query
  })
}

//发起移库计划
export function startMovePlan(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/start/' + query,
    method: 'PUT'
    // params: query
  })
}

//结案
export function overMovePlan(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/over/' + query,
    method: 'PUT'
    // params: query
  })
}

//整单取消
export function cancelMovePlan(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/cancel/' + query,
    method: 'PUT'
    // params: query
  })
}