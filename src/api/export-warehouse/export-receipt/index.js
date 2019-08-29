import request from '@/utils/request';
import base from '@/utils/api';
export function getRecipt(query) {//获取表单回单列表数据
  return request({
    url:  base + '/rest/wms/access/v1/outgoing-from',
    method: 'Get',
    params: query
  })
}

export function getReciptDetail(query) {//获取表单回单明细列表数据
  return request({
    url:  base + '/rest/wms/access/v1/outgoing-from/info',
    method: 'Get',
    params: query
  })
}
//拣货完成
export function updateRecipt (query) {
  return request({
    url:  base + '/rest/wms/access/v1/outgoing-from/update',
    method: 'PUT',
    data: query
  })
}
//整单完成

