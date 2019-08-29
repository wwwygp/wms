import request from '@/utils/request'
import base from '@/utils/api'

export function searchLabelInfo(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-label',
    method: 'get',
    params: queryParams
  })
}
export function searchDtlLabelInfo(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-label/info',
    method: 'get',
    params: queryParams
  })
}
