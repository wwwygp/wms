import request from '@/utils/request';
import base from '@/utils/api';
export function shipConfigList (query) {
  return request({
    url: base+'/rest/wms/access/v1/export_combine_config/combine-config-query',
    method: 'get',
    params: query
  })
}
export function shipConfigAdd (query) {
  return request({
    url: base+'/rest/wms/access/v1/export_combine_config/combine-config-insert',
    method: 'post',
    data: query
  })
}
export function shipConfigUpdate (query) {
  return request({
    url: base+'/rest/wms/access/v1/export_combine_config/combine-config-update',
    method: 'put',
    data: query
  })
}
export function shipConfigDel (query) {
  return request({
    url: base+'/rest/wms/access/v1/export_combine_config/combine-config-delete',
    method: 'delete',
    params: query
  })
}

