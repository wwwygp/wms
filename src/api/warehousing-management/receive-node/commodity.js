import request from '@/utils/request';
import base from '@/utils/api';
export function getBrand(query) {//获取品牌接口
  return request({
    url:  base + '/rest/common/basematerial/v1/brands',
    method: 'get',
    params: query
  })
}
export function getCommodity(query, query1) {//获取品牌接口
  return request({
    url:  base + '/rest/common/basematerial/v1/commodity-extend/list',
    method: 'get',
    params: query
    // data: query1
  })
}