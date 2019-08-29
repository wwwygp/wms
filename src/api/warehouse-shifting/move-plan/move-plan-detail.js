import request from '@/utils/request';
import base from '@/utils/api';
//查询
export function getMovePlanDtlList(query) {
  console.log(query)
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/dtl',
    method: 'GET',
    params: query
  })
}

//新增
export function addMovePlanDtl(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/save',
    method: 'POST',
    data: query
  })
}

//保存
export function editMovePlanDtl(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/dtl/edit',
    method: 'PUT',
    data: query
  })
}

//删除
export function deleteMovePlanDtl(query) {
  return request({
    url:  base + '/rest/wms/access/v1/move_plan/dtl/delete/' + query,
    method: 'DELETE'
    // params: query
  })
}
//移库新增列表查询
export function getCommoditDetail(query) {
  return request({
    url:  base + '/rest/wms/stock/v1/move-stock-commodity-page',
    method: 'GET',
    params: query
  })
}
