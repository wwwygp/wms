import request from '@/utils/request'
import base from '@/utils/api'

export function queryStockMovement(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-movement',
    method: 'get',
    params: queryParams
  })
}


