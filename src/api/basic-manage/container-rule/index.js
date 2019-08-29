import request from '@/utils/request';
import base from '@/utils/api';
export function getContainerRule (query) {
  return request({
    url: base + '/rest/common/basematerial/v1/container_rule/',
    method: 'get',
    params: query
  })
}
export function addContainerRule (query) {
  return request({
    url: base + '/rest/common/basematerial/v1/container_rule/',
    method: 'post',
    data: query
  })
}
export function updateContainerRule (query) {
  return request({
    url: base + '/rest/common/basematerial/v1/container_rule/',
    method: 'put',
    data: query
  })
}
export function delContainerRule (containerRuleIds) {
  return request({
    url: base + '/rest/common/basematerial/v1/container_rule/' + containerRuleIds,
    method: 'DELETE'
  })
}

