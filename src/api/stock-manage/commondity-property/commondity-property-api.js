import request from '@/utils/request'
import base from '@/utils/api'

export function commondityPropertyList(query) {
  return request({
    url: base + '/rest/wms/stock/v1/commodity-property',
    method: 'get',
    params: query
  })
}


